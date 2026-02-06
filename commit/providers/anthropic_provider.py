"""
Anthropic provider implementation using the official Anthropic Python SDK.
"""

import os
from typing import Optional

from anthropic import Anthropic

from providers.base import BaseProvider


class AnthropicProvider(BaseProvider):
    """
    Provider implementation for Anthropic's API.

    Uses the official Anthropic Python SDK to interact with Claude models.

    Environment variables:
        ANTHROPIC_API_KEY: Required. Your Anthropic API key.
        MODEL_NAME: Optional. Override the default model.
    """

    DEFAULT_MODEL = "claude-sonnet-4-5-20250929"

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Anthropic provider.

        Args:
            api_key: Optional API key. If not provided, reads from ANTHROPIC_API_KEY env var.

        Raises:
            ValueError: If no API key is found.
        """
        self._api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self._api_key:
            raise ValueError(
                "Anthropic API key not found. Please set ANTHROPIC_API_KEY environment variable."
            )
        self._client = Anthropic(api_key=self._api_key)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "anthropic"

    def get_default_model(self) -> str:
        """Return the default model for Anthropic."""
        return os.getenv("MODEL_NAME", self.DEFAULT_MODEL)

    def chat_completion(self, prompt: str, model: Optional[str] = None) -> str:
        """
        Send a chat completion request to Anthropic.

        Args:
            prompt: The user prompt to send.
            model: Optional model override.

        Returns:
            The text response from the model.
        """
        model_to_use = model or self.get_default_model()

        response = self._client.messages.create(
            model=model_to_use,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )

        # Anthropic returns a list of content blocks
        return response.content[0].text.strip()
