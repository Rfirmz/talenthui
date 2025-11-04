-- TalentHui Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  
  -- Professional info
  current_title TEXT,
  current_company TEXT,
  company_location TEXT,
  category TEXT,
  
  -- Location
  country TEXT DEFAULT 'United States',
  state TEXT DEFAULT 'Hawaii',
  city TEXT,
  current_city TEXT,
  hometown TEXT,
  island TEXT,
  location TEXT,
  
  -- Education
  school TEXT,
  high_school TEXT,
  college TEXT,
  education TEXT[], -- Array of schools
  education_websites TEXT[],
  education_linkedin TEXT[],
  
  -- Skills and experience
  skills TEXT[],
  years_experience INTEGER,
  
  -- Social links
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  personal_email TEXT,
  work_email TEXT,
  
  -- Company info
  company_website TEXT,
  company_linkedin TEXT,
  company_address TEXT,
  
  -- Profile info
  bio TEXT,
  avatar_url TEXT,
  
  -- Privacy
  visibility BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_current_title ON profiles(current_title);
CREATE INDEX IF NOT EXISTS idx_profiles_current_company ON profiles(current_company);
CREATE INDEX IF NOT EXISTS idx_profiles_island ON profiles(island);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_school ON profiles(school);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(visibility);

-- Create full text search index
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles 
USING GIN(to_tsvector('english', 
  COALESCE(full_name, '') || ' ' || 
  COALESCE(current_title, '') || ' ' || 
  COALESCE(current_company, '') || ' ' ||
  COALESCE(bio, '') || ' ' ||
  COALESCE(array_to_string(skills, ' '), '')
));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access for visible profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (visibility = true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Create companies table (if not exists)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  island TEXT,
  city TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  type TEXT,
  contacts JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_island ON companies(island);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- Enable RLS for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access for companies
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);

-- Search function for profiles
CREATE OR REPLACE FUNCTION search_profiles(
  search_query TEXT DEFAULT NULL,
  filter_island TEXT DEFAULT NULL,
  filter_school TEXT DEFAULT NULL,
  filter_title TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  username TEXT,
  current_title TEXT,
  current_company TEXT,
  city TEXT,
  island TEXT,
  school TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  avatar_url TEXT,
  years_experience INTEGER,
  score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.full_name,
    p.username,
    p.current_title,
    p.current_company,
    p.city,
    p.island,
    p.school,
    p.skills,
    p.linkedin_url,
    p.avatar_url,
    p.years_experience,
    (
      -- Text match score (title, company, skills)
      CASE 
        WHEN search_query IS NOT NULL THEN
          ts_rank(
            to_tsvector('english', 
              COALESCE(p.full_name, '') || ' ' ||
              COALESCE(p.current_title, '') || ' ' || 
              COALESCE(p.current_company, '') || ' ' ||
              COALESCE(array_to_string(p.skills, ' '), '')
            ),
            plainto_tsquery('english', search_query)
          ) * 10
        ELSE 0
      END
      +
      -- Island boost
      CASE WHEN filter_island IS NOT NULL AND p.island = filter_island THEN 2 ELSE 0 END
      +
      -- Years experience tie-breaker (normalized)
      COALESCE(p.years_experience, 0)::REAL / 100
    )::REAL AS score
  FROM profiles p
  WHERE 
    p.visibility = true
    AND (search_query IS NULL OR to_tsvector('english', 
      COALESCE(p.full_name, '') || ' ' ||
      COALESCE(p.current_title, '') || ' ' || 
      COALESCE(p.current_company, '') || ' ' ||
      COALESCE(array_to_string(p.skills, ' '), '')
    ) @@ plainto_tsquery('english', search_query))
    AND (filter_island IS NULL OR p.island = filter_island)
    AND (filter_school IS NULL OR p.school ILIKE '%' || filter_school || '%')
    AND (filter_title IS NULL OR p.current_title ILIKE '%' || filter_title || '%')
  ORDER BY score DESC, p.years_experience DESC NULLS LAST
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

