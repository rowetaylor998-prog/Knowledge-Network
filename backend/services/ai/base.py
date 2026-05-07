from abc import ABC, abstractmethod


class AIProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, **kwargs: object) -> str:
        """Generate a text response for the given prompt."""
