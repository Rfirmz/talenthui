'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export default function TestSupabasePage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Load all profiles (including private ones for testing)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          setError(`Error loading profiles: ${profilesError.message}`);
        } else {
          setProfiles(profilesData || []);
        }
        
        // Test database connection
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
          
        if (testError) {
          setTestResult(`❌ Database connection failed: ${testError.message}`);
        } else {
          setTestResult('✅ Database connection successful');
        }
        
      } catch (err: any) {
        setError(`Unexpected error: ${err.message}`);
        setTestResult('❌ Unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const testInsert = async () => {
    try {
      const testProfile = {
        full_name: 'Test User',
        bio: 'This is a test profile to verify Supabase is working',
        island: 'Oahu',
        city: 'Honolulu',
        visibility: true,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([testProfile])
        .select();

      if (error) {
        setTestResult(`❌ Insert test failed: ${error.message}`);
      } else {
        setTestResult('✅ Insert test successful - data stored in Supabase');
        // Reload profiles to show the new test profile
        const { data: newProfiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        setProfiles(newProfiles || []);
      }
    } catch (err: any) {
      setTestResult(`❌ Insert test failed: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supabase Data Test</h1>
          <p className="mt-2 text-gray-600">
            This page tests whether Supabase is properly storing and retrieving data.
          </p>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Test</h2>
          <div className="mb-4">
            <p className="text-lg">{testResult}</p>
          </div>
          
          <button
            onClick={testInsert}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Test Data Insert
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current User</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-600">No user logged in</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Profiles Data */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profiles in Database ({profiles.length})
          </h2>
          
          {profiles.length > 0 ? (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>ID:</strong> {profile.id}</p>
                      <p><strong>Name:</strong> {profile.full_name || 'N/A'}</p>
                      <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                      <p><strong>Island:</strong> {profile.island || 'N/A'}</p>
                      <p><strong>City:</strong> {profile.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Company:</strong> {profile.company || 'N/A'}</p>
                      <p><strong>Title:</strong> {profile.current_title || 'N/A'}</p>
                      <p><strong>School:</strong> {profile.school || 'N/A'}</p>
                      <p><strong>Visibility:</strong> {profile.visibility ? 'Public' : 'Private'}</p>
                      <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {profile.bio && (
                    <div className="mt-2">
                      <p><strong>Bio:</strong> {profile.bio}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No profiles found in database</p>
          )}
        </div>
      </div>
    </div>
  );
}
