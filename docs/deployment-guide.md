# 🚂 Railway Deployment Guide

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with **GitHub** (recommended) or email
3. You get **$5 free credits/month** on the hobby plan

## Step 2: Push Code to GitHub
```bash
cd c:\Users\User\Desktop\life-os
git init
git add .
git commit -m "Initial commit - JazzCash Spending Agent"
```
Then create a repo on GitHub and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/jazzcash-agent.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Railway
1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub Repo"**
3. Select your `jazzcash-agent` repository
4. Railway will auto-detect Node.js and start building

## Step 4: Set Environment Variables
In Railway dashboard → your project → **Variables** tab, add ALL of these:

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | `AlzaSyArTpalQFZMHoaVkjRoMhdbm7mcUNLybTE` |
| `SUPABASE_URL` | `https://pdwfxcwlwairaymrgno.supabase.co` |
| `SUPABASE_KEY` | `sb_publishable_95vXwvSmo2FsiAeH1wjikg_mV0tTi89` |
| `TWILIO_ACCOUNT_SID` | `ACd0c0ba214e28eef8f0a9afee3568de2` |
| `TWILIO_AUTH_TOKEN` | `441d5b6a32bd539d28e340f9125ef807` |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` |
| `WHATSAPP_TO` | `whatsapp:+923706096116` |
| `PORT` | `3000` |
| `TZ` | `Asia/Karachi` |
| `API_SECRET` | `jazzcash-agent-2026` |

## Step 5: Get Your Railway URL
After deployment, Railway gives you a URL like:
```
https://jazzcash-agent-production.up.railway.app
```
Find it in: **Settings → Networking → Generate Domain**

Click **"Generate Domain"** to get your public URL.

## Step 6: Test
Open your Railway URL in browser — you should see:
```json
{"status":"running","service":"JazzCash Spending Agent","time":"..."}
```

---

# 📱 Supabase Setup

## Step 1: Create Project
1. Go to [supabase.com](https://supabase.com) → Sign in
2. Click **"New Project"**
3. Name: `jazzcash-agent`, set a password, choose closest region
4. Wait for project to be created

## Step 2: Get Your Supabase URL
Go to **Settings → API** and copy:
- **Project URL** (looks like `https://xxxxx.supabase.co`)
- Update this in your Railway environment variables as `SUPABASE_URL`

## Step 3: Create the Database Table
Go to **SQL Editor** in Supabase dashboard and run:

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_sms TEXT NOT NULL,
  type TEXT CHECK (type IN ('sent', 'received', 'bill_payment', 'topup', 'other')),
  amount DECIMAL(12,2),
  counterparty TEXT,
  reference TEXT,
  balance DECIMAL(12,2),
  transaction_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

Click **"Run"** — your table is ready! ✅

---

# 💬 Twilio WhatsApp Sandbox Setup

## Step 1: Activate Sandbox
1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Messaging → Try it out → Send a WhatsApp message**
3. You'll see instructions to send a message to **+14155238886**

## Step 2: Join the Sandbox
On your phone, open WhatsApp and send this message to **+1 (415) 523-8886**:
```
join <your-sandbox-keyword>
```
*(Twilio will show you the exact keyword on the console page)*

> ⚠️ **IMPORTANT**: You must do this step! Otherwise Twilio cannot send you messages.

## Step 3: Test
After joining, you should receive a confirmation message on WhatsApp.
