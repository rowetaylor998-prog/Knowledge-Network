# Proletarian Biographical Index / 无产阶级人物索引库

This directory contains the first MVP data file for the Knowledge Platform's proletarian biographical appendix.

The index is manually expandable. Each entry keeps a compact schema for name normalization, reading notes, classic-text references, future story/game popovers, and Marxist/proletarian-standpoint summaries.

Future enrichment can use the scanned reference indexes:

- 马克思恩格斯全集人名索引 第一至三十九卷
- 列宁全集俄文 第5版 人名索引

Because those PDFs are scanned and may not have clean OCR text, frontend code should not depend on parsing them directly. Later versions may add CSV import tools, OCR-assisted review workflows, and graph visualization for relations.

Initial OCR exports are stored in `content/people/ocr_exports/`. The local helper script is `scripts/ocr_people_index.swift`; it uses macOS PDFKit and Vision OCR, exports CSV and JSON, and marks imported rows as `needs_review=true` for manual inspection before any biography generation or database import. The current exports were run from PDF page 87 for the Lenin index and PDF page 7 for the Marx-Engels index.
