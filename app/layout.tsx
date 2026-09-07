import type { Metadata, Viewport } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'BrandToPost Command Center',
  description:
    'A Linear-style product execution command center and roadmap manager to track features, release sprints, specifications, and daily targets.',
  applicationName: 'BrandToPost',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BrandToPost',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'BrandToPost Command Center',
    description:
      'A Linear-style product execution command center and roadmap manager to track features, release sprints, specifications, and daily targets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandToPost Command Center',
    description:
      'A Linear-style product execution command center and roadmap manager to track features, release sprints, specifications, and daily targets.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={interTight.variable} suppressHydrationWarning>
      <body
        className={`${interTight.className} antialiased selection:bg-blue-600 selection:text-white font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
