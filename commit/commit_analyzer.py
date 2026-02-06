#!/usr/bin/env python3
"""
AI-Powered Git Commit Message Generator

Generates conventional commit messages using OpenAI, Anthropic, or any OpenAI-compatible LLM API.

Installation in another repo:
1. Copy the entire commit/ folder to your repo
2. Run: pip install openai anthropic python-dotenv
3. Create .env with your API key (or run setup.sh/setup.ps1)
4. Make a commit!
"""

import subprocess
import os
import sys
import json
import codecs
from typing import List, Tuple, Optional
from pathlib import Path
from dotenv import load_dotenv

# Add this directory to path to import the providers module
sys.path.insert(0, str(Path(__file__).parent))
from providers import get_provider


# =============================================================================
# GIT COMMAND SECURITY
# =============================================================================

_ALLOWED_GIT_SUBCOMMANDS = frozenset(["diff"])
_GIT_ARG_CACHED = "--cached"
_GIT_ARG_NAME_ONLY = "--name-only"
_GIT_ARG_HEAD_PREVIOUS = "HEAD~1"
_ALLOWED_GIT_ARGS = frozenset([_GIT_ARG_CACHED, _GIT_ARG_NAME_ONLY, _GIT_ARG_HEAD_PREVIOUS])

_REPOSITORY_CONTEXT_PATH = "DOCS/repository_context.txt"


def _normalize_repo_path(path: str) -> str:
    """Normalize paths to forward-slashed, workspace-relative form."""
    return path.replace("\\", "/").lstrip("./")


def _filter_diff_excluding_paths(diff: str, excluded_paths: List[str]) -> str:
    """Remove full per-file diff blocks for excluded paths."""
    if not diff or not excluded_paths:
        return diff

    excluded = {_normalize_repo_path(p) for p in excluded_paths}
    kept: List[str] = []
    skipping = False

    for line in diff.splitlines(True):
        if line.startswith("diff --git "):
            parts = line.strip().split()
            a_path = ""
            b_path = ""
            if len(parts) >= 4:
                a_token = parts[2]
                b_token = parts[3]
                if a_token.startswith("a/"):
                    a_path = a_token[2:]
                if b_token.startswith("b/"):
                    b_path = b_token[2:]

            file_path = b_path or a_path
            skipping = _normalize_repo_path(file_path) in excluded

            if skipping:
                continue

        if skipping:
            continue

        kept.append(line)

    return "".join(kept)


def _run_git_command(args: List[str]) -> str:
    """
    Safely execute a git command with strict whitelist validation.
    """
    if not args:
        raise ValueError("Git command arguments cannot be empty")

    subcommand = args[0]
    if subcommand not in _ALLOWED_GIT_SUBCOMMANDS:
        raise ValueError(f"Git subcommand '{subcommand}' not allowed")

    for arg in args[1:]:
        if arg not in _ALLOWED_GIT_ARGS:
            raise ValueError(f"Git argument '{arg}' not allowed")

    full_command = ["git"] + list(args)
    result = subprocess.check_output(
        full_command,
        shell=False,
        stderr=subprocess.DEVNULL,
    )
    return result.decode("utf-8")


# =============================================================================
# DIFF ANALYSIS
# =============================================================================

def _is_lock_file(filename: str) -> bool:
    """Check if a filename is a dependency lock file."""
    lock_file_patterns = (
        ".lock",
        "lock.json",
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
    )
    return any(filename.endswith(pattern) for pattern in lock_file_patterns)


