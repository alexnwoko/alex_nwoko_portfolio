import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Field Notes — Alex Nwoko',
  description: 'Reflections, technical deep dives, and opinions from the intersection of humanitarian data, GIS, climate, and cash programming.',
}

const posts = [
  {
    slug: 'from-humanitarian-data-to-digitising-africas-markets',
    title: 'From Humanitarian Data Systems to Digitising Africa\'s Market Ecosystems',
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '12 min',
    excerpt: 'A decade of building data systems in crisis zones revealed a pattern: the same problems of fragmented information, broken trust, and invisible supply chains that plague humanitarian response also define Africa\'s $2.3 trillion informal economy. That insight sparked a new chapter.',
    featured: true,
  },
  {
    slug: 'why-i-build-systems-not-dashboards',
    title: 'Why I Build Systems, Not Dashboards',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    excerpt: 'The humanitarian sector is drowning in dashboards but starving for systems. A dashboard is a view; a system is an ecosystem that changes how organizations make decisions.',
    featured: false,
  },
  {
    slug: 'the-72-hour-problem',
    title: 'The 72-Hour Problem',
    category: 'Field Reflection',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '7 min',
    excerpt: 'The first 72 hours of a sudden-onset disaster are an information black hole. Good IM isn\'t about perfect data — it\'s about being useful under imperfect conditions.',
    featured: false,
  },
  {
    slug: 'from-maiduguri-to-machine-learning',
    title: 'From Maiduguri to Machine Learning',
    category: 'Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt: 'The evolution from manual Excel-based IM in Nigeria\'s NE crisis to AI-powered analytical platforms wasn\'t planned — it was driven by repeatedly hitting the limits of existing tools.',
    featured: false,
  },
  {
    slug: 'the-case-for-anticipatory-cash',
    title: 'The Case for Anticipatory Cash',
    category: 'Opinion',
    pillar: 'Climate & Cash',
    pillarColor: '#8B3A2F',
    readTime: '8 min',
    excerpt: 'We can predict most slow-onset disasters weeks in advance but still wait for them to happen before responding. Every dollar spent before a flood is worth five dollars spent after.',
    featured: false,
  },
  {
    slug: 'what-1559-households-taught-me',
    title: 'What 1,559 Households Taught Me About Measuring Cash Impact',
    category: 'Technical Deep Dive',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    readTime: '10 min',
    excerpt: 'The Ethiopia PDM Meta-Analysis was the first attempt to unify post-distribution monitoring data from five organizations into a single analytical framework. Here\'s what we learned.',
    featured: false,
  },
  {
    slug: 'geoai-for-humanitarians',
    title: 'GeoAI for Humanitarians: Getting Started',
    category: 'Tutorial',
    pillar: 'GIS',
    pillarColor: '#7B4B94',
    readTime: '8 min',
    excerpt: 'GeoAI has enormous potential for humanitarian operations, but most IM officers don\'t know where to start. This is a practical guide.',
    featured: false,
  },
  {
    slug: 'the-im-coordination-trap',
    title: 'The IM Coordination Trap',
    category: 'Opinion',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '7 min',
    excerpt: 'The biggest barriers to good information management in humanitarian response are not technical — they\'re political. Data sharing agreements and institutional distrust kill more IM initiatives than bad technology.',
    featured: false,
  },
  {
    slug: 'future-of-humanitarian-im-is-agentic',
    title: 'The Future of Humanitarian IM is Agentic',
    category: 'Opinion',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    excerpt: 'AISA and why the next generation of humanitarian information management will use AI agents, not just AI tools.',
    featured: false,
  },
]

export default function BlogPage() {
  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Field Notes</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Writing from the Field
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Reflections, technical deep dives, and opinions from a decade at the intersection of humanitarian data, GIS, climate risk, and cash programming.
        </p>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-white rounded-2xl border border-beige-300 p-8 md:p-12 card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: featured.pillarColor }} />
            <span className="text-xs uppercase tracking-widest text-dusty-orange font-semibold">Featured</span>
            <h2 className="font-serif text-3xl md:text-4xl text-coffee mt-3 mb-4">{featured.title}</h2>
            <div className="flex items-center gap-4 mb-6 text-sm text-coffee-muted">
              <span>{featured.category}</span>
              <span>&middot;</span>
              <span>{featured.readTime} read</span>
            </div>
            <p className="text-coffee-light/80 leading-relaxed max-w-2xl mb-8 font-reading text-lg">
              {featured.excerpt}
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Read Article &rarr;
            </Link>
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
