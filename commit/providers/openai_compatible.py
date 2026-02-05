"""
Generic OpenAI-compatible provider implementation.

This provider supports any API endpoint that implements the OpenAI API format,
such as LM Studio, Ollama, vLLM, and other local or self-hosted LLM services.
"""

import os
from typing import Optional

from openai import OpenAI

from providers.base import BaseProvider


class OpenAICompatibleProvider(BaseProvider):
    """
    Provider implementation for OpenAI-compatible APIs.

    Uses the OpenAI Python SDK with a custom base_url to interact with
    any OpenAI-compatible endpoint.

    Environment variables:
        OPENAI_COMPATIBLE_API_KEY: Required. API key for the compatible endpoint.
        OPENAI_COMPATIBLE_BASE_URL: Required. Base URL for the compatible endpoint.
        MODEL_NAME: Required for this provider. The model to use.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        """
        Initialize the OpenAI-compatible provider.

        Args:
            api_key: Optional API key. If not provided, reads from OPENAI_COMPATIBLE_API_KEY env var.
            base_url: Optional base URL. If not provided, reads from OPENAI_COMPATIBLE_BASE_URL env var.

        Raises:
            ValueError: If API key or base URL is not found.
        """
        self._api_key = api_key or os.getenv("OPENAI_COMPATIBLE_API_KEY")
        self._base_url = base_url or os.getenv("OPENAI_COMPATIBLE_BASE_URL")

        if not self._api_key:
            raise ValueError(
                "OpenAI-compatible API key not found. "
                "Please set OPENAI_COMPATIBLE_API_KEY environment variable."
            )
        if not self._base_url:
            raise ValueError(
                "OpenAI-compatible base URL not found. "
                "Please set OPENAI_COMPATIBLE_BASE_URL environment variable."
            )

        self._client = OpenAI(api_key=self._api_key, base_url=self._base_url)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "openai-compatible"

    def get_default_model(self) -> str:
        """
        Return the default model for this provider.

        Note: For OpenAI-compatible providers, the model must be specified
        via MODEL_NAME environment variable as there's no universal default.
        """
        model = os.getenv("MODEL_NAME")
        if not model:
            raise ValueError(
                "MODEL_NAME environment variable is required for openai-compatible provider. "
                "Please set MODEL_NAME to your desired model."
            )
        return model

    def chat_completion(self, prompt: str, model: Optional[str] = None) -> str:
        """
        Send a chat completion request to the OpenAI-compatible endpoint.

        Args:
            prompt: The user prompt to send.
            model: Optional model override.

        Returns:
            The text response from the model.
        """
        model_to_use = model or self.get_default_model()

        response = self._client.chat.completions.create(
            model=model_to_use,
            messages=[{"role": "user", "content": prompt}],
            stream=False,
        )

        return response.choices[0].message.content.strip()
