import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Blog — Alex Nwoko',
  description:
    'Reflections, technical deep dives, and opinion pieces on disaster risk reduction, DELTA Resilience, Sendai Framework, humanitarian data systems, GIS, climate analytics, anticipatory action, and cash programming — drawn from a decade of building data infrastructure across six countries.',
  keywords: [
    'disaster risk reduction blog',
    'humanitarian data blog',
    'DELTA Resilience',
    'Sendai Framework',
    'G-DRSF',
    'anticipatory action',
    'voice AI humanitarian',
    'climate adaptation',
    'cash transfer programming',
    'data ecosystem maturity',
    'Alex Nwoko',
  ],
  alternates: { canonical: 'https://alexnwoko.com/blog' },
  openGraph: {
    title: 'My Blog — Alex Nwoko',
    description:
      'Reflections, technical deep dives, and opinions on DRR, humanitarian data systems, climate, and cash programming.',
    url: 'https://alexnwoko.com/blog',
    siteName: 'Alex Nwoko Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog — Alex Nwoko',
    description:
      'Reflections on DRR, humanitarian data systems, climate, and cash programming.',
  },
}

const posts = [
  {
    slug: 'disaster-loss-data-climate-adaptation',
    title: 'Why Disaster Loss Data Matters More Than Ever for Climate Adaptation',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt: 'In Cox\'s Bazar, host communities pushed back against reforestation — not because they opposed it, but because their own climate losses to coastal erosion and cyclones were undocumented and therefore unfundable. Disaster loss data is now the evidentiary backbone of the entire climate adaptation architecture.',
    featured: true,
  },
  {
    slug: 'delta-resilience-early-warning-anticipatory-action',
    title: 'From Forecast to Action: Operationalising Early Warning and Anticipatory Action with DELTA Resilience',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt: 'A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. DELTA Resilience is the first national disaster data system designed to provide that missing link at scale — turning early warnings into impact-based, evidence-driven anticipatory action.',
    featured: true,
  },
  {
    slug: 'from-humanitarian-data-to-digitising-africas-markets',
    title: 'From Crisis Zones Digital Systems to Market Zones Digital Transition for Africa\'s Informal Economies',
    category: 'Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '12 min',
    excerpt: 'While working abroad over the last decade, I visited Nigeria every few months. Every visit, the same struggle — finding reliable services, navigating markets blind, and watching trust deficits hold back an entire economy from going digital. Then a realisation hit me.',
    featured: false,
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
  {
    slug: 'voice-is-the-future-of-humanitarian-data',
    title: 'Voice Is the Future of Humanitarian Data and Evidence Generation',
    category: 'Opinion / Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    excerpt: 'After a decade of building form-based reporting systems across six countries, voice AI will fundamentally reshape how the humanitarian sector generates evidence. The interface was always the bottleneck.',
    featured: false,
  },
  {
    slug: 'the-form-is-already-dead',
    title: 'From Forms to Voice: The Deeper Inclusive Transition',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    excerpt: 'Every number in our reporting systems started as a human observation that had to survive a form before it became actionable. Voice-to-schema AI ends that entire pipeline.',
    featured: false,
  },
  {
    slug: 'africa-will-define-voice-ai',
    title: 'Africa Will Define How the World Uses Voice AI',
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '9 min',
    excerpt: 'Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI. And this time, the continent won\'t just adopt — it will lead.',
    featured: false,
  },
  {
    slug: 'voice-powered-decision-intelligence',
    title: 'From Reporting Platforms to Voice-Powered Decision Intelligence',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '11 min',
    excerpt: 'A field officer in Kabul told me: "By the time our data reaches Kabul, the situation has already moved." Voice AI combined with agentic AI collapses the pipeline from weeks to seconds.',
    featured: false,
  },
  {
    slug: 'the-voices-our-data-systems-silence',
    title: 'The Voices Our Data Systems Were Built to Silence',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt: 'Accountability to Affected Populations has been a humanitarian commitment for over a decade. But our data collection tools — forms, checkboxes, pre-coded categories — were never designed to listen.',
    featured: false,
  },
  {
    slug: 'voice-infrastructure-inequality',
    title: 'Voice Infrastructure Inequality: The New Digital Divide',
    category: 'Opinion / Research',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt: 'AI scores 80% accuracy in English. Below 55% in Yoruba, spoken by 50 million people. If voice is the future of data, voice infrastructure inequality is the future of data exclusion.',
    featured: false,
  },
  {
    slug: 'building-voice-native-evidence-systems',
    title: 'Building Voice-Native Evidence Systems: From Theory to Architecture',
    category: 'Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    excerpt: 'What does a voice-native humanitarian evidence system actually look like? After building form-based platforms for a decade, here\'s the architecture — and why it changes everything.',
    featured: false,
  },
  {
    slug: 'building-systems-governments-can-own',
    title: 'Building Disaster Data Systems That Governments Can Own',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '10 min',
    excerpt: 'A flood vulnerability analysis I designed died quietly two years after I left. The hardest lesson from a decade of building these platforms isn\'t technical — it\'s institutional.',
    featured: false,
  },
  {
    slug: 'desinventar-to-delta-resilience',
    title: 'The Evolution of National Disaster Tracking Systems: From DesInventar to DELTA Resilience',
    category: 'Observer Technical Deep Dive',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt: 'Not a software upgrade — an architectural paradigm shift from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Why and how the world outgrew DesInventar.',
    featured: false,
  },
  {
    slug: 'g-drsf-statisticians-disaster-managers',
    title: 'The Global Disaster-Related Statistics Framework: Why Statisticians and Disaster Managers Must Finally Speak the Same Language',
    category: 'Cornerstone / Policy Explainer',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt: 'Endorsed by the UN Statistical Commission in March 2026, the G-DRSF gives disaster managers and statisticians a shared vocabulary, shared standards, and a shared reason to work together.',
    featured: false,
  },
  {
    slug: 'data-ecosystem-maturity-assessment-guide',
    title: 'The Data Ecosystem Maturity Assessment: A Practitioner\'s Guide to Diagnosing National Disaster Data Readiness',
    category: 'Tutorial / Technical Deep Dive',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    excerpt: 'A maturity assessment is not a delay. It is the investment that ensures the system you build is the system that survives. The DEMA framework, in practice.',
    featured: false,
  },
  {
    slug: 'lessons-six-countries',
    title: 'Lessons from Building Humanitarian Data Platforms Across Multiple Crisis Contexts',
    category: 'Field Reflection / Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    excerpt: 'Multiple countries. Seven data platforms. A decade of work. Six principles emerged across all of them — and none are about technology.',
    featured: false,
  },
  {
    slug: 'politics-of-humanitarian-data-infrastructure',
    title: 'The Politics of Humanitarian Data Infrastructure: Who Owns the System When Everyone Walks Away?',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    excerpt: 'The email I sent at 11am to 115 organisations announced the platform was suspended immediately. Afghanistan in 2025 was a stress test that revealed a system-wide architectural flaw: nobody owns continuity.',
    featured: false,
  },
]

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
          Reflections, technical deep dives, and opinions from a decade at the intersection of humanitarian data, GIS, climate risk, and cash programming.
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
