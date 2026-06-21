import type { Metadata } from 'next'
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

export default function ContactPage() {
  return <ContactClient />
}
