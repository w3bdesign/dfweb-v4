"""
Base provider abstract class defining the interface all LLM providers must implement.
"""

from abc import ABC, abstractmethod
from typing import Optional


class BaseProvider(ABC):
    """
    Abstract base class for LLM providers.
    
    All provider implementations must inherit from this class and implement
    the required abstract methods to ensure a consistent interface.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """
        Return the provider name (e.g., 'openai', 'anthropic', 'openai-compatible').
        """
        pass

    @abstractmethod
    def chat_completion(self, prompt: str, model: Optional[str] = None) -> str:
        """
        Send a chat completion request and return the response text.
        
        Args:
            prompt: The user prompt to send to the LLM.
            model: Optional model override. If not provided, uses the default model.
            
        Returns:
            The text response from the LLM.
            
        Raises:
            Exception: If the API request fails.
        """
        pass

    @abstractmethod
    def get_default_model(self) -> str:
        """
        Return the default model for this provider.
        
        Returns:
            The default model identifier string.
        """
        pass
