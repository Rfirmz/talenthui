# Talent Hui - MVP Frontend Build

## Project Overview
A community-driven career and talent discovery platform for Hawaii, connecting local talent with employers and ecosystem partners.

**Owner:** Zack @ AEP Hawaii  
**Collaborators:** Rafael Firme  
**Goal:** Functional frontend MVP with minimal backend (auth only)

---

## Tech Stack

- **Frontend:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth only for MVP)
- **Database:** PostgreSQL via Supabase (minimal setup)
- **Auth:** Supabase Auth (Google + Email)
- **Deployment:** Vercel
- **Version Control:** GitHub

---

## MVP Scope - Frontend Focus

### What We're Building (MVP v1.0):
✅ **Static/Mock Data Frontend**
- Landing page with mission statement
- User authentication (signup/login/logout)
- Profile pages (static data for now)
- Directory views (schools, companies, cities)
- Leaderboard pages (mock data)
- Responsive design with Tailwind CSS

❌ **Not in MVP:**
- Full database integration (using mock data)
- Admin dashboard
- User profile editing
- Real leaderboard calculations
- Job postings
- Employer dashboards
- Payment/pricing pages

---

## Site Structure & Pages

### Core Pages (Priority 1):

#### 1. `/` - Landing Page
**Purpose:** Introduce Talent Hui, showcase value proposition  
**Components:**
- Hero section with tagline: "Connecting Hawaii's Talent"
- Mission statement
- Top employers showcase (mock data)
- Testimonials section (placeholder)
- CTA for sign up
- Footer with "Gov — Sponsor This" callout

#### 2. `/signup` - Registration
**Purpose:** User account creation  
**Components:**
- Supabase Auth integration
- Google OAuth button
- Email/password form
- Redirect to `/profile/:username` after signup

#### 3. `/login` - Login
**Purpose:** User authentication  
**Components:**
- Supabase Auth integration
- Google OAuth button
- Email/password form
- "Forgot password" link

#### 4. `/profile/[username]` - Public Profile
**Purpose:** Display user profile  
**Components:**
- Avatar/profile image
- Full name
- Current title & company
- Island & city
- School
- LinkedIn/GitHub/Twitter links
- Bio section
- "Connect" button (future feature - disabled for MVP)

**Mock Data Structure:**
```typescript
{
  username: "john-doe",
  full_name: "John Doe",
  avatar_url: "/avatars/placeholder.jpg",
  current_title: "Software Engineer",
  company: "Hawaiian Tech Co",
  island: "Oahu",
  city: "Honolulu",
  school: "University of Hawaii at Manoa",
  bio: "Passionate about building products for Hawaii...",
  linkedin_url: "https://linkedin.com/in/johndoe",
  github_url: "https://github.com/johndoe",
  twitter_url: "https://twitter.com/johndoe"
}
```

#### 5. `/profiles` - Talent Directory
**Purpose:** Browse all talent profiles  
**Components:**
- Search bar (client-side filtering)
- Filter dropdowns: Island, City, School, Job Title
- Grid of profile cards
- Each card: avatar, name, title, location, school
- Click → goes to `/profile/[username]`

**Mock Data:** 20-30 sample profiles with diverse:
- Islands (Oahu, Maui, Big Island, Kauai)
- Cities (Honolulu, Hilo, Kahului, Lihue)
- Schools (UH Manoa, UH Hilo, HPU, Chaminade)
- Job titles (Software Engineer, Product Manager, Designer, etc.)

#### 6. `/schools` - Schools Directory
**Purpose:** Browse Hawaii schools  
**Components:**
- Search bar
- Grid/list of school cards
- Each card: logo, name, island, alumni count
- Click → goes to `/schools/[schoolname]`

**Mock Schools:**
- University of Hawaii at Manoa
- University of Hawaii at Hilo
- Hawaii Pacific University
- Chaminade University
- Brigham Young University Hawaii

#### 7. `/schools/[schoolname]` - School Page
**Purpose:** School leaderboard & alumni  
**Components:**
- School banner/logo
- School info (island, city)
- Alumni count
- Grid of alumni profiles (filtered from mock data)
- Top companies where alumni work

#### 8. `/companies` - Companies Directory
**Purpose:** Browse Hawaii companies  
**Components:**
- Search bar
- Filter by: Industry, Size, Island
- Grid of company cards
- Each card: logo, name, industry, location, employee count
- Click → goes to `/companies/[companyname]`

**Mock Companies:**
- Hawaiian Airlines
- Altres
- Hawaii Pacific Health
- Bank of Hawaii
- Local startups (5-10 examples)

