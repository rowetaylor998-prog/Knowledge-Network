from services.ai.base import AIProvider


class DisabledAIProvider(AIProvider):
    async def generate(self, prompt: str, **kwargs: object) -> str:
        return (
            "AI tutor support is currently disabled. The platform can still be used for "
            "Markdown content, guided learning, and Archive of Sparks navigation. Set "
            "AI_PROVIDER=openai and configure an API key to enable hosted AI responses."
        )
