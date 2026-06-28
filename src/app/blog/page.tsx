import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS_META } from '@/lib/blog-posts-meta'

export const metadata: Metadata = {
  title: 'My Blog, Alex Nwoko',
  description:
    'Reflections, technical deep dives, and opinions from a decade working at the intersection of disaster risk reduction, development programmes, and humanitarian action, climate risk, data systems, Geospatial Information Management, and cash transfer programming.',
  keywords: [
    'disaster risk reduction',
    'development programmes',
    'humanitarian action',
    'climate risk',
    'humanitarian data systems',
    'Geospatial Information Management',
    'GIS',
    'cash transfer programming',
    'DELTA Resilience',
    'Sendai Framework',
    'anticipatory action',
    'Alex Nwoko',
  ],
  alternates: { canonical: 'https://alexnwoko.com/blog' },
  openGraph: {
    title: 'My Blog, Alex Nwoko',
    description:
      'A decade at the intersection of disaster risk reduction, development, humanitarian action, climate risk, data systems, Geospatial Information Management, and cash transfer programming.',
    url: 'https://alexnwoko.com/blog',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog, Alex Nwoko',
    description:
      'A decade at the intersection of disaster risk reduction, development, humanitarian action, climate risk, data systems, GIS, and cash transfer programming.',
  },
}
// Hide posts with published: false from the public listing. The data
// remains in POSTS_META so they can be re-published later by flipping the
// flag, no content needs to be rewritten.
const posts = POSTS_META.filter((p) => p.published !== false)

export default function BlogPage() {
  const featuredPosts = posts.filter((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">My Blog</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Reflections from My Journey
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Reflections, technical deep dives, and opinions from a decade working at the intersection of disaster risk reduction, development programmes, and humanitarian action, climate risk, data systems, Geospatial Information Management, and cash transfer programming.
        </p>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((featured) => (
              <div
                key={featured.slug}
                className="bg-white rounded-2xl border border-beige-300 p-8 md:p-10 card-hover relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: featured.pillarColor }} />
                <span className="text-xs uppercase tracking-widest text-dusty-orange font-semibold">Featured</span>
                <h2 className="font-serif text-2xl md:text-3xl text-coffee mt-3 mb-4 leading-tight">{featured.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-coffee-muted">
                  <span
                    className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded"
                    style={{ color: featured.pillarColor, backgroundColor: featured.pillarColor + '10' }}
                  >
                    {featured.pillar}
                  </span>
                  <span>{featured.category}</span>
                  <span>&middot;</span>
                  <span>{featured.readTime} read</span>
                </div>
                <p className="text-coffee-light/80 leading-relaxed mb-8 font-reading text-base flex-1">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all self-start"
                >
                  Read Article &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-beige-300 p-8 card-hover group block"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded"
                  style={{ color: post.pillarColor, backgroundColor: post.pillarColor + '10' }}
                >
                  {post.pillar}
                </span>
                <span className="text-xs text-coffee-muted">{post.readTime} read</span>
              </div>
              <h3 className="font-serif text-xl text-coffee mb-3 group-hover:text-dusty-orange transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-coffee-muted leading-relaxed mb-4">{post.excerpt}</p>
              <span className="text-sm text-dusty-orange font-medium">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
