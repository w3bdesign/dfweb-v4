#!/usr/bin/env python3
"""
pin-actions.py — Audit & pin GitHub Actions to immutable commit SHAs.

Zero external dependencies. Uses only the Python standard library.

Modes:
    audit   — Report mutable action references (default)
    pin     — Rewrite workflow files with SHA-pinned references
    verify  — Check that all references are already pinned

Usage:
    python scripts/pin-actions.py audit
    python scripts/pin-actions.py audit --dir .github/workflows
    python scripts/pin-actions.py pin
    python scripts/pin-actions.py pin --dry-run
    python scripts/pin-actions.py verify

Environment:
    GITHUB_TOKEN  — Optional. Raises API rate limit from 60/hr to 5000/hr.
                    Only used for resolving refs → SHAs via api.github.com.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SHA_PATTERN = re.compile(r"^[0-9a-f]{40}$")
# Matches:  uses: owner/repo@ref           (simple)
#           uses: owner/repo/path@ref       (sub-action)
USES_PATTERN = re.compile(
    r"^(?P<indent>\s*)-?\s*uses:\s*"
    r"(?P<action>[a-zA-Z0-9\-_.]+/[a-zA-Z0-9\-_.]+(?:/[a-zA-Z0-9\-_.]+)*)"
    r"@(?P<ref>[^\s#]+)"
    r"(?:\s*#\s*(?P<comment>.+))?\s*$"
)

RISK_BRANCH = "BRANCH"
RISK_TAG = "TAG"
RISK_PINNED = "PINNED"

# ANSI colors (disabled when NO_COLOR is set or not a tty)
_use_color = sys.stdout.isatty() and not os.environ.get("NO_COLOR")


def _c(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if _use_color else text


def red(t: str) -> str:
    return _c("31", t)


def yellow(t: str) -> str:
    return _c("33", t)


def green(t: str) -> str:
    return _c("32", t)


def bold(t: str) -> str:
    return _c("1", t)


def dim(t: str) -> str:
    return _c("2", t)


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------


@dataclass
class ActionRef:
    """A single `uses:` reference found in a workflow file."""

    file: Path
    line_number: int
    line_text: str
    action: str  # e.g. "actions/checkout" or "github/codeql-action/init"
    ref: str  # e.g. "v6", "master", or a SHA
    comment: Optional[str] = None  # trailing comment like "v4.2.2"
    risk: str = ""
    owner_repo: str = ""  # e.g. "actions/checkout" (without sub-path)
    resolved_sha: Optional[str] = None

    def __post_init__(self) -> None:
        # Determine owner/repo (first two path segments)
        parts = self.action.split("/")
        self.owner_repo = f"{parts[0]}/{parts[1]}"

        # Classify risk
        if SHA_PATTERN.match(self.ref):
            self.risk = RISK_PINNED
        elif self._looks_like_branch(self.ref):
            self.risk = RISK_BRANCH
        else:
            self.risk = RISK_TAG

    @staticmethod
    def _looks_like_branch(ref: str) -> bool:
        """Heuristic: branches are names like 'master', 'main', 'develop'.
        Tags typically start with 'v' followed by digits."""
        branch_names = {
            "master",
            "main",
            "develop",
            "dev",
            "release",
            "stable",
            "latest",
            "nightly",
            "trunk",
        }
        if ref.lower() in branch_names:
            return True
        # If it doesn't start with 'v' + digit, and isn't a SHA, likely a branch
        if not re.match(r"^v?\d", ref):
            return True
        return False


@dataclass
class AuditResult:
    """Collected results from scanning workflow files."""

    refs: list[ActionRef] = field(default_factory=list)

    @property
    def pinned(self) -> list[ActionRef]:
        return [r for r in self.refs if r.risk == RISK_PINNED]

    @property
    def mutable_tags(self) -> list[ActionRef]:
        return [r for r in self.refs if r.risk == RISK_TAG]

    @property
    def mutable_branches(self) -> list[ActionRef]:
        return [r for r in self.refs if r.risk == RISK_BRANCH]

    @property
    def mutable(self) -> list[ActionRef]:
        return [r for r in self.refs if r.risk != RISK_PINNED]


# ---------------------------------------------------------------------------
# Scanner
# ---------------------------------------------------------------------------


def scan_workflows(workflow_dir: Path) -> AuditResult:
    """Parse all .yml/.yaml files in the workflow directory."""
    result = AuditResult()

    if not workflow_dir.is_dir():
        print(red(f"Error: {workflow_dir} is not a directory"), file=sys.stderr)
        sys.exit(1)

    for fpath in sorted(workflow_dir.iterdir()):
        if fpath.suffix not in (".yml", ".yaml"):
            continue
        with open(fpath, encoding="utf-8") as f:
            for line_num, line in enumerate(f, start=1):
                m = USES_PATTERN.match(line)
                if m:
                    result.refs.append(
                        ActionRef(
                            file=fpath,
                            line_number=line_num,
                            line_text=line.rstrip(),
                            action=m.group("action"),
                            ref=m.group("ref"),
                            comment=m.group("comment"),
                        )
                    )

    return result


# ---------------------------------------------------------------------------
# GitHub API — resolve ref to SHA
# ---------------------------------------------------------------------------


def _github_api(url: str, token: Optional[str] = None) -> dict:
    """Make a GET request to the GitHub API. Returns parsed JSON."""
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "pin-actions/1.0"}
    if token:
        headers["Authorization"] = f"token {token}"

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        raise RuntimeError(f"GitHub API {e.code}: {url}\n{body}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}") from e


def resolve_ref_to_sha(owner_repo: str, ref: str, token: Optional[str] = None) -> str:
    """Resolve a tag or branch name to its full commit SHA.

    Tries tags first (annotated → peel to commit), then branches.
    """
    # Try as a git ref via the matching refs endpoint
    url = f"https://api.github.com/repos/{owner_repo}/git/matching-refs/tags/{ref}"
    try:
        data = _github_api(url, token)
        if data:
            # Find exact match
            for item in data:
                if item["ref"] == f"refs/tags/{ref}":
                    obj = item["object"]
                    # Annotated tags need peeling
                    if obj["type"] == "tag":
                        tag_data = _github_api(obj["url"], token)
                        return tag_data["object"]["sha"]
                    return obj["sha"]
    except RuntimeError:
        pass

    # Try as a branch
    url = f"https://api.github.com/repos/{owner_repo}/branches/{ref}"
    try:
        data = _github_api(url, token)
        return data["commit"]["sha"]
    except RuntimeError:
        pass

    # Last resort: git/ref endpoint
    url = f"https://api.github.com/repos/{owner_repo}/git/ref/tags/{ref}"
    try:
        data = _github_api(url, token)
        obj = data["object"]
        if obj["type"] == "tag":
            tag_data = _github_api(obj["url"], token)
            return tag_data["object"]["sha"]
        return obj["sha"]
    except RuntimeError as exc:
        raise RuntimeError(
            f"Could not resolve {owner_repo}@{ref} — is it a valid tag/branch?"
        ) from exc


# ---------------------------------------------------------------------------
# Audit report
# ---------------------------------------------------------------------------


def print_audit(result: AuditResult) -> None:
    """Print a detailed audit report to stdout."""
    total = len(result.refs)
    pinned = len(result.pinned)
    tags = len(result.mutable_tags)
    branches = len(result.mutable_branches)

    print()
    print(bold("═══════════════════════════════════════════════════════════"))
    print(bold("  GitHub Actions Supply Chain Audit"))
    print(bold("═══════════════════════════════════════════════════════════"))
    print()
    print(f"  Total action references:  {bold(str(total))}")
    print(f"  ✅ SHA-pinned (safe):      {green(str(pinned))}")
    print(f"  ⚠️  Mutable tag (@vN):      {yellow(str(tags))}")
    print(f"  🔴 Mutable branch:         {red(str(branches))}")
    print()

    if branches:
        print(red(bold("── 🔴 CRITICAL: Branch References ──────────────────────")))
        print(red("  These track a branch HEAD — any push silently changes"))
        print(red("  what runs in your pipeline."))
        print()
        for ref in result.mutable_branches:
            _print_ref(ref, red)
        print()

    if tags:
        print(yellow(bold("── ⚠️  Mutable Tag References ──────────────────────────")))
        print(yellow("  Tags can be force-pushed. This is the exact vector"))
        print(yellow("  used in the tj-actions/changed-files compromise."))
        print()
        for ref in result.mutable_tags:
            _print_ref(ref, yellow)
        print()

    if pinned:
        print(green(bold("── ✅ SHA-Pinned (Safe) ─────────────────────────────────")))
        print()
        for ref in result.pinned:
            _print_ref(ref, green)
        print()

    # Summary
    if result.mutable:
        pct = (len(result.mutable) / total * 100) if total else 0
        print(bold("── Summary ─────────────────────────────────────────────"))
        print(f"  {red(f'{len(result.mutable)}/{total}')} references "
              f"({red(f'{pct:.0f}%')}) are mutable and vulnerable.")
        print(f"  Run {bold('python scripts/pin-actions.py pin')} to fix them.")
        print()
    else:
        print(green(bold("  ✅ All action references are SHA-pinned. You're safe.")))
        print()


def _print_ref(ref: ActionRef, color_fn) -> None:
    fname = ref.file.name
    comment = f"  # {ref.comment}" if ref.comment else ""
    print(f"  {dim(f'{fname}:{ref.line_number:>3}')}  "
          f"{color_fn(f'{ref.action}@{ref.ref}')}{dim(comment)}")


# ---------------------------------------------------------------------------
# Pin (rewrite files)
# ---------------------------------------------------------------------------


def pin_workflows(result: AuditResult, dry_run: bool = False) -> int:
    """Resolve mutable refs to SHAs and rewrite workflow files.

    Returns the number of references pinned.
    """
    mutable = result.mutable
    if not mutable:
        print(green("✅ All action references are already SHA-pinned. Nothing to do."))
        return 0

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print(yellow("Tip: Set GITHUB_TOKEN to raise the API rate limit from 60/hr to 5000/hr."))
        print()

    # Resolve each unique action@ref pair
    cache: dict[tuple[str, str], str] = {}
    errors: list[str] = []
    total = len(mutable)

    print(bold(f"\nResolving {total} mutable references...\n"))

    for i, ref in enumerate(mutable, 1):
        key = (ref.owner_repo, ref.ref)
        if key in cache:
            ref.resolved_sha = cache[key]
            print(f"  [{i}/{total}] {ref.action}@{ref.ref} → {dim('(cached)')}")
            continue

        try:
            sha = resolve_ref_to_sha(ref.owner_repo, ref.ref, token)
            ref.resolved_sha = sha
            cache[key] = sha
            print(f"  [{i}/{total}] {ref.action}@{ref.ref} → {green(sha[:12])}")
        except RuntimeError as e:
            errors.append(f"  {red('✗')} {ref.action}@{ref.ref}: {e}")
            print(f"  [{i}/{total}] {ref.action}@{ref.ref} → {red('FAILED')}")

    if errors:
        print(f"\n{red(bold('Errors:'))}")
        for err in errors:
            print(err)
        print()

    # Group by file and rewrite
    pinned_count = 0
    files_modified: set[str] = set()

    # Build a map of (file, line_number) → ActionRef for resolved refs
    ref_map: dict[tuple[Path, int], ActionRef] = {}
    for ref in mutable:
        if ref.resolved_sha:
            ref_map[(ref.file, ref.line_number)] = ref

    # Process each file
    files_to_process = sorted({ref.file for ref in mutable if ref.resolved_sha})

    for fpath in files_to_process:
        with open(fpath, encoding="utf-8") as f:
            lines = f.readlines()

        modified = False
        for line_idx in range(len(lines)):
            line_num = line_idx + 1
            key = (fpath, line_num)
            if key not in ref_map:
                continue

            ref = ref_map[key]
            old_line = lines[line_idx]
            # Build replacement: action@sha # original-ref
            new_ref_str = f"{ref.resolved_sha} # {ref.ref}"
            # Replace @old_ref with @sha # old_ref
            new_line = re.sub(
                r"@" + re.escape(ref.ref) + r"(\s*(?:#.*)?)$",
                f"@{new_ref_str}",
                old_line.rstrip(),
            ) + "\n"

            if new_line != old_line:
                lines[line_idx] = new_line
                modified = True
                pinned_count += 1

                if dry_run:
                    print(f"\n  {dim(f'{fpath.name}:{line_num}')}")
                    print(f"  {red('- ' + old_line.rstrip())}")
                    print(f"  {green('+ ' + new_line.rstrip())}")

        if modified and not dry_run:
            with open(fpath, "w", encoding="utf-8") as f:
                f.writelines(lines)
            files_modified.add(str(fpath))

    print()
    if dry_run:
        print(bold(f"Dry run complete. {pinned_count} references would be pinned "
                   f"across {len(files_to_process)} files."))
        print(f"Run without {bold('--dry-run')} to apply changes.")
    else:
        print(green(bold(f"✅ Pinned {pinned_count} references across "
                         f"{len(files_modified)} files.")))

    return pinned_count


# ---------------------------------------------------------------------------
# Verify
# ---------------------------------------------------------------------------


def verify_workflows(result: AuditResult) -> int:
    """Check that all references are SHA-pinned. Exit 1 if any are mutable."""
    if result.mutable:
        print(red(bold(f"✗ {len(result.mutable)} mutable action reference(s) found:\n")))
        for ref in result.mutable:
            risk_label = "BRANCH" if ref.risk == RISK_BRANCH else "TAG"
            print(f"  {ref.file.name}:{ref.line_number}  "
                  f"{ref.action}@{ref.ref}  [{risk_label}]")
        print(f"\nRun {bold('python scripts/pin-actions.py pin')} to fix.")
        return 1
    else:
        print(green(bold("✅ All action references are SHA-pinned.")))
        return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Audit & pin GitHub Actions to immutable commit SHAs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # audit
    p_audit = sub.add_parser("audit", help="Report mutable action references")
    p_audit.add_argument(
        "--dir", default=".github/workflows", help="Workflow directory to scan"
    )

    # pin
    p_pin = sub.add_parser("pin", help="Rewrite workflow files with SHA-pinned refs")
    p_pin.add_argument(
        "--dir", default=".github/workflows", help="Workflow directory to scan"
    )
    p_pin.add_argument(
        "--dry-run", action="store_true", help="Show changes without writing files"
    )

    # verify
    p_verify = sub.add_parser(
        "verify", help="Exit 1 if any mutable refs exist (CI gate)"
    )
    p_verify.add_argument(
        "--dir", default=".github/workflows", help="Workflow directory to scan"
    )

    args = parser.parse_args()
    workflow_dir = Path(args.dir)
    result = scan_workflows(workflow_dir)

    if args.command == "audit":
        print_audit(result)
        sys.exit(1 if result.mutable else 0)

    elif args.command == "pin":
        print_audit(result)
        if not result.mutable:
            sys.exit(0)
        pin_workflows(result, dry_run=args.dry_run)

    elif args.command == "verify":
        sys.exit(verify_workflows(result))


if __name__ == "__main__":
    main()
