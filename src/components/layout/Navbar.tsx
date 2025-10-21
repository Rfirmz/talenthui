'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle authentication state
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Solid Color Header with Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 py-4">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-xl shadow-md">
                  <Image
                    src="/images/hawaii.png"
                    alt="Hawaii"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span>Talent Hui</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/profiles" 
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black ${isActive('/profiles') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
              >
                Talent
              </Link>
              <Link 
                href="/companies" 
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black ${isActive('/companies') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
              >
                Companies
              </Link>
              <Link 
                href="/schools" 
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black ${isActive('/schools') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
              >
                Schools
              </Link>
              <Link 
                href="/cities" 
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black ${isActive('/cities') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
              >
                Cities
              </Link>
              <Link 
                href="/about" 
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black ${isActive('/about') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
              >
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="text-primary-600 px-5 py-3 text-base font-semibold">
                  Loading...
                </div>
              ) : user ? (
                <>
                  <Link 
                    href="/profile/edit" 
                    className="text-primary-600 hover:text-primary-800 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg text-base font-black hover:bg-red-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-black text-shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-primary-600 hover:text-primary-800 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-black"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg text-base font-black hover:bg-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-black text-shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary-600 hover:text-primary-800 focus:outline-none focus:text-primary-800 bg-white p-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-black"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-4 space-y-2 sm:px-4 bg-white shadow-lg border border-gray-200">
              <Link 
                href="/profiles" 
                className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/profiles') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Talent
              </Link>
              <Link 
                href="/companies" 
                className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/companies') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              <Link 
                href="/schools" 
                className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/schools') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Schools
              </Link>
              <Link 
                href="/cities" 
                className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/cities') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cities
              </Link>
              <Link 
                href="/about" 
                className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/about') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-primary-200 pt-4">
                {isLoading ? (
                  <div className="text-primary-600 px-5 py-4 text-lg font-semibold">
                    Loading...
                  </div>
                ) : user ? (
                  <>
                    <Link 
                      href="/profile/edit" 
                      className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/profile/edit') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-600 text-white block px-5 py-4 rounded-lg text-lg font-black hover:bg-red-700 mt-2 transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-lg w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className={`block px-5 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black ${isActive('/login') ? 'text-primary-800 border-b-8 border-b-primary-500' : 'text-primary-600 hover:text-primary-800'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-primary-600 text-white block px-5 py-4 rounded-lg text-lg font-black hover:bg-primary-700 mt-2 transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
