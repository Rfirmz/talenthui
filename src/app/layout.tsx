import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans'
});

const sourceSans3 = Source_Sans_3({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-sans-3'
});

export const metadata: Metadata = {
  title: 'Talent Hui - Connecting Hawaii\'s Talent',
  description: 'A community-driven career and talent discovery platform for Hawaii, connecting local talent with employers and ecosystem partners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSans.variable} ${sourceSans3.variable} font-sans`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          {/* Tribal Pattern Section */}
          <div className="tribal-pattern"></div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
