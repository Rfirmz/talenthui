# TalentHui Quick Start Guide

Get TalentHui up and running in 10 minutes!

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project (choose US West region)
3. Go to SQL Editor → New Query
4. Copy and paste contents from `supabase-setup.sql`
5. Click Run

### 3. Configure Environment

Create `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
NEXT_PUBLIC_ADMIN_PASSWORD=talenthui2024
```

Get keys from: Supabase Dashboard → Settings → API

### 4. Import Candidate Data

```bash
node scripts/import-candidates.js "/path/to/your/csv/file.csv" 1000
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Test the App

Open browser:
- **Profiles**: http://localhost:3000/profiles
- **Companies**: http://localhost:3000/companies
- **Search API**: http://localhost:3000/api/search?q=software+engineer
- **Admin Import**: http://localhost:3000/admin/import
- **Signup**: http://localhost:3000/signup

## Quick Test Checklist

✅ Browse profiles - should show real data from CSV
✅ Search "software engineer" - returns < 300ms
✅ Search "cyber" - returns cybersecurity pros
✅ Filter by island (Oahu, Maui, etc.)
✅ Browse companies in table view
✅ Sign up a new account
✅ Login with created account
✅ Upload CSV via admin panel

## Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Import candidates
node scripts/import-candidates.js "path/to/csv" 1000
```

## API Endpoints

### Search Candidates
```bash
GET /api/search?q=software+engineer&island=Oahu&limit=10
```

### Response
```json
{
  "results": [...],
  "count": 10,
  "duration_ms": 45
}
```

## Admin Access

- URL: http://localhost:3000/admin/import
- Password: `talenthui2024` (change in `.env.local`)

## Production Deploy

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# In Vercel dashboard:
# 1. Import repo
# 2. Add environment variables
# 3. Deploy
```

### Environment Variables for Vercel
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
NEXT_PUBLIC_ADMIN_PASSWORD
```

## Features Overview

### 1. Candidate Profiles (/profiles)
- Browse 1000+ Hawaii tech professionals
- Search by name, title, company, skills
- Filter by island, city, school
- Real-time data from Supabase
- Fast search (< 300ms)

### 2. Authentication (/signup, /login)
- Email + Password signup
- Google OAuth (optional)
- Required fields: LinkedIn, title, company, location, school
- Profile auto-creation on signup

### 3. Companies (/companies)
- Table/Grid view toggle
- Search and filter
- Company profiles with descriptions
- Direct links to websites

### 4. Search API (/api/search)
- RESTful search endpoint
- Scoring algorithm (title + skills + location)
- Fast queries (< 300ms warm)
- Supports filters (island, school, title)

### 5. Admin Import (/admin/import)
- Web-based CSV upload
- Password protected
- Batch processing
- Error reporting
- Immediate results

## Need Help?

See full documentation: [SETUP.md](./SETUP.md)

## Troubleshooting

**Profiles showing "Mock Data"**
→ Check Supabase connection and imported data

**Search is slow**
→ Run migration script to create indexes

**CSV import fails**
→ Check CSV format matches expected columns

**Auth not working**
→ Verify Supabase credentials in `.env.local`

---

**Ready to go!** Visit http://localhost:3000 🚀

