#!/usr/bin/env python3
"""Clean OCR people-index exports into an auditable candidate table.

This script deliberately does not write to the formal biographical index.
It keeps OCR-derived rows reviewable and import-ready, with conservative
confidence scores and error flags.
"""

from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
INPUTS = [
    (
        "marx_engels",
        ROOT / "content/people/ocr_exports/marx_engels_collected_works_people_index_ocr.json",
    ),
    (
        "lenin",
        ROOT / "content/people/ocr_exports/lenin_collected_works_people_index_ocr.json",
    ),
]
OUTPUT_DIR = ROOT / "content/people/processed"
JSON_OUT = OUTPUT_DIR / "people_candidates.json"
CSV_OUT = OUTPUT_DIR / "people_candidates.csv"
REPORT_OUT = OUTPUT_DIR / "people_ocr_quality_report.md"

NOISE_KEYWORDS = [
    "议会议员",
    "司法大臣",
    "曾任外交大臣",
    "外交大臣",
    "内阁大臣",
    "内务大臣",
    "财政大臣",
    "陆军大臣",
    "海军大臣",
    "大臣",
    "作者",
    "译者",
    "目录",
    "人名索引",
    "人名译名对照表",
    "国家活动家",
    "政治活动家",
    "革命的参加者",
    "自由主义者",
    "的首脑",
    "将军",
    "法学家",
    "政论家",
    "银行家",
]

OFFICE_OR_TITLE_RE = re.compile(
    r"^(议会议员|司法大臣|外交大臣|内阁大臣|内务大臣|财政大臣|陆军大臣|海军大臣|"
    r"作者|译者|目录|人名索引|人名译名对照表|国家活动家|政治活动家|革命的参加者|"
    r"自由主义者|的首脑|将军|法学家|政论家|委员|会委员|委员会委员|主席|人民委员|"
    r"会议员|代表大会|表大会|大会|会议|法案|案件|期间|工党|共产党|社会民主工党|"
    r"民主工党|英国国王|俄国外交家|西班牙将军|妻子|学家|作者--波格丹诺夫)$"
)
LATIN_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]")
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
YEAR_RANGE_RE = re.compile(
    r"((?:约\s*)?(?:生于\s*)?\d{3,4}\s*(?:-|--|—|–|－|一|至)\s*(?:(?:约\s*)?\d{2,4}|(?:今|现在)|\?{1,4}))"
)
SINGLE_YEAR_RE = re.compile(r"((?:生于|死于|卒于|约)\s*\d{3,4}\s*年?)")
BRACKET_RE = re.compile(r"[\(（]([^()（）]{2,180})[\)）]")


