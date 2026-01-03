'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { mockProfiles } from '@/data/profiles';
import { clearedDodProfiles } from '@/data/clearedDodProfiles';
import { mockCompanies } from '@/data/companies';
import ProfileCard from '@/components/cards/ProfileCard';
import ProfileModal from '@/components/modals/ProfileModal';
import CompanyCard from '@/components/cards/CompanyCard';
import CompanyCarousel from '@/components/ui/CompanyCarousel';

export default function HomePage() {
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonialProfiles, setTestimonialProfiles] = useState<{[key: string]: any}>({});

  // Handle profile card click - open modal
  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Load real featured profiles from Supabase
  useEffect(() => {
    const loadFeaturedProfiles = async () => {
      try {
        setIsLoading(true);
        
        // Fetch specific featured profiles
        const featuredNames = [
          { name: 'Zack', search: ['zack hernandez', 'zack', 'hernandez'] },
          { name: 'Gigi', search: ['gigi dawn', 'gigi', 'dawn'] },
          { name: 'Jia Qi', search: ['jia qi', 'jia', 'qi'], company: 'TikTok' },
          { name: 'Noel', search: ['noel', 'noel '] },
          { name: 'Jeff Mori', search: ['jeff mori', 'jeff', 'mori'] },
          { name: 'Austin Yoshino', search: ['austin yoshino', 'yoshino'], email: 'ay@austinyoshino.com' },
          { name: 'Francisco Cha', search: ['francisco cha', 'francisco', 'cha'] },
          { name: 'Brian NG', search: ['brian ng', 'brian', 'ng'] },
          { name: 'Rafael Firme', search: ['rafael firme', 'rafael', 'firme'] },
          { name: 'Austin Yoshino 2', search: ['austin yoshino', 'yoshino'], email: null, useSecond: true }
        ];

        const fetchedProfiles: any[] = [];
        const foundNames = new Set<string>();

        // Fetch all profiles in parallel for faster loading
        const profilePromises = featuredNames.map(async ({ name, search, email, useSecond, company }) => {
          let profile = null;

          // Try email search first if available
          if (email && !useSecond) {
            const { data: emailData } = await supabase
          .from('profiles')
          .select('*')
          .eq('visibility', true)
              .ilike('email', email)
          .limit(1);
            
            if (emailData && emailData.length > 0) {
              return { name, profile: emailData[0] };
            }
          }

          // If not found by email, try name search (try most specific first)
          for (const searchTerm of search) {
            let query = supabase
          .from('profiles')
          .select('*')
          .eq('visibility', true)
              .ilike('full_name', `%${searchTerm}%`);
            
            // For Jia Qi, filter by company TikTok
            if (name === 'Jia Qi' && (company || searchTerm.includes('jia qi'))) {
              query = query.ilike('current_company', '%tiktok%');
            }
            
            const { data } = await query.limit(10);

            if (data && data.length > 0) {
              // For Austin Yoshino with useSecond, get the second one
              if (name === 'Austin Yoshino 2' && data.length > 1) {
                // Prefer Founder profile, or get second by creation date
                const founderProfile = data.find(p => 
                  p.current_title?.toLowerCase().includes('founder')
                );
                
                if (founderProfile) {
                  profile = founderProfile;
                } else {
                  const sorted = data.sort((a, b) => {
            const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
            return bDate - aDate;
          });
                  profile = sorted[1] || sorted[0];
                }
              } else if (name === 'Jia Qi') {
                // For Jia Qi, prefer Machine Learning Engineer at TikTok
                const mleProfile = data.find(p => 
                  p.current_title?.toLowerCase().includes('machine learning') &&
                  (p.current_company?.toLowerCase().includes('tiktok') || p.company?.toLowerCase().includes('tiktok'))
                );
                profile = mleProfile || data[0];
              } else {
                // For first Austin Yoshino, prefer the one with email or Founder
                if (name === 'Austin Yoshino' && data.length > 1) {
                  const founderProfile = data.find(p => 
                    p.current_title?.toLowerCase().includes('founder')
                  );
                  profile = founderProfile || data[0];
                } else {
                  profile = data[0];
                }
              }
              break; // Found a match, stop searching
            }
          }

          return { name, profile };
        });

        // Wait for all queries to complete in parallel
        const results = await Promise.all(profilePromises);

        // Process results and add to fetchedProfiles
        for (const { name, profile } of results) {
          if (profile) {
            const profileName = (profile.full_name || '').toLowerCase();
            if (!foundNames.has(profileName)) {
              foundNames.add(profileName);
              fetchedProfiles.push({
                ...profile,
                company: profile.current_company || profile.company || '',
              });
            }
          }
        }

        // Ensure we have 9 profiles, fill with mock data if needed
        if (fetchedProfiles.length < 9) {
          const filteredMockProfiles = [...mockProfiles, ...clearedDodProfiles].filter((profile) => {
            const name = profile.full_name?.toLowerCase() || '';
            return !name.includes('ryan inouye') && 
                   !name.includes('ryan dude') &&
                   !foundNames.has(name);
          });
          fetchedProfiles.push(...filteredMockProfiles.slice(0, 9 - fetchedProfiles.length));
          }

        setFeaturedProfiles(fetchedProfiles.slice(0, 9));
      } catch (err) {
        console.error('Error loading featured profiles:', err);
        const filteredMockProfiles = [...mockProfiles, ...clearedDodProfiles].filter((profile) => {
          const name = profile.full_name?.toLowerCase() || '';
          return !name.includes('ryan inouye') && !name.includes('ryan dude');
        });
        setFeaturedProfiles(filteredMockProfiles.slice(0, 9));
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProfiles();
  }, []);

  // Load testimonial profiles
  useEffect(() => {
    const loadTestimonialProfiles = async () => {
      try {
        const testimonialQueries = [
          { key: 'Austin Yoshino', searches: ['Austin Yoshino', 'Yoshino', 'Austin Y'], email: 'ay@austinyoshino.com' },
          { key: 'Robert Kam', searches: ['Robert Kam', 'Kam'], email: null },
          { key: 'Tim Kamana', searches: ['Timothy Kamanā', 'Timothy Kamana', 'Tim Kamanā', 'Tim Kamana', 'Kamanā', 'Kamana'], email: null }
        ];
        const profiles: {[key: string]: any} = {};

        for (const { key, searches, email } of testimonialQueries) {
          let found = false;
          
          // For Austin Yoshino, try email search first if available
          if (key === 'Austin Yoshino' && email) {
            const { data: emailData } = await supabase
              .from('profiles')
              .select('*')
              .eq('visibility', true)
              .ilike('email', email)
              .limit(1);
            
            if (emailData && emailData.length > 0) {
              profiles[key] = {
                ...emailData[0],
                company: emailData[0].current_company || emailData[0].company || '',
              };
              console.log(`✅ Found profile for ${key} (by email):`, emailData[0].full_name, 'Title:', emailData[0].current_title, 'Avatar:', emailData[0].avatar_url);
              found = true;
            }
          }
          
          // Try each search variation
          for (const search of searches) {
            if (found) break;
            
            // Try exact match - get all matches for Austin Yoshino
            let { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('visibility', true)
              .ilike('full_name', `%${search}%`)
              .limit(10);

            if (data && data.length > 0) {
              // For Austin Yoshino, find the one with "Founder" title or more complete data
              if (key === 'Austin Yoshino' && data.length > 1) {
                // First, exclude CEO profiles and prefer Founder
                const founderProfile = data.find(p => {
                  const title = p.current_title?.toLowerCase() || '';
                  return title.includes('founder') && !title.includes('ceo') && !title.includes('chief executive');
                });
                
                if (founderProfile) {
                  profiles[key] = {
                    ...founderProfile,
                    company: founderProfile.current_company || founderProfile.company || '',
                  };
                  console.log(`✅ Found profile for ${key} (Founder):`, founderProfile.full_name, 'Title:', founderProfile.current_title, 'Avatar:', founderProfile.avatar_url);
                  found = true;
                  break;
                }
                
                // If no founder, exclude CEO and find one with multiple locations
                const nonCEOProfiles = data.filter(p => {
                  const title = p.current_title?.toLowerCase() || '';
                  return !title.includes('chief executive') && !title.includes('ceo');
                });
                
                if (nonCEOProfiles.length > 0) {
                  const profileWithMultipleLocations = nonCEOProfiles.find(p => {
                    const hasMultipleLocations = 
                      (p.current_city && p.hometown) || 
                      (p.current_city && p.island) ||
                      (p.city && p.island && p.hometown);
                    const hasRealAvatar = p.avatar_url && 
                      !p.avatar_url.includes('placeholder') &&
                      p.avatar_url !== '/avatars/placeholder.svg';
                    return hasMultipleLocations && hasRealAvatar;
                  });
                  
                  if (profileWithMultipleLocations) {
                    profiles[key] = {
                      ...profileWithMultipleLocations,
                      company: profileWithMultipleLocations.current_company || profileWithMultipleLocations.company || '',
                    };
                    console.log(`✅ Found profile for ${key} (multiple locations + avatar, non-CEO):`, profileWithMultipleLocations.full_name, 'Title:', profileWithMultipleLocations.current_title, 'Avatar:', profileWithMultipleLocations.avatar_url);
                    found = true;
                    break;
                  }
                }
                
                // If no founder, prefer profile with multiple locations (San Francisco, Honolulu, Oahu)
                const profileWithMultipleLocations = data.find(p => {
                  const hasMultipleLocations = 
                    (p.current_city && p.hometown) || 
                    (p.current_city && p.island) ||
                    (p.city && p.island && p.hometown);
                  const hasRealAvatar = p.avatar_url && 
                    !p.avatar_url.includes('placeholder') &&
                    p.avatar_url !== '/avatars/placeholder.svg';
                  return hasMultipleLocations && hasRealAvatar;
                });
                
                if (profileWithMultipleLocations) {
                  profiles[key] = {
                    ...profileWithMultipleLocations,
                    company: profileWithMultipleLocations.current_company || profileWithMultipleLocations.company || '',
                  };
                  console.log(`✅ Found profile for ${key} (multiple locations + avatar):`, profileWithMultipleLocations.full_name, 'Title:', profileWithMultipleLocations.current_title, 'Avatar:', profileWithMultipleLocations.avatar_url);
                  found = true;
                  break;
                }
                
                // Prefer profile with real avatar (not placeholder)
                const profileWithAvatar = data.find(p => 
                  p.avatar_url && 
                  !p.avatar_url.includes('placeholder') &&
                  p.avatar_url !== '/avatars/placeholder.svg'
                );
                
                if (profileWithAvatar) {
                  profiles[key] = {
                    ...profileWithAvatar,
                    company: profileWithAvatar.current_company || profileWithAvatar.company || '',
                  };
                  console.log(`✅ Found profile for ${key} (with avatar):`, profileWithAvatar.full_name, 'Title:', profileWithAvatar.current_title, 'Avatar:', profileWithAvatar.avatar_url);
                  found = true;
                  break;
                }
                
                // Fallback: use the second one by creation date
                const sorted = data.sort((a, b) => {
                  const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
                  const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
                  return bDate - aDate; // Most recent first
                });
                const selectedProfile = sorted[1] || sorted[0];
                profiles[key] = {
                  ...selectedProfile,
                  company: selectedProfile.current_company || selectedProfile.company || '',
                };
                console.log(`✅ Found profile for ${key} (using second match):`, selectedProfile.full_name, 'Avatar:', selectedProfile.avatar_url);
                found = true;
                break;
              }
              
              // Find the best match (exact match preferred) for others
              const exactMatch = data.find(p => 
                p.full_name?.toLowerCase() === search.toLowerCase() ||
                p.full_name?.toLowerCase().includes(search.toLowerCase())
              );
              
              if (exactMatch) {
                // Map current_company to company for compatibility with ProfileCard
                profiles[key] = {
                  ...exactMatch,
                  company: exactMatch.current_company || exactMatch.company || '',
                };
                console.log(`✅ Found profile for ${key}:`, exactMatch.full_name, 'Avatar:', exactMatch.avatar_url);
                found = true;
                break;
              } else if (data.length > 0) {
                // Use first result if no exact match, map company field
                profiles[key] = {
                  ...data[0],
                  company: data[0].current_company || data[0].company || '',
                };
                console.log(`✅ Found profile for ${key} (partial match):`, data[0].full_name, 'Avatar:', data[0].avatar_url);
                found = true;
                break;
              }
            }
          }

          if (!found) {
            console.log(`❌ No profile found for ${key}`);
          }
        }

        setTestimonialProfiles(profiles);
      } catch (err) {
        console.error('Error loading testimonial profiles:', err);
      }
    };

    loadTestimonialProfiles();
  }, []);
  
  // Feature specific client companies
  const clientCompanyNames = [
    'Reef.ai', 
    'AEP Hawaii',
    'Vannevar Labs (Series B)',
    'One Brief (Series C)',
    'Kentik',
    'Hawaii Technology Development Corporation',
    'Bayze',
    'Honolulu Tech Week',
    'Anja Health',
    'Hohonu',
    'Terraformation',
    'Paubox'
  ];
  // Filter and sort companies to maintain the specified order
  const featuredCompanies = clientCompanyNames
    .map(name => mockCompanies.find(c => c.name === name))
    .filter((c): c is typeof mockCompanies[0] => c !== undefined);

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section with Image Background */}
      <section className="relative min-h-[60vh]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/photo1.png"
            alt="Hawaii background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Stronger light blue overlay for better text visibility */}
        <div className="absolute inset-0 w-full h-full bg-blue-500 bg-opacity-40" />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-2xl tracking-tight">
              Global <span className="text-yellow-300 font-semibold">Talent</span>, Hawai'i <span className="text-yellow-300 font-semibold">Rooted</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto font-medium drop-shadow-xl">
              A community-driven career and talent discovery platform for Hawaii, 
              connecting local talent with employers and ecosystem partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors shadow-xl"
              >
                Join the Community
              </Link>
              <Link 
                href="/profiles" 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors shadow-xl"
              >
                Browse Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              We believe in the power of Hawaii's local talent. Our platform connects 
              skilled professionals with opportunities that strengthen our islands' economy 
              and preserve our unique culture.
            </p>
          </div>

          {/* Mission Images */}
          <div className="flex flex-col md:flex-row gap-8 mb-16">
            <div className="flex-1 relative">
              <Image 
                src="/images/HTW_TalentLeadership&DJ-20.JPEG" 
                alt="Hawaii talent networking event" 
                width={600}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-40 rounded-lg"></div>
            </div>
            <div className="flex-1 relative">
              <Image 
                src="/images/HTW_TalentLeadership&DJ-10.JPEG" 
                alt="Hawaii talent networking event" 
                width={600}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-40 rounded-lg"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 border-2 border-white/30">
                <span className="text-white text-3xl filter brightness-0 invert">🌺</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Local Focus</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Dedicated to Hawaii's unique talent ecosystem and community values.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 border-2 border-white/30">
                <span className="text-white text-3xl filter brightness-0 invert">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Community Driven</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Built by and for the Hawaii community, with authentic connections.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 border-2 border-white/30">
                <span className="text-white text-3xl filter brightness-0 invert">🚀</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Growth Focused</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Empowering career growth and economic development across the islands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Talent */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Featured Talent
            </h2>
            <p className="text-lg text-gray-600">
              Discover the amazing professionals building Hawaii's future
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-primary-600 text-lg">Loading featured talent...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    onClick={handleProfileClick}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/profiles" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  View All Talent →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Clients & Employers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Our Clients & Partners
            </h2>
            <p className="text-lg text-gray-600">
              Leading defense and technology companies working with Hawaii's best talent
            </p>
          </div>

          {/* Company Carousel */}
          <div className="mb-16">
            <CompanyCarousel />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/companies" 
              className="bg-secondary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-700 transition-colors"
            >
              View All Companies →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              What our Community Says
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Austin Yoshino */}
            {(() => {
              const profile = testimonialProfiles['Austin Yoshino'];
              
              return (
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 flex flex-col h-full">
                  {/* Quote at top */}
                  <div className="mb-6">
                    <p className="text-gray-800 text-lg italic text-center">
                      "Love the vision, will use it as central source of truth for sourcing HI talent"
                    </p>
                  </div>
                  
                  {/* Profile section - aligned at bottom */}
                  {profile ? (
                    <div className="flex-grow flex flex-col justify-end">
                      <div className="flex items-end space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <img
                            src={profile.avatar_url && profile.avatar_url !== '/avatars/placeholder.svg' && !profile.avatar_url.includes('placeholder') 
                              ? profile.avatar_url 
                              : '/avatars/placeholder.svg'}
                            alt={profile.full_name || 'Profile'}
                            className="w-20 h-20 rounded-full object-cover border-[3px] border-primary-200 shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/avatars/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.full_name || 'No name'}</h3>
                          <p className="text-primary-600 font-medium text-sm mt-1 truncate">
                            {profile.current_title || 'No title'}
              </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-gray-600 text-sm truncate">{profile.company || profile.current_company || 'No company'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col justify-end">
                      <div className="flex items-end space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center border-[3px] border-primary-200 shadow-sm">
                            <span className="text-primary-600 font-bold text-xl">AY</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">Austin Yoshino</h3>
                          <p className="text-primary-600 font-medium text-sm mt-1">CEO of Anja (raised 4.5m from YC, 776)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Robert Kam */}
            {(() => {
              const profile = testimonialProfiles['Robert Kam'];
              
              return (
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 flex flex-col h-full">
                  {/* Quote at top */}
                  <div className="mb-6">
                    <p className="text-gray-800 text-lg italic text-center">
                      "Great tool, user friendly for recruiters and candidates alike."
                    </p>
                </div>
                  
                  {/* Profile section - aligned at bottom */}
                  <div className="flex-grow flex flex-col justify-end">
                    <div className="flex items-end space-x-4">
                      {/* Avatar - matches ProfileCard size */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center border-[3px] border-secondary-200 shadow-sm">
                          <span className="text-secondary-600 font-bold text-xl">RK</span>
              </div>
            </div>
            
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">Robert Kam</h3>
                        <p className="text-primary-600 font-medium text-sm mt-1 truncate">
                          Senior Federal Program Manager
              </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-gray-600 text-sm truncate">Virtru</p>
                        </div>
                </div>
                </div>
              </div>
            </div>
              );
            })()}
            
            {/* Tim Kamana */}
            {(() => {
              const profile = testimonialProfiles['Tim Kamana'];
              
              return (
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 flex flex-col h-full">
                  {/* Quote at top */}
                  <div className="mb-6">
                    <p className="text-gray-800 text-lg italic text-center">
                      "Talent Hui represents something we've been missing. A place built for Hawai'i, by people who actually understand Hawai'i."
                    </p>
                  </div>
                  
                  {/* Profile section - aligned at bottom */}
                  {profile ? (
                    <div className="flex-grow flex flex-col justify-end">
                      <div className="flex items-end space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <img
                            src={profile.avatar_url && profile.avatar_url !== '/avatars/placeholder.svg' && !profile.avatar_url.includes('placeholder') 
                              ? profile.avatar_url 
                              : '/avatars/placeholder.svg'}
                            alt={profile.full_name || 'Profile'}
                            className="w-20 h-20 rounded-full object-cover border-[3px] border-primary-200 shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/avatars/placeholder.svg';
                            }}
                          />
                </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.full_name || 'No name'}</h3>
                          <p className="text-primary-600 font-medium text-sm mt-1 truncate">
                            {profile.current_title || 'No title'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-gray-600 text-sm truncate">{profile.company || profile.current_company || 'No company'}</p>
                </div>
              </div>
            </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col justify-end">
                      <div className="flex items-end space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center border-[3px] border-accent-200 shadow-sm">
                            <span className="text-accent-600 font-bold text-xl">TK</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">Timothy Kamanā</h3>
                          <p className="text-primary-600 font-medium text-sm mt-1">Talent at Onebrief</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white text-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Connect?
          </h2>
          <p className="text-xl text-primary-600 mb-8 max-w-2xl mx-auto">
            Join Hawaii's premier talent platform and discover your next opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/about" 
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-600 hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
