import AppKit
import Foundation
import PDFKit
import Vision

struct OCRLine {
  let text: String
  let confidence: Float
  let x: CGFloat
  let y: CGFloat
}

struct OCRRow: Codable {
  let raw_name: String
  let standard_name: String
  let foreign_name: String
  let years: String
  let original_note: String
  let references: String
  let source_pdf: String
  let source_page: Int
  let needs_review: Bool
}

let outputDirectory = URL(fileURLWithPath: "content/people/ocr_exports", isDirectory: true)
let defaultPDFPaths = [
  "/Users/mac/Downloads/列宁全集俄文 第5版 人名索引 (河北大学外语系俄语翻译组译) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
  "/Users/mac/Downloads/马克思恩格斯全集人名索引 第一至三十九卷 (中共中央马克思、恩格斯、列宁、斯大林著作编译局编) (z-library.sk, 1lib.sk, z-lib.sk).pdf"
]
let pdfPaths = ProcessInfo.processInfo.environment["OCR_PDFS"]?
  .split(separator: "|")
  .map(String.init) ?? defaultPDFPaths
let maxPages = ProcessInfo.processInfo.environment["OCR_MAX_PAGES"].flatMap(Int.init)
let startPage = max((ProcessInfo.processInfo.environment["OCR_START_PAGE"].flatMap(Int.init) ?? 1), 1)
let debugLines = ProcessInfo.processInfo.environment["OCR_DEBUG_LINES"] == "1"

func normalized(_ text: String) -> String {
  text
    .replacingOccurrences(of: "（", with: "(")
    .replacingOccurrences(of: "）", with: ")")
    .replacingOccurrences(of: "—", with: "-")
    .replacingOccurrences(of: "–", with: "-")
    .replacingOccurrences(of: "－", with: "-")
    .replacingOccurrences(of: "，", with: ",")
    .trimmingCharacters(in: .whitespacesAndNewlines)
}

func slug(for url: URL) -> String {
  let name = url.lastPathComponent
  if name.contains("马克思恩格斯") {
    return "marx_engels_collected_works_people_index_ocr"
  }
  if name.contains("列宁") {
    return "lenin_collected_works_people_index_ocr"
  }
  return normalized(name)
    .replacingOccurrences(of: ".pdf", with: "")
    .replacingOccurrences(of: " ", with: "_")
    .replacingOccurrences(of: "/", with: "_")
}

func makeCGImage(from page: PDFPage, scale: CGFloat = 2.6) -> CGImage? {
  let bounds = page.bounds(for: .mediaBox)
  let width = Int(bounds.width * scale)
  let height = Int(bounds.height * scale)
  guard width > 0, height > 0 else { return nil }

  let colorSpace = CGColorSpaceCreateDeviceGray()
  guard let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.none.rawValue
  ) else {
    return nil
  }

  context.setFillColor(gray: 1.0, alpha: 1.0)
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.saveGState()
  context.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: context)
  context.restoreGState()

  return context.makeImage()
}

func recognizedLines(from image: CGImage) throws -> [OCRLine] {
  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.usesLanguageCorrection = true
  request.minimumTextHeight = 0.006
  if #available(macOS 13.0, *) {
    request.automaticallyDetectsLanguage = true
  }
  if let supported = try? request.supportedRecognitionLanguages() {
    let preferred = ["zh-Hans", "zh-Hant", "en-US", "ru-RU", "fr-FR", "de-DE"]
    let languages = preferred.filter { supported.contains($0) }
    if !languages.isEmpty {
      request.recognitionLanguages = languages
    }
  }

  let handler = VNImageRequestHandler(cgImage: image, options: [:])
  try handler.perform([request])

  let observations = request.results ?? []
  let lines = observations.compactMap { observation -> OCRLine? in
    guard let candidate = observation.topCandidates(1).first else { return nil }
    let text = candidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return nil }
    return OCRLine(
      text: text,
      confidence: candidate.confidence,
      x: observation.boundingBox.minX,
      y: observation.boundingBox.maxY
    )
  }

  let leftColumn = lines.filter { $0.x < 0.52 }.sorted { a, b in
    if abs(a.y - b.y) > 0.01 { return a.y > b.y }
    return a.x < b.x
  }
  let rightColumn = lines.filter { $0.x >= 0.52 }.sorted { a, b in
    if abs(a.y - b.y) > 0.01 { return a.y > b.y }
    return a.x < b.x
  }

  return leftColumn + rightColumn
}

