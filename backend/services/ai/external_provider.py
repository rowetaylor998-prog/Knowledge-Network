import os
import logging
from typing import Any

import httpx

from services.ai.base import AIProvider

logger = logging.getLogger(__name__)


class ExternalAIProvider(AIProvider):
    """Proxy AI requests to an already-deployed AI web app.

    This keeps the knowledge platform frontend independent from any vendor API key.
    The platform backend talks to this external service, and the frontend only talks
    to the platform backend.
    """

    def __init__(self) -> None:
        self.base_url = self._get_env("EXTERNAL_AI_BASE_URL", "AI_BASE_URL").rstrip("/")
        self.chat_endpoint = self._get_env(
            "EXTERNAL_AI_CHAT_ENDPOINT",
            "EXTERNAL_AI_WEB_ENDPOINT",
            "AI_CHAT_ENDPOINT",
            default="/chat-web",
        )
        self.timeout_seconds = self._get_timeout()
        self.config_error = ""

        if not self.base_url:
            self.config_error = (
                "EXTERNAL_AI_BASE_URL is missing. Set EXTERNAL_AI_BASE_URL or legacy AI_BASE_URL."
            )

    async def generate(self, prompt: str, **kwargs: Any) -> str:
        if self.config_error:
            return f"External AI is not configured correctly: {self.config_error}"

        endpoint = self.chat_endpoint
        if not endpoint.startswith("/"):
            endpoint = f"/{endpoint}"

        question = str(kwargs.get("question") or prompt)
        context = str(kwargs.get("context") or "")
        page_title = str(kwargs.get("page_title") or "Be Knowledgeable Platform")
        model = kwargs.get("model")
        provider = kwargs.get("provider")

        payload = {
            "question": question,
            "message": question,
            "context": context,
            "page_title": page_title,
        }
        if provider:
            payload["provider"] = str(provider)
        if model:
            payload["model"] = str(model)

        url = f"{self.base_url}{endpoint}"

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(url, json=payload)
        except httpx.HTTPError as exc:
            logger.warning("External AI request failed url=%s error=%s", url, exc.__class__.__name__)
            return f"External AI request failed: {exc.__class__.__name__}."

        response_preview = response.text[:300]
        logger.info(
            "External AI response url=%s status=%s preview=%s",
            url,
            response.status_code,
            response_preview,
        )

        if response.status_code < 200 or response.status_code >= 300:
            return (
                f"External AI returned status {response.status_code}. "
                f"Response preview: {response_preview}"
            )

        try:
            data = response.json()
        except ValueError:
            if response.text.strip():
                return response.text
            return "External AI returned an empty non-JSON response."

        if isinstance(data, dict):
            for key in ("answer", "content", "message", "text", "response"):
                value = data.get(key)
                if isinstance(value, str) and value.strip():
                    return value
                if isinstance(value, dict):
                    nested_content = value.get("content")
                    if isinstance(nested_content, str) and nested_content.strip():
                        return nested_content
                    nested_answer = value.get("answer")
                    if isinstance(nested_answer, str) and nested_answer.strip():
                        return nested_answer

        if isinstance(data, str) and data.strip():
            return data

        if response.text.strip():
            return f"External AI returned an unsupported response format. Preview: {response_preview}"

        return "External AI returned an unsupported empty response."

    def _get_env(self, *names: str, default: str = "") -> str:
        for name in names:
            value = os.getenv(name)
            if value:
                return value
        return default

    def _get_timeout(self) -> float:
        raw_timeout = self._get_env(
            "EXTERNAL_AI_TIMEOUT_SECONDS",
            "AI_TIMEOUT_SECONDS",
            default="45",
        )
        try:
            return float(raw_timeout)
        except ValueError:
            return 45.0
