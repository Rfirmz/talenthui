import Link from 'next/link';
import { mockProfiles } from '@/data/profiles';
import { mockCompanies } from '@/data/companies';
import ProfileCard from '@/components/cards/ProfileCard';
import CompanyCard from '@/components/cards/CompanyCard';
import VideoBackground from '@/components/ui/VideoBackground';
import CompanyCarousel from '@/components/ui/CompanyCarousel';

export default function HomePage() {
  const featuredProfiles = mockProfiles.slice(0, 6);
  const featuredCompanies = mockCompanies.slice(0, 6);

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[60vh]">
        {/* Direct video element for testing */}
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          <source src="/videos/hawaii-background.mp4" type="video/mp4" />
        </video>
        
        {/* Stronger light blue overlay for better text visibility */}
        <div className="absolute inset-0 w-full h-full bg-blue-500 bg-opacity-40" />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-2xl tracking-tight uppercase">
              CONNECTING HAWAII'S{' '}
              <span className="text-yellow-300 font-semibold">TALENT</span>
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
              <img 
                src="/images/photo1.png" 
                alt="Hawaii landscape" 
                className="w-full h-64 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-40 rounded-lg"></div>
            </div>
            <div className="flex-1 relative">
              <img 
                src="/images/photo2.png" 
                alt="Hawaii landscape" 
                className="w-full h-64 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-40 rounded-lg"></div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
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
        </div>
      </section>

      {/* Top Employers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Top Employers
            </h2>
            <p className="text-lg text-gray-600">
              Leading companies hiring Hawaii's best talent
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
              What Our Community Says
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4">
                "Talent Hui helped me connect with amazing local companies. 
                The community feel is exactly what I was looking for."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-bold">JD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4">
                "As a hiring manager, I love how Talent Hui connects me with 
                qualified local candidates who understand our culture."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-secondary-600 font-bold">SK</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Kim</p>
                  <p className="text-sm text-gray-600">HR Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4">
                "The platform showcases Hawaii's incredible talent pool. 
                It's inspiring to see so many skilled professionals here."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent-600 font-bold">MC</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">UX Designer</p>
                </div>
              </div>
            </div>
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
    </div>
  );
}
