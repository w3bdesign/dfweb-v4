# Setup script for AI Commit Message Generator
# Run this from your repository root after copying the commit/ folder

$ErrorActionPreference = "Stop"

# Find repo root
try {
    $RepoRoot = git rev-parse --show-toplevel 2>$null
    if (-not $RepoRoot) { throw }
} catch {
    Write-Error "Error: Not in a git repository"
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CommitAnalyzer = Join-Path $ScriptDir "commit_analyzer.py"

# Check if commit_analyzer.py exists
if (-not (Test-Path $CommitAnalyzer)) {
    Write-Error "Error: commit_analyzer.py not found in $ScriptDir"
    exit 1
}

Write-Output "Setting up AI Commit Message Generator..."

# Install Python dependencies
Write-Output "Installing Python dependencies..."
pip install openai anthropic python-dotenv

# Create .env from template if it doesn't exist
$EnvFile = Join-Path $RepoRoot ".env"
$EnvExample = Join-Path $ScriptDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    if (Test-Path $EnvExample) {
        Copy-Item $EnvExample $EnvFile
        Write-Output "Created .env from template"
    } else {
        Write-Output "Warning: .env.example not found, creating minimal .env"
        "# Add your API key`nANTHROPIC_API_KEY=`"`"" | Out-File -FilePath $EnvFile -Encoding UTF8
    }
}

# Create git hook
$HooksDir = Join-Path $RepoRoot ".git\hooks"
$HookFile = Join-Path $HooksDir "prepare-commit-msg"

if (-not (Test-Path $HooksDir)) {
    New-Item -ItemType Directory -Path $HooksDir -Force | Out-Null
}

# Use forward slashes for the path in the hook (git uses Unix-style paths)
$CommitAnalyzerUnix = $CommitAnalyzer.Replace('\', '/')

@"
#!/bin/sh
python "$CommitAnalyzerUnix" --hook
"@ | Out-File -FilePath $HookFile -Encoding UTF8 -NoNewline

Write-Output ""
Write-Output "Setup complete!"
Write-Output ""
Write-Output "Next steps:"
Write-Output "1. Edit .env and add your API key (ANTHROPIC_API_KEY or OPENAI_API_KEY)"
Write-Output "2. Make a commit to test the AI commit message generator"
