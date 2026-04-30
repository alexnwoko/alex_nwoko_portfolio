'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

/**
 * Google Analytics 4 (GA4) integration.
 *
 * This component is a no-op unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * in the build environment. To activate GA4 on the live site:
 *
 *   1. In Vercel dashboard -> Project -> Settings -> Environment Variables
 *   2. Add NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX (your Measurement ID)
 *   3. Redeploy (Deployments tab -> Redeploy latest)
 *
 * The variable is NEXT_PUBLIC_* because gtag runs in the browser and the
 * Measurement ID needs to be embedded in the client bundle. It is safe
 * to expose; GA4 Measurement IDs are public by design.
 *
 * Why this implementation:
 *
 *   - Loads the gtag library with strategy="afterInteractive" so it
 *     never blocks first paint. Lighthouse score stays clean.
 *   - Sets `send_page_view: false` on init and manually fires page_view
 *     on every route change. Next.js App Router does client-side
 *     navigation that doesn't trigger a full page load, so the default
 *     gtag behaviour misses internal navigation.
 *   - `anonymize_ip: true` strips the last octet of visitors' IPs at
 *     collection time, which is the GDPR-friendly default.
 *   - PageviewTracker is wrapped in Suspense because useSearchParams
 *     can suspend during static generation (Next.js requirement).
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * Fires a page_view event whenever the App Router pathname or search
 * params change. Mounted only when GA is configured.
 */
function PageviewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return
    const search = searchParams?.toString()
    const url = search ? `${pathname}?${search}` : pathname
    window.gtag('config', measurementId, {
      page_path: url,
    })
  }, [pathname, searchParams, measurementId])

  return null
}

export default function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker measurementId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  )
}