def get_staged_diff() -> Tuple[Optional[str], bool, List[str]]:
    """
    Get the diff of staged changes and list of changed files.

    Returns:
        Tuple of (diff_content, has_lock_files, changed_files)
    """
    try:
        files_output = _run_git_command(["diff", _GIT_ARG_CACHED, _GIT_ARG_NAME_ONLY])
        staged_files = files_output.splitlines()
        staged_files_normalized = [_normalize_repo_path(f) for f in staged_files]

        if any(_is_lock_file(f) for f in staged_files):
            return None, True, staged_files

        if staged_files_normalized == [_REPOSITORY_CONTEXT_PATH]:
            return "", False, staged_files

        diff = _run_git_command(["diff", _GIT_ARG_CACHED])

        if _REPOSITORY_CONTEXT_PATH in staged_files_normalized:
            diff = _filter_diff_excluding_paths(diff, [_REPOSITORY_CONTEXT_PATH])

        if not diff:
            diff = _run_git_command(["diff", _GIT_ARG_HEAD_PREVIOUS])
            files_output = _run_git_command(["diff", _GIT_ARG_HEAD_PREVIOUS, _GIT_ARG_NAME_ONLY])
            staged_files = files_output.splitlines()
            staged_files_normalized = [_normalize_repo_path(f) for f in staged_files]

            if any(_is_lock_file(f) for f in staged_files):
                return None, True, staged_files

            if staged_files_normalized == [_REPOSITORY_CONTEXT_PATH]:
                return "", False, staged_files

            if _REPOSITORY_CONTEXT_PATH in staged_files_normalized:
                diff = _filter_diff_excluding_paths(diff, [_REPOSITORY_CONTEXT_PATH])

        return diff, False, staged_files

    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff: {e}")
        return None, False, []
    except ValueError as e:
        print(f"Internal error - invalid git command: {e}")
        return None, False, []


# =============================================================================
# COMMIT MESSAGE GENERATION
# =============================================================================

def generate_commit_message(diff: str) -> Optional[str]:
    """Generate commit message using the configured LLM provider."""
    try:
        load_dotenv()
        provider = get_provider()

        prompt = f"""You are a git commit message generator. Your task is to analyze the git diff and output ONLY the commit message itself - no explanations, no prefixes like "Based on the diff...", just the commit message exactly as it should appear in git.

        The commit message MUST follow this format:
        <emoji> <type>[optional scope]: <description>

        [required body] (minimum length of 50 characters and a maximum of around 80 characters)

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
           - Be 50 characters or less (THIS IS CRITICAL - count characters carefully!)
           - Start with lowercase
           - Use imperative mood ("add" not "adds/added")
           - No period at end
           - Be concise - prefer shorter descriptions like "add multi-provider support" over verbose ones

        3. Body (if included) MUST:
           - Be separated from title by blank line
           - Wrap at 72 characters
           - Explain what and why vs. how
           - Use proper punctuation

        Git diff to analyze:
        {diff}

        Output ONLY the commit message exactly as it should appear in git, with no additional text."""

        message = provider.chat_completion(prompt)

        if "Based on the diff" in message:
            message = message.split("\n")[-1].strip()
        return message

    except Exception as e:
        error_msg = str(e)
        print(f"Error generating commit message: {error_msg}")

        if "500" in error_msg:
            print("\nServer error. Check MODEL_NAME if set.")
        elif "401" in error_msg or "403" in error_msg:
            print("\nAuth error. Check your API key.")
        elif "404" in error_msg:
            print("\nModel not found. Check MODEL_NAME.")

        return None


# =============================================================================
# MAIN
# =============================================================================

def main():
    diff, has_lock_files, changed_files = get_staged_diff()
    normalized_changed = [_normalize_repo_path(f) for f in changed_files]

    if has_lock_files:
        commit_message = "📦 deps: update dependencies"
    elif normalized_changed == [_REPOSITORY_CONTEXT_PATH]:
        commit_message = "📝 docs: update repository context"
    elif not diff:
        print("No changes to analyze")
        sys.exit(1)
    else:
        commit_message = generate_commit_message(diff)

    if not commit_message:
        print("Failed to generate commit message")
        sys.exit(1)

    print("\nGenerated commit message:")
    print("------------------------")
    sys.stdout.buffer.write(commit_message.encode("utf-8"))
    sys.stdout.buffer.flush()
    print("\n------------------------")

    if len(sys.argv) > 1 and sys.argv[1] == "--hook":
        with codecs.open(".git/COMMIT_EDITMSG", "w", encoding="utf-8") as f:
            f.write(commit_message)


if __name__ == "__main__":
    main()
