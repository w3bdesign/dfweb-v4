#!/bin/bash
# Setup script for AI Commit Message Generator
# Run this from your repository root after copying the commit/ folder

set -e

# Find repo root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
    echo "Error: Not in a git repository"
    exit 1
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMIT_ANALYZER="$SCRIPT_DIR/commit_analyzer.py"

# Check if commit_analyzer.py exists
if [[ ! -f "$COMMIT_ANALYZER" ]]; then
    echo "Error: commit_analyzer.py not found in $SCRIPT_DIR"
    exit 1
fi

echo "Setting up AI Commit Message Generator..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install openai anthropic python-dotenv

# Create .env from template if it doesn't exist
if [[ ! -f "$REPO_ROOT/.env" ]]; then
    if [[ -f "$SCRIPT_DIR/.env.example" ]]; then
        cp "$SCRIPT_DIR/.env.example" "$REPO_ROOT/.env"
        echo "Created .env from template"
    else
        echo "Warning: .env.example not found, creating minimal .env"
        echo '# Add your API key' > "$REPO_ROOT/.env"
        echo 'ANTHROPIC_API_KEY=""' >> "$REPO_ROOT/.env"
    fi
fi

# Create git hook
HOOK_FILE="$REPO_ROOT/.git/hooks/prepare-commit-msg"
mkdir -p "$REPO_ROOT/.git/hooks"

cat > "$HOOK_FILE" << EOF
#!/bin/sh
python "$COMMIT_ANALYZER" --hook
EOF

chmod +x "$HOOK_FILE"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API key (ANTHROPIC_API_KEY or OPENAI_API_KEY)"
echo "2. Make a commit to test the AI commit message generator"