#### 9. `/companies/[companyname]` - Company Page
**Purpose:** Company profile & employees  
**Components:**
- Company banner/logo
- Company description
- Industry, size, location
- Grid of employees (filtered from mock profiles)
- Average pay band (placeholder/mock)

#### 10. `/cities` - Cities Directory
**Purpose:** Browse cities by island  
**Components:**
- Island tabs or sections
- City cards with: name, island, talent count
- Click → goes to `/cities/[cityname]`

#### 11. `/cities/[cityname]` - City Page
**Purpose:** City profile  
**Components:**
- City name & island
- Local talent grid (filtered profiles)
- Local employers (filtered companies)
- Average pay info (mock data)

#### 12. `/about` - About Page
**Purpose:** Tell the Talent Hui story  
**Components:**
- Mission statement
- Team section (Zack, collaborators)
- Partner logos (schools, orgs)
- Contact info

---

## Design System (Tailwind)

### Color Palette (Hawaii-Inspired):
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    500: '#0891b2', // Ocean blue
    600: '#0e7490',
    700: '#155e75',
  },
  secondary: {
    500: '#fbbf24', // Sunset gold
    600: '#f59e0b',
  },
  accent: {
    500: '#10b981', // Island green
    600: '#059669',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    500: '#71717a',
    900: '#18181b',
  }
}
```

### Typography:
- Headings: `font-bold` with `text-3xl` to `text-5xl`
- Body: `font-normal` with `text-base` to `text-lg`
- Use `font-sans` (system fonts for speed)

### Components to Build:

1. **ProfileCard** - Reusable profile display
2. **CompanyCard** - Reusable company display
3. **SchoolCard** - Reusable school display
4. **CityCard** - Reusable city display
5. **Navbar** - Fixed header with logo, nav links, auth buttons
6. **Footer** - Links + "Gov — Sponsor This" CTA
7. **SearchBar** - Reusable search input
8. **FilterDropdown** - Reusable filter component
9. **LeaderboardTable** - Ranked list display

---

## Mock Data Files

Create these in `/data/` directory:

### `/data/profiles.ts`
```typescript
export const mockProfiles = [
  {
    id: "1",
    username: "john-doe",
    full_name: "John Doe",
    avatar_url: "/avatars/avatar1.jpg",
    current_title: "Software Engineer",
    company: "Hawaiian Tech Co",
    island: "Oahu",
    city: "Honolulu",
    school: "University of Hawaii at Manoa",
    bio: "Building the future of Hawaii tech...",
    linkedin_url: "https://linkedin.com/in/johndoe",
    github_url: "https://github.com/johndoe",
    twitter_url: null,
    pay_band: 80000,
  },
  // Add 20-30 more profiles with variety
];
```

### `/data/companies.ts`
```typescript
export const mockCompanies = [
  {
    id: "1",
    name: "Hawaiian Airlines",
    slug: "hawaiian-airlines",
    description: "Hawaii's largest airline",
    logo_url: "/logos/hawaiian-airlines.png",
    industry: "Transportation",
    size: "1000+",
    island: "Oahu",
    city: "Honolulu",
    website: "https://hawaiianairlines.com",
    employee_count: 1200,
    avg_salary: 75000,
  },
  // Add 10-15 more companies
];
```

### `/data/schools.ts`
```typescript
export const mockSchools = [
  {
    id: "1",
    name: "University of Hawaii at Manoa",
    slug: "uh-manoa",
    island: "Oahu",
    city: "Honolulu",
    logo_url: "/logos/uh-manoa.png",
    alumni_count: 145,
    description: "Hawaii's flagship university",
  },
  // Add 5-10 more schools
];
```

### `/data/cities.ts`
```typescript
export const mockCities = [
  {
    id: "1",
    name: "Honolulu",
    slug: "honolulu",
    island: "Oahu",
    talent_count: 250,
    company_count: 45,
    avg_salary: 72000,
  },
  // Add 10-15 cities across islands
];
```

---

## Authentication Setup (Minimal)

### Supabase Configuration:

1. **Create Supabase Project:**
   - Go to supabase.com
   - Create new project: "talent-hui"
   - Copy URL and anon key

2. **Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. **Auth Providers to Enable:**
   - Email/Password (native)
   - Google OAuth

4. **Minimal Database (Optional for MVP):**
   - Only create `profiles` table if you want to store user data
   - Otherwise, auth only (no database writes for MVP)

### Auth Flow:
- User signs up → Supabase creates auth user
- User logs in → Session stored in cookies
- Protected routes check session
- No profile creation/editing in MVP (coming later)

---

## File Structure

```
talent-hui/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── profile/
│   │   └── [username]/
│   │       └── page.tsx
│   ├── profiles/
│   │   └── page.tsx
│   ├── schools/
│   │   ├── page.tsx
│   │   └── [schoolname]/
│   │       └── page.tsx
│   ├── companies/
│   │   ├── page.tsx
│   │   └── [companyname]/
│   │       └── page.tsx
│   ├── cities/
│   │   ├── page.tsx
│   │   └── [cityname]/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx (landing page)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── cards/
│   │   ├── ProfileCard.tsx
│   │   ├── CompanyCard.tsx
│   │   ├── SchoolCard.tsx
│   │   └── CityCard.tsx
│   ├── ui/
│   │   ├── SearchBar.tsx
│   │   ├── FilterDropdown.tsx
│   │   └── LeaderboardTable.tsx
│   └── auth/
│       └── AuthButton.tsx
├── data/
│   ├── profiles.ts
│   ├── companies.ts
│   ├── schools.ts
│   └── cities.ts
├── lib/
│   ├── supabase.ts (client setup)
│   └── utils.ts
├── public/
│   ├── avatars/
│   ├── logos/
│   └── images/
├── types/
│   └── index.ts
├── .env.local
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Implementation Steps for Cursor

