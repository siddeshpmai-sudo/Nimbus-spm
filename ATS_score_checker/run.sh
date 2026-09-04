#!/bin/bash
set -e

# Define directory variables
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
VENV_DIR="$PROJECT_DIR/venv"

echo "=== Setting up Resume ATS Checker ==="
echo "Project path: $PROJECT_DIR"

# Ensure we have python3
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not installed." >&2
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment at $VENV_DIR..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r "$BACKEND_DIR/requirements.txt"

# Start the uvicorn server
echo "Starting backend server on http://localhost:8000..."
cd "$BACKEND_DIR"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
