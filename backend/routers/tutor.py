from fastapi import APIRouter, HTTPException, Request

from models.schemas import (
    ImproveAnnotationRequest,
    ImproveAnnotationResponse,
    TutorAskRequest,
    TutorAskResponse,
)
from services.ai.provider_factory import get_ai_provider
from services.ai.cache import get_cached, make_cache_key, set_cached
from services.ai.rate_limit import enforce_daily_limit, ensure_ai_enabled


router = APIRouter()


@router.post("/ask", response_model=TutorAskResponse)
async def ask_tutor(http_request: Request, request: TutorAskRequest) -> TutorAskResponse:
    ensure_ai_enabled()

    question = (request.question or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required.")
    enforce_daily_limit(http_request)

    cache_key = make_cache_key(
        "tutor.ask",
        provider=request.provider,
        model=request.model,
        question=question,
        context=request.context or "",
        page_title=request.page_title or "",
    )
    cached_answer = get_cached(cache_key)
    if cached_answer is not None:
        return TutorAskResponse(answer=cached_answer, cached=True)

    provider = get_ai_provider()
    prompt = build_tutor_prompt(request)
    try:
        answer = await provider.generate(
            prompt,
            question=question,
            context=request.context,
            page_title=request.page_title,
            provider=request.provider,
            model=request.model,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail="AI tutor request failed.") from exc
    set_cached(cache_key, answer)
    return TutorAskResponse(answer=answer)


@router.post("/improve-annotation", response_model=ImproveAnnotationResponse)
async def improve_annotation(
    http_request: Request, request: ImproveAnnotationRequest
) -> ImproveAnnotationResponse:
    ensure_ai_enabled()

    if not request.annotation or not request.annotation.strip():
        raise HTTPException(status_code=400, detail="annotation is required.")
    enforce_daily_limit(http_request)

    provider = get_ai_provider()
    prompt = build_annotation_prompt(request)
    try:
        answer = await provider.generate(prompt, model=request.model)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="AI annotation request failed.") from exc

    return parse_annotation_answer(answer)


def build_tutor_prompt(request: TutorAskRequest) -> str:
    parts = [
        "You are an AI tutor for an open knowledge platform.",
        "Explain clearly for learners.",
        "Prefer simple explanation first, then deeper explanation if useful.",
        "Encourage critical thinking.",
        "Do not claim certainty when unsure.",
        "If context is provided, ground the answer in that context.",
        "Keep answers concise by default.",
        "The answer should usually be under 800 Chinese characters unless the user asks for more.",
    ]

    if request.page_title:
        parts.append(f"Page title: {request.page_title}")

    if request.context:
        parts.append(f"Context:\n{request.context}")

    parts.append(f"Question:\n{request.question or ''}")
    return "\n\n".join(parts)


def build_annotation_prompt(request: ImproveAnnotationRequest) -> str:
    source_text = request.source_text or ""
    source_note = (
        source_text
        if source_text.strip()
        else "No source_text was provided. Improve the annotation, but say feedback is limited."
    )

    return "\n\n".join(
        [
            "You are an annotation mentor for an open knowledge platform.",
            "Preserve the user's original meaning.",
            "Point out unclear concepts or weak logic.",
            "Rewrite the annotation more clearly.",
            "Ask one follow-up question that helps the learner think deeper.",
            "Do not be harsh or insulting.",
            "Do not invent facts not supported by the source_text.",
            "Return exactly three labeled sections:",
            "Feedback:",
            "Improved Annotation:",
            "Follow-up Question:",
            f"Source text:\n{source_note}",
            f"User annotation:\n{request.annotation or ''}",
        ]
    )


def parse_annotation_answer(answer: str) -> ImproveAnnotationResponse:
    sections = {
        "feedback": "",
        "improved_annotation": "",
        "follow_up_question": "",
    }
    current_key: str | None = None
    label_map = {
        "feedback:": "feedback",
        "improved annotation:": "improved_annotation",
        "follow-up question:": "follow_up_question",
        "follow up question:": "follow_up_question",
    }

    for line in answer.splitlines():
        normalized = line.strip().lower()
        if normalized in label_map:
            current_key = label_map[normalized]
            continue
        if current_key:
            sections[current_key] = f"{sections[current_key]}\n{line}".strip()

    if not any(sections.values()):
        sections["feedback"] = answer
        sections["improved_annotation"] = answer
        sections["follow_up_question"] = "What idea in this annotation do you most want to understand more deeply?"

    return ImproveAnnotationResponse(**sections)
