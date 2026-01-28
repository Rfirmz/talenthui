'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'signup_form_data';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedinUrl: '',
    currentTitle: '',
    company: '',
    city: '',
    currentCity: '',
    hometown: '',
    island: '',
    school: '',
    highSchool: '',
    college: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        // Clear the stored data after restoring
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error restoring form data:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTermsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Save form data to sessionStorage before navigating
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    router.push('/terms');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Validate LinkedIn URL
    if (!formData.linkedinUrl.includes('linkedin.com')) {
      setError('Please provide a valid LinkedIn URL');
      setIsLoading(false);
      return;
    }
    
    try {
      const userMetadata = {
        full_name: formData.fullName,
        first_name: formData.fullName.split(' ')[0] || formData.fullName,
        last_name: formData.fullName.split(' ').slice(1).join(' '),
        linkedin_url: formData.linkedinUrl || '',
        current_title: formData.currentTitle || '',
        current_company: formData.company || '',
        island: formData.island || '',
        current_city: formData.currentCity || '',
        hometown: formData.hometown || '',
        high_school: formData.highSchool || '',
        college: formData.college || '',
      };

      // Sign up the user with metadata so the values are stored even if profile creation is delayed.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userMetadata,
          emailRedirectTo: 'https://talenthui.com/profile/edit',
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      let userId = signUpData.user?.id;

      // Redirect to email confirmation page and pass in email address
      router.push('/signup/confirm-email?email=' + encodeURIComponent(formData.email));
      return;

      // TODO: Move to a separate profile completion page after email confirmation?
      if (userId) {
        // Create profile entry
        const nameParts = formData.fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');

        // Generate a bio
        const title = formData.currentTitle || 'Professional';
        const company = formData.company || 'Hawaii Tech';
        const school = formData.college || formData.school || 'University';
        const location = formData.currentCity || formData.city || formData.island || 'Hawaii';
        const bio = `${title} at ${company}. ${school} alumni based in ${location}.`;

        // Build profile data, excluding fields that might not exist in schema
        const profileData: any = {
          id: userId, // Use auth user id as profile id
          user_id: userId,
          full_name: formData.fullName,
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: formData.email,
          linkedin_url: formData.linkedinUrl || '',
          current_title: formData.currentTitle || '',
          current_company: formData.company || '',
          city: formData.city || '',
          bio: bio,
          avatar_url: '/avatars/placeholder.svg',
          visibility: true,
        };
        
        // Add optional location fields if they exist
        if (formData.currentCity || formData.city) {
          profileData.current_city = formData.currentCity || formData.city;
        }
        if (formData.hometown) {
          profileData.hometown = formData.hometown;
        }
        if (formData.island) {
          profileData.island = formData.island;
        }
        if (formData.school || formData.college) {
          profileData.school = formData.school || formData.college || '';
        }
        // Only add these if they exist in schema (may not exist if migration not run)
        if (formData.highSchool) {
          profileData.high_school = formData.highSchool;
        }
        if (formData.college) {
          profileData.college = formData.college;
        }

        const { error: profileError, data: profileResult } = await supabase
          .from('profiles')
          .upsert(profileData)
          .select();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // If it's a column error, give helpful message
          if (profileError.message && profileError.message.includes('column')) {
            setError(`Profile creation failed: ${profileError.message}. Please run the migration: migration-add-education-location-fields.sql`);
          } else {
            setError('Account created but profile setup failed. Please complete your profile.');
          }
        } else {
          console.log('Profile created successfully:', profileResult);
        }

        // Clear saved form data if it exists
        sessionStorage.removeItem(STORAGE_KEY);
        // Redirect to profile edit page
        router.push('/profile/edit');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-2xl inline-block mb-4">
            Talent Hui
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-normal text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currentTitle" className="block text-sm font-medium text-gray-700">
                Current Job Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="currentTitle"
                  name="currentTitle"
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  value={formData.currentTitle}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <div className="mt-1">
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Reef.ai"
                  value={formData.company}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="island" className="block text-sm font-medium text-gray-700">
                Island <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="island"
                  name="island"
                  required
                  value={formData.island}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select Island</option>
                  <option value="Oahu">Oahu</option>
                  <option value="Maui">Maui</option>
                  <option value="Hawaii">Hawaii Island</option>
                  <option value="Kauai">Kauai</option>
                  <option value="Molokai">Molokai</option>
                  <option value="Lanai">Lanai</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hometown" className="block text-sm font-medium text-gray-700">
                  Hometown
                </label>
                <div className="mt-1">
                  <input
                    id="hometown"
                    name="hometown"
                    type="text"
                    placeholder="e.g. Hilo"
                    value={formData.hometown}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="currentCity" className="block text-sm font-medium text-gray-700">
                  Current City <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="currentCity"
                    name="currentCity"
                    type="text"
                    required
                    placeholder="e.g. Honolulu"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="highSchool" className="block text-sm font-medium text-gray-700">
                  High School
                </label>
                <div className="mt-1">
                  <input
                    id="highSchool"
                    name="highSchool"
                    type="text"
                    placeholder="e.g. Punahou School"
                    value={formData.highSchool}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                  College <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="college"
                    name="college"
                    type="text"
                    required
                    placeholder="e.g. University of Hawaii at Manoa"
                    value={formData.college}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a 
                  href="/terms" 
                  onClick={handleTermsClick}
                  className="text-primary-600 hover:text-primary-500 underline"
                >
                  Terms of Service
                </a>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
