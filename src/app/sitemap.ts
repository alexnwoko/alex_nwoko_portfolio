import type { MetadataRoute } from 'next'

/**
 * All blog post slugs. Kept in sync with `blog/[slug]/page.tsx`.
 *
 * We keep this list co-located with the sitemap rather than importing from
 * the post page module to avoid pulling the entire post body (and its React
 * tree) into the sitemap build. Pure data, no dependencies.
 */
const BLOG_SLUGS: string[] = [
  // Founder & cross-cutting
  'from-humanitarian-data-to-digitising-africas-markets',
  'why-i-build-systems-not-dashboards',
  'future-of-humanitarian-im-is-agentic',
  // Voice AI series
  'voice-is-the-future-of-humanitarian-data',
  'the-form-is-already-dead',
  'africa-will-define-voice-ai',
  'voice-powered-decision-intelligence',
  'the-voices-our-data-systems-silence',
  'voice-infrastructure-inequality',
  'building-voice-native-evidence-systems',
  // Field reflections + cash + GIS series
  'the-72-hour-problem',
  'from-maiduguri-to-machine-learning',
  'the-case-for-anticipatory-cash',
  'measuring-joint-response-for-cash-transfer',
  'geoai-for-humanitarians',
  'the-im-coordination-trap',
  // DRR series
  'disaster-loss-data-climate-adaptation',
  'building-systems-governments-can-own',
  'desinventar-to-delta-resilience',
  'g-drsf-statisticians-disaster-managers',
  'delta-resilience-early-warning-anticipatory-action',
  'data-ecosystem-maturity-assessment-guide',
  'lessons-six-countries',
  'politics-of-humanitarian-data-infrastructure',
]

/**
 * Static top-level pages with their relative SEO importance.
 * Higher priority + more frequent change-freq = stronger crawl signal.
 */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/expertise', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/innovations', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/founder-journey', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/credentials', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
]

const BASE_URL = 'https://alexnwoko.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticEntries, ...blogEntries]
}
