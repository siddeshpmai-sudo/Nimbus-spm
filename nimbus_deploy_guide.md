# 🚀 NimbusWiz Tech — Local Hosting + Public Domain Guide
### App runs on your Mac → Accessible at `nimbuswiztech.com`

---

## 🏗️ Architecture

```
[Public User]
     ↓ https://nimbuswiztech.com
[Cloudflare CDN + SSL] ← free, handles HTTPS automatically
     ↓ Encrypted Tunnel
[cloudflared — running on your Mac]
     ↓
[localhost:3001 — Node.js app]
```

> [!IMPORTANT]
> The site will be **down when your Mac is off or sleeping**. Disable sleep in System Settings → Battery → "Prevent automatic sleeping" if you want it always on.

---

## PHASE 1 — Start the App Locally

```bash
cd /Users/sid/Documents/Nimbus-spm
npm install        # first time only
npm start          # runs on http://localhost:3001
```

Verify it works: open `http://localhost:3001` in your browser.

---

## PHASE 2 — Set Up Cloudflare (Free Account)

### Step 1: Create a free Cloudflare account
Go to → **https://dash.cloudflare.com/sign-up** → Sign up (free plan)

### Step 2: Add your domain to Cloudflare
1. In Cloudflare dashboard → Click **"Add a site"**
2. Enter `nimbuswiztech.com` → Click **Add site**
3. Select the **Free plan** → Continue
4. Cloudflare will scan your existing DNS records — click **Continue**
5. Cloudflare will give you **2 nameservers**, like:
   ```
   aldo.ns.cloudflare.com
   vita.ns.cloudflare.com
   ```
   **Copy these — you'll need them in the next step.**

---

## PHASE 3 — Update Nameservers in Route 53

> This tells the world to use Cloudflare's DNS for your domain (domain stays registered in AWS).

1. Go to **AWS Console** → **Route 53** → **Registered Domains**
2. Click `nimbuswiztech.com`
3. Click **"Edit name servers"**
4. Replace the existing nameservers with the **two Cloudflare nameservers** from Phase 2
5. Save

> [!NOTE]
> Nameserver propagation takes **10–30 minutes**. Cloudflare will email you when it's active. Continue with the next phase while waiting.

---

## PHASE 4 — Install `cloudflared` on Your Mac

```bash
# Install via Homebrew
brew install cloudflared

# Verify
cloudflared --version
```

---

## PHASE 5 — Create a Named Tunnel

### Step 1: Login to Cloudflare via CLI
```bash
cloudflared tunnel login
```
This opens a browser → select `nimbuswiztech.com` → Authorize.
A credentials file is saved at `~/.cloudflared/cert.pem`.

### Step 2: Create the tunnel
```bash
cloudflared tunnel create nimbus
```
Note the **Tunnel ID** shown (looks like `abc1234-...`). Save it.

### Step 3: Create the config file
```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `YOUR-TUNNEL-ID` with your actual tunnel ID):
```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /Users/sid/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: nimbuswiztech.com
    service: http://localhost:3001
  - hostname: www.nimbuswiztech.com
    service: http://localhost:3001
  - service: http_status:404
```

Save: `Ctrl+X` → `Y` → `Enter`

### Step 4: Add DNS routes in Cloudflare
```bash
cloudflared tunnel route dns nimbus nimbuswiztech.com
cloudflared tunnel route dns nimbus www.nimbuswiztech.com
```

This automatically creates CNAME records in Cloudflare pointing to your tunnel.

---

## PHASE 6 — Run the Tunnel

### Option A: Quick test (run in terminal manually)
```bash
cloudflared tunnel run nimbus
```
Open `https://nimbuswiztech.com` — it should load your local app with HTTPS! 🎉

### Option B: Run as a background service (auto-starts on Mac login)
```bash
sudo cloudflared service install
sudo launchctl start com.cloudflare.cloudflared
```

To check status:
```bash
sudo launchctl list | grep cloudflare
```

To stop the service:
```bash
sudo launchctl stop com.cloudflare.cloudflared
```

---

## PHASE 7 — Keep the Node.js App Running in Background

Instead of keeping a terminal open with `npm start`, use **PM2**:

```bash
# Install PM2 globally
npm install -g pm2

# Start the app with PM2
cd /Users/sid/Documents/Nimbus-spm
pm2 start server.js --name "nimbus"

# Auto-start on Mac login
pm2 startup
pm2 save
```

### Useful PM2 commands:
```bash
pm2 status           # check if app is running
pm2 logs nimbus      # live logs
pm2 restart nimbus   # restart after code changes
pm2 stop nimbus      # stop the app
```

---

## ✅ Final Checklist

- [ ] App starts locally at `http://localhost:3001`
- [ ] Cloudflare free account created
- [ ] `nimbuswiztech.com` added to Cloudflare
- [ ] Route 53 nameservers updated to Cloudflare's
- [ ] `cloudflared` installed via Homebrew
- [ ] Tunnel created and config file set up
- [ ] DNS routes added (`nimbuswiztech.com` + `www`)
- [ ] Tunnel running (`cloudflared tunnel run nimbus` or as service)
- [ ] `https://nimbuswiztech.com` loads with 🔒 padlock
- [ ] PM2 keeping Node.js app alive in background

---

## 💰 Cost

| Service | Cost |
|---|---|
| Domain (AWS Route 53) | Already purchased |
| Cloudflare Tunnel | **Free** |
| PM2 | **Free** |
| SSL Certificate | **Free** (Cloudflare handles it) |
| **Total additional cost** | **$0/mo** |

---

> [!TIP]
> **After code changes**, just run `pm2 restart nimbus` — your live site updates instantly. No redeployment needed.
