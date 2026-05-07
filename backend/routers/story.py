from fastapi import APIRouter, HTTPException, Request

from models.schemas import ArchiveSuggestion, CharacterChatRequest, CharacterChatResponse
from services.ai.provider_factory import get_ai_provider
from services.ai.cache import get_cached, make_cache_key, set_cached
from services.ai.rate_limit import enforce_daily_limit, ensure_ai_enabled


router = APIRouter()

ARCHIVES = [
    ArchiveSuggestion(title="Algorithms", path="/content/knowledge/computer-science/algorithms"),
    ArchiveSuggestion(title="Marxism / Political Economy Introduction", path="/content/knowledge/marxism-political-economy/introduction"),
    ArchiveSuggestion(title="Knowledge Map", path="/knowledge"),
    ArchiveSuggestion(title="Knowledge Map", path="/knowledge"),
    ArchiveSuggestion(title="Archive of Sparks Chapter 0", path="/content/works/archive-of-sparks/chapter-0-trapped-people"),
]


@router.post("/character-chat", response_model=CharacterChatResponse)
async def character_chat(http_request: Request, request: CharacterChatRequest) -> CharacterChatResponse:
    ensure_ai_enabled()
    enforce_daily_limit(http_request)

    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="question is required.")

    cache_key = make_cache_key(
        "story.character_chat",
        model=request.model,
        character=request.character or "Atang",
        question=request.question.strip(),
        scene_context=request.scene_context,
        route=request.route or "",
    )
    cached_answer = get_cached(cache_key)
    archives = suggest_archives(request)
    if cached_answer is not None:
        return CharacterChatResponse(answer=cached_answer, suggested_archives=archives, cached=True)

    provider = get_ai_provider()
    prompt = build_story_prompt(request)
    try:
        answer = await provider.generate(prompt, model=request.model)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Story character chat request failed.") from exc

    set_cached(cache_key, answer)
    return CharacterChatResponse(answer=answer, suggested_archives=archives)


def build_story_prompt(request: CharacterChatRequest) -> str:
    character = request.character or "Atang"
    route = request.route or "general"
    route_guidance = {
        "political_economy": "Connect the issue to labor, capital, production relations, and political economy.",
        "mainstream_economics": "Connect the issue to incentives, markets, regulation, labor economics, and institutions.",
        "technology": "Connect the issue to algorithms, data, systems, and AI.",
        "state_institutions": "Connect the issue to law, policy, institutions, and governance.",
        "general": "Answer neutrally and suggest multiple possible routes.",
    }.get(route, "Answer neutrally and suggest multiple possible routes.")

    return "\n\n".join(
        [
            "You are supporting an interactive narrative prototype called Archive of Sparks.",
            "Default character: Atang.",
            "Atang is the original guide character for Archive of Sparks.",
            "She is clear, lively, slightly humorous, but not unserious.",
            "She helps players connect real-life problems to history, economics, technology, and knowledge.",
            "She should not sound like a textbook.",
            "She should not give illegal action instructions or real-world confrontation tactics.",
            "She should encourage lawful, thoughtful, knowledge-based understanding.",
            "She should avoid sexualized, addictive, gambling, or pay-to-win content.",
            f"Character: {character}",
            f"Route: {route}",
            f"Route guidance: {route_guidance}",
            f"Scene context:\n{request.scene_context}",
            f"Player question:\n{request.question}",
            "Keep the answer concise and useful for a learner inside the story.",
        ]
    )


def suggest_archives(request: CharacterChatRequest) -> list[ArchiveSuggestion]:
    route = request.route or ""

    if route == "political_economy":
        return [ARCHIVES[1], ARCHIVES[0], ARCHIVES[4]]
    if route == "mainstream_economics":
        return [ARCHIVES[2], ARCHIVES[3], ARCHIVES[4]]
    if route == "technology":
        return [ARCHIVES[0], ARCHIVES[1], ARCHIVES[4]]
    if route == "state_institutions":
        return [ARCHIVES[3], ARCHIVES[2], ARCHIVES[4]]

    return [ARCHIVES[4], ARCHIVES[0], ARCHIVES[1]]
