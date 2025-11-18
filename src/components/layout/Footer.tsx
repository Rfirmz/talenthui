import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
                Talent Hui
              </div>
            </div>
            <p className="text-gray-300 max-w-md">
              Connecting Hawaii's talent with employers and ecosystem partners. 
              Building a stronger Hawaii through community-driven career discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profiles" className="text-gray-300 hover:text-white transition-colors">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-300 hover:text-white transition-colors">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-gray-300 hover:text-white transition-colors">
                  Schools
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-gray-300 hover:text-white transition-colors">
                  Cities
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="text-gray-300 hover:text-white transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about#partners" className="text-gray-300 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Talent Hui. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-2 text-white text-sm">
              <span>Powered by</span>
              <a 
                href="https://www.aephawaii.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://oihana.org/wp-content/uploads/group-avatars/180/686efa5068c7e-bpfull.png"
                  alt="AEP Hawaii"
                  width={60}
                  height={60}
                  className="h-8 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
