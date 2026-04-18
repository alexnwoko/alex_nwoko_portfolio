import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://alexnwoko.com'),
  title: {
    default: 'Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect',
    template: '%s | Alex Nwoko',
  },
  description:
    'Building the data systems behind disaster risk reduction and humanitarian response across six countries. Expertise in disaster loss data, DELTA Resilience, Sendai Framework reporting, GIS, climate analytics, anticipatory action, and cash transfer programming.',
  keywords: [
    'disaster risk reduction',
    'DRR',
    'disaster loss data',
    'DELTA Resilience',
    'Sendai Framework',
    'G-DRSF',
    'humanitarian data',
    'information management',
    'GIS',
    'remote sensing',
    'climate analytics',
    'anticipatory action',
    'early warning systems',
    'cash transfer programming',
    'data ecosystem maturity',
    'Power BI',
    'data visualization',
    'UNDRR',
    'UNICEF',
    'iMMAP',
    'IOM',
    'WFP',
    'OCHA',
  ],
  authors: [{ name: 'Alex Nwoko' }],
  openGraph: {
    title: 'Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect',
    description:
      'Building the data systems behind disaster risk reduction and humanitarian response across six countries.',
    url: 'https://alexnwoko.com',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect',
    description:
      'Building the data systems behind disaster risk reduction and humanitarian response across six countries.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Site-wide JSON-LD: identifies the website to search engines and ties it
 * to the Person entity (Alex Nwoko). Feeds Google's Knowledge Graph
 * attribution and improves brand SERP appearance.
 *
 * Content is fully internal — defined as a static literal at build time,
 * no user input flows in. The dangerouslySetInnerHTML usage is safe; we
 * additionally escape `</` to defence-in-depth against script-tag breakout.
 */
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://alexnwoko.com/#website',
      url: 'https://alexnwoko.com',
      name: 'Alex Nwoko',
      description:
        'Portfolio of Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect.',
      inLanguage: 'en',
      publisher: { '@id': 'https://alexnwoko.com/#person' },
    },
    {
      '@type': 'Person',
      '@id': 'https://alexnwoko.com/#person',
      name: 'Alex Nwoko',
      url: 'https://alexnwoko.com',
      jobTitle: 'Disaster Risk and Humanitarian Data Systems Architect',
      description:
        'Disaster risk and humanitarian data systems architect with a decade of experience building data infrastructure across Afghanistan, Bangladesh, Ethiopia, Nigeria, and Switzerland.',
      knowsAbout: [
        'Disaster Risk Reduction',
        'DELTA Resilience',
        'Sendai Framework',
        'G-DRSF',
        'Humanitarian Data Systems',
        'Information Management',
        'GIS',
        'Climate Analytics',
        'Anticipatory Action',
        'Cash Transfer Programming',
        'Voice AI',
      ],
      sameAs: [
        'https://www.linkedin.com/in/alex-nwoko/',
        'https://github.com/alex-nwoko',
      ],
    },
  ],
}

const SITE_JSON_LD_STRING = JSON.stringify(SITE_JSON_LD).replace(/<\//g, '<\\/')

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SITE_JSON_LD_STRING }}
        />
      </head>
      <body className="bg-beige-100 text-coffee-light antialiased">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
