import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ContactClient from './ContactClient'

/**
 * Server-component wrapper so we can export metadata + canonical for
 * /contact. The interactive form lives in ContactClient.tsx.
 */
export const metadata: Metadata = {
  title: 'Contact, Alex Nwoko',
  description:
    'Get in touch about consulting on humanitarian data systems, disaster risk reduction, climate analytics, GIS, or cash transfer programming.',
  alternates: { canonical: 'https://alexnwoko.com/contact' },
}

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://alexnwoko.com' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://alexnwoko.com/contact' },
  ],
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <ContactClient />
    </>
  )
}
