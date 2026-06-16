/**
 * Single source of truth for blog post metadata.
 *
 * Both the blog listing page (src/app/blog/page.tsx) and the per-post OG
 * image generator (src/app/blog/[slug]/opengraph-image.tsx) read from
 * here. Adding a new blog post means: write the full content in
 * src/app/blog/[slug]/page.tsx AND add an entry here. The listing card,
 * social-share OG card, and rich-results image all light up automatically.
 *
 * This deliberately does NOT include the post body (sections / content) —
 * the OG image route runs in the Edge runtime and importing the full post
 * tree would bloat the function. Body lives in the page module; metadata
 * lives here.
 */

export interface BlogPostMeta {
  /** URL slug — also the route segment under /blog/ */
  slug: string
  /** Headline used as <h1> on the post page and the OG card hero text */
  title: string
  /** Editorial category (e.g. "Opinion / Cornerstone") */
  category: string
  /** Pillar this post belongs to (drives accent colour + theme label) */
  pillar:
    | 'Cross-cutting'
    | 'Climate Analytics & DRR'
    | 'Data Analytics & IM'
    | 'Data Analytics'
    | 'Climate & Cash'
    | 'Cash Programming'
    | 'GIS'
  /** Hex accent colour matching the pillar (kept for backward compat with the listing card styling) */
  pillarColor: string
  /** Reading time string (e.g. "8 min") */
  readTime: string
  /** Two-sentence excerpt used in the listing and as the meta description */
  excerpt: string
  /** Whether to surface this post in the featured top section of /blog */
  featured?: boolean
  /** True if the post has full content in src/app/blog/[slug]/page.tsx — false for listing-only placeholders */
  published?: boolean
}

/**
 * Master post catalogue. Order in this array determines display order on
 * the blog listing (featured posts are pulled to the top automatically).
 */
