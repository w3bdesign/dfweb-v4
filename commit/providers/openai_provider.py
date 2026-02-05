"""
OpenAI provider implementation using the official OpenAI Python SDK.
"""

import os
from typing import Optional

from openai import OpenAI

from providers.base import BaseProvider


class OpenAIProvider(BaseProvider):
    """
    Provider implementation for OpenAI's API.
    
    Uses the official OpenAI Python SDK to interact with GPT models.
    
    Environment variables:
        OPENAI_API_KEY: Required. Your OpenAI API key.
        MODEL_NAME: Optional. Override the default model.
    """

    DEFAULT_MODEL = "gpt-5.2"

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the OpenAI provider.
        
        Args:
            api_key: Optional API key. If not provided, reads from OPENAI_API_KEY env var.
            
        Raises:
            ValueError: If no API key is found.
        """
        self._api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self._api_key:
            raise ValueError(
                "OpenAI API key not found. Please set OPENAI_API_KEY environment variable."
            )
        self._client = OpenAI(api_key=self._api_key)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "openai"

    def get_default_model(self) -> str:
        """Return the default model for OpenAI."""
        return os.getenv("MODEL_NAME", self.DEFAULT_MODEL)

    def chat_completion(self, prompt: str, model: Optional[str] = None) -> str:
        """
        Send a chat completion request to OpenAI.
        
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
