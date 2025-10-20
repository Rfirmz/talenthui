import { mockProfiles } from '@/data/profiles';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = mockProfiles.find(p => p.username === params.username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.full_name}</h1>
              <p className="text-xl text-primary-600 font-semibold mb-2">{profile.current_title}</p>
              <p className="text-lg text-gray-600 mb-2">{profile.company}</p>
              <p className="text-gray-500 mb-4">{profile.city}, {profile.island}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profile.school}
                </span>
                <span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${profile.pay_band.toLocaleString()}+
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  GitHub
                </a>
              )}
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{profile.city}, {profile.island}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-600">{profile.school}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Current Role</h3>
              <p className="text-gray-600">{profile.current_title} at {profile.company}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Salary Range</h3>
              <p className="text-gray-600">${profile.pay_band.toLocaleString()}+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
