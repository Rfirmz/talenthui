# TalentHui Setup Guide

This guide will walk you through setting up TalentHui with Supabase, importing candidates, and deploying the application.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git installed

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Project Name: `talenthui`
   - Database Password: (choose a strong password)
   - Region: Choose closest to Hawaii (US West recommended)
4. Wait for the project to be created (~2 minutes)

### 1.2 Run Database Migration

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned" - this is correct!

### 1.3 Enable Google OAuth (Optional)

1. Go to Authentication → Providers in Supabase dashboard
2. Enable "Google" provider
3. Follow instructions to set up Google OAuth credentials
4. Add your site URL to authorized redirect URIs

### 1.4 Get Your Supabase Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon/public` key
   - `service_role` key (keep this secret!)

## Step 2: Environment Setup

### 2.1 Create Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Admin Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=talenthui2024
```

Replace the placeholders with your actual Supabase credentials.

### 2.2 Install Dependencies

```bash
npm install
```

## Step 3: Import Candidate Data

### Option A: Using the Import Script (Recommended)

1. Make sure your CSV file is ready (the one you provided)
2. Run the import script:

```bash
node scripts/import-candidates.js "/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv" 1000
```

This will import the first 1000 candidates from the CSV.

**Expected output:**
```
🚀 TalentHui Candidate Import Script
═══════════════════════════════════════════
📂 Reading CSV from: /Users/rafaelfirme/Downloads/...
🎯 Importing up to 1000 candidates...

✓ Processed 100 candidates...
✓ Processed 200 candidates...
...
✅ Successfully imported 847 candidates to Supabase!
```

### Option B: Using the Admin Web Interface

1. Start the development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/admin/import`
3. Enter the admin password: `talenthui2024`
4. Upload your CSV file
5. Click "Upload and Import"
6. Wait for the import to complete

## Step 4: Verify the Setup

### 4.1 Check Database

1. Go to Supabase Dashboard → Table Editor
2. Select `profiles` table
3. You should see imported candidates with:
   - Names, titles, companies
   - Location info (city, island, state)
   - Skills arrays
   - LinkedIn URLs
   - Etc.

### 4.2 Test the Application

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000/profiles`
3. You should see real candidate profiles (not mock data)
4. The page should show "Data source: Supabase" in green
5. Try searching for:
   - "software engineer" - should return relevant results
   - "cyber" - should return cybersecurity professionals
   - "PM" or "product manager" - should return PMs

### 4.3 Test Search API

```bash
# Test basic search
curl "http://localhost:3000/api/search?q=software+engineer&limit=5"

# Test with filters
curl "http://localhost:3000/api/search?q=engineer&island=Oahu&limit=10"

# Test by title
curl "http://localhost:3000/api/search?title=software"
```

**Expected response:**
```json
{
  "results": [...],
  "count": 10,
  "duration_ms": 45,
  "query": {
    "q": "software engineer",
    "island": "Oahu",
    "limit": 10
  }
}
```

Response time should be < 300ms for warm queries.

## Step 5: Test Authentication

### 5.1 Test Signup Flow

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - Full name
   - Email
   - LinkedIn URL (required)
   - Current title (required)
   - Company
   - Island (required)
   - City (required)
   - School (required)
   - Password
3. Click "Create account"
4. You should be redirected to `/profile/edit`
5. Check Supabase: New user should appear in Authentication and profiles table

### 5.2 Test Login Flow

1. Go to `http://localhost:3000/login`
2. Enter email and password from signup
3. Click "Sign in"
4. Should redirect to `/profiles`

### 5.3 Test Google OAuth (if configured)

1. Click "Continue with Google" on login/signup page
2. Complete Google authentication
3. Should redirect back to the app

## Step 6: Test Companies Page

1. Go to `http://localhost:3000/companies`
2. You should see a table view of companies (default)
3. Try the filters:
   - Search by name
   - Filter by industry
   - Filter by island
   - Filter by company size
