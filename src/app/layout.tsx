import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  metadataBase: new URL('https://alexnwoko.com'),
  title: {
    default: 'Alex Nwoko, Disaster Risk and Humanitarian Data Systems Architect',
    template: '%s | Alex Nwoko',
  },
  description:
    "Disaster risk and humanitarian data systems architect. Global Disaster Data Expert at UNDRR in Bonn, bringing the disaster-risk perspective to DELTA Resilience, UNDRR's system for tracking disaster losses and damages across 85 countries, and framing how its losses and damages record is enriched to drive predictable climate action, early warning, emergency response, and long-term resilience and recovery.",
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
    title: 'Alex Nwoko, Disaster Risk and Humanitarian Data Systems Architect',
    description:
      'Building the data systems behind disaster risk reduction and humanitarian response across six countries.',
    url: 'https://alexnwoko.com',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://alexnwoko.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Alex Nwoko, Disaster Risk and Humanitarian Data Systems Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Nwoko, Disaster Risk and Humanitarian Data Systems Architect',
    description:
      'Building the data systems behind disaster risk reduction and humanitarian response across six countries.',
    images: ['https://alexnwoko.com/opengraph-image'],
    creator: '@alexnwoko',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: [
      'OwRd5wI0J7U0beCd7xALUteOCUO8rnztXxd6miXtsjA',
      'ptMfpGKSTlvV2mJ-c-waZdKhO43SrJ9h4gr3i-ZNW7s',
    ],
  },
}

/**
 * Site-wide JSON-LD: identifies the website to search engines and ties it
 * to the Person entity (Alex Nwoko). Feeds Google's Knowledge Graph
 * attribution and improves brand SERP appearance.
 *
 * Content is fully internal, defined as a static literal at build time,
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
        'Portfolio of Alex Nwoko, Disaster Risk and Humanitarian Data Systems Architect.',
      inLanguage: 'en',
      publisher: { '@id': 'https://alexnwoko.com/#person' },
    },
    {
      '@type': 'Person',
      '@id': 'https://alexnwoko.com/#person',
      name: 'Alex Nwoko',
      url: 'https://alexnwoko.com',
      jobTitle: 'Disaster Risk and Humanitarian Data Systems Architect',
      worksFor: {
        '@type': 'Organization',
        name: 'United Nations Office for Disaster Risk Reduction (UNDRR)',
        url: 'https://www.undrr.org/',
      },
      description:
        "Global Disaster Data Expert in the Risk Knowledge Branch of UNDRR's Bonn office, and disaster-data subject-matter expert in the DELTA Resilience product team. A decade building disaster risk reduction and humanitarian data infrastructure across Afghanistan, Bangladesh, Ethiopia, Nigeria, Switzerland and Germany.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon / icon links are auto-emitted by Next.js from the
            convention files at src/app/{favicon.ico,icon.svg,apple-icon.png}.
            No manual <link> tags needed. */}
        <JsonLd data={SITE_JSON_LD} />
      </head>
      <body className="bg-beige-100 text-coffee-light antialiased">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
