# 📱 MacroDroid Setup Guide

## What This Macro Does
Whenever your phone receives a JazzCash SMS, MacroDroid automatically sends it to your Railway backend via HTTP POST. The backend then parses it with AI and stores it.

---

## Step-by-Step Setup

### Step 1: Open MacroDroid
Open the MacroDroid app on your phone.

### Step 2: Create New Macro
Tap the **"+"** button to create a new macro.
- **Name**: `JazzCash SMS Tracker`

### Step 3: Add TRIGGER
1. Tap **"Triggers"** → **"+"**
2. Select **"SMS/MMS"** → **"SMS Received"**
3. Set filter:
   - **Content**: Select **"Contains"** → type `JazzCash`
   - OR set **Sender**: Select **"Contains"** → type `JazzCash`
   - *(This ensures only JazzCash messages trigger the macro)*
4. Tap **OK**

### Step 4: Add ACTION
1. Tap **"Actions"** → **"+"**
2. Select **"Connectivity"** → **"HTTP Request"** (you may need MacroDroid Pro or use "Open Website" as alternative)
3. Configure:

   | Field | Value |
   |-------|-------|
   | **Method** | `POST` |
   | **URL** | `https://YOUR-RAILWAY-URL.up.railway.app/api/transactions` |
   | **Content Type** | `application/json` |
   | **Body** | *(see below)* |

4. In the **Body** field, paste this exactly:
```json
{"sms":"[sms_text]","sender":"[sms_sender]","received_at":"[year]-[month_0]-[dayofmonth_0]T[hour24_0]:[minute_0]:[second_0]"}
```

> **Important**: `[sms_text]`, `[sms_sender]`, `[year]`, `[month_0]`, etc. are **MacroDroid variables**. When typing the body:
> 1. Type `{"sms":"`
> 2. Tap the **magic wand (🪄)** icon → **SMS** → **SMS Body**
> 3. Continue typing `","sender":"`
> 4. Tap 🪄 → **SMS** → **SMS Sender Number**
> 5. Type `","received_at":"`
> 6. Tap 🪄 → **Date/Time** → build the timestamp
> 7. Close with `"}`

### Step 5: Add HEADER (Optional but Recommended)
Add a header for the HTTP request:
- **Key**: `Content-Type`
- **Value**: `application/json`

### Step 6: No Constraints
Leave **Constraints** empty — we want this to always run.

### Step 7: Save the Macro
Tap the **checkmark ✓** to save.

### Step 8: Enable the Macro
Make sure the macro toggle is **ON** (green).

---

## ⚠️ Important Permissions
Make sure MacroDroid has these permissions:
- ✅ **SMS Read** permission
- ✅ **Internet** access
- ✅ **Battery optimization disabled** (so it runs in background)
  - Go to Phone Settings → Battery → MacroDroid → "Don't optimize"
- ✅ **Auto-start** enabled (on Xiaomi/OPPO/Vivo phones)

---

## 🧪 Testing the Macro
1. Ask a friend to send you a test SMS containing the word "JazzCash"
2. Or use another phone to send yourself: `"JazzCash: You have received Rs.100 from 03001234567"`
3. Check your Railway logs to see if the transaction was received
4. Check Supabase dashboard to see if transaction was stored

---

## 📋 Alternative: Using "Open Website" Action
If HTTP Request is not available in your MacroDroid version:
1. Use **"Open Website"** action instead
2. URL: `https://YOUR-RAILWAY-URL.up.railway.app/api/transactions?sms=[sms_text]&sender=[sms_sender]`
3. Check "Run in background"

*(Note: This uses GET instead of POST. The backend handles both.)*
