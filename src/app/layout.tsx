import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://alexnwoko.com'),
  title: {
    default: 'Alex Nwoko — Humanitarian Systems Architect',
    template: '%s | Alex Nwoko',
  },
  description:
    'Building the data systems behind humanitarian response across six countries. Expertise in data analytics, GIS, climate risk, and cash transfer programming.',
  keywords: [
    'humanitarian data',
    'information management',
    'GIS',
    'remote sensing',
    'climate analytics',
    'anticipatory action',
    'cash transfer programming',
    'Power BI',
    'data visualization',
    'UNICEF',
    'iMMAP',
    'IOM',
    'WFP',
  ],
  authors: [{ name: 'Alex Nwoko' }],
  openGraph: {
    title: 'Alex Nwoko — Humanitarian Systems Architect',
    description:
      'Building the data systems behind humanitarian response across six countries.',
    url: 'https://alexnwoko.com',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Nwoko — Humanitarian Systems Architect',
    description:
      'Building the data systems behind humanitarian response across six countries.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-beige-100 text-coffee-light antialiased">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
