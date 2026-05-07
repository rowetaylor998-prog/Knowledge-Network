from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse

router = APIRouter()

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "content"
ALLOWED_SUFFIXES = {".md", ".markdown"}


def _resolve_content_path(raw_path: str) -> Path:
    if not raw_path or raw_path.strip() in {"", "/"}:
        raise HTTPException(status_code=400, detail="path is required.")

    normalized = raw_path.strip().lstrip("/")
    if normalized.startswith("content/"):
        normalized = normalized[len("content/") :]

    base_candidate = (CONTENT_ROOT / normalized).resolve()
    try:
        base_candidate.relative_to(CONTENT_ROOT.resolve())
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


@router.get("/markdown", response_class=PlainTextResponse)
async def read_markdown(path: str = Query(..., description="Path under the content directory.")) -> str:
    content_path = _resolve_content_path(path)
    return content_path.read_text(encoding="utf-8")
