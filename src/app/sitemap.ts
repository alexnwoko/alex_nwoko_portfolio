import type { MetadataRoute } from 'next'

/**
 * Sitemap.
 *
 * Two-tier structure:
 *   - Static pages (with curated priority + change-frequency)
 *   - Blog posts (priority 0.8, monthly, real publication date)
 *   - Topic pillar pages (priority 0.9, weekly — strong topical hubs)
 *
 * Post publication dates are stored locally as a slug -> ISO map so we can
 * emit a meaningful `lastmod` without importing the full post tree.
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
  'the-case-for-anticipatory-cash',
  'measuring-joint-response-for-cash-transfer',
  'geoai-for-humanitarians',
  'the-im-coordination-trap',
  // DRR series
  'invisible-disasters-invisible-funding',
  'disaster-loss-data-climate-adaptation',
  'building-systems-governments-can-own',
  'desinventar-to-delta-resilience',
  'g-drsf-statisticians-disaster-managers',
  'delta-resilience-early-warning-anticipatory-action',
  'data-ecosystem-maturity-assessment-guide',
  'lessons-six-countries',
  'politics-of-humanitarian-data-infrastructure',
  // COP31 series
  'road-to-antalya-ncqg',
  'loss-and-damage-fund-make-or-break-year',
  'delta-grade-data-currency-of-climate-finance',
  'from-early-warning-to-early-money',
  'belem-adaptation-indicators-data-test',
  'cop31-data-making-the-case',
  // Disaster Data Diplomacy series
  'disaster-data-diplomacy',
  'disaster-data-diplomacy-in-fragility',
  // Data poverty & equity (2-part series)
  'protected-into-invisibility-part-1',
  'data-poverty-fragility-data-equity-part-2',
]

/**
 * Approximate publication date per post, in ISO format. Drives the sitemap
 * `lastmod` field so search engines see meaningful freshness signals.
 * Falls back to `now` for slugs without a recorded date.
 */
const POST_PUBLISHED_AT: Record<string, string> = {
  // 2024 / early 2025 (founder reflections + older voice series)
  'from-humanitarian-data-to-digitising-africas-markets': '2025-02-15',
  'why-i-build-systems-not-dashboards': '2024-09-10',
  'lessons-six-countries': '2024-11-05',
  'the-72-hour-problem': '2024-08-22',
  'the-im-coordination-trap': '2024-10-18',
  'the-case-for-anticipatory-cash': '2024-09-26',
  'measuring-joint-response-for-cash-transfer': '2025-01-14',
  'geoai-for-humanitarians': '2024-11-30',
  'building-systems-governments-can-own': '2025-03-08',
  'politics-of-humanitarian-data-infrastructure': '2025-04-02',
  // Voice AI series — 2025
  'voice-is-the-future-of-humanitarian-data': '2025-05-12',
  'the-form-is-already-dead': '2025-05-20',
  'africa-will-define-voice-ai': '2025-06-04',
  'voice-powered-decision-intelligence': '2025-06-16',
  'the-voices-our-data-systems-silence': '2025-07-08',
  'voice-infrastructure-inequality': '2025-07-22',
  'building-voice-native-evidence-systems': '2025-08-05',
  // Agentic IM
  'future-of-humanitarian-im-is-agentic': '2025-09-12',
  // DRR series — late 2025 / early 2026
  'disaster-loss-data-climate-adaptation': '2025-10-08',
  'invisible-disasters-invisible-funding': '2025-11-04',
  'desinventar-to-delta-resilience': '2025-12-02',
  'g-drsf-statisticians-disaster-managers': '2026-01-15',
  'delta-resilience-early-warning-anticipatory-action': '2026-02-10',
  'data-ecosystem-maturity-assessment-guide': '2026-03-03',
  // COP31 + Disaster Data Diplomacy + Data Equity batch — April/May 2026
  'road-to-antalya-ncqg': '2026-04-06',
  'loss-and-damage-fund-make-or-break-year': '2026-04-14',
  'delta-grade-data-currency-of-climate-finance': '2026-04-22',
  'from-early-warning-to-early-money': '2026-05-01',
  'belem-adaptation-indicators-data-test': '2026-05-09',
  'cop31-data-making-the-case': '2026-05-16',
  'disaster-data-diplomacy': '2026-05-22',
  'disaster-data-diplomacy-in-fragility': '2026-05-28',
  'protected-into-invisibility-part-1': '2026-06-04',
  'data-poverty-fragility-data-equity-part-2': '2026-06-05',
}

/**
 * Topic pillar pages — high-priority hubs that aggregate the corpus by
 * theme. Strong internal-linking targets for SEO and clean landing pages
 * for AI-engine citations.
 */
const TOPIC_SLUGS: string[] = [
  'cop31',
  'disaster-risk-data',
  'early-warning',
  'humanitarian-data',
  'information-management',
]

/**
 * Static top-level pages with their relative SEO importance.
 * Higher priority + more frequent change-freq = stronger crawl signal.
 *
 * The five core positioning pages (about / expertise / projects /
 * innovations / founder-journey) are pinned at priority 1.0 with weekly
 * change-frequency. They're the surfaces a recruiter, journalist, or
 * consulting prospect lands on first — Google should treat them as
 * peers of the homepage in crawl frequency.
 */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/expertise', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/projects', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/innovations', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/founder-journey', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/topics', priority: 0.9, changeFrequency: 'weekly' },
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

  const topicEntries: MetadataRoute.Sitemap = TOPIC_SLUGS.map((slug) => ({
    url: `${BASE_URL}/topics/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => {
    const isoDate = POST_PUBLISHED_AT[slug]
    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: isoDate ? new Date(isoDate) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })

  return [...staticEntries, ...topicEntries, ...blogEntries]
}
