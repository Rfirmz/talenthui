'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  const handleBackToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
        <div className="mb-6">
          <button
            onClick={handleBackToSignup}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sign Up
          </button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Definitions</h2>
            <p className="text-gray-700 mb-3">
              <strong>&quot;Company,&quot; &quot;we,&quot; or &quot;us&quot;</strong> refers to Talent Hui.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>&quot;User&quot;</strong> means any individual or entity using the Service.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>&quot;Content&quot;</strong> means all information, data, text, images, videos, or other materials uploaded, posted, or otherwise made available through the Service.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>&quot;Account&quot;</strong> means a User&apos;s registered account on the Service.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>&quot;Talent Profile&quot;</strong> means a profile created by a User who is talent/individual seeking opportunities.
            </p>
            <p className="text-gray-700">
              <strong>&quot;Employer Profile&quot;</strong> means a profile created by a User who is an employer, company, or organization seeking talent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-3">
              You must be at least 13 (or a higher minimum age required by your jurisdiction) to use the Service.
            </p>
            <p className="text-gray-700 mb-3">
              By creating an Account, you represent and warrant that the information you provide is accurate, current, and complete.
            </p>
            <p className="text-gray-700">
              You agree to maintain and promptly update your registration information to keep it accurate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration & Use</h2>
            <p className="text-gray-700 mb-3">
              To use certain features of the Service, you must register for an Account.
            </p>
            <p className="text-gray-700 mb-3">
              You are responsible for safeguarding your login credentials. You agree not to share your password, and you are fully responsible for all activities that occur under your Account.
            </p>
            <p className="text-gray-700">
              We may suspend or terminate your Account if you violate these Terms or any applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Content</h2>
            <p className="text-gray-700 mb-3">
              You retain ownership of any Content you submit to the Service (e.g., your profile, resume, images), but by submitting Content, you grant Talent Hui a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, host, store, reproduce, modify, publicly display, and distribute that Content in connection with operating and promoting the Service.
            </p>
            <p className="text-gray-700 mb-3">
              You are solely responsible for the Content you post; you affirm that you have all rights necessary to grant us the license above, and that your Content does not violate third-party rights.
            </p>
            <p className="text-gray-700">
              We reserve the right (but are not obligated) to monitor, remove, or refuse any Content that, in our sole discretion, violates these Terms or is objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use / Prohibited Conduct</h2>
            <p className="text-gray-700 mb-3">You agree that you will not use the Service to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Post or transmit Content that is illegal, defamatory, threatening, obscene, infringing, or otherwise objectionable;</li>
              <li>Violate the rights of others, including privacy, publicity, or intellectual property rights;</li>
              <li>Use the Service to spam, harass, or abuse other users;</li>
              <li>Attempt to gain unauthorized access to other users&apos; Accounts or the Service&apos;s systems;</li>
              <li>Use automated means (e.g., bots, scrapers) to access or interact with the Service without our prior written permission;</li>
              <li>Resell, sublicense, or commercially exploit any portion of the Service without our explicit permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payments / Fees (if applicable)</h2>
            <p className="text-gray-700 mb-3">
              If Talent Hui offers paid features (e.g., premium employer access, enhanced talent visibility), you agree to pay all applicable fees in accordance with our pricing and payment terms (as may be described more fully on our Site).
            </p>
            <p className="text-gray-700 mb-3">
              Fees are non-refundable unless otherwise stated.
            </p>
            <p className="text-gray-700">
              We reserve the right to change our pricing or payment terms at any time; but any changes will not apply to fees you have already paid for a current subscription period (unless we explicitly say otherwise).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-3">
              All rights, title, and interest in and to the Service (excluding your Content) are and will remain with Talent Hui (or its licensors), including all intellectual property rights.
            </p>
            <p className="text-gray-700">
              You agree not to copy, modify, distribute, or create derivative works of the Service or the underlying software, except as expressly permitted by us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Feedback</h2>
            <p className="text-gray-700">
              If you provide feedback (e.g., suggestions, ideas) about the Service, you grant us a perpetual, irrevocable, transferable, and sublicensable license to use that feedback without compensation to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-3">
              <strong>By You:</strong> You may close and delete your Account at any time by contacting us or via the Account settings (if provided).
            </p>
            <p className="text-gray-700 mb-3">
              <strong>By Us:</strong> We may suspend or terminate your Account or access to the Service if (i) you breach these Terms, (ii) we believe you pose a risk or liability to us, or (iii) we discontinue the Service.
            </p>
            <p className="text-gray-700">
              Upon termination, your license to use the Service ends immediately, and we may delete or deactivate your Account and Content in accordance with our data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers / &quot;As Is&quot; / No Warranty</h2>
            <p className="text-gray-700 mb-3">
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
            </p>
            <p className="text-gray-700 mb-3">
              We expressly disclaim all warranties, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, non-infringement, or title.
            </p>
            <p className="text-gray-700">
              We do not guarantee that the Service will be uninterrupted, secure, or free from errors or viruses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-3">
              To the maximum extent permitted by law, in no event will Talent Hui, its officers, employees, agents, or partners be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-3">
              <li>Any indirect, incidental, special, punitive, or consequential damages;</li>
              <li>Any loss of profits, data, or business;</li>
              <li>Any claim arising from your use (or inability to use) the Service;</li>
            </ul>
            <p className="text-gray-700">
              Our total liability for all claims arising out of or relating to these Terms or your use of the Service will not exceed the total amount you paid us (if any) in the 12 months prior to the claim (or, if you haven&apos;t paid, a nominal amount, e.g., US$100, whichever is greater).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Talent Hui and its officers, directors, employees, agents, and partners from and against any and all claims, liabilities, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with: (i) your Content, (ii) your use of the Service, or (iii) your breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to the Terms</h2>
            <p className="text-gray-700 mb-3">
              We may modify these Terms at any time. If we make material changes, we will try to notify you (e.g., by email or via the Service).
            </p>
            <p className="text-gray-700 mb-3">
              By continuing to use the Service after changes take effect, you agree to the updated Terms.
            </p>
            <p className="text-gray-700">
              We may also require you to re-accept the Terms (e.g., when logging in) before you can continue using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law & Dispute Resolution</h2>
            <p className="text-gray-700 mb-3">
              These Terms are governed by the laws of the State of Hawaii (or whichever jurisdiction Talent Hui is incorporated / operates in), without regard to conflict-of-law principles.
            </p>
            <p className="text-gray-700">
              Any disputes arising out of or relating to these Terms or the Service will be resolved in the state or federal courts located in Honolulu county, and you consent to the personal jurisdiction of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remainder of the Terms will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Waiver</h2>
            <p className="text-gray-700">
              No waiver of any term or condition in these Terms by Talent Hui will be deemed a further or continuing waiver of such term or condition, or any other term or condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Notices / Contact</h2>
            <p className="text-gray-700 mb-3">
              If you have any questions about these Terms or want to contact us, you can reach us at:
            </p>
            <div className="text-gray-700 space-y-1">
              <p><strong>Talent Hui</strong></p>
              <p>Email: <a href="mailto:talent@aephawaii.com" className="text-primary-600 hover:text-primary-500">talent@aephawaii.com</a></p>
              <p>Mobile: <a href="tel:808-349-1611" className="text-primary-600 hover:text-primary-500">808-349-1611</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Miscellaneous</h2>
            <p className="text-gray-700 mb-3">
              <strong>Entire Agreement:</strong> These Terms (plus any documents incorporated by reference) form the entire agreement between you and Talent Hui regarding the Service.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign the Terms or delegate our obligations at any time.
            </p>
            <p className="text-gray-700">
              <strong>No Third-Party Beneficiaries:</strong> There are no third-party beneficiaries under these Terms, unless explicitly stated.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

