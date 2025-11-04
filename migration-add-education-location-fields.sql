-- Migration: Add education and location fields to profiles table
-- Run this in your Supabase SQL Editor

-- Add new education fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS high_school TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;

-- Add new location fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hometown TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.high_school IS 'High school attended';
COMMENT ON COLUMN profiles.college IS 'College or university attended';
COMMENT ON COLUMN profiles.current_city IS 'City where the person currently lives';
COMMENT ON COLUMN profiles.hometown IS 'City where the person is originally from';

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('high_school', 'college', 'current_city', 'hometown');


