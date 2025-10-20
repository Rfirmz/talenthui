export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Talent Hui
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building Hawaii's premier talent platform, connecting local professionals 
            with opportunities that strengthen our islands' economy and preserve our unique culture.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Talent Hui was born from a simple belief: Hawaii's greatest asset is its people. 
              We saw talented professionals leaving the islands for opportunities elsewhere, 
              while local companies struggled to find qualified candidates who understood 
              Hawaii's unique culture and values.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform bridges this gap by creating a community-driven ecosystem where 
              Hawaii's talent can discover meaningful opportunities close to home, and 
              employers can connect with professionals who truly understand our islands.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16" id="team">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">Z</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zack</h3>
              <p className="text-primary-600 font-medium mb-2">Project Owner</p>
              <p className="text-gray-600">AEP Hawaii</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary-600 font-bold text-2xl">D</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Darius</h3>
              <p className="text-secondary-600 font-medium mb-2">Collaborator</p>
              <p className="text-gray-600">Development Team</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-600 font-bold text-2xl">R</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reid</h3>
              <p className="text-accent-600 font-medium mb-2">Collaborator</p>
              <p className="text-gray-600">Development Team</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">AS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Auston Stewart</h3>
              <p className="text-primary-600 font-medium mb-2">Partner</p>
              <p className="text-gray-600">Nalukai.org</p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-16" id="partners">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Partners</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="bg-primary-100 rounded-lg p-4 mb-2">
                  <span className="text-primary-600 font-bold text-lg">AEP</span>
                </div>
                <p className="text-sm text-gray-600">AEP Hawaii</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-100 rounded-lg p-4 mb-2">
                  <span className="text-accent-600 font-bold text-lg">NLK</span>
                </div>
                <p className="text-sm text-gray-600">Nalukai.org</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary-100 rounded-lg p-4 mb-2">
                  <span className="text-secondary-600 font-bold text-lg">UH</span>
                </div>
                <p className="text-sm text-gray-600">University of Hawaii</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <span className="text-gray-600 font-bold text-lg">HPU</span>
                </div>
                <p className="text-sm text-gray-600">Hawaii Pacific University</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-8" id="contact">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-6">
              Have questions about Talent Hui? Want to partner with us? 
              We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Email:</strong> contact@talenthui.com
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> (808) 555-TALENT
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> Honolulu, Hawaii
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
