'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export interface ProfileData {
  full_name: string;
  avatar_url: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  email: string;
  island: string;
  city: string;
  current_city: string;
  hometown: string;
  school: string;
  high_school: string;
  college: string;
  current_title: string;
  company: string;
  pay_band: number | null;
  visibility: boolean;
}

const ISLANDS = ['Oahu', 'Maui', 'Kauai', 'Big Island', 'Molokai', 'Lanai'];
const PAY_BANDS = [
  { value: 0, label: 'Unemployed' },
  { value: 1, label: '$10k - $20k' },
  { value: 2, label: '$30k - $50k' },
  { value: 3, label: '$50k - $70k' },
  { value: 4, label: '$70k - $90k' },
  { value: 5, label: '$90k - $110k' },
  { value: 6, label: '$110k - $130k' },
  { value: 7, label: '$130k - $150k' },
  { value: 8, label: '$150k+' },
];

export default function ProfileForm({ 
  onSave, 
  onCancel, 
  onFormDataChange 
}: { 
  onSave?: () => void; 
  onCancel?: () => void;
  onFormDataChange?: (data: ProfileData) => void;
}) {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    avatar_url: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    email: '',
    island: '',
    city: '',
    current_city: '',
    hometown: '',
    school: '',
    high_school: '',
    college: '',
    current_title: '',
    company: '',
    pay_band: null,
    visibility: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState<any>(null);

  // Notify parent component of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);

  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Try to load existing profile by user_id (more reliable than id)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          
          // If no profile found by user_id, try by id as fallback
          let profileData = profile;
          if (!profileData && !error) {
            const { data: profileById, error: errorById } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .maybeSingle();
            profileData = profileById;
          }

          if (profileData) {
            console.log('Loaded profile:', profileData);
            const newFormData = {
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || '',
              bio: profileData.bio || '',
              linkedin_url: profileData.linkedin_url || '',
              github_url: profileData.github_url || '',
              twitter_url: profileData.twitter_url || '',
              email: profileData.email || currentUser.email || '',
              island: profileData.island || '',
              city: profileData.city || '',
              current_city: profileData.current_city || '',
              hometown: profileData.hometown || '',
              school: profileData.school || '',
              high_school: profileData.high_school || '',
              college: profileData.college || '',
              current_title: profileData.current_title || '',
              company: profileData.current_company || '',
              pay_band: profileData.pay_band || null,
              visibility: profileData.visibility ?? true,
            };
            setFormData(newFormData);
            // Immediately trigger preview update
            if (onFormDataChange) {
              onFormDataChange(newFormData);
            }
          } else {
            console.log('No existing profile found, creating new profile');
            if (error) {
              console.error('Error loading profile:', error);
            }
            // Set default values for new profile
            const newFormData = {
              ...formData,
              full_name: currentUser.user_metadata?.full_name || '',
              email: currentUser.email || '',
            };
            setFormData(newFormData);
            // Immediately trigger preview update
            if (onFormDataChange) {
              onFormDataChange(newFormData);
            }
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value ? parseInt(value) : null) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (!user) {
      setError('You must be logged in to save your profile');
      setIsSaving(false);
      return;
    }

    try {
      // Map form data to database schema
      const { company, school, ...restFormData } = formData;
      
      // Build the upsert payload, explicitly mapping fields
      const upsertData: any = {
        id: user.id,
        user_id: user.id,
        full_name: restFormData.full_name || '',
        avatar_url: restFormData.avatar_url || '',
        bio: restFormData.bio || '',
        linkedin_url: restFormData.linkedin_url || '',
        github_url: restFormData.github_url || '',
        twitter_url: restFormData.twitter_url || '',
        email: restFormData.email || user.email || '',
        island: restFormData.island || '',
        city: restFormData.city || '',
        current_company: company || '',
        current_title: restFormData.current_title || '',
        pay_band: restFormData.pay_band || null,
        visibility: restFormData.visibility ?? true,
        updated_at: new Date().toISOString(),
      };
      
      // Add optional location fields
      if (restFormData.current_city) {
        upsertData.current_city = restFormData.current_city;
      }
      if (restFormData.hometown) {
        upsertData.hometown = restFormData.hometown;
      }
      
      // Add education fields - try to include them, but handle gracefully if they don't exist
      if (restFormData.high_school) {
        upsertData.high_school = restFormData.high_school;
      }
      if (restFormData.college) {
        upsertData.college = restFormData.college;
      }
      // Keep school for backward compatibility
      if (school) {
        upsertData.school = school;
      }
      
      const { error: saveError, data } = await supabase
        .from('profiles')
        .upsert(upsertData)
        .select();

      if (saveError) {
        // Check if it's a column not found error
        if (saveError.message && saveError.message.includes('column') && saveError.message.includes('does not exist')) {
          throw new Error(`Database schema is missing required columns. Please run the migration in your Supabase SQL Editor: migration-add-education-location-fields.sql\n\nOriginal error: ${saveError.message}`);
        }
        throw saveError;
      }

      setSuccessMessage('Profile saved successfully!');
      console.log('Profile saved:', data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      if (onSave) {
        onSave();
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please check the console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-primary-600 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Private)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="current_title" className="block text-sm font-medium text-gray-700 mb-1">
              Current Title
            </label>
            <input
              type="text"
              id="current_title"
              name="current_title"
              value={formData.current_title}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Marketing Manager"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="high_school" className="block text-sm font-medium text-gray-700 mb-1">
              High School
            </label>
            <input
              type="text"
              id="high_school"
              name="high_school"
              value={formData.high_school}
              onChange={handleChange}
              placeholder="e.g. Punahou School, Iolani School"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
              College / University
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. University of Hawaii at Manoa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="island" className="block text-sm font-medium text-gray-700 mb-1">
              Island
            </label>
            <select
              id="island"
              name="island"
              value={formData.island}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select an island</option>
              {ISLANDS.map(island => (
                <option key={island} value={island}>{island}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hometown" className="block text-sm font-medium text-gray-700 mb-1">
              Hometown
            </label>
            <input
              type="text"
              id="hometown"
              name="hometown"
              value={formData.hometown}
              onChange={handleChange}
              placeholder="e.g. Hilo, Kailua"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="current_city" className="block text-sm font-medium text-gray-700 mb-1">
              Current City
            </label>
            <input
              type="text"
              id="current_city"
              name="current_city"
              value={formData.current_city}
              onChange={handleChange}
              placeholder="e.g. Honolulu, Hilo, Kahului"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="url"
              id="twitter_url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pay_band" className="block text-sm font-medium text-gray-700 mb-1">
              Pay Band (Optional)
            </label>
            <select
              id="pay_band"
              name="pay_band"
              value={formData.pay_band || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select pay band</option>
              {PAY_BANDS.map(band => (
                <option key={band.value} value={band.value}>{band.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visibility"
              name="visibility"
              checked={formData.visibility}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="visibility" className="ml-2 block text-sm text-gray-900">
              Make profile public
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
