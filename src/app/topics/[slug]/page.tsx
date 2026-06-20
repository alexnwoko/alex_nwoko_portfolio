import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTopic, getAllTopicSlugs, TOPICS } from '@/lib/topics'
import { POSTS_META } from '@/lib/blog-posts-meta'
import JsonLd from '@/components/JsonLd'

export function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) {
    return { title: 'Topic Not Found' }
  }
  const url = `https://alexnwoko.com/topics/${topic.slug}`
  return {
    title: topic.title,
    description: topic.metaDescription,
    keywords: topic.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: topic.title,
      description: topic.metaDescription,
      url,
      siteName: 'Alex Nwoko Portfolio',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.title,
      description: topic.metaDescription,
    },
  }
}

const PILLAR_ACCENT: Record<string, string> = {
  cop31: '#2E7D32',
  'disaster-risk-data': '#2E7D32',
  'early-warning': '#8B3A2F',
  'humanitarian-data': '#C4703F',
  'cash-programming': '#8B3A2F',
  'information-management': '#1565C0',
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const accent = PILLAR_ACCENT[topic.slug] ?? '#C4703F'
  const url = `https://alexnwoko.com/topics/${topic.slug}`

  // Resolve post metadata for the topic, in the order declared in topics.ts.
  // Drop any slugs that point at unpublished posts.
  const postLookup = new Map(POSTS_META.map((p) => [p.slug, p]))
  const posts = topic.postSlugs
    .map((s) => postLookup.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.published !== false)

  // Cross-link to other topics for internal SEO.
  const otherTopics = TOPICS.filter((t) => t.slug !== topic.slug)

  // ---------- JSON-LD ----------
  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: topic.title,
    description: topic.metaDescription,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://alexnwoko.com/#website' },
    about: topic.keywords.map((k) => ({ '@type': 'Thing', name: k })),
    hasPart: posts.map((p) => ({
      '@type': 'BlogPosting',
      '@id': `https://alexnwoko.com/blog/${p.slug}`,
      headline: p.title,
      url: `https://alexnwoko.com/blog/${p.slug}`,
      description: p.excerpt,
      author: { '@type': 'Person', name: 'Alex Nwoko', url: 'https://alexnwoko.com' },
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://alexnwoko.com' },
        { '@type': 'ListItem', position: 2, name: 'Topics', item: 'https://alexnwoko.com/topics' },
        { '@type': 'ListItem', position: 3, name: topic.shortLabel, item: url },
      ],
    },
  }

  const faqPageLd = topic.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: topic.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
    : null

  return (
    <div className="pt-24 pb-16">
      <JsonLd data={collectionPageLd} />
      {faqPageLd && <JsonLd data={faqPageLd} />}

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 mb-8 text-sm text-coffee-muted">
        <Link href="/" className="hover:text-dusty-orange transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/topics" className="hover:text-dusty-orange transition-colors">Topics</Link>
        <span className="mx-2">/</span>
        <span className="text-coffee">{topic.shortLabel}</span>
      </div>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="h-1 w-12 mb-6 rounded-full" style={{ backgroundColor: accent }} />
        <p
          className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
          style={{ color: accent }}
        >
          Topic · {topic.shortLabel}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          {topic.title}
        </h1>
        <p className="text-lg text-coffee-light/85 max-w-3xl leading-relaxed">{topic.tagline}</p>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="space-y-5 text-base text-coffee-light/90 leading-relaxed">
          {topic.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Posts in this topic */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <h2 className="font-serif text-2xl text-coffee mb-6">Essays in this topic</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl border border-beige-300 p-6 card-hover flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-coffee-muted">
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded"
                  style={{ color: post.pillarColor, backgroundColor: post.pillarColor + '10' }}
                >
                  {post.pillar}
                </span>
                <span>{post.category}</span>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
              <h3 className="font-serif text-xl text-coffee mb-2 leading-tight">{post.title}</h3>
              <p className="text-sm text-coffee-light/80 leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {topic.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 mb-16">
          <h2 className="font-serif text-2xl text-coffee mb-2">Frequently asked</h2>
          <p className="text-sm text-coffee-muted mb-8">
            Short, sourceable answers to the questions that come up most around this topic.
          </p>
          <div className="space-y-6">
            {topic.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-beige-300 p-6">
                <h3 className="font-semibold text-coffee mb-2 text-base">{faq.question}</h3>
                <p className="text-sm text-coffee-light/85 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link to other topics */}
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-xl text-coffee mb-4">Other topics</h2>
        <div className="flex flex-wrap gap-3">
          {otherTopics.map((t) => {
            const a = PILLAR_ACCENT[t.slug] ?? '#C4703F'
            return (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="text-xs uppercase tracking-widest font-semibold px-3 py-2 rounded border transition-colors hover:text-white"
                style={{
                  color: a,
                  borderColor: a + '40',
                  backgroundColor: a + '08',
                }}
              >
                {t.shortLabel}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
