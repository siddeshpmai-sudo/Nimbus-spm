// ============================================
// NimbusWiz Tech — Express Server
// Serves static files + handles form submission
// Sends email (Nodemailer) + SMS (Twilio)
// ============================================

'use strict';

require('dotenv').config();
const express  = require('express');
const path     = require('path');
const nodemailer = require('nodemailer');
const twilio   = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Parse JSON and URL-encoded bodies ──────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve static files (HTML, CSS, JS, images) ─
app.use(express.static(path.join(__dirname, 'public')));

// ── Health check ────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── Email transporter (Gmail SMTP) ─────────────
function createEmailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// ── Twilio client ───────────────────────────────
function createTwilioClient() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || sid.startsWith('AC' + 'x')) return null;
  return twilio(sid, token);
}

// ── Send email notification ─────────────────────
async function sendEmail({ name, email, phone, course, message }) {
  const transporter = createEmailTransporter();
  const courseLabels = {
    devops: 'DevOps Complete Certification',
    aws:    'AWS Cloud Computing',
    k8s:    'Docker & Kubernetes Mastery',
    cicd:   'CI/CD Pipelines',
  };

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f2f8; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg,#4F63FF,#A855F7); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <h1 style="color:white; margin:0; font-size:24px;">📩 New Enquiry Received</h1>
        <p style="color:rgba(255,255,255,0.8); margin:8px 0 0;">${process.env.SITE_NAME}</p>
      </div>
      <div style="background:white; border-radius:12px; padding:24px;">
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#5a5f7a; width:35%;"><strong>👤 Name</strong></td>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#13152a;">${escHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#5a5f7a;"><strong>📧 Email</strong></td>
            <td style="padding:10px 0; border-bottom:1px solid #eee;"><a href="mailto:${escHtml(email)}" style="color:#4F63FF;">${escHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#5a5f7a;"><strong>📞 Phone</strong></td>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#13152a;">${escHtml(phone || 'Not provided')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#5a5f7a;"><strong>🎓 Course</strong></td>
            <td style="padding:10px 0; border-bottom:1px solid #eee; color:#13152a;">${escHtml(courseLabels[course] || course || 'Not specified')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#5a5f7a; vertical-align:top;"><strong>💬 Message</strong></td>
            <td style="padding:10px 0; color:#13152a; white-space:pre-wrap;">${escHtml(message || 'No message')}</td>
          </tr>
        </table>
      </div>
      <p style="text-align:center; color:#aaa; font-size:12px; margin-top:16px;">
        Sent from ${process.env.SITE_URL} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
      </p>
    </div>
  `;

  await transporter.sendMail({
    from:    `"${process.env.SITE_NAME} 🎓" <${process.env.GMAIL_USER}>`,
    to:      process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `📩 New Enquiry from ${name} — ${courseLabels[course] || 'NimbusWiz Tech'}`,
    html,
    text: `New enquiry from ${name}\nEmail: ${email}\nPhone: ${phone}\nCourse: ${courseLabels[course] || course}\nMessage: ${message}`,
  });
}

// ── Send SMS / WhatsApp notification ───────────
async function sendSMS({ name, email, phone, course }) {
  const client = createTwilioClient();
  if (!client) {
    console.log('[SMS] Twilio not configured — skipping SMS.');
    return;
  }

  const courseShort = {
    devops: 'DevOps Certification',
    aws:    'AWS Cloud',
    k8s:    'Docker & K8s',
    cicd:   'CI/CD Pipelines',
  };

  const channel = (process.env.NOTIFY_CHANNEL || 'sms').toLowerCase();
  const from   = channel === 'whatsapp'
    ? `whatsapp:${process.env.TWILIO_FROM_NUMBER}`
    : process.env.TWILIO_FROM_NUMBER;
  const to     = channel === 'whatsapp'
    ? `whatsapp:${process.env.NOTIFY_PHONE}`
    : process.env.NOTIFY_PHONE;

  const body = `🎓 NimbusWiz Tech — New Enquiry!\n👤 ${name}\n📧 ${email}\n📞 ${phone || 'N/A'}\n📚 ${courseShort[course] || course || 'General'}\n\nReply to: ${email}`;

  await client.messages.create({ from, to, body });
}

// ── HTML escape helper ──────────────────────────
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Simple rate limiter (max 5 submissions / 10 min per IP) ─
const submissions = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const window = 10 * 60 * 1000; // 10 minutes
  const max = 5;
  const record = submissions.get(ip) || [];
  const recent = record.filter(t => now - t < window);
  if (recent.length >= max) return true;
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

// ── POST /submit — Contact form handler ─────────
app.post('/submit', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please wait a few minutes.' });
  }

  const { name, email, phone, course, message } = req.body;

  // Basic validation
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ ok: false, error: 'Name and email are required.' });
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
  }

  const data = {
    name:    name.trim().slice(0, 100),
    email:   email.trim().slice(0, 200),
    phone:   (phone || '').trim().slice(0, 20),
    course:  (course || '').trim().slice(0, 50),
    message: (message || '').trim().slice(0, 2000),
  };

  console.log(`[SUBMIT] ${new Date().toISOString()} — ${data.name} <${data.email}>`);

  // Fire both notifications in parallel, don't fail if one fails
  const results = await Promise.allSettled([
    sendEmail(data),
    sendSMS(data),
  ]);

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[${i === 0 ? 'EMAIL' : 'SMS'}] Error:`, r.reason?.message || r.reason);
    } else {
      console.log(`[${i === 0 ? 'EMAIL' : 'SMS'}] Sent successfully.`);
    }
  });

  // Always return success to the user (don't expose notification failures)
  res.json({ ok: true, message: "Thank you! We'll reach out within 24 hours." });
});

// ── 404 — serve index.html for any unknown route (SPA fallback) ──
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server ────────────────────────────────
// Binding to '0.0.0.0' ensures the server listens on IPv4, which fixes Safari's "cannot connect to localhost" issue.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 NimbusWiz Tech server running at http://localhost:${PORT}`);
  console.log(`📧 Email notifications: ${process.env.GMAIL_USER ? '✅ configured' : '⚠️  NOT configured (.env missing)'}`);
  const smsReady = process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('xxx');
  console.log(`📱 SMS notifications:   ${smsReady ? '✅ configured' : '⚠️  NOT configured (.env missing)'}`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});

module.exports = app;
