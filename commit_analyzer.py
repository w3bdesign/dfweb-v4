import subprocess
import os
import sys
import json
import codecs

from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

def get_api_config():
    """Get API configuration from various sources in order of precedence:
    1. Environment variables (including .env)
    2. Local config file in user's home directory
    """
    # Try loading from .env file first
    load_dotenv()

    # Get API key
    api_key = os.getenv("AI_API_KEY")

    # Get base URL if set (no default)
    base_url = os.getenv("AI_BASE_URL")

    if not api_key:
        # Try config file in home directory as fallback
        config_path = os.path.join(str(Path.home()), ".ai_config.json")
        try:
            if os.path.exists(config_path):
                with open(config_path, "r") as f:
                    config = json.load(f)
                    api_key = config.get("api_key")
                    # Also check for base_url in config
                    if "base_url" in config:
                        base_url = config.get("base_url")
        except Exception as e:
            print(f"Error reading config file: {e}")

    if not api_key:
        raise ValueError(
            "No API key found. Please either:\n"
            "1. Create a .env file in your repository with AI_API_KEY=your-api-key\n"
            "2. Set AI_API_KEY environment variable, or\n"
            f'3. Create {config_path} with content: {{"api_key": "your-api-key"}}'
        )

    return api_key, base_url


def get_staged_diff():
    """Get the diff of staged changes"""
    try:
        # Get diff of staged changes
        diff = subprocess.check_output(["git", "diff", "--cached"]).decode("utf-8")
        if not diff:
            # If no staged changes, get diff of last commit
            diff = subprocess.check_output(["git", "diff", "HEAD~1"]).decode("utf-8")
        return diff
    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff: {e}")
        return None


