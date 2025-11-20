import AdvisorCard from '@/components/ui/AdvisorCard';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16 text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AdvisorCard
              name="Zack"
              role="Advisor"
              imageSrc="https://xoazqxmfxsxyqnakzkab.supabase.co/storage/v1/object/public/avatars/2f69c640-284f-40c3-9585-f8644018f043/avatar.png"
              description="Zack is passionate about growing Hawaii's economy through talent development. With deep roots in the local tech ecosystem, he brings strategic vision and community connections to help Talent Hui connect Hawaii's best talent with meaningful opportunities."
              highlight="CEO & Founder of AEP Hawaii Founder of Talent Hui"
              fallbackInitial="Z"
              colorVariant="primary"
            />
            
            <AdvisorCard
              name="Gigi"
              role="Advisor"
              imageSrc="/images/team/gigi-headshot.jpg"
              description="Gigi brings extensive experience in talent acquisition and community building. Her expertise in connecting professionals with opportunities and understanding of Hawaii's unique business landscape helps guide Talent Hui's mission to strengthen the local talent ecosystem."
              highlight="Director of AEP Hawaii"
              fallbackInitial="G"
              colorVariant="secondary"
            />
            
            <AdvisorCard
              name="Darius"
              role="Advisor"
              imageSrc="/images/team/darius.png"
              description="Darius is a serial entrepreneur with an exceptional track record of building and scaling successful startups. With three successful Y Combinator exits under his belt, he brings unparalleled expertise in product development, fundraising, and company growth. His deep understanding of the startup ecosystem and proven ability to execute at the highest level makes him an invaluable advisor to Talent Hui as we build Hawaii's premier talent platform."
              highlight="3x Y Combinator Exits"
              fallbackInitial="D"
              colorVariant="accent"
            />
            
            <AdvisorCard
              name="Reid"
              role="Advisor"
              imageSrc="/images/team/reid.png"
              description="As Chief Operating Officer of Pre (YC 24), Reid brings extensive operational expertise and strategic insights to Talent Hui. His experience in scaling Y Combinator-backed startups helps shape our approach to building a sustainable platform that serves both talent and employers across Hawaii."
              highlight="Chief Operating Officer of Pre"
              highlightLine2="(YC 24)"
              fallbackInitial="R"
              colorVariant="primary"
            />
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-16" id="partners">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Partners</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-4">
                    <Image
                      src="/images/company_photos/aephawaii_logo.jpeg"
                      alt="AEP Hawaii logo"
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AEP Hawaii</h3>
                <p className="text-sm text-gray-600">
                  Supporting Hawaii's economic development through talent initiatives and ecosystem building.
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-4">
                    <Image
                      src="/images/company_photos/Logo1.webp"
                      alt="Nalukai logo"
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Nalukai.org</h3>
                <p className="text-sm text-gray-600">
                  Empowering Hawaii's youth with technology skills and entrepreneurial opportunities.
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-4">
                    <Image
                      src="/images/company_photos/hpu_valueslockup_color.png"
                      alt="Hawaii Pacific University logo"
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Hawaii Pacific University</h3>
                <p className="text-sm text-gray-600">
                  Preparing students for global careers while maintaining strong ties to Hawaii's community.
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-4">
                    <Image
                      src="/images/company_photos/0x0.webp"
                      alt="University of Hawaii at Manoa logo"
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">University of Hawaii at Manoa</h3>
                <p className="text-sm text-gray-600">
                  Hawaii's flagship university connecting students and alumni with career opportunities.
                </p>
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
                <strong>Email:</strong> talent@aephawaii.com
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> 808-349-1611
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
