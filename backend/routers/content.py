from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse

router = APIRouter()

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "content"
ALLOWED_SUFFIXES = {".md", ".markdown"}


def _content_root_resolved() -> Path:
    return CONTENT_ROOT.resolve()


def _resolve_content_path(raw_path: str) -> Path:
    if not raw_path or raw_path.strip() in {"", "/"}:
        raise HTTPException(status_code=400, detail="path is required.")

    normalized = raw_path.strip().lstrip("/")
    if normalized.startswith("content/"):
        normalized = normalized[len("content/") :]

    content_root = _content_root_resolved()
    base_candidate = (CONTENT_ROOT / normalized).resolve()
    try:
        base_candidate.relative_to(content_root)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid content path.") from exc

    if base_candidate.suffix == "":
        candidates = [
            base_candidate.with_suffix(".md"),
            base_candidate / "README.md",
        ]
    else:
        candidates = [base_candidate]

    candidate = next((path for path in candidates if path.exists() and path.is_file()), candidates[0])

    if candidate.suffix.lower() not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=400, detail="Only Markdown content can be loaded.")

    if not candidate.exists() or not candidate.is_file():
        raise HTTPException(status_code=404, detail="Content file not found.")

    return candidate


def _resolve_index_root(raw_root: str | None) -> Path:
    if raw_root is None or raw_root.strip() in {"", "/"}:
        return _content_root_resolved()

    normalized = raw_root.strip().lstrip("/")
    if normalized.startswith("content/"):
        normalized = normalized[len("content/") :]

    content_root = _content_root_resolved()
    root_path = (CONTENT_ROOT / normalized).resolve()
    try:
        root_path.relative_to(content_root)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid content root.") from exc

    if not root_path.exists() or not root_path.is_dir():
        raise HTTPException(status_code=404, detail="Content root not found.")

    return root_path


def _markdown_title_from_filename(content_path: Path) -> str:
    if content_path.stem.lower() == "readme":
        return content_path.parent.name.replace("-", " ").replace("_", " ").title()
    return content_path.stem.replace("-", " ").replace("_", " ").title()


def _extract_markdown_metadata(content_path: Path) -> tuple[str, str]:
    title = ""
    description_parts: list[str] = []
    in_code_block = False

    for raw_line in content_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if line.startswith("```") or line.startswith("~~~"):
            in_code_block = not in_code_block
            continue

        if in_code_block or not line:
            if description_parts:
                break
            continue

        if line.startswith("#"):
            if not title:
                title = line.lstrip("#").strip()
            continue

        if not description_parts:
            description_parts.append(line)
            continue

        description_parts.append(line)

    return title or _markdown_title_from_filename(content_path), " ".join(description_parts)


def _content_index_path(content_path: Path) -> str:
    relative_path = content_path.relative_to(_content_root_resolved())
    if content_path.stem.lower() == "readme":
        relative_without_suffix = relative_path.parent
    else:
        relative_without_suffix = relative_path.with_suffix("")
    return f"/content/{relative_without_suffix.as_posix()}"


def _content_category(content_path: Path) -> str:
    relative_parent = content_path.relative_to(_content_root_resolved()).parent
    return relative_parent.as_posix() if relative_parent.as_posix() != "." else "content"


def _markdown_files(root: Path) -> list[Path]:
    return [
        content_path
        for content_path in sorted(root.rglob("*"))
        if content_path.is_file() and content_path.suffix.lower() in ALLOWED_SUFFIXES
    ]


def _extract_headings(markdown: str) -> list[str]:
    return [line.lstrip("#").strip() for line in markdown.splitlines() if line.strip().startswith("#")]


def _plain_markdown_text(markdown: str) -> str:
    lines = []
    in_code_block = False

    for raw_line in markdown.splitlines():
        line = raw_line.strip()
        if line.startswith("```") or line.startswith("~~~"):
            in_code_block = not in_code_block
            continue

        if in_code_block or not line:
            continue

        lines.append(line.lstrip("#").strip())

    return " ".join(lines)


def _search_snippet(markdown_text: str, query: str) -> str:
    normalized_text = " ".join(markdown_text.split())
    match_index = normalized_text.lower().find(query.lower())

    if match_index == -1:
        return normalized_text[:220]

    start = max(match_index - 80, 0)
    end = min(match_index + len(query) + 140, len(normalized_text))
    prefix = "..." if start > 0 else ""
    suffix = "..." if end < len(normalized_text) else ""
    return f"{prefix}{normalized_text[start:end]}{suffix}"


@router.get("/index")
async def read_content_index(
    root: str | None = Query(None, description="Optional directory under content/.")
) -> dict[str, list[dict[str, str]]]:
    index_root = _resolve_index_root(root)
    items = []

    for content_path in _markdown_files(index_root):
        title, description = _extract_markdown_metadata(content_path)
        items.append(
            {
                "title": title,
                "path": _content_index_path(content_path),
                "category": _content_category(content_path),
                "description": description,
            }
        )

    return {"items": items}


@router.get("/search")
async def search_content(
    q: str = Query(..., min_length=1, description="Case-insensitive keyword search query.")
) -> dict[str, list[dict[str, str]]]:
    query = q.strip()
    if not query:
        return {"items": []}

    normalized_query = query.lower()
    matches = []

    for content_path in _markdown_files(_content_root_resolved()):
        markdown = content_path.read_text(encoding="utf-8")
        title, _description = _extract_markdown_metadata(content_path)
        headings = _extract_headings(markdown)
        body_text = _plain_markdown_text(markdown)
        title_match = normalized_query in title.lower()
        headings_match = normalized_query in " ".join(headings).lower()
        body_match = normalized_query in body_text.lower()

        if not (title_match or headings_match or body_match):
            continue

        if title_match:
            rank = 0
        elif headings_match:
            rank = 1
        else:
            rank = 2

        matches.append(
            {
                "rank": rank,
                "title": title,
                "path": _content_index_path(content_path),
                "snippet": _search_snippet(body_text, query),
            }
        )

    items = [
        {key: value for key, value in item.items() if key != "rank"}
        for item in sorted(matches, key=lambda match: (match["rank"], match["title"].lower()))[:20]
    ]
    return {"items": items}


@router.get("/markdown", response_class=PlainTextResponse)
async def read_markdown(path: str = Query(..., description="Path under the content directory.")) -> str:
    content_path = _resolve_content_path(path)
    return content_path.read_text(encoding="utf-8")
