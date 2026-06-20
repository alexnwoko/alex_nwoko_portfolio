import type { Metadata } from 'next'
import HomeClient from './HomeClient'

/**
 * Server-component wrapper for the homepage.
 *
 * The interactive page lives in HomeClient.tsx (marked 'use client').
 * This wrapper exists so we can export per-page metadata, which Next.js
 * does not allow on client components. The canonical URL here is what
 * tells Google that https://alexnwoko.com/ is the primary URL (not
 * https://www.alexnwoko.com/), resolving the "Duplicate without
 * user-selected canonical" report in Search Console.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://alexnwoko.com' },
}

export default function HomePage() {
  return <HomeClient />
}
