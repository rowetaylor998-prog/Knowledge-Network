import os

from services.ai.base import AIProvider


class OpenAIProvider(AIProvider):
    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is required when AI_PROVIDER=openai.")

        try:
            from openai import AsyncOpenAI
        except ImportError as exc:
            raise RuntimeError("The openai package is required when AI_PROVIDER=openai.") from exc

        self.client = AsyncOpenAI(api_key=api_key)
        self.default_model = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")

    async def generate(self, prompt: str, **kwargs: object) -> str:
        model = str(kwargs.get("model") or self.default_model)
        response = await self.client.responses.create(
            model=model,
            input=prompt,
        )
        return response.output_text
