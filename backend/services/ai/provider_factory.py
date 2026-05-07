import os

from services.ai.base import AIProvider
from services.ai.disabled_provider import DisabledAIProvider
from services.ai.external_provider import ExternalAIProvider
from services.ai.openai_provider import OpenAIProvider


def get_ai_provider() -> AIProvider:
    enabled = os.getenv("ENABLE_AI", "true").lower() == "true"
    provider = os.getenv("AI_PROVIDER", "disabled").lower()

    if not enabled or provider == "disabled":
        return DisabledAIProvider()

    if provider == "openai":
        try:
            return OpenAIProvider()
        except RuntimeError as exc:
            return DisabledAIProviderWithReason(str(exc))

    if provider == "external":
        return ExternalAIProvider()

    # TODO: Add Ollama provider support for AI_PROVIDER=ollama.
    # TODO: Add local model provider support for AI_PROVIDER=local.
    # TODO: Add community node provider support for AI_PROVIDER=community_node.
    return DisabledAIProviderWithReason(
        f"AI_PROVIDER={provider} is not implemented yet. Supported MVP providers: openai, external, disabled."
    )


class DisabledAIProviderWithReason(DisabledAIProvider):
    def __init__(self, reason: str) -> None:
        self.reason = reason

    async def generate(self, prompt: str, **kwargs: object) -> str:
        base_message = await super().generate(prompt, **kwargs)
        return f"{base_message} Reason: {self.reason}"
