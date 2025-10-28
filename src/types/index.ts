export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  current_title: string;
  company: string;
  island: string;
  city: string;
  school: string;
  bio: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  pay_band: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  industry: string;
  size: string;
  island: string;
  city: string;
  website: string;
  linkedin_url?: string;
  type?: string;
  contacts?: Array<{
    text: string;
    href: string;
  }>;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  island: string;
  city: string;
  logo_url: string;
  alumni_count: number;
  description: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  island: string;
  talent_count: number;
  company_count: number;
  avg_salary: number;
}
