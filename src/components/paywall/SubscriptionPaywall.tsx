'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const VALID_PROMO_CODE = 'hawaiitalent';

export default function SubscriptionPaywall() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const router = useRouter();

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    // Simple check - if promo code matches, grant access
    if (promoCode.trim().toLowerCase() === VALID_PROMO_CODE.toLowerCase()) {
      // Store access in localStorage
      localStorage.setItem('talent_access', 'granted');
      // Redirect to profiles immediately
      window.location.href = '/profiles';
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleSubscribe = () => {
    setShowPaymentForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border-2 border-primary-200 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Full Talent Directory
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Get access to browse and search all talent profiles in Hawaii
            </p>
            
            <div className="bg-primary-50 rounded-lg p-6 mb-8">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                $100
              </div>
              <div className="text-gray-600 text-lg">per month</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access to all talent profiles</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced search and filters</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Contact information access</span>
              </div>
            </div>

            {!showPaymentForm ? (
              <>
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors mb-4"
                >
                  Subscribe Now
                </button>

                <p className="text-sm text-gray-500">
                  Cancel anytime. No commitment.
                </p>
              </>
            ) : (
              <div className="space-y-6">
                {/* Promo Code Section */}
                <div className="border-2 border-primary-200 rounded-lg p-6 bg-primary-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Have a promo code?</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError('');
                      }}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyPromo();
                        }
                      }}
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-600 text-sm mt-2">{promoError}</p>
                  )}
                </div>

                {/* Payment Form Placeholder */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Payment processing coming soon. Use promo code "hawaiitalent" for free access.
                  </p>
                </div>

                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
