# PowerShell script to set up the Claude commit message generator

# Ensure we're in a git repository
if (-not (Test-Path .git)) {
    Write-Error "This script must be run from the root of a git repository"
    exit 1
}

# Install required Python package
Write-Output "Installing required Python package..."
pip install openai python-dotenv

# Create .env from example if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Output "Creating .env file from template..."
    Copy-Item .env.example .env
    Write-Output "Please edit .env and add your API key"
}

# Create hooks directory if it doesn't exist
if (-not (Test-Path .git/hooks)) {
    New-Item -ItemType Directory -Path .git/hooks
}

# Create the git hook
Write-Output "Setting up git hook..."
@"
#!/bin/sh
python "`$(dirname "`$0")/../../commit/commit_analyzer.py" --hook
"@ | Out-File -FilePath .git/hooks/prepare-commit-msg -Encoding UTF8

# Make the hook executable (Windows doesn't really need this, but good for WSL compatibility)
Write-Output "Making hook executable..."
attrib +x .git/hooks/prepare-commit-msg

Write-Output "`nSetup complete! Please:"
Write-Output "1. Edit .env and add your API key"
Write-Output "2. Test the setup by making a commit"
