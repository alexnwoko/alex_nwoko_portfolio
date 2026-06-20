import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/lib/topics'
import { POSTS_META } from '@/lib/blog-posts-meta'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Topics — COP31, DRR Data, Early Warning, Humanitarian Data, IM',
  description:
    'Topic hubs curating the blog corpus by theme: COP31 and climate finance, disaster risk data, early warning and anticipatory action, humanitarian data equity, and information management.',
  keywords: [
    'COP31',
    'disaster risk data',
    'early warning systems',
    'anticipatory action',
    'humanitarian data',
    'data equity',
    'humanitarian information management',
    'DELTA Resilience',
    'Sendai Framework',
    'Alex Nwoko topics',
  ],
  alternates: { canonical: 'https://alexnwoko.com/topics' },
  openGraph: {
    title: 'Topics — Alex Nwoko',
    description:
      'COP31, disaster risk data, early warning, humanitarian data and information management — curated essays.',
    url: 'https://alexnwoko.com/topics',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics — Alex Nwoko',
    description:
      'Curated topic hubs across COP31, disaster risk data, early warning, humanitarian data and IM.',
  },
}

const PILLAR_ACCENT: Record<string, string> = {
  cop31: '#2E7D32',
  'disaster-risk-data': '#2E7D32',
  'early-warning': '#8B3A2F',
  'humanitarian-data': '#C4703F',
  'cash-programming': '#8B3A2F',
  'information-management': '#1565C0',
}

export default function TopicsIndexPage() {
  const publishedSlugs = new Set(
    POSTS_META.filter((p) => p.published !== false).map((p) => p.slug),
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://alexnwoko.com/topics',
    name: 'Topics — Alex Nwoko',
    description:
      'Topic hubs covering COP31, disaster risk data, early warning, humanitarian data, and information management.',
    url: 'https://alexnwoko.com/topics',
    hasPart: TOPICS.map((t) => ({
      '@type': 'WebPage',
      '@id': `https://alexnwoko.com/topics/${t.slug}`,
      name: t.title,
      url: `https://alexnwoko.com/topics/${t.slug}`,
      description: t.metaDescription,
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://alexnwoko.com' },
        { '@type': 'ListItem', position: 2, name: 'Topics', item: 'https://alexnwoko.com/topics' },
      ],
    },
  }

  return (
    <div className="pt-24 pb-16">
      <JsonLd data={jsonLd} />

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Topics</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Five threads running through a decade of work
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Curated entry points into the corpus. Each topic hub pulls together
          the essays, technical pieces, and field reflections that belong
          together, and adds a short orientation for anyone landing cold.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPICS.map((topic) => {
            const accent = PILLAR_ACCENT[topic.slug] ?? '#C4703F'
            const count = topic.postSlugs.filter((s) => publishedSlugs.has(s)).length
            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="bg-white rounded-2xl border border-beige-300 p-8 card-hover relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold mb-3"
                  style={{ color: accent }}
                >
                  {topic.shortLabel}
                </span>
                <h2 className="font-serif text-2xl text-coffee mb-3 leading-tight">{topic.title}</h2>
                <p className="text-sm text-coffee-light/80 leading-relaxed mb-4 flex-grow">
                  {topic.tagline}
                </p>
                <div className="flex items-center justify-between text-xs text-coffee-muted pt-3 border-t border-beige-200">
                  <span>{count} {count === 1 ? 'essay' : 'essays'}</span>
                  <span className="text-dusty-orange font-medium">Explore →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