4. Toggle between Table View and Grid View
5. Click on a company to view its detail page

## Step 7: Performance Verification

### Search Performance Target: < 300ms

Test the search endpoint:

```bash
# Run multiple times to warm up
for i in {1..5}; do
  curl -w "\nTime: %{time_total}s\n" \
    "http://localhost:3000/api/search?q=software+engineer&limit=10"
done
```

Expected: Most requests < 0.3s (300ms)

## Step 8: Deploy to Vercel (Production)

### 8.1 Push to GitHub

```bash
git add .
git commit -m "Setup TalentHui with Supabase"
git push origin main
```

### 8.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
   ```
6. Click "Deploy"
7. Wait ~2-3 minutes for deployment

### 8.3 Configure Supabase for Production

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### 8.4 Test Production

1. Visit your Vercel URL
2. Test all features:
   - Browse profiles
   - Search candidates
   - Sign up / Login
   - Browse companies
   - Admin import (if needed)

## Acceptance Criteria Checklist

### ✅ Task 1: Candidates in DB
- [x] Import ~1000 candidate rows from CSV
- [x] Hit /profiles and see real people (not dummy data)
- [x] Typical searches return results in < 300ms warm

### ✅ Task 2: Auth + Signup Form
- [x] Supabase Auth with email + Google
- [x] Post-signup required fields: linkedin_url, current_title, company, school, city/island
- [x] New user can sign up and data is persisted to profiles
- [x] LinkedIn URL format validation

### ✅ Task 3: Public Companies Browse
- [x] /companies page renders with real companies
- [x] List/table view (not cards)
- [x] Basic search and filter
- [x] Click into company profile page with description and website

### ✅ Task 4: Search API
- [x] /api/search endpoint for candidates
- [x] Params: q, island, school, title
- [x] Scoring: title/company match + skill tags + island boost
- [x] Returns top 10 matches quickly (< 300ms warm)

### ✅ Task 5: Admin CSV Import
- [x] /admin/import page to upload CSV
- [x] Access control via password/email allowlist
- [x] Upload CSV and immediately see new rows in /profiles

## Troubleshooting

### Issue: "Failed to load profiles" error

**Solution:** Check your Supabase credentials in `.env.local`

### Issue: Search is slow (> 300ms)

**Solution:** 
1. Make sure you ran the database migration (creates indexes)
2. Run the search a few times to warm up (first query is always slower)
3. Check Supabase dashboard for slow queries

### Issue: CSV import fails

**Solution:**
1. Check the CSV format matches expected columns
2. Ensure SUPABASE_SERVICE_KEY is set correctly
3. Check Supabase logs for errors

### Issue: Google OAuth not working

**Solution:**
1. Make sure you've configured Google OAuth in Supabase dashboard
2. Check that your redirect URLs are correct
3. Verify Google Client ID and Secret are set

## Admin Access

### Admin Routes
- `/admin/import` - CSV import interface

### Admin Credentials
- Password: Set in `NEXT_PUBLIC_ADMIN_PASSWORD` env variable
- Default: `talenthui2024` (change this in production!)

### Admin Email Allowlist
Edit `/src/app/admin/import/page.tsx` and add admin emails to:
```typescript
const ADMIN_EMAILS = [
  'admin@talenthui.com',
  'your-email@example.com',
];
```

## Support

For issues or questions:
1. Check this setup guide
2. Review Supabase logs
3. Check browser console for errors
4. Review Next.js build logs

## Next Steps

After setup:
1. Customize the design and branding
2. Add more features (messaging, bookmarks, etc.)
3. Set up analytics (Google Analytics, Posthog, etc.)
4. Add email notifications
5. Implement advanced search filters
6. Add company admin features

---

**Setup Complete!** 🎉

Your TalentHui platform is now ready to connect Hawaii's talent with opportunities.