def load_gitmojis():
    """Load gitmojis from gitmojis.json"""
    try:
        with open("gitmojis.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            return {gitmoji["name"]: gitmoji["emoji"] for gitmoji in data["gitmojis"]}
    except Exception as e:
        print(f"Error loading gitmojis: {e}")
        return {}


def get_emoji_for_type(commit_type, gitmojis):
    """Map commit type to appropriate emoji"""
    type_to_emoji = {
        # Core conventional commit types
        "feat": gitmojis.get("sparkles", "✨"),  # New feature
        "fix": gitmojis.get("bug", "🐛"),  # Bug fix
        "docs": gitmojis.get("memo", "📝"),  # Documentation
        "style": gitmojis.get("art", "🎨"),  # Style/format
        "refactor": gitmojis.get("recycle", "♻️"),  # Code refactoring
        "perf": gitmojis.get("zap", "⚡️"),  # Performance
        "test": gitmojis.get("white-check-mark", "✅"),  # Tests
        "chore": gitmojis.get("wrench", "🔧"),  # Chores
        "ci": gitmojis.get("construction-worker", "👷"),  # CI changes
        # Additional commit types with specific emojis
        "security": gitmojis.get("lock", "🔒"),  # Security fixes
        "deps": gitmojis.get("package", "📦"),  # Dependencies
        "breaking": gitmojis.get("boom", "💥"),  # Breaking changes
        "ui": gitmojis.get("lipstick", "💄"),  # UI/style changes
        "i18n": gitmojis.get("globe-with-meridians", "🌐"),  # Internationalization
        "typo": gitmojis.get("pencil2", "✏️"),  # Fix typos
        "init": gitmojis.get("tada", "🎉"),  # Initial commit
        "license": gitmojis.get("page-facing-up", "📄"),  # License
        "docker": gitmojis.get("whale", "🐳"),  # Docker
        "config": gitmojis.get("wrench", "🔧"),  # Configuration changes
        "access": gitmojis.get("wheelchair", "♿️"),  # Accessibility
        "logs": gitmojis.get("loud-sound", "🔊"),  # Logging
        "db": gitmojis.get("card-file-box", "🗃️"),  # Database
        "cleanup": gitmojis.get("fire", "🔥"),  # Remove code/files
        "wip": gitmojis.get("construction", "🚧"),  # Work in progress
        "move": gitmojis.get("truck", "🚚"),  # Move/rename files
        "revert": gitmojis.get("rewind", "⏪"),  # Revert changes
        "merge": gitmojis.get("twisted-rightwards-arrows", "🔀"),  # Merge branches
        "responsive": gitmojis.get("iphone", "📱"),  # Responsive design
        "hotfix": gitmojis.get("ambulance", "🚑"),  # Critical hotfix
    }
    return type_to_emoji.get(commit_type, "")


def generate_commit_message(diff):
    """Generate commit message using OpenAI API"""
    try:
        api_key, base_url = get_api_config()
        client_kwargs = {"api_key": api_key}
        if base_url:
            client_kwargs["base_url"] = base_url

        client = OpenAI(**client_kwargs)

        # Get model from environment variable or use default
        model = os.getenv("MODEL_NAME", "claude-3.5-sonnet@anthropic")

        # Load gitmojis
        # gitmojis = load_gitmojis()

        prompt = f"""You are a git commit message generator. Your task is to analyze the git diff and output ONLY the commit message itself - no explanations, no prefixes like "Based on the diff...", just the commit message exactly as it should appear in git.

        The commit message MUST follow this format:
        <emoji> <type>[optional scope]: <description>

        [optional body]

        [optional footer(s)]

        Where:
        1. Type MUST be one of (with corresponding emoji):
           Core types:
           - ✨ feat: A new feature
           - 🐛 fix: A bug fix
           - 📝 docs: Documentation only changes
           - 🎨 style: Changes that don't affect the meaning of the code
           - ♻️ refactor: A code change that neither fixes a bug nor adds a feature
           - ⚡️ perf: A code change that improves performance
           - ✅ test: Adding missing tests or correcting existing tests
           - 🔧 chore: Changes to build process or auxiliary tools
           - 👷 ci: Changes to CI configuration files and scripts

           Additional specific types:
           - 🔒 security: Security fixes
           - 📦 deps: Dependencies
           - 💥 breaking: Breaking changes
           - 💄 ui: UI/style changes
           - 🌐 i18n: Internationalization
           - ✏️ typo: Fix typos
           - 🎉 init: Initial commit
           - 📄 license: License
           - 🐳 docker: Docker
           - ♿️ access: Accessibility
           - 🔊 logs: Logging
           - 🗃️ db: Database
           - 🔥 cleanup: Remove code/files
           - 🚧 wip: Work in progress
           - 🚚 move: Move/rename files
           - ⏪ revert: Revert changes
           - 🔀 merge: Merge branches
           - 📱 responsive: Responsive design
           - 🚑 hotfix: Critical hotfix

        2. Description MUST:
           - Be 50 characters or less
           - Start with lowercase
           - Use imperative mood ("add" not "adds/added")
           - No period at end
           - Be clear and descriptive

        3. Body (if included) MUST:
           - Be separated from title by blank line
           - Wrap at 72 characters
           - Explain what and why vs. how
           - Use proper punctuation

        Git diff to analyze:
        {diff}

        Output ONLY the commit message exactly as it should appear in git, with no additional text."""

        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            stream=False,
        )
        
        # Get the message and clean any potential explanatory text
        message = response.choices[0].message.content.strip()
        if "Based on the diff" in message:
            message = message.split("\n")[-1].strip()
        return message
    except Exception as e:
        print(f"Error generating commit message: {e}")
        return None


def main():
    # Get the diff
    diff = get_staged_diff()
    if not diff:
        print("No changes to analyze")
        sys.exit(1)

    # Generate commit message
    commit_message = generate_commit_message(diff)
    if not commit_message:
        print("Failed to generate commit message")
        sys.exit(1)

    # Print the commit message
    print("\nGenerated commit message:")
    print("------------------------")
    # Use sys.stdout.buffer.write for Unicode support in console
    sys.stdout.buffer.write(commit_message.encode("utf-8"))
    print("\n------------------------")

    # If running as a hook, save the message
    if len(sys.argv) > 1 and sys.argv[1] == "--hook":
        # Use UTF-8 encoding when writing the commit message
        with codecs.open(".git/COMMIT_EDITMSG", "w", encoding="utf-8") as f:
            f.write(commit_message)


if __name__ == "__main__":
    main()
