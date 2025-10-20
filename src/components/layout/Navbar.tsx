'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Tribal Pattern Top Bar with Navigation Overlay */}
      <div className="relative">
        <div className="tribal-pattern"></div>
        
        {/* Navigation Overlay */}
        <nav className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 py-4">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-xl shadow-md">
                  Talent Hui
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/profiles" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                Talent
              </Link>
              <Link 
                href="/companies" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                Companies
              </Link>
              <Link 
                href="/schools" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                Schools
              </Link>
              <Link 
                href="/cities" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                Cities
              </Link>
              <Link 
                href="/about" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-primary-600 hover:text-primary-700 px-5 py-3 text-base font-semibold transition-all duration-200 bg-white bg-opacity-90 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary-600 text-white px-6 py-3 rounded-lg text-base font-black hover:bg-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-black text-shadow-lg"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary-600 hover:text-primary-700 focus:outline-none focus:text-primary-700 bg-white bg-opacity-90 backdrop-blur-md p-3 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-black"
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
            <div className="px-4 pt-4 pb-4 space-y-2 sm:px-4 bg-white bg-opacity-95 backdrop-blur-md shadow-2xl border-2 border-black">
              <Link 
                href="/profiles" 
                className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Talent
              </Link>
              <Link 
                href="/companies" 
                className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              <Link 
                href="/schools" 
                className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Schools
              </Link>
              <Link 
                href="/cities" 
                className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Cities
              </Link>
              <Link 
                href="/about" 
                className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-primary-200 pt-4">
                <Link 
                  href="/login" 
                  className="text-primary-600 hover:text-primary-700 block px-5 py-4 rounded-lg text-lg font-black transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-black text-shadow-md"
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
              </div>
            </div>
          </div>
        )}
        </nav>
      </div>
    </>
  );
}
