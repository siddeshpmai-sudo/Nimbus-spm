#!/usr/bin/env bash
# ─────────────────────────────────────────────
#  NimbusWiz Tech — Start Script
#  Run once on any Mac to install & launch site
#  Usage:  chmod +x start.sh && ./start.sh
# ─────────────────────────────────────────────

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "🚀  NimbusWiz Tech — Starting up..."
echo ""

# 1. Install Homebrew if missing
if ! command -v brew &>/dev/null; then
  echo "📦  Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# 2. Install Node.js if missing
if ! command -v node &>/dev/null; then
  echo "📦  Installing Node.js..."
  brew install node
fi
echo "✅  Node $(node --version)"

# 3. Install npm dependencies
echo "📦  Installing dependencies..."
cd "$DIR"
npm install --silent
echo "✅  Dependencies ready."

# 4. Create .env if it doesn't exist
if [ ! -f "$DIR/.env" ]; then
  cp "$DIR/.env.example" "$DIR/.env"
  echo ""
  echo "⚠️  ACTION REQUIRED:"
  echo "    Open  $DIR/.env  and fill in:"
  echo "    • GMAIL_USER          — your Gmail address"
  echo "    • GMAIL_APP_PASSWORD  — Gmail App Password"
  echo "    • NOTIFY_EMAIL        — email to receive enquiries"
  echo "    • NOTIFY_PHONE        — your phone (e.g. +91XXXXXXXXXX)"
  echo "    • TWILIO_*            — Twilio credentials (for SMS)"
  echo ""
  echo "    Then re-run:  ./start.sh"
  echo ""
  exit 0
fi

# 5. Install PM2 globally if missing (keeps site alive forever)
if ! command -v pm2 &>/dev/null; then
  echo "📦  Installing PM2 (process manager)..."
  npm install -g pm2 2>/dev/null || sudo npm install -g pm2
fi
echo "✅  PM2 $(pm2 --version)"

# 6. Stop any existing instance
pm2 delete nimbuswiz 2>/dev/null || true

# 7. Start the site
echo ""
echo "▶  Starting NimbusWiz Tech server..."
pm2 start "$DIR/server.js" \
  --name nimbuswiz \
  --restart-delay 3000 \
  --max-restarts 10 \
  --log "$DIR/app.log" \
  --merge-logs

pm2 save

echo ""
echo "✅  Site is live at http://localhost:3000"
echo ""
echo "📋  Useful commands:"
echo "    pm2 logs nimbuswiz     — view live logs"
echo "    pm2 stop nimbuswiz     — stop the server"
echo "    pm2 restart nimbuswiz  — restart"
echo "    pm2 status             — check status"
echo ""

# Open in browser on macOS
open "http://localhost:3000" 2>/dev/null || true
