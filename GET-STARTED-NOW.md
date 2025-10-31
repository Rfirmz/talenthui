# 🚀 Get Your Candidates Showing in 10 Minutes

## Current Issue
Your profiles page is empty because Supabase isn't set up yet. Let's fix that!

---

## Step-by-Step Setup

### ✅ Step 1: Create Supabase Project (2 min)

1. Go to: **https://supabase.com**
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   ```
   Project name: talenthui
   Database password: [choose a strong password]
   Region: West US (California)
   ```
5. Click **"Create new project"**
6. ⏳ Wait 2 minutes for setup

---

### ✅ Step 2: Get Your API Keys (1 min)

In your Supabase Dashboard:

1. Click **Settings** ⚙️ (left sidebar)
2. Click **"API"**
3. Copy these 3 things:

```
📋 Project URL: https://xxxxx.supabase.co
📋 anon public key: eyJhbGc...
📋 service_role key: eyJhbGc... (click "Reveal" first)
```

---

### ✅ Step 3: Create .env.local File (1 min)

**Option A: Using Terminal**
```bash
cd /Users/rafaelfirme/talenthui
touch .env.local
open .env.local
```

**Option B: Using VS Code/Cursor**
- Create new file: `.env.local` in project root
- Add this content (replace with YOUR keys):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_PASSWORD=talenthui2024
```

**⚠️ Important:** Replace the values with YOUR actual keys from Step 2!

---

### ✅ Step 4: Run Database Migration (2 min)

1. Go back to **Supabase Dashboard**
2. Click **"SQL Editor"** (left sidebar)
3. Click **"New Query"**
4. Open this file: `/Users/rafaelfirme/talenthui/supabase-setup.sql`
5. **Copy ALL contents** (Cmd+A, Cmd+C)
6. **Paste** into SQL Editor (Cmd+V)
7. Click **"Run"** or press **Cmd+Enter**

✅ You should see: **"Success. No rows returned"** ← This is correct!

---

### ✅ Step 5: Import Your Candidates (3 min)

Run this command in your terminal:

```bash
cd /Users/rafaelfirme/talenthui
./import-now.sh
```

You should see:
```
🚀 Starting TalentHui Data Import...
✅ Environment variables loaded
📊 Importing candidates from CSV...
✓ Processed 100 candidates...
✓ Processed 200 candidates...
...
✅ Successfully imported 847 candidates to Supabase!
```

---

### ✅ Step 6: Start Your Server and View Results! (1 min)

```bash
npm run dev
```

Then visit: **http://localhost:3000/profiles**

🎉 **You should now see real candidates from your CSV!**

---

## 🔍 Troubleshooting

### "Environment variables missing"
→ Make sure you created `.env.local` with your actual Supabase keys

### "Profiles table does not exist"
→ Run the database migration (Step 4) in Supabase SQL Editor

### "Import failed"
→ Check that your CSV file is at the correct path:
  `/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv`

### Still not showing?
→ Check browser console (F12) for errors
→ Verify data imported: Go to Supabase Dashboard → Table Editor → profiles

---

## 📞 Quick Check Commands

```bash
# Check if setup is complete
node check-setup.js

# Re-import data if needed
./import-now.sh

# View first 10 profiles in database
# (In Supabase Dashboard → Table Editor → profiles)
```

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] `.env.local` file created with keys
- [ ] Database migration run (supabase-setup.sql)
- [ ] Candidates imported (./import-now.sh)
- [ ] Dev server running (npm run dev)
- [ ] Profiles showing at http://localhost:3000/profiles

---

**Once you complete these steps, your candidates will show up!** 🎉

**Also done:** Companies page now defaults to grid view as requested ✅

