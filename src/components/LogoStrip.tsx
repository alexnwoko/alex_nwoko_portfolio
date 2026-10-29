'use client'

import { Reveal } from './ScrollReveal'

/**
 * Reusable logo strip used for both Partners & Donors and Humanitarian
 * Clusters sections on the home and about pages. Each entry renders as a
 * styled text wordmark on a white card at consistent height (the iMMAP
 * pattern — Donors & Partners / Global Clusters strips use the same
 * approach visually).
 *
 * Why text wordmarks: downloading the actual trademarked logos reliably
 * from arbitrary CDNs in-session is not practical and raises licensing
 * questions for a personal portfolio. Styled wordmarks in the brand's
 * accent colour read as a logo at strip scale, keep the file footprint
 * tiny, and can be swapped one-for-one with real image files later by
 * swapping `wordmark` for a `src` attribute per entry — the component is
 * data-driven for exactly that reason.
 */

export type LogoEntry = {
  name: string
  wordmark: string
  color: string
  subtitle?: string
  href?: string
}

export const PARTNER_LOGOS: LogoEntry[] = [
  { name: 'USAID', wordmark: 'USAID', subtitle: 'FROM THE AMERICAN PEOPLE', color: '#002F6C', href: 'https://www.usaid.gov' },
  { name: 'UK AID', wordmark: 'UK AID', subtitle: 'FROM THE BRITISH PEOPLE', color: '#C8102E', href: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office' },
  { name: 'ECHO', wordmark: 'ECHO', subtitle: 'European Civil Protection and Humanitarian Aid', color: '#003399', href: 'https://civil-protection-humanitarian-aid.ec.europa.eu/' },
]

export const CLUSTER_LOGOS: LogoEntry[] = [
  { name: 'Shelter Cluster', wordmark: 'SHELTER', subtitle: 'Global Shelter Cluster', color: '#7B4B94' },
  { name: 'CCCM Cluster', wordmark: 'CCCM', subtitle: 'Camp Coordination & Management', color: '#C4703F' },
  { name: 'Food Security Cluster', wordmark: 'FSC', subtitle: 'Food Security Cluster', color: '#8B3A2F' },
  { name: 'Nutrition Cluster', wordmark: 'NUTRITION', subtitle: 'Global Nutrition Cluster', color: '#1CABE2' },
  { name: 'Health Cluster', wordmark: 'HEALTH', subtitle: 'Global Health Cluster', color: '#D62728' },
  { name: 'WASH Cluster', wordmark: 'WASH', subtitle: 'Water, Sanitation & Hygiene', color: '#009EDB' },
  { name: 'Protection Cluster', wordmark: 'PROTECTION', subtitle: 'Global Protection Cluster', color: '#2E7D32' },
]

function LogoCard({ logo }: { logo: LogoEntry }) {
  const body = (
    <div className="group h-24 min-w-[180px] bg-white rounded-xl border border-beige-300 px-6 py-4 flex flex-col items-center justify-center text-center transition-all hover:border-dusty-orange/60 hover:shadow-md">
      <span
        className="text-xl md:text-2xl font-bold tracking-tight transition-opacity"
        style={{ color: logo.color }}
      >
        {logo.wordmark}
      </span>
      {logo.subtitle && (
        <span className="mt-1 text-[9px] uppercase tracking-widest text-coffee-muted leading-tight">
          {logo.subtitle}
        </span>
      )}
    </div>
  )
  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={logo.name}
      >
        {body}
      </a>
    )
  }
  return body
}

export default function LogoStrip({
  heading,
  intro,
  logos,
  backgroundClassName = 'bg-beige-100',
}: {
  heading: string
  intro?: string
  logos: LogoEntry[]
  backgroundClassName?: string
}) {
  return (
    <section className={`py-16 ${backgroundClassName}`}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex items-center gap-6 mb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-coffee">{heading}</h2>
            <div className="flex-1 h-px bg-coffee/20" />
          </div>
          {intro && (
            <p className="text-sm md:text-base text-coffee-muted max-w-3xl mb-10">
              {intro}
            </p>
          )}
        </Reveal>
        <div className="flex flex-wrap gap-4 items-center justify-start">
          {logos.map((logo, i) => (
            <Reveal key={logo.name} index={i} staggerMs={60}>
              <LogoCard logo={logo} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
