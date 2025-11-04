'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import ProfileForm from '@/components/forms/ProfileForm';
import ProfileCard from '@/components/cards/ProfileCard';
import { Profile } from '@/types';

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePreview, setProfilePreview] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSave = () => {
    // Redirect to profiles page after successful save
    router.push('/profiles');
  };

  const handleFormDataChange = useCallback((data: any) => {
    // Update the preview with the current form data
    setProfilePreview({
      id: data.id || '1',
      username: data.username || '',
      full_name: data.full_name || '',
      avatar_url: data.avatar_url || '/avatars/placeholder.svg',
      current_title: data.current_title || '',
      company: data.company || '',
      island: data.island || '',
      city: data.city || '',
      current_city: data.current_city || '',
      hometown: data.hometown || '',
      school: data.school || '',
      high_school: data.high_school || '',
      college: data.college || '',
      bio: data.bio || '',
      linkedin_url: data.linkedin_url || '',
      github_url: data.github_url || '',
      twitter_url: data.twitter_url || '',
      pay_band: data.pay_band || 0,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Update your information to help others discover your talent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <ProfileForm onSave={handleSave} onFormDataChange={handleFormDataChange} />
          </div>

          {/* Preview Section - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <p className="text-sm text-gray-600 mb-4">
                This is how your profile will appear to others
              </p>
              {profilePreview ? (
                <ProfileCard profile={profilePreview} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <p className="text-gray-500 text-center">
                    Start editing to see your profile preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