def normalize_text(value: Any) -> str:
    text = "" if value is None else str(value)
    replacements = {
        "\u3000": " ",
        "（": "(",
        "）": ")",
        "，": ",",
        "；": ";",
        "：": ":",
        "。": "。",
        "—": "-",
        "–": "-",
        "－": "-",
        "―": "-",
        "—-": "-",
        "﹣": "-",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r"(?<=\d)\s*一\s*(?=\s*\d)", "-", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_name(value: str) -> str:
    text = normalize_text(value)
    text = re.sub(r"^[\"'“”‘’]+|[\"'“”‘’]+$", "", text)
    text = re.sub(r"\s+", "", text)
    return text.strip(" ,;:-·•.。")


def normalize_years(value: str) -> str:
    text = normalize_text(value)
    text = text.replace(" ", "")
    text = re.sub(r"(\d{3,4})-(\d{2})(?!\d)", lambda m: f"{m.group(1)}-{m.group(1)[:2]}{m.group(2)}", text)
    return text.strip(" ,;:。")


def extract_years(*values: str) -> str:
    joined = " ".join(normalize_text(v) for v in values if v)
    match = YEAR_RANGE_RE.search(joined)
    if match:
        return normalize_years(match.group(1))
    match = SINGLE_YEAR_RE.search(joined)
    if match:
        return normalize_years(match.group(1))
    return ""


def clean_foreign_candidate(value: str) -> str:
    text = normalize_text(value)
    text = re.sub(r"\b(?:约|生于|死于|卒于)\b", " ", text)
    text = YEAR_RANGE_RE.sub(" ", text)
    text = SINGLE_YEAR_RE.sub(" ", text)
    text = re.sub(r"[\u4e00-\u9fff]+", " ", text)
    text = re.sub(r"[《》“”\"；;：:。]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = text.strip(" ,.-")
    if not LATIN_RE.search(text):
        return ""
    latin_parts = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ .,'’\-]*", text)
    if not latin_parts:
        return ""
    candidate = " ".join(part.strip() for part in latin_parts if part.strip())
    candidate = re.sub(r"\s+", " ", candidate).strip(" ,.-")
    if len(candidate) < 2:
        return ""
    return candidate[:160]


def extract_foreign_name(existing: str, note: str) -> str:
    existing_clean = clean_foreign_candidate(existing)
    if existing_clean:
        return existing_clean

    note_clean = normalize_text(note)
    for match in BRACKET_RE.finditer(note_clean):
        content = match.group(1)
        if LATIN_RE.search(content):
            candidate = clean_foreign_candidate(content)
            if candidate:
                return candidate

    if LATIN_RE.search(note_clean):
        candidate = clean_foreign_candidate(note_clean)
        if candidate:
            return candidate
    return ""


def is_numeric_or_punct(text: str) -> bool:
    return bool(text) and re.fullmatch(r"[\d\s,.;:、，。；：\-\(\)（）/]+", text) is not None


def looks_garbled(text: str) -> bool:
    if not text:
        return True
    if "□" in text or "�" in text:
        return True
    if re.search(r"[•·]{3,}|\.{4,}|⋯", text):
        return True
    meaningful = len(re.findall(r"[\u4e00-\u9fffA-Za-zÀ-ÖØ-öø-ÿ0-9]", text))
    return len(text) > 0 and meaningful / max(len(text), 1) < 0.35


def error_flags_for(raw_name: str, original_note: str, foreign_name: str, years: str) -> list[str]:
    flags: list[str] = []
    raw = normalize_name(raw_name)
    note = normalize_text(original_note)
    combined = f"{raw} {note}".strip()

    if not raw:
        flags.append("empty_raw_name")
    if raw and len(raw) <= 1 and not note:
        flags.append("too_short_without_note")
    if raw and len(raw) > 32:
        flags.append("raw_name_too_long")
    if is_numeric_or_punct(raw):
        flags.append("numeric_or_punctuation_only")
    if OFFICE_OR_TITLE_RE.fullmatch(raw):
        flags.append("office_or_title_only")
    if raw in {"目录", "人名索引"}:
        flags.append("index_heading")
    if any(keyword in raw for keyword in NOISE_KEYWORDS):
        flags.append("raw_noise_keyword")
    if any(keyword in combined for keyword in NOISE_KEYWORDS):
        flags.append("noise_keyword")
    if looks_garbled(raw):
        flags.append("garbled_raw_name")
    if raw and not CJK_RE.search(raw) and not LATIN_RE.search(raw):
        flags.append("no_name_script")
    if raw and re.search(r"(曾任|参加|拥护者|领导|研究者|教授|大臣|议员)", raw):
        flags.append("raw_looks_like_note_fragment")
    if raw and len(raw) <= 2 and not (foreign_name or years or len(note) > 12):
        flags.append("fragment_without_context")
    if note and looks_garbled(note) and len(note) < 24:
        flags.append("garbled_short_note")
    return sorted(set(flags))


def is_discard(flags: list[str], raw_name: str, original_note: str) -> bool:
    raw = normalize_name(raw_name)
    note = normalize_text(original_note)
    if "index_heading" in flags or "numeric_or_punctuation_only" in flags:
        return True
    if "office_or_title_only" in flags:
        return True
    if "empty_raw_name" in flags or "garbled_raw_name" in flags and len(raw) <= 2:
        return True
    if "raw_looks_like_note_fragment" in flags and not LATIN_RE.search(note):
        return True
    if "fragment_without_context" in flags:
        return True
    if any(keyword in raw for keyword in ["目录", "人名索引", "议会议员", "司法大臣", "作者", "译者"]):
        return True
    return False


def score_candidate(raw_name: str, original_note: str, foreign_name: str, years: str, flags: list[str], discard: bool) -> float:
    raw = normalize_name(raw_name)
    note = normalize_text(original_note)
    if discard:
        return 0.05 if ("garbled_raw_name" in flags or "numeric_or_punctuation_only" in flags) else 0.20
    if raw and foreign_name and years:
        score = 0.85
    elif raw and note and years:
        score = 0.70
    elif raw and note:
        score = 0.55
    elif raw:
        score = 0.35
    else:
        score = 0.05
    if "noise_keyword" in flags or "raw_looks_like_note_fragment" in flags:
        score = min(score, 0.35)
    if "garbled_short_note" in flags:
        score -= 0.10
    if "raw_name_too_long" in flags:
        score -= 0.15
    return round(max(min(score, 0.95), 0.05), 2)


def source_label_from_pdf(source_hint: str, source_pdf: str) -> str:
    if source_hint:
        return source_hint
    if "列宁" in source_pdf:
        return "lenin"
    return "marx_engels"


@dataclass
class CleanRow:
    raw_name: str
    cn_name_guess: str
    foreign_name_guess: str
    years_guess: str
    original_note: str
    references: str
    source: str
    source_page: int
    confidence: float
    needs_review: bool
    error_flags: list[str]
    suggested_action: str
    source_record: dict[str, Any]


@dataclass
class MergeGroup:
    rows: list[CleanRow] = field(default_factory=list)

    def merge(self, candidate_id: str) -> dict[str, Any]:
        rows = self.rows
        best = max(rows, key=lambda row: (row.confidence, bool(row.foreign_name_guess), bool(row.years_guess), len(row.original_note)))
        sources = []
        seen_sources = set()
        notes = []
        refs = []
        all_flags: list[str] = []
        for row in rows:
            source_obj = {
                "source": row.source,
                "source_page": row.source_page,
                "references": row.references,
            }
            source_key = (row.source, row.source_page, row.references)
            if source_key not in seen_sources:
                seen_sources.add(source_key)
                sources.append(source_obj)
            if row.original_note and row.original_note not in notes:
                notes.append(row.original_note)
            if row.references and row.references not in refs:
                refs.append(row.references)
            all_flags.extend(row.error_flags)

        flags = sorted(set(all_flags))
        discard = any(row.suggested_action == "discard" for row in rows) and all(
            row.suggested_action == "discard" for row in rows
        )
        confidence = max(row.confidence for row in rows)
        if len(rows) > 1 and not discard:
            confidence = min(confidence + 0.05, 0.90)
        confidence = round(confidence, 2)
        if discard:
            action = "discard"
        elif len(rows) > 1:
            action = "merge"
        elif confidence >= 0.85 and not flags:
            action = "keep"
        else:
            action = "review"

        needs_review = action != "keep" or confidence < 0.85 or bool(flags)
        return {
            "candidate_id": candidate_id,
            "raw_name": best.raw_name,
            "cn_name_guess": best.cn_name_guess,
            "foreign_name_guess": best.foreign_name_guess,
            "years_guess": best.years_guess,
            "original_note": " || ".join(notes)[:4000],
            "references": "; ".join(refs),
            "source": best.source if len({row.source for row in rows}) == 1 else "multiple",
            "source_page": best.source_page,
            "confidence": confidence,
            "needs_review": needs_review,
            "error_flags": flags,
            "suggested_action": action,
            "sources": sources,
        }


def merge_key(row: CleanRow) -> tuple[str, str, str]:
    raw_key = normalize_name(row.cn_name_guess or row.raw_name)
    foreign_key = normalize_text(row.foreign_name_guess).lower()
    years_key = normalize_years(row.years_guess)
    if foreign_key and years_key:
        return ("foreign_years", foreign_key, years_key)
    if foreign_key and raw_key:
        return ("raw_foreign", raw_key, foreign_key)
    if raw_key and years_key:
        return ("raw_years", raw_key, years_key)
    return ("raw_only", raw_key, "")


def clean_row(row: dict[str, Any], source_hint: str) -> CleanRow:
    raw_name = normalize_name(row.get("raw_name", ""))
    original_note = normalize_text(row.get("original_note", ""))
    references = normalize_text(row.get("references", ""))
    source = source_label_from_pdf(source_hint, row.get("source_pdf", ""))
    source_page = int(row.get("source_page") or 0)
    foreign_name = extract_foreign_name(row.get("foreign_name", ""), original_note)
    years = extract_years(row.get("years", ""), original_note)
    flags = error_flags_for(raw_name, original_note, foreign_name, years)
    discard = is_discard(flags, raw_name, original_note)
    confidence = score_candidate(raw_name, original_note, foreign_name, years, flags, discard)
    action = "discard" if discard else ("keep" if confidence >= 0.85 and not flags else "review")
    return CleanRow(
        raw_name=raw_name,
        cn_name_guess="" if discard else raw_name,
        foreign_name_guess=foreign_name,
        years_guess=years,
        original_note=original_note,
        references=references,
        source=source,
        source_page=source_page,
        confidence=confidence,
        needs_review=action != "keep",
        error_flags=flags,
        suggested_action=action,
        source_record={
            "source": source,
            "source_page": source_page,
            "references": references,
        },
    )


def load_rows() -> tuple[list[CleanRow], dict[str, int], Counter[str]]:
    rows: list[CleanRow] = []
    counts: dict[str, int] = {}
    raw_counter: Counter[str] = Counter()
    for source, path in INPUTS:
        data = json.loads(path.read_text(encoding="utf-8"))
        counts[source] = len(data)
        for item in data:
            clean = clean_row(item, source)
            rows.append(clean)
            raw_counter[clean.raw_name] += 1
    return rows, counts, raw_counter


def merge_rows(rows: list[CleanRow]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str], MergeGroup] = defaultdict(MergeGroup)
    for row in rows:
        grouped[merge_key(row)].rows.append(row)

    candidates = []
    for index, key in enumerate(sorted(grouped.keys(), key=lambda item: (item[0], item[1], item[2])), start=1):
        candidates.append(grouped[key].merge(f"C{index:06d}"))
    candidates.sort(key=lambda item: item["candidate_id"])
    return candidates


def write_outputs(candidates: list[dict[str, Any]]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")

    fieldnames = [
        "candidate_id",
        "raw_name",
        "cn_name_guess",
        "foreign_name_guess",
        "years_guess",
        "original_note",
        "references",
        "source",
        "source_page",
        "confidence",
        "needs_review",
        "error_flags",
        "suggested_action",
        "sources",
    ]
    with CSV_OUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for candidate in candidates:
            row = dict(candidate)
            row["error_flags"] = ";".join(row["error_flags"])
            row["sources"] = json.dumps(row["sources"], ensure_ascii=False)
            writer.writerow(row)


def table_row(values: list[Any]) -> str:
    return "| " + " | ".join(str(value).replace("\n", " ").replace("|", "\\|") for value in values) + " |"


def candidate_summary(candidate: dict[str, Any]) -> list[Any]:
    note = candidate["original_note"]
    if len(note) > 90:
        note = note[:90] + "..."
    return [
        candidate["candidate_id"],
        candidate["raw_name"],
        candidate["foreign_name_guess"],
        candidate["years_guess"],
        candidate["source"],
        candidate["source_page"],
        candidate["confidence"],
        ",".join(candidate["error_flags"][:4]),
        note,
    ]


def write_report(candidates: list[dict[str, Any]], source_counts: dict[str, int], raw_counter: Counter[str]) -> None:
    discard_items = [item for item in candidates if item["suggested_action"] == "discard"]
    needs_review_items = [item for item in candidates if item["needs_review"]]
    foreign_count = sum(1 for item in candidates if item["foreign_name_guess"])
    years_count = sum(1 for item in candidates if item["years_guess"])
    lowest_confidence = sorted(candidates, key=lambda item: (item["confidence"], item["candidate_id"]))[:50]
    review_recommendations = sorted(
        [item for item in candidates if item["suggested_action"] != "discard" and item["needs_review"]],
        key=lambda item: (
            -len(item["sources"]),
            -item["confidence"],
            not bool(item["foreign_name_guess"]),
            not bool(item["years_guess"]),
            item["raw_name"],
        ),
    )[:100]

    lines: list[str] = []
    lines.append("# People OCR Quality Report")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- 马恩索引 OCR 原始条目数: {source_counts.get('marx_engels', 0)}")
    lines.append(f"- 列宁索引 OCR 原始条目数: {source_counts.get('lenin', 0)}")
    lines.append(f"- OCR 原始条目总数: {sum(source_counts.values())}")
    lines.append(f"- 清洗后候选人数: {len(candidates)}")
    lines.append(f"- discard 数量: {len(discard_items)}")
    lines.append(f"- needs_review 数量: {len(needs_review_items)}")
    lines.append(f"- foreign_name_guess 成功提取数量: {foreign_count}")
    lines.append(f"- years_guess 成功提取数量: {years_count}")
    lines.append("")
    lines.append("## Raw Name 重复最多的前 30 项")
    lines.append("")
    lines.append("| raw_name | count |")
    lines.append("| --- | ---: |")
    for raw_name, count in raw_counter.most_common(30):
        lines.append(table_row([raw_name, count]))
    lines.append("")
    lines.append("## Confidence 最低的前 50 项")
    lines.append("")
    lines.append("| candidate_id | raw_name | foreign_name_guess | years_guess | source | page | confidence | flags | note |")
    lines.append("| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |")
    for item in lowest_confidence:
        lines.append(table_row(candidate_summary(item)))
    lines.append("")
    lines.append("## suggested_action=discard 的示例 50 项")
    lines.append("")
    lines.append("| candidate_id | raw_name | foreign_name_guess | years_guess | source | page | confidence | flags | note |")
    lines.append("| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |")
    for item in discard_items[:50]:
        lines.append(table_row(candidate_summary(item)))
    lines.append("")
    lines.append("## 推荐下一步人工审核的前 100 个候选人物")
    lines.append("")
    lines.append("| candidate_id | raw_name | foreign_name_guess | years_guess | source | page | confidence | flags | note |")
    lines.append("| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |")
    for item in review_recommendations:
        lines.append(table_row(candidate_summary(item)))
    lines.append("")
    lines.append("## Notes")
    lines.append("")
    lines.append("- `suggested_action=discard` 表示明显噪音、官职片段、目录标题、页码或严重残缺 OCR。")
    lines.append("- `suggested_action=merge` 表示脚本按姓名、外文名、年份等键自动合并了多个 OCR 来源或重复条目。")
    lines.append("- `standard_name` 未在本阶段生成；正式人物简介库也未被修改。")
    REPORT_OUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rows, source_counts, raw_counter = load_rows()
    candidates = merge_rows(rows)
    write_outputs(candidates)
    write_report(candidates, source_counts, raw_counter)
    print(f"raw_total={sum(source_counts.values())}")
    print(f"candidate_total={len(candidates)}")
    print(f"needs_review={sum(1 for item in candidates if item['needs_review'])}")
    print(f"discard={sum(1 for item in candidates if item['suggested_action'] == 'discard')}")
    print(f"wrote={JSON_OUT}")
    print(f"wrote={CSV_OUT}")
    print(f"wrote={REPORT_OUT}")


if __name__ == "__main__":
    main()