export const POSTS_META: BlogPostMeta[] = [

  {
    slug: 'disaster-loss-data-climate-adaptation',
    title: 'Why Disaster Loss Data Matters More Than Ever for Climate Adaptation',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt:
      "In Cox's Bazar, host communities pushed back against reforestation — not because they opposed it, but because their own climate losses to coastal erosion and cyclones were undocumented and therefore unfundable. Disaster loss data is now the evidentiary backbone of the entire climate adaptation architecture.",
    featured: true,
    published: true,
  },
  {
    slug: 'delta-resilience-early-warning-anticipatory-action',
    title: 'From Forecast to Action: Operationalising Early Warning and Anticipatory Action with DELTA Resilience',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt:
      'A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. DELTA Resilience is the first national disaster data system designed to provide that missing link at scale — turning early warnings into impact-based, evidence-driven anticipatory action.',
    featured: true,
    published: true,
  },
  {
    slug: 'invisible-disasters-invisible-funding',
    title: 'Invisible Disasters, Invisible Funding: When Disaster Data Decides Who Gets Climate Finance',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    excerpt:
      "Every year, millions experience flash floods, prolonged drought, and slow-onset hazards that never reach the world's primary disaster databases. Their losses are real, recurring, and devastating. Because they don't show up in the data, they rarely show up in the funding either.",
    published: true,
  },
  {
    slug: 'road-to-antalya-ncqg',
    title: 'The Road to Antalya: Turning the NCQG Into Real-World Climate Finance',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '9 min',
    excerpt:
      "A finance goal is only as honest as the data that tracks it. On the road to COP31, the New Collective Quantified Goal is about to meet that test — and the credibility of USD 300 billion a year will be decided not by negotiators but by the boring, technical, deeply political business of measurement.",
    published: true,
  },
  {
    slug: 'loss-and-damage-fund-make-or-break-year',
    title: "From Pledge to Payout: A Defining Year for the Loss and Damage Fund",
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    excerpt:
      "A fund exists when money reaches the people it was built for. By that test, the Loss and Damage Fund is still becoming real. With the first call for funding requests now open, the year between Belém and Antalya is when the Fund either delivers — or doesn't.",
    published: true,
  },
  {
    slug: 'delta-grade-data-currency-of-climate-finance',
    title: 'DELTA-Grade Data: The Emerging Currency of Climate Finance on the Road to COP31',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    excerpt:
      "Every climate fund on the road to Antalya disburses against evidence. The countries that can produce DELTA-grade loss data will compete for it. The ones that can't will watch it flow elsewhere — because data sovereignty has become climate sovereignty.",
    published: true,
  },
  {
    slug: 'from-early-warning-to-early-money',
    title: 'From Early Warning to Early Action: Why Anticipatory Finance Belongs at the Heart of COP31',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate & Cash',
    pillarColor: '#8B3A2F',
    readTime: '9 min',
    excerpt:
      "We can see most climate disasters coming. The question COP31 has to answer is whether the money can move before they arrive — and whether the trigger fires for the communities the forecast keeps missing. Anticipatory action is only as equitable as the data its triggers are built on.",
    published: true,
  },
  {
    slug: 'belem-adaptation-indicators-data-test',
    title: 'Measuring What Works: Helping the Belém Adaptation Indicators Live Up to Their Promise',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '9 min',
    excerpt:
      "COP30 finally gave the world a way to measure adaptation. COP31 has to prove that most countries can actually produce the numbers — or the indicators become one more standard the vulnerable are judged against and cannot meet.",
    published: true,
  },
  {
    slug: 'cop31-data-making-the-case',
    title: 'COP31 and Data: A View From the Field',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    excerpt:
      "The most important climate finance argument at Antalya will not be made by a negotiator. It was already made, years ago, by communities whose losses no one wrote down. This is what I learned trying to write them down — and why data is now the gatekeeper of climate justice.",
    published: true,
  },
  {
    slug: 'disaster-data-diplomacy',
    title: 'Disaster and Humanitarian Data Diplomacy: The Quiet Work Behind the Numbers',
    category: 'Opinion / Cornerstone',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '10 min',
    excerpt:
      "In disaster and humanitarian data diplomacy, the numbers are the easy part. Deciding what they are allowed to mean — to the host government, to affected communities, to a watching world — is often the harder, and more consequential, work.",
    published: true,
  },
  {
    slug: 'disaster-data-diplomacy-in-fragility',
    title: 'Holding Data Carefully: Disaster Data Diplomacy in Fragile and Conflict Contexts',
    category: 'Opinion / Cornerstone',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '11 min',
    excerpt:
      "In a stable country, negotiating disaster data is hard. In a fragile one — where the government may be unrecognised, the conflict still live, and the population itself a contested fact — the same negotiation can decide who is reached, who is exposed, and who is simply erased.",
    published: true,
  },
  {
    slug: 'the-72-hour-problem',
    title: 'The 72-Hour Post Disaster Problem',
    category: 'Field Reflection',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '7 min',
    excerpt:
      "The first 72 hours of a sudden-onset disaster are an information black hole. Good IM isn't about perfect data — it's about being useful under imperfect conditions.",
    published: true,
  },
  {
    slug: 'the-case-for-anticipatory-cash',
    title: 'The Case for Anticipatory Cash',
    category: 'Opinion',
    pillar: 'Climate & Cash',
    pillarColor: '#8B3A2F',
    readTime: '8 min',
    excerpt:
      'We can predict most slow-onset disasters weeks in advance but still wait for them to happen before responding. Every dollar spent before a flood is worth five dollars spent after.',
    published: true,
  },
  {
    slug: 'measuring-joint-response-for-cash-transfer',
    title: 'Measuring Joint Response for Cash Transfer Programmes — A New Way of Using Humanitarian Meta-Data',
    category: 'Technical Deep Dive',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    readTime: '11 min',
    excerpt:
      "Five organisations running cash transfer programmes in the same country produce five sets of post-distribution monitoring data using five different tools. The simple question — \"is our collective cash response working?\" — becomes structurally unanswerable. Inter-agency PDM meta-analysis is how you answer it.",
    published: true,
  },
  {
    slug: 'geoai-for-humanitarians',
    title: 'GeoAI for Humanitarians: Getting Started',
    category: 'Tutorial',
    pillar: 'GIS',
    pillarColor: '#7B4B94',
    readTime: '8 min',
    excerpt:
      "GeoAI has enormous potential for humanitarian operations, but most IM officers don't know where to start. This is a practical guide.",
    published: true,
  },
  {
    slug: 'the-im-coordination-trap',
    title: 'The IM Coordination Trap',
    category: 'Opinion',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '8 min',
    excerpt:
      "The biggest barriers to good information management in humanitarian response are not technical — they're political. Data sharing agreements and institutional distrust kill more IM initiatives than bad technology.",
    published: true,
  },
  {
    slug: 'future-of-humanitarian-im-is-agentic',
    title: 'The Future of Humanitarian IM is Agentic',
    category: 'Opinion',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    excerpt:
      'AISA and why the next generation of humanitarian information management will use AI agents, not just AI tools.',
    published: true,
  },
  {
    slug: 'voice-is-the-future-of-humanitarian-data',
    title: 'Voice Is the Future of Humanitarian Data and Evidence Generation',
    category: 'Opinion / Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    excerpt:
      'After a decade of building form-based reporting systems across six countries, voice AI will fundamentally reshape how the humanitarian sector generates evidence. The interface was always the bottleneck.',
    published: true,
  },
  {
    slug: 'the-form-is-already-dead',
    title: 'From Forms to Voice: The Deeper Inclusive Transition',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    excerpt:
      'Every number in our reporting systems started as a human observation that had to survive a form before it became actionable. Voice-to-schema AI ends that entire pipeline.',
    published: true,
  },
  {
    slug: 'voice-powered-decision-intelligence',
    title: 'From Reporting Platforms to Voice-Powered Decision Intelligence',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '11 min',
    excerpt:
      'A field officer in Kabul told me: "By the time our data reaches Kabul, the situation has already moved." Voice AI combined with agentic AI collapses the pipeline from weeks to seconds.',
    published: true,
  },
  {
    slug: 'building-voice-native-evidence-systems',
    title: 'Building Voice-Native Evidence Systems: From Theory to Architecture',
    category: 'Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    excerpt:
      "What does a voice-native humanitarian evidence system actually look like? After building form-based platforms for a decade, here's the architecture — and why it changes everything.",
    published: true,
  },
  {
    slug: 'building-systems-governments-can-own',
    title: 'Building Disaster Data Systems That Governments Can Own',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '10 min',
    excerpt:
      "A flood vulnerability analysis I designed died quietly two years after I left. The hardest lesson from a decade of building these platforms isn't technical — it's institutional.",
    published: true,
  },
  {
    slug: 'desinventar-to-delta-resilience',
    title: 'The Evolution of National Disaster Tracking Systems: From DesInventar to DELTA Resilience',
    category: 'Observer Technical Deep Dive',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt:
      'Not a software upgrade — an architectural paradigm shift from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Why and how the world outgrew DesInventar.',
    published: true,
  },
  {
    slug: 'g-drsf-statisticians-disaster-managers',
    title: 'The Global Disaster-Related Statistics Framework: Why Statisticians and Disaster Managers Must Finally Speak the Same Language',
    category: 'Cornerstone / Policy Explainer',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    excerpt:
      'Endorsed by the UN Statistical Commission in March 2026, the G-DRSF gives disaster managers and statisticians a shared vocabulary, shared standards, and a shared reason to work together.',
    published: true,
  },
  {
    slug: 'data-ecosystem-maturity-assessment-guide',
    title: "The Data Ecosystem Maturity Assessment: A Practitioner's Guide to Diagnosing National Disaster Data Readiness",
    category: 'Tutorial / Technical Deep Dive',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    excerpt:
      'A maturity assessment is not a delay. It is the investment that ensures the system you build is the system that survives. The DEMA framework, in practice.',
    published: true,
  },
  {
    slug: 'politics-of-humanitarian-data-infrastructure',
    title: 'The Politics of Humanitarian Data Infrastructure: Who Owns the System When Everyone Walks Away?',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    excerpt:
      'The email I sent at 11am to 115 organisations announced the platform was suspended immediately. Afghanistan in 2025 was a stress test that revealed a system-wide architectural flaw: nobody owns continuity.',
    published: true,
  },
  {
    slug: 'from-humanitarian-data-to-digitising-africas-markets',
    title: "From Crisis Zones Digital Systems to Market Zones Digital Transition for Africa's Informal Economies",
    category: 'Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '12 min',
    excerpt:
      "While working abroad over the last decade, I visited Nigeria every few months. Every visit, the same struggle — finding reliable services, navigating markets blind, and watching trust deficits hold back an entire economy from going digital. Then a realisation hit me.",
    published: true,
  },
  {
    slug: 'why-i-build-systems-not-dashboards',
    title: 'Why I Build Systems, Not Dashboards',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    excerpt:
      'The humanitarian sector is drowning in dashboards but starving for systems. A dashboard is a view; a system is an ecosystem that changes how organizations make decisions.',
    published: true,
  },
  {
    slug: 'from-maiduguri-to-machine-learning',
    title: 'From Maiduguri to Machine Learning',
    category: 'Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt:
      "The evolution from manual Excel-based IM in Nigeria's NE crisis to AI-powered analytical platforms wasn't planned — it was driven by repeatedly hitting the limits of existing tools.",
    published: false,
  },
  {
    slug: 'africa-will-define-voice-ai',
    title: 'Africa Will Define How Africa Uses Voice AI',
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '9 min',
    excerpt:
      "Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI. And this time, the continent won't just adopt — it will lead.",
    published: true,
  },
  {
    slug: 'the-voices-our-data-systems-silence',
    title: 'The Voices Our Data Systems Were Built to Silence',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt:
      'Accountability to Affected Populations has been a humanitarian commitment for over a decade. But our data collection tools — forms, checkboxes, pre-coded categories — were never designed to listen.',
    published: true,
  },
  {
    slug: 'voice-infrastructure-inequality',
    title: 'Voice Infrastructure Inequality: The New Digital Divide',
    category: 'Opinion / Research',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    excerpt:
      'AI scores 80% accuracy in English. Below 55% in Yoruba, spoken by 50 million people. If voice is the future of data, voice infrastructure inequality is the future of data exclusion.',
    published: true,
  },
  {
    slug: 'lessons-six-countries',
    title: 'Lessons from Building Humanitarian Data Platforms Across Multiple Crisis Contexts',
    category: 'Field Reflection / Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    excerpt:
      'Multiple countries. Seven data platforms. A decade of work. Six principles emerged across all of them — and none are about technology.',
    published: true,
  },
  {
    slug: 'protected-into-invisibility-part-1',
    title: 'Counted with Care: Rethinking Data Poverty in Fragile Contexts',
    category: 'Opinion / Cornerstone',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '7 min',
    excerpt:
      "We promised to leave no one behind. But you cannot reach a person your systems cannot see, and decades of missing data — some of it the unintended cost of our own protective caution — have quietly turned a promise of inclusion into a machinery of exclusion. Part 1 of 2.",
    published: true,
  },
  {
    slug: 'data-poverty-fragility-data-equity-part-2',
    title: 'From Data Poverty to Data Equity: A Way Forward',
    category: 'Opinion / Cornerstone',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '7 min',
    excerpt:
      "Data equity is not the opposite of data protection. It is the harder, more relational work that lets people be both seen and safe — on their own terms. Part 2 of 2, on what pushing for it actually requires.",
    published: true,
  },
]

/**
 * Lookup a single post's metadata by slug. Returns undefined if no such
 * post exists — callers should handle this (typically by falling back to
 * a generic "Blog Post" placeholder).
 */
export function getPostMeta(slug: string): BlogPostMeta | undefined {
  return POSTS_META.find((p) => p.slug === slug)
}

/** All slugs known to the system, in display order. */
export function getAllSlugs(): string[] {
  return POSTS_META.map((p) => p.slug)
}
