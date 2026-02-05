"""
Provider factory with auto-detection and explicit selection support.

This module provides a factory function to get the appropriate LLM provider
based on environment configuration.
"""

import os
from typing import Optional

from providers.base import BaseProvider
from providers.openai_provider import OpenAIProvider
from providers.anthropic_provider import AnthropicProvider
from providers.openai_compatible import OpenAICompatibleProvider


# Valid provider names for explicit selection
VALID_PROVIDERS = frozenset(["anthropic", "openai", "openai-compatible"])


class ProviderConfigurationError(Exception):
    """Raised when provider configuration is invalid or missing."""
    pass


class InvalidProviderError(Exception):
    """Raised when an invalid provider name is specified."""
    pass


def get_provider(provider_name: Optional[str] = None) -> BaseProvider:
    """
    Get an LLM provider instance.
    
    If provider_name is specified, returns that specific provider.
    Otherwise, checks the PROVIDER environment variable.
    If PROVIDER is not set, auto-detects based on available API keys.
    
    Auto-detection priority order:
    1. Anthropic (if ANTHROPIC_API_KEY is set)
    2. OpenAI (if OPENAI_API_KEY is set)
    3. OpenAI-compatible (if OPENAI_COMPATIBLE_API_KEY and OPENAI_COMPATIBLE_BASE_URL are set)
    
    Args:
        provider_name: Optional explicit provider name ('anthropic', 'openai', 'openai-compatible').
        
    Returns:
        A configured provider instance.
        
    Raises:
        InvalidProviderError: If an invalid provider name is specified.
        ProviderConfigurationError: If no provider can be configured.
    """
    # Determine provider name
    name = provider_name or os.getenv("PROVIDER")
    
    if name:
        # Explicit provider selection
        name = name.lower().strip()
        if name not in VALID_PROVIDERS:
            raise InvalidProviderError(
                f"Invalid provider '{name}'. Valid providers are: {', '.join(sorted(VALID_PROVIDERS))}"
            )
        return _create_provider(name)
    
    # Auto-detection mode
    return _auto_detect_provider()


def _create_provider(name: str) -> BaseProvider:
    """
    Create a provider instance by name.
    
    Args:
        name: The provider name.
        
    Returns:
        A configured provider instance.
    """
    if name == "anthropic":
        return AnthropicProvider()
    elif name == "openai":
        return OpenAIProvider()
    elif name == "openai-compatible":
        return OpenAICompatibleProvider()
    else:
        raise InvalidProviderError(f"Unknown provider: {name}")


def _auto_detect_provider() -> BaseProvider:
    """
    Auto-detect and return the appropriate provider based on available API keys.
    
    Returns:
        A configured provider instance.
        
    Raises:
        ProviderConfigurationError: If no API keys are found.
    """
    # Check for Anthropic (highest priority)
    if os.getenv("ANTHROPIC_API_KEY"):
        return AnthropicProvider()
    
    # Check for OpenAI
    if os.getenv("OPENAI_API_KEY"):
        return OpenAIProvider()
    
    # Check for OpenAI-compatible
    if os.getenv("OPENAI_COMPATIBLE_API_KEY") and os.getenv("OPENAI_COMPATIBLE_BASE_URL"):
        return OpenAICompatibleProvider()
    
    # No provider found
    raise ProviderConfigurationError(
        "No API key found. Please configure one of the following:\n"
        "  - ANTHROPIC_API_KEY for Anthropic Claude models\n"
        "  - OPENAI_API_KEY for OpenAI GPT models\n"
        "  - OPENAI_COMPATIBLE_API_KEY and OPENAI_COMPATIBLE_BASE_URL for OpenAI-compatible endpoints\n"
        "\n"
        "Alternatively, set PROVIDER environment variable to explicitly choose a provider."
    )
