#!/usr/bin/env python3
"""
fetch_avatars.py
----------------
Fetches GitHub avatar URLs for all NishchayJyot team members and updates the
Team section of client/README.md with circular avatar images.

Usage (run from repo root):
    python scripts/fetch_avatars.py

No third-party packages required — only stdlib (urllib, json, re, pathlib).
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

# ── Team members ──────────────────────────────────────────────────────────────
TEAM = [
    ("Kandarp Gajjar",  "slantie"),
    ("Ridham Patel",    "ridh21"),
    ("Nancy Patel",     "xcode-nancy"),
    ("Krutika Patel",   "stack-krutika"),
    ("Kritika Thakkar", "kritikaat"),
    ("Palak Vanpariya", "Palvanp"),
    ("Harsh Dodiya",    "HarshDodiya1"),
    ("Oum Gadani",      "Oum-Gadani"),
]

README_PATH = Path(__file__).parent.parent / "client" / "README.md"

MARKER_START = "<!-- TEAM_AVATARS_START -->"
MARKER_END   = "<!-- TEAM_AVATARS_END -->"

# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch_avatar_url(username: str) -> str:
    """Return the canonical avatar URL for a GitHub username via the public API."""
    api_url = f"https://api.github.com/users/{username}"
    req = urllib.request.Request(
        api_url,
        headers={
            "User-Agent": "nischayjyot-readme-script/1.0",
            "Accept": "application/vnd.github+json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        return data["avatar_url"]
    except urllib.error.HTTPError as e:
        print(f"  [warn] HTTP {e.code} for @{username} — falling back to username URL")
        return f"https://github.com/{username}.png?size=64"
    except Exception as e:
        print(f"  [warn] Error fetching @{username}: {e} — falling back to username URL")
        return f"https://github.com/{username}.png?size=64"


def build_avatar_block(team_with_avatars: list[tuple[str, str, str]]) -> str:
    """Build the HTML block that replaces content between the markers."""
    img_tags = "\n  ".join(
        f'<a href="https://github.com/{username}" title="{name}">'
        f'<img src="{avatar_url}" width="64" height="64" '
        f'style="border-radius:50%;margin:6px" alt="{name}" /></a>'
        for name, username, avatar_url in team_with_avatars
    )
    # Note: GitHub.com strips inline style= attributes, so border-radius only
    # renders as circles in local Markdown viewers (VS Code, Typora, etc.).
    return (
        f"{MARKER_START}\n"
        f"<p align=\"center\">\n"
        f"  {img_tags}\n"
        f"</p>\n"
        f"{MARKER_END}"
    )


def update_readme(new_block: str) -> None:
    """Replace the avatar block in README.md between the marker comments."""
    content = README_PATH.read_text(encoding="utf-8")

    if MARKER_START not in content or MARKER_END not in content:
        print(f"[error] Markers not found in {README_PATH}")
        print(f"        Make sure the README contains:")
        print(f"          {MARKER_START}")
        print(f"          {MARKER_END}")
        sys.exit(1)

    pattern = re.compile(
        re.escape(MARKER_START) + r".*?" + re.escape(MARKER_END),
        flags=re.DOTALL,
    )
    updated = pattern.sub(new_block, content)
    README_PATH.write_text(updated, encoding="utf-8")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("NishchayJyot — GitHub Avatar Fetcher")
    print("=" * 40)

    team_with_avatars: list[tuple[str, str, str]] = []
    for name, username in TEAM:
        print(f"  Fetching @{username} ({name})...")
        avatar_url = fetch_avatar_url(username)
        team_with_avatars.append((name, username, avatar_url))

    block = build_avatar_block(team_with_avatars)

    print(f"\nUpdating {README_PATH} ...")
    update_readme(block)

    print("\nDone! Open client/README.md in VS Code Markdown Preview to see the circles.")
    print("(GitHub.com strips inline styles — images appear square there.)")


if __name__ == "__main__":
    main()
