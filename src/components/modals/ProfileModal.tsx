'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ProfileModalProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ profile, isOpen, onClose }: ProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullProfile, setFullProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen && profile) {
      loadFullProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, profile]);

  const loadFullProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setFullProfile(profile); // Fallback to passed profile
      } else {
        setFullProfile(data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setFullProfile(profile);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !profile) return null;

  const displayProfile = fullProfile || profile;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-primary-600">Loading profile...</div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {displayProfile.avatar_url ? (
                      <Image
                        src={displayProfile.avatar_url}
                        alt={displayProfile.full_name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {displayProfile.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {displayProfile.full_name || 'No name provided'}
                    </h3>
                    {displayProfile.current_title && (
                      <p className="text-lg text-gray-600">{displayProfile.current_title}</p>
                    )}
                    {(displayProfile.company || displayProfile.current_company) && (
                      <p className="text-gray-500">{displayProfile.company || displayProfile.current_company}</p>
                    )}
                    {(displayProfile.current_city || displayProfile.island || displayProfile.city || displayProfile.hometown) && (
                      <p className="text-sm text-gray-500">
                        {displayProfile.current_city || [displayProfile.city, displayProfile.island].filter(Boolean).join(', ')}
                        {displayProfile.hometown && displayProfile.hometown !== displayProfile.current_city && (
                          <span className="text-gray-400"> (from {displayProfile.hometown})</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {displayProfile.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-700 leading-relaxed">{displayProfile.bio}</p>
                  </div>
                )}

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(displayProfile.college || displayProfile.school || displayProfile.high_school) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Education</h4>
                      {displayProfile.college && (
                        <p className="text-gray-700 font-medium">{displayProfile.college}</p>
                      )}
                      {!displayProfile.college && displayProfile.school && (
                        <p className="text-gray-700 font-medium">{displayProfile.school}</p>
                      )}
                      {displayProfile.high_school && (
                        <p className="text-gray-600 text-sm mt-1">High School: {displayProfile.high_school}</p>
                      )}
                    </div>
                  )}
                  
                  {displayProfile.pay_band !== null && displayProfile.pay_band !== undefined && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Pay Band</h4>
                      <p className="text-gray-700">
                        {displayProfile.pay_band === 0 && 'Unemployed'}
                        {displayProfile.pay_band === 1 && '$10k - $20k'}
                        {displayProfile.pay_band === 2 && '$30k - $50k'}
                        {displayProfile.pay_band === 3 && '$50k - $70k'}
                        {displayProfile.pay_band === 4 && '$70k - $90k'}
                        {displayProfile.pay_band === 5 && '$90k - $110k'}
                        {displayProfile.pay_band === 6 && '$110k - $130k'}
                        {displayProfile.pay_band === 7 && '$130k - $150k'}
                        {displayProfile.pay_band === 8 && '$150k+'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(displayProfile.linkedin_url || displayProfile.github_url || displayProfile.twitter_url) && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Links</h4>
                    <div className="flex flex-wrap gap-3">
                      {displayProfile.linkedin_url && (
                        <a
                          href={displayProfile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      
                      {displayProfile.github_url && (
                        <a
                          href={displayProfile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      
                      {displayProfile.twitter_url && (
                        <a
                          href={displayProfile.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-400 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {displayProfile.email && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Contact</h4>
                    <a
                      href={`mailto:${displayProfile.email}`}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      {displayProfile.email}
                    </a>
                  </div>
                )}

                {/* Profile Metadata */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Profile created {new Date(displayProfile.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      displayProfile.visibility 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {displayProfile.visibility ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
