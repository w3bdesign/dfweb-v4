"""
Provider abstraction layer for LLM API integrations.

This module provides a unified interface for interacting with different LLM providers
(OpenAI, Anthropic, and OpenAI-compatible endpoints) through a common API.

Usage:
    from providers import get_provider
    
    provider = get_provider()  # Auto-detects based on available API keys
    response = provider.chat_completion("Your prompt here")
"""

from providers.factory import get_provider

__all__ = ["get_provider"]
