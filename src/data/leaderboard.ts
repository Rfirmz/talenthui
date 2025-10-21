export interface LeaderboardEntry {
  id: string;
  name: string;
  type: 'university' | 'high_school';
  island: string;
  city: string;
  alumni_count: number;
  rank: number;
  description: string;
  logo_url: string;
  metrics: {
    total_alumni: number;
    active_professionals: number;
    average_salary: number;
    employment_rate: number;
  };
}

export const universityLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    name: "University of Hawaii at Manoa",
    type: "university",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 145,
    rank: 1,
    description: "Hawaii's flagship university and research institution",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 145,
      active_professionals: 132,
      average_salary: 75000,
      employment_rate: 91
    }
  },
  {
    id: "2",
    name: "University of Hawaii at Hilo",
    type: "university",
    island: "Big Island",
    city: "Hilo",
    alumni_count: 89,
    rank: 2,
    description: "Hawaii's comprehensive university on the Big Island",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 89,
      active_professionals: 78,
      average_salary: 68000,
      employment_rate: 88
    }
  },
  {
    id: "3",
    name: "Hawaii Pacific University",
    type: "university",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 67,
    rank: 3,
    description: "Private university in downtown Honolulu",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 67,
      active_professionals: 61,
      average_salary: 72000,
      employment_rate: 91
    }
  },
  {
    id: "4",
    name: "Chaminade University",
    type: "university",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 34,
    rank: 4,
    description: "Catholic university with strong community focus",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 34,
      active_professionals: 31,
      average_salary: 65000,
      employment_rate: 91
    }
  },
  {
    id: "5",
    name: "Brigham Young University Hawaii",
    type: "university",
    island: "Oahu",
    city: "Laie",
    alumni_count: 28,
    rank: 5,
    description: "Private university with international focus",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 28,
      active_professionals: 26,
      average_salary: 70000,
      employment_rate: 93
    }
  }
];

export const highSchoolLeaderboard: LeaderboardEntry[] = [
  {
    id: "h1",
    name: "Punahou School",
    type: "high_school",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 89,
    rank: 1,
    description: "Private college preparatory school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 89,
      active_professionals: 85,
      average_salary: 82000,
      employment_rate: 95
    }
  },
  {
    id: "h2",
    name: "Iolani School",
    type: "high_school",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 76,
    rank: 2,
    description: "Private college preparatory school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 76,
      active_professionals: 72,
      average_salary: 78000,
      employment_rate: 95
    }
  },
  {
    id: "h3",
    name: "Kamehameha Schools",
    type: "high_school",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 134,
    rank: 3,
    description: "Private school system for Native Hawaiian children",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 134,
      active_professionals: 128,
      average_salary: 75000,
      employment_rate: 96
    }
  },
  {
    id: "h4",
    name: "Mid-Pacific Institute",
    type: "high_school",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 45,
    rank: 4,
    description: "Private college preparatory school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 45,
      active_professionals: 42,
      average_salary: 76000,
      employment_rate: 93
    }
  },
  {
    id: "h5",
    name: "Hawaii Preparatory Academy",
    type: "high_school",
    island: "Big Island",
    city: "Kamuela",
    alumni_count: 23,
    rank: 5,
    description: "Private boarding and day school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 23,
      active_professionals: 22,
      average_salary: 79000,
      employment_rate: 96
    }
  },
  {
    id: "h6",
    name: "Maui Preparatory Academy",
    type: "high_school",
    island: "Maui",
    city: "Lahaina",
    alumni_count: 18,
    rank: 6,
    description: "Private college preparatory school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 18,
      active_professionals: 17,
      average_salary: 74000,
      employment_rate: 94
    }
  },
  {
    id: "h7",
    name: "Island School",
    type: "high_school",
    island: "Kauai",
    city: "Lihue",
    alumni_count: 12,
    rank: 7,
    description: "Private college preparatory school",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 12,
      active_professionals: 11,
      average_salary: 71000,
      employment_rate: 92
    }
  },
  {
    id: "h8",
    name: "Hawaii Technology Academy",
    type: "high_school",
    island: "Oahu",
    city: "Honolulu",
    alumni_count: 34,
    rank: 8,
    description: "Public charter school with technology focus",
    logo_url: "/avatars/placeholder.svg",
    metrics: {
      total_alumni: 34,
      active_professionals: 32,
      average_salary: 73000,
      employment_rate: 94
    }
  }
];
