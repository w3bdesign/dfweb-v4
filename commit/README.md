# AI Commit Message Generator

A self-contained AI-powered git commit message generator supporting multiple LLM providers.

## Quick Install in Another Repository

**Copy the entire `commit/` folder** to your repository, then run the setup script:

**Linux/macOS:**

```bash
chmod +x commit/setup.sh
./commit/setup.sh
```

**Windows (PowerShell):**

```powershell
.\commit\setup.ps1
```

Then edit `.env` and add your API key. That's it!

## Manual Setup

```bash
# Install dependencies
pip install openai anthropic python-dotenv

# Create .env with your API key
cp commit/.env.example .env
# Edit .env and add your key

# Create git hook
mkdir -p .git/hooks
cat > .git/hooks/prepare-commit-msg << 'EOF'
#!/bin/sh
python "$(git rev-parse --show-toplevel)/commit/commit_analyzer.py" --hook
EOF
chmod +x .git/hooks/prepare-commit-msg
```

## Supported Providers

| Provider          | API Key                                                    | Default Model                |
| ----------------- | ---------------------------------------------------------- | ---------------------------- |
| Anthropic         | `ANTHROPIC_API_KEY`                                        | `claude-sonnet-4-5-20250929` |
| OpenAI            | `OPENAI_API_KEY`                                           | `gpt-5.2`                    |
| OpenAI-compatible | `OPENAI_COMPATIBLE_API_KEY` + `OPENAI_COMPATIBLE_BASE_URL` | (set `MODEL_NAME`)           |

The system auto-detects which provider to use based on which API key is set.

## Configuration (.env)

```env
# For Anthropic Claude (recommended)
ANTHROPIC_API_KEY="sk-ant-..."

# OR for OpenAI GPT
OPENAI_API_KEY="sk-..."

# Optional: Override the model
# MODEL_NAME="claude-opus-4-5-20251101"

# Optional: Force a specific provider
# PROVIDER="anthropic"
```

## Files

```
commit/
├── commit_analyzer.py   # Main script
├── providers/           # LLM provider implementations
│   ├── __init__.py
│   ├── base.py
│   ├── factory.py
│   ├── anthropic_provider.py
│   ├── openai_provider.py
│   └── openai_compatible.py
├── .env.example         # Configuration template
├── setup.sh             # Unix setup script
├── setup.ps1            # Windows setup script
└── README.md            # This file
```