### Phase 1: Project Setup
1. Initialize Next.js project with TypeScript
2. Install dependencies: `supabase-js`, `@supabase/auth-helpers-nextjs`
3. Configure Tailwind CSS with custom colors
4. Set up Supabase client
5. Create basic layout (Navbar + Footer)

### Phase 2: Mock Data
1. Create all mock data files (profiles, companies, schools, cities)
2. Create TypeScript types for all entities
3. Add utility functions for filtering/searching mock data

### Phase 3: Authentication
1. Implement Supabase Auth setup
2. Create login page with Google OAuth + email
3. Create signup page
4. Add logout functionality
5. Create protected route wrapper (optional for MVP)

### Phase 4: Core Pages
1. Build landing page (hero + sections)
2. Build profile page template
3. Build profiles directory with filters
4. Build schools directory + individual school pages
5. Build companies directory + individual company pages
6. Build cities directory + individual city pages
7. Build about page

### Phase 5: Components
1. Create ProfileCard component
2. Create CompanyCard component
3. Create SchoolCard component
4. Create CityCard component
5. Create SearchBar component
6. Create FilterDropdown component
7. Create LeaderboardTable component

### Phase 6: Styling & Polish
1. Make all pages responsive (mobile-first)
2. Add loading states
3. Add error states
4. Add smooth transitions
5. Optimize images (use Next.js Image component)

### Phase 7: Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel
4. Deploy to production
5. Test all pages and auth flow

---

## Design Notes for Figma Integration

When your Figma designs are ready:
1. Export components as PNG/SVG
2. Place in `/public/images/`
3. Update color palette in `tailwind.config.js` to match Figma
4. Use Figma's spacing/sizing as Tailwind classes
5. Consider using Figma's design tokens for consistency

### Key Design Elements:
- **Hawaii aesthetic:** Ocean blues, sunset golds, island greens
- **Professional but warm:** Approachable, community-focused
- **Mobile-first:** Most users will browse on phones
- **Fast loading:** Optimize images, minimal animations
- **Accessible:** High contrast, clear typography

---

## Testing Checklist

- [ ] All pages load without errors
- [ ] Authentication flow works (signup/login/logout)
- [ ] Profile pages display correctly with mock data
- [ ] Directory pages show all items
- [ ] Filters work on directory pages
- [ ] Search works on directory pages
- [ ] Links navigate correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Images load properly
- [ ] Google OAuth works
- [ ] Email auth works

---

## Post-MVP (Future Features)

- Real database integration with Supabase
- User profile creation/editing
- Admin dashboard
- Job postings
- Real leaderboard calculations
- Payment/pricing pages
- Employer dashboards
- Messaging/connections
- Analytics

---

## Questions to Resolve

1. Should profiles be clickable in MVP or just display-only?
2. Do we want placeholder avatars or require image uploads?
3. Should we collect more data at signup or keep it minimal?
4. What's the priority order for islands? (Start with Oahu only?)
5. Do we need a "verified" badge system in MVP?

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## Contact

**Project Owner:** Zack @ AEP Hawaii  
**For Questions:** [Add contact method]

---

**Let's build something awesome for Hawaii! 🌺**