func looksLikeEntryStart(_ text: String) -> Bool {
  let line = normalized(text)
  if line.count < 2 || line.count > 140 { return false }
  if line.range(of: #"^[0-9IVXivx]+[\s.,，、页第卷-]"#, options: .regularExpression) != nil {
    return false
  }
  if line.range(of: #"^[一二三四五六七八九十]+[、.]"#, options: .regularExpression) != nil {
    return false
  }
  guard line.range(of: #"\p{Han}"#, options: .regularExpression) != nil else { return false }
  return line.range(of: #"^[\p{Han}·•—-]{2,36}\("#, options: .regularExpression) != nil
    || line.range(of: #"^[\p{Han}·•—-]{2,24},[^,]{0,24}\("#, options: .regularExpression) != nil
    || line.range(of: #"^[\p{Han}·•—-]{2,24},[^,]{0,18}[·•]"#, options: .regularExpression) != nil
}

func compactEntries(from lines: [OCRLine]) -> [(text: String, confidence: Float)] {
  var entries: [(String, Float)] = []
  var current = ""
  var currentConfidence: Float = 1.0

  for line in lines {
    let text = line.text.trimmingCharacters(in: .whitespacesAndNewlines)
    if text.isEmpty { continue }

    if looksLikeEntryStart(text) {
      if !current.isEmpty {
        entries.append((current, currentConfidence))
      }
      current = text
      currentConfidence = line.confidence
    } else if !current.isEmpty {
      current += " " + text
      currentConfidence = min(currentConfidence, line.confidence)
    }
  }

  if !current.isEmpty {
    entries.append((current, currentConfidence))
  }

  return entries
}

func firstMatch(_ text: String, pattern: String) -> String {
  guard let regex = try? NSRegularExpression(pattern: pattern),
        let match = regex.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)),
        let range = Range(match.range(at: 1), in: text) else {
    return ""
  }
  return String(text[range]).trimmingCharacters(in: .whitespacesAndNewlines)
}

func parseEntry(_ entry: String, confidence: Float, sourcePDF: String, sourcePage: Int) -> OCRRow {
  let clean = normalized(entry)
  let rawName = firstMatch(clean, pattern: #"^([\p{Han}·•—-]{2,30})"#)
  let foreignName = firstMatch(clean, pattern: #"\(([A-Za-zÀ-ÿА-Яа-яЁё .,'’\-]+)\)"#)
  let years = firstMatch(clean, pattern: #"([0-9]{3,4}\s*-\s*(?:[0-9]{2,4})?)"#)
  let references = firstMatch(clean, pattern: #"((?:第?\d{1,2}[卷册]?[,:：]?\s*)?\d{1,4}(?:\s*[-,，、;；]\s*\d{1,4}){1,}(?:\s*[;；]\s*\d{1,4}(?:\s*[-,，、]\s*\d{1,4})*)*)$"#)

  var note = clean
  for piece in [rawName, foreignName, years, references] where !piece.isEmpty {
    note = note.replacingOccurrences(of: piece, with: "")
  }
  note = note
    .replacingOccurrences(of: "()", with: "")
    .replacingOccurrences(of: "( )", with: "")
    .trimmingCharacters(in: CharacterSet(charactersIn: " ,，;；:：-").union(.whitespacesAndNewlines))

  return OCRRow(
    raw_name: rawName.isEmpty ? clean : rawName,
    standard_name: "",
    foreign_name: foreignName,
    years: years,
    original_note: note.isEmpty ? clean : note,
    references: references,
    source_pdf: sourcePDF,
    source_page: sourcePage,
    needs_review: true
  )
}

func csvEscaped(_ value: String) -> String {
  "\"" + value.replacingOccurrences(of: "\"", with: "\"\"") + "\""
}

func writeCSV(rows: [OCRRow], to url: URL) throws {
  let headers = [
    "raw_name",
    "standard_name",
    "foreign_name",
    "years",
    "original_note",
    "references",
    "source_pdf",
    "source_page",
    "needs_review"
  ]
  var output = headers.joined(separator: ",") + "\n"
  for row in rows {
    output += [
      row.raw_name,
      row.standard_name,
      row.foreign_name,
      row.years,
      row.original_note,
      row.references,
      row.source_pdf,
      String(row.source_page),
      String(row.needs_review)
    ].map(csvEscaped).joined(separator: ",") + "\n"
  }
  try output.write(to: url, atomically: true, encoding: .utf8)
}

func writeJSON(rows: [OCRRow], to url: URL) throws {
  let encoder = JSONEncoder()
  encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
  let data = try encoder.encode(rows)
  try data.write(to: url)
}

try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

for path in pdfPaths {
  let url = URL(fileURLWithPath: path)
  guard let document = PDFDocument(url: url) else {
    fputs("Could not open PDF: \(path)\n", stderr)
    continue
  }

  let pdfName = url.lastPathComponent
  let pdfSlug = slug(for: url)
  var rows: [OCRRow] = []
  print("OCR \(pdfName) pages=\(document.pageCount)")

  let startIndex = min(startPage - 1, document.pageCount)
  let pageLimit = min(startIndex + (maxPages ?? document.pageCount), document.pageCount)
  for pageIndex in startIndex..<pageLimit {
    autoreleasepool {
      guard let page = document.page(at: pageIndex),
            let image = makeCGImage(from: page) else {
        fputs("Could not render page \(pageIndex + 1) in \(pdfName)\n", stderr)
        return
      }

      do {
        let lines = try recognizedLines(from: image)
        if debugLines {
          for line in lines {
            print("    \(String(format: "%.2f", line.confidence)) \(line.text)")
          }
        }
        let entries = compactEntries(from: lines)
        let pageRows = entries.map {
          parseEntry($0.text, confidence: $0.confidence, sourcePDF: pdfName, sourcePage: pageIndex + 1)
        }
        rows.append(contentsOf: pageRows)
        print("  page \(pageIndex + 1)/\(document.pageCount): lines=\(lines.count) entries=\(pageRows.count)")
      } catch {
        fputs("OCR failed page \(pageIndex + 1) in \(pdfName): \(error)\n", stderr)
      }
    }
  }

  let csvURL = outputDirectory.appendingPathComponent("\(pdfSlug).csv")
  let jsonURL = outputDirectory.appendingPathComponent("\(pdfSlug).json")
  try writeCSV(rows: rows, to: csvURL)
  try writeJSON(rows: rows, to: jsonURL)
  print("Wrote \(rows.count) rows:")
  print("  \(csvURL.path)")
  print("  \(jsonURL.path)")
}
