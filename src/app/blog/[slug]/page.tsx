import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import ShareButtons from '@/components/ShareButtons'

interface BlogSection {
  heading?: string
  content: string
}

/**
 * Parse inline markdown links and code into React nodes.
 * Mid-paragraph **bold** asterisks are STRIPPED (not bolded) — bold styling
 * is only applied to leading-bold paragraphs via renderBlock.
 *
 * Supports:
 *   - [text](url) → <a> (or Next Link for internal paths)
 *   - `code` → <code>
 *   - **text** mid-line → asterisks stripped, plain text
 */
function parseInline(text: string): ReactNode[] {
  // Strip mid-paragraph **bold** markers — keep the inner text as plain prose.
  const stripped = text.replace(/\*\*([^*]+)\*\*/g, '$1')

  const pattern = /(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(stripped)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(stripped.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // [text](url)
      const linkText = match[2]
      const href = match[3]
      const isExternal = /^https?:\/\//i.test(href)
      nodes.push(
        isExternal ? (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dusty-orange hover:text-darkred underline underline-offset-2 transition-colors"
          >
            {linkText}
          </a>
        ) : (
          <Link
            key={key++}
            href={href}
            className="text-dusty-orange hover:text-darkred underline underline-offset-2 transition-colors"
          >
            {linkText}
          </Link>
        )
      )
    } else if (match[4]) {
      // `code`
      nodes.push(
        <code key={key++} className="bg-beige-200 text-coffee px-1.5 py-0.5 rounded text-sm font-mono">
          {match[5]}
        </code>
      )
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < stripped.length) {
    nodes.push(stripped.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [stripped]
}

/**
 * Render a markdown paragraph block.
 * Bold styling is applied ONLY when **bold** appears at the very start of the
 * paragraph (used as a bold lead-in / mini-heading). Mid-paragraph asterisks
 * are stripped by parseInline.
 *
 * Also handles bullet lists ("- item" or "* item" on each line).
 */
function renderBlock(block: string, key: number): ReactNode {
  const lines = block.split('\n')
  const isBulletList = lines.length > 1 && lines.every((line) => /^\s*-\s+/.test(line))

  if (isBulletList) {
    return (
      <ul key={key} className="list-disc pl-6 space-y-2">
        {lines.map((line, i) => {
          const itemText = line.replace(/^\s*-\s+/, '')
          return <li key={i}>{parseInline(itemText)}</li>
        })}
      </ul>
    )
  }

  // Detect a leading **bold lead-in** at the very start of the paragraph.
  const leadingBoldMatch = block.match(/^\*\*([^*]+)\*\*(\s*)([\s\S]*)$/)

  if (leadingBoldMatch) {
    const boldText = leadingBoldMatch[1]
    const spacer = leadingBoldMatch[2] ?? ''
    const rest = leadingBoldMatch[3] ?? ''
    return (
      <p key={key}>
        <strong className="text-coffee font-semibold">{boldText}</strong>
        {spacer}
        {parseInline(rest)}
      </p>
    )
  }

  return <p key={key}>{parseInline(block)}</p>
}

interface BlogPost {
  slug: string
  title: string
  category: string
  pillar: string
  pillarColor: string
  readTime: string
  date: string
  excerpt: string
  sections: BlogSection[]
  relatedSlugs: string[]
  /**
   * Optional per-post SEO keywords. If omitted, defaults are derived from the
   * post's pillar via PILLAR_KEYWORDS.
   */
  keywords?: string[]
}

/**
 * Baseline keywords inherited by every blog post for site-wide SEO consistency.
 */
const BASE_KEYWORDS = [
  'Alex Nwoko',
  'humanitarian data',
  'information management',
  'data systems architect',
]

/**
 * Pillar-level keyword bundles. A post inherits the bundle for its pillar
 * unless it provides its own `keywords` array.
 */
const PILLAR_KEYWORDS: Record<string, string[]> = {
  'Climate Analytics & DRR': [
    'disaster risk reduction',
    'DRR',
    'disaster loss data',
    'DELTA Resilience',
    'DesInventar',
    'Sendai Framework',
    'G-DRSF',
    'climate adaptation',
    'Loss and Damage Fund',
    'Belém Adaptation Indicators',
    'UNDRR',
    'WMO-CHE',
    'NDMA',
    'NSO',
    'early warning systems',
    'anticipatory action',
  ],
  'Data Analytics & IM': [
    'humanitarian data systems',
    'data governance',
    'data ecosystem maturity',
    'DEMA',
    'information management',
    'Power BI',
    'data interoperability',
    'OCHA',
    'cluster coordination',
    'humanitarian data drought',
    'data sovereignty',
    'NDMA-NSO partnership',
  ],
  'Data Analytics': [
    'humanitarian data',
    'voice AI',
    'agentic AI',
    'evidence generation',
    'voice-to-schema',
    'WAXAL',
    'Omnilingual ASR',
    'data collection',
    'situation analysis',
    'AISA',
  ],
  'Cross-cutting': [
    'humanitarian innovation',
    'African informal economy',
    'voice AI',
    'Vendoh',
    'MAKKET',
    'Nigeria',
    'voice infrastructure',
    'data ecosystem',
    'humanitarian-to-commerce',
    'founder journey',
  ],
  'Climate & Cash': [
    'anticipatory cash',
    'cash transfer programming',
    'climate finance',
    'forecast-based financing',
    'CHIRPS',
    'food security',
  ],
  'Cash Programming': [
    'cash transfer programming',
    'post-distribution monitoring',
    'multi-purpose cash',
    'CTP',
    'beneficiary outcomes',
  ],
  'GIS': [
    'GIS',
    'GeoAI',
    'remote sensing',
    'Google Earth Engine',
    'spatial analysis',
    'geospatial intelligence',
  ],
}

/**
 * Resolve the SEO keyword bundle for a given post (post-level overrides win).
 */
function getPostKeywords(post: BlogPost): string[] {
  const pillar = PILLAR_KEYWORDS[post.pillar] ?? []
  const own = post.keywords ?? []
  // De-duplicate while preserving order; post-level keywords appear first
  // because they are the most specific signal for that page.
  return Array.from(new Set([...own, ...pillar, ...BASE_KEYWORDS]))
}

const blogPosts: Record<string, BlogPost> = {
  'from-humanitarian-data-to-digitising-africas-markets': {
    slug: 'from-humanitarian-data-to-digitising-africas-markets',
    title: "From Crisis Zones Digital Systems to Market Zones Digital Transition for Africa's Informal Economies",
    category: 'Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '12 min',
    date: 'March 2026',
    excerpt:
      'While working abroad over the last decade, I visited Nigeria every few months. Every visit, the same struggle — finding reliable services, navigating markets blind, and watching trust deficits hold back an entire economy from going digital. Then a realisation hit me.',
    sections: [
      {
        content: `While mostly working abroad over the last decade — in Afghanistan, Bangladesh, Ethiopia, and Switzerland — I visited Nigeria every few months to take intermittent breaks. And every single visit, I faced the same challenges: the struggle of finding reliable services, the frustration of navigating markets with no information to guide you, and the palpable trust deficit that has held back African markets from going digital.

I'd try to find a good plumber. I'd ask a cousin, who'd ask a neighbour, who'd give me a number that might or might not work. I'd go to a market looking for something specific and spend hours navigating stalls because there's no directory, no reviews, no way to know who's trustworthy until after you've already paid. Every visit, the same friction. Every visit, the same thought growing louder in the back of my mind.

Because during those same years, I was building information systems for humanitarian emergencies — platforms that helped hundreds of organisations coordinate, dashboards that tracked millions of services to vulnerable populations, geospatial tools that mapped risk across entire countries. I was solving exactly these problems — fragmented information, invisible actors, broken trust — in some of the world's most complex operating environments.

And I kept asking myself: why can't this power be deployed into the market ecosystem back home?`,
      },
      {
        heading: 'The Realisation That Changed Everything',
        content: `The realisation didn't come in a single moment. It built up over years of those visits home — each time noticing the same patterns I was solving professionally in crisis zones playing out in everyday Nigerian commerce.

In a humanitarian operation, the core challenge is always the same: too many actors, too little shared information, and no infrastructure connecting them. Organisations collect data in silos. If you want to see the full picture — who's doing what, where, for whom — you have to piece it together manually from dozens of sources.

Now think about an African market. Thousands of sellers, each operating independently. Buyers who have no way to discover them except through personal networks. Prices that vary from stall to stall. Quality that's impossible to assess until after a transaction. Trust that exists only within existing relationships.

It's the same structural problem. Different context, same underlying challenge: how do you create shared visibility, build trust at scale, and connect people who need each other but can't find each other?

The systems I led and managed in my humanitarian career — reporting platforms, geospatial analysis tools, data coordination mechanisms — were all built to make the invisible visible. To create trust where none existed. To connect fragmented actors into a functioning ecosystem.

I started running the idea past a few friends. Could the same systems thinking that powered humanitarian coordination power African commerce? Every conversation made me more convinced. Not just that it was possible — but that it was necessary. That the trust deficit holding back African markets could be addressed with the right digital infrastructure, built by someone who understood the constraints from the inside.

The ambition crystallised: help Africa's markets and service sector transition into the digital phase. Help Africans do business with Africans — with the trust, visibility, and efficiency they deserve.`,
      },
      {
        heading: 'Why My Humanitarian Experience Matters Here',
        content: `People sometimes ask me: "What does humanitarian work have to do with building a tech startup?" Everything, it turns out.

Building trust where none exists: In crisis response, trust is oxygen. You build verification systems because decisions affect lives. Partner vetting, beneficiary registration, feedback loops, audit trails — every mechanism exists to ensure that when someone claims something, you can verify it. That same discipline translates directly to marketplace trust. Seller verification. Payment protection. Review systems. Making invisible credentials visible and verifiable. This is exactly what African markets need — a trust infrastructure layer.

Designing for real-world constraints: Humanitarian systems must work on 2G networks, on basic phones, with unreliable power, in areas where infrastructure is a variable you design around, not a given you can assume. African commerce operates under identical constraints. Most platforms fail here because they're designed for environments with stable internet, fixed addresses, and digital payment infrastructure. I spent ten years designing for the opposite. That's an advantage you can't learn from a textbook.

Geospatial intelligence: The same GIS skills I used to map flood risk and identify access routes now help me map market catchment areas, understand population density patterns, and identify underserved commercial zones. MAKKET's dataset of hundreds of Nigerian markets with geolocation data is essentially a humanitarian-style baseline assessment applied to commerce. Every market has a story — population, transportation, seasonal variation, competitive intensity. Map it, understand it, build for it.

Communication that actually works: In the field, I learned that voice messages are how information moves in communities where literacy varies and screens aren't the primary interface. Seventy-eight percent of Nigerians send voice messages daily. That's not a limitation to work around — it's a design specification to build on.

These aren't abstract skills. They're hard-won operational instincts from a decade of building in the world's most challenging environments. And they translate directly to the challenge of digitising Africa's informal economies.`,
      },
      {
        heading: 'Why Most Tech Solutions Get Africa Wrong',
        content: `Most marketplace platforms are designed for formal economies. They assume fixed addresses, reliable internet, digital payment accounts, and standardised pricing. These assumptions are so deeply baked into the architecture that most founders don't even realise they're making them.

Nigeria's markets don't work like that. Balogun market does enormous volumes of trade with zero digital records. Sellers communicate through voice messages and personal referrals. Price discovery happens through haggling and relationships, not algorithms. There are no formal addresses — the market is a geography without a coordinate system.

The pattern of failure is predictable: a founder sees an African market, sees "inefficiency," imports a Western marketplace model, spends investor money on user acquisition, and discovers that the entire infrastructure assumption was wrong. The market isn't "digitally backward." It's working perfectly well for how it actually functions.

What's needed isn't disruption. It's enhancement. Start with how the market actually operates and add a digital layer that makes it work better — without trying to replace what's already there. This is what I experienced on every visit home. The markets work. The service providers are skilled. The commerce is vibrant. What's missing is the connective digital tissue that makes it all visible, trustworthy, and scalable.

This is the opposite of importing a model. It's building from first principles — by someone who's lived on both sides of the problem.`,
      },
      {
        heading: 'Vendoh and MAKKET: Two Platforms, One Conviction',
        content: `This is why I'm building two platforms.

Vendoh is a voice-first AI service marketplace for Nigeria's urban service economy — plumbers, electricians, carpenters, salon professionals, home maintenance providers. It's a massive market where less than 5% of transactions happen on formal platforms. If you need a plumber in Lagos today, you ask a friend — exactly the frustration I experienced on every visit home. Vendoh makes that discovery instant, voice-powered, and trust-protected with escrow payments.

MAKKET digitises Nigeria's physical markets — connecting buyers with traders across hundreds of markets. Unlike e-commerce platforms that try to replace markets, MAKKET enhances the existing ecosystem. It makes discovery possible beyond your immediate neighbourhood, makes seller credentials visible, and creates a digital layer on top of commerce that's been working for generations.

They look like different platforms. But underneath, they share one conviction: Africa's informal economies don't need to be replaced by digital alternatives. They need to be enhanced with digital infrastructure that respects how they already work.

Enhance the market, never displace it. That's the thesis. And it comes directly from a decade of humanitarian work where I learned the hard way that systems succeed when they work with existing realities, not against them.`,
      },
      {
        heading: 'Helping Africans Do Business with Africans',
        content: `Africa's informal commerce is a multi-trillion-dollar economy operating almost entirely offline. Street traders, market vendors, service professionals, and micro-entrepreneurs move more capital through person-to-person transactions than many formal financial institutions touch. Yet this entire ecosystem remains invisible to digital platforms.

The biggest untapped opportunity in African tech isn't competing with established platforms — it's building infrastructure for the vast majority of commerce that no platform has reached. Commerce that works perfectly well without digital intermediation, but could be dramatically more powerful with the right digital layer.

We're starting with Nigeria — Lagos, Abuja, Port Harcourt. Proving the model, measuring what works, then expanding. Not because we're being cautious, but because that's another lesson from humanitarian operations: density before breadth. Go deep in one location before going wide across many.

Looking back, those visits home — the frustration of finding a plumber, the hours lost in markets, the trust deficit I experienced as a customer — weren't just inconveniences. They were the problem statement for everything I'm building now. A decade of building digital systems in crisis zones gave me the tools. Coming home gave me the purpose.

I'm finally helping Africans do business with Africans. With the trust, the visibility, and the digital infrastructure this continent's markets have always deserved.`,
      },
    ],
    relatedSlugs: [
      'why-i-build-systems-not-dashboards',
      'future-of-humanitarian-im-is-agentic',
    ],
  },

  'why-i-build-systems-not-dashboards': {
    slug: 'why-i-build-systems-not-dashboards',
    title: 'Why I Build Systems, Not Dashboards',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    date: 'March 2026',
    excerpt:
      'Dashboards are tools for looking. Systems are tools for changing. Why organizations confuse the two—and why it matters.',
    sections: [
      {
        content: `A humanitarian coordinator walks into my office. "Can you make me a dashboard?" she asks.

This is a phrase I've heard a hundred times. And every time, I know that the question is not actually about dashboards.

What she's really asking is: "Can you help me see what's happening in my program?" or "Can you help me make better decisions?" or "Can you give me something to show my donors?" The dashboard is just the medium she's imagining.

But dashboards are rarely the answer. And if you build the wrong thing at the beginning, you end up in a familiar place: a beautiful visualization that nobody uses, updated once and then abandoned, a monument to someone's good intentions.`,
      },
      {
        heading: 'The Dashboard Trap',
        content: `Dashboards become graveyards. I've seen it dozens of times across humanitarian organizations. Someone commissions a beautiful dashboard—maps, charts, metrics, all color-coded and interactive. It launches to fanfare. Then it's updated three times and nobody looks at it again.

Why? Because dashboards solve the wrong problem.

A dashboard answers the question: "What do the numbers say?" But that's rarely the question that matters. The question that matters is: "What should I do about it?"

Organizations confuse data visibility with data utility. They think "If we can see the data, we'll make better decisions." But seeing the data doesn't automatically change behavior. You can show someone a chart that says "dropout rates are 23% higher in region X" and they still have no idea how to act on that information.

Worse, dashboards create a false sense of understanding. You're looking at a graph and thinking "I understand the situation." But you're looking at aggregated numbers that might be wrong, outdated, or misleading. A dashboard is a view. It's useful for getting a general sense of direction. It's terrible for understanding the actual situation.

The fundamental problem: dashboards show you numbers. They don't change your workflow.`,
      },
      {
        heading: 'What a System Actually Looks Like',
        content: `ReportHub was a system. Let me trace what that actually means.

The problem it solved: humanitarian organizations collect data in silos. Each organization reports to its donors in its own format using its own definitions. A cash program reports differently than a food program, which reports differently than a health program. To see a coordinated picture, you have to manually compile data from dozens of sources. This takes weeks. By the time you've compiled it, the situation has changed.

The system we built had multiple layers:
- Data standards (what gets reported, in what format, with what definitions)
- Collection tools (mobile forms, web intake, API integrations for existing systems)
- Validation pipelines (automated checks to catch bad data early)
- Coordination mechanisms (ways for organizations to share data, see shared dashboards, coordinate action)
- Feedback loops (a way for field teams to challenge data and corrections to flow back)

Not one of these pieces was a dashboard. Most of them weren't even visible to end users. They were infrastructure.

But here's what changed: organizations stopped sending me spreadsheets. The reporting burden dropped by 60%. Analysts spent less time compiling and more time analyzing. Coordination happened faster because people could see shared data. Donors got better information because the data was more timely and reliable.

200+ organizations used ReportHub. Not because the dashboards were beautiful. Because the system reduced their burden and gave them something useful to work with.

That's what a system does. It doesn't just show you data. It changes your workflow. It makes certain actions easier and other actions harder. It creates incentives. It builds in quality control. It amplifies good behavior and makes bad behavior visible.`,
      },
      {
        heading: 'The Three Questions',
        content: `Every information system should answer three questions. If it doesn't answer all three, it's just decoration.

Question 1: Who needs this data? Not "who might want this data," but who specifically, for what role, in what context. A field coordinator needs different information than a country director needs different information than a program manager. If you don't know who the user is, you can't build for them.

Question 2: What decision does it inform? Data without an associated decision is just noise. If the data doesn't help someone decide something specific, it doesn't belong in the system. A humanitarian coordinator needs to decide: do we scale the program to region X? Do we change the targeting criteria? Do we shift resources? What specific decision does your data support?

Question 3: How does it get to them at the right time? Timeliness is underrated. A perfect analysis that arrives after the decision has been made is worthless. A rough analysis that arrives when it can still change an outcome is gold. Systems that work think about information flow. How often does this person need this data? Do they need it pushed to them proactively? Do they need it available when they ask? Does it need to trigger an alert?

Most information projects fail because they answer the wrong question. They show you everything without thinking about who's using it, why they're using it, and when they need it.

Build the system around the decision, not around the data.`,
      },
      {
        heading: 'Closing Provocation',
        content: `The next time someone asks you for a dashboard, ask them what decision they need to make. That's where you start.

If they say "I want to see program performance," dig deeper. Which metrics? For what decision? If they say "I want to monitor beneficiary outcomes," ask which outcomes, measured how, and what you're going to do differently based on what you see.

Dashboards are fine tools for certain purposes—general awareness, donor reporting, directional understanding. But if you want to actually change how an organization operates, if you want to build something that gets used, you need to build a system.

Start with the decision. Build backwards from there. Then you might end up with something worth building.`,
      },
    ],
    relatedSlugs: [
      'from-humanitarian-data-to-digitising-africas-markets',
      'future-of-humanitarian-im-is-agentic',
    ],
  },

  'future-of-humanitarian-im-is-agentic': {
    slug: 'future-of-humanitarian-im-is-agentic',
    title: 'The Future of Humanitarian IM is Agentic',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    date: 'March 2026',
    excerpt:
      'How AI agents—not just tools—will transform humanitarian information management. Introducing the concept of AISA.',
    sections: [
      {
        content: `I'm watching an analyst spend three weeks on what should be a two-day job.

She's sitting in a Nairobi office, working on a situation analysis for a new conflict-affected area. The task is straightforward: read reports from dozens of sources, classify the information by sector, identify key trends, cross-reference with historical data, synthesize into a single analytical product, and produce a situation report that senior management can use to make decisions.

Three weeks. In that time, she's manually searching databases, reading PDFs, categorizing information in spreadsheets, cross-checking dates and numbers, consolidating into a single narrative. The work is artisanal. It requires human judgment—she needs to assess source credibility, handle contradictions, extract meaning from messy data. But so much of it is structural work that a machine could do.

By the time the situation report is published, the situation has shifted. The analysis is technically complete but operationally obsolete.

I'm thinking: an AI agent could handle the structural work in hours. Not replace the analyst. Augment her. Do the heavy lifting of information processing so she can focus on judgment and synthesis.`,
      },
      {
        heading: 'The Manual Bottleneck',
        content: `Situation analysis is the backbone of humanitarian decision-making. It's how leadership understands crises. What's happening on the ground? What are the humanitarian needs? What's causing them? How are they changing? What does the operation need to do?

Producing a good situation analysis requires reading widely, thinking across sectors, holding multiple perspectives at once, updating as new information arrives. It's a core competency.

But the process is artisanal. An analyst sits at a desk and does search-classify-synthesize work manually. She searches the OCHA situation reports database for similar contexts. She reads analysis from partner organizations. She pulls sector-specific data. She matches dates and locations. She reconciles contradictions. She builds a narrative.

This is cognitively intensive, which is why it requires a skilled analyst. But it's also repetitive and structural, which is why so much of it is ripe for automation.

In Afghanistan, producing a single multi-sectoral situation analysis took 2-3 weeks. In Somalia, it took 3-4 weeks. By the time it was published, the situation had shifted, new data had arrived, and the next analysis cycle was already behind schedule.

The humanitarian sector has tried to solve this with dashboards (which just aggregate data without adding synthesis), with templates (which structure the output but don't speed up the process), and with larger teams (which helps but hits diminishing returns fast).

None of these address the core bottleneck: information processing is slow because it's manual.`,
      },
      {
        heading: 'From AI Tools to AI Agents',
        content: `The humanitarian sector has dabbled with AI. DEEP platform for document classification. NLP for sentiment analysis. Predictive models for needs estimation. These are useful.

But these are AI tools, not AI agents. There's a critical difference.

A tool waits to be used. You point it at a document and it classifies it. You feed it text and it extracts sentiment. It's reactive. You summon it, it performs its function, it waits for the next summons.

An agent is autonomous. It has a goal and it acts toward that goal. It searches for information without being asked. It identifies gaps in its understanding and goes looking. It detects anomalies and flags them. It updates its outputs as new data arrives. It thinks about what information it needs and goes after it.

The difference is agency.

Current AI systems in humanitarian response are tools. A document classification model is useful for screening reports. NLP for sentiment analysis helps you understand population perception. But none of these do anything without a human initiating the action. You have to bring them a document, ask them a question, point them at data.

An agentic system would work differently. It would continuously monitor sources (humanitarian databases, news feeds, partner reports, social media signals). It would detect emerging patterns automatically. It would classify information as it arrives. It would identify contradictions and gaps. It would draft analytical products. It would flag anomalies that humans need to review.

The human would still be in the loop for judgment, contextual understanding, and quality assurance. But the information processing would be automated.`,
      },
      {
        heading: 'Introducing AISA',
        content: `AISA: Agentic Intersectoral Situational Analysis.

This is the concept I've been thinking about for the past year. What would it look like if we built an agentic system for situation analysis in humanitarian response?

Architecture: multiple specialized agents, each with a specific role.

Source monitor agents continuously scan humanitarian databases, news feeds, partner reports, and social media for information about the crisis. They're looking for new reports, updated statistics, emerging trends, signals of change.

Classification agents take incoming information and categorize it by sector (WASH, food security, health, protection, etc.), by operational relevance (critical for decision-making, contextual background, noise), by source credibility (which organizations are reliable? which sources are prone to bias?).

Cross-reference agents look for contradictions, temporal inconsistencies, and outliers. If two organizations report different numbers for the same metric, they flag it. If a trend contradicts historical patterns, they note it.

Synthesis agents look across classifications and create intersectoral understanding. They identify how health impacts connect to food security, how displacement creates protection risks, how market disruption affects livelihood capacity.

Product generation agents draft analytical outputs—situation reports, trend analysis, early warning signals, critical updates—and flag them for human review.

All of these agents are in communication. They're not sequential. They work in parallel, updating each other, refining understanding as new information arrives.

The human analyst is positioned as a quality control point and a judgment arbiter. She reviews agent outputs, challenges them, adds context, makes sense of contradictions, and decides what gets published. The agents handle the structural work of information processing. The human handles the cognitive work of judgment.

The result: situation analysis that's updated daily, not monthly. Analysis that catches emerging trends in real-time. Analysis that's consistent and well-sourced. Analysis that's ready to support decisions.

Practically, this means 10x faster analytical throughput with consistent quality.`,
      },
      {
        heading: 'Why This Matters Now',
        content: `The volume of humanitarian information is growing exponentially. More organizations, more reporting systems, more real-time data feeds, more beneficiary communication platforms. The amount of raw information available is increasing faster than our ability to process it.

At the same time, crises are becoming more complex. Climate-driven disasters interact with conflict, conflict creates displacement, displacement creates protection risks, all of this unfolds across multiple sectors simultaneously. Understanding a complex crisis requires holding many variables at once.

The analyst workforce can't scale to meet demand. You can't hire your way out of this problem. And even if you could, the human experience of sitting at a desk doing manual information processing is grinding.

Agentic systems aren't replacing analysts. They're multiplying their capacity. One analyst with AISA support can do the work of five analysts without it. That's not because the agents are smarter—it's because they handle the repetitive structural work and let the humans focus on judgment.

This matters now because the technology is ready. Large language models can read, understand, classify, and synthesize information. Multi-agent orchestration frameworks exist. We know how to build agentic systems. The missing piece is someone building it for humanitarian use.`,
      },
      {
        heading: 'Closing Provocation',
        content: `The question isn't whether AI will transform humanitarian information management. It will. The question is whether we'll build the right kind of AI.

Will we build systems that augment human judgment or bypass it? Will we build for transparency and explainability or opacity? Will we build for the constraints of humanitarian work—sparse data, ethical complexity, political sensitivity—or will we import standard models that don't fit?

The next generation of humanitarian IM won't be dashboards and databases. It will be agentic systems that continuously work to make invisible information visible, that support human judgment with machine-powered information processing, that free analysts from the grinding work of manual synthesis so they can focus on meaning-making and decision support.

That's the infrastructure the humanitarian sector needs. That's what builders should be focusing on.`,
      },
    ],
    relatedSlugs: [
      'why-i-build-systems-not-dashboards',
      'from-humanitarian-data-to-digitising-africas-markets',
    ],
  },

  'voice-is-the-future-of-humanitarian-data': {
    slug: 'voice-is-the-future-of-humanitarian-data',
    title: 'Voice Is the Future of Humanitarian Data and Evidence Generation',
    category: 'Opinion / Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '10 min',
    date: 'March 2026',
    excerpt:
      'After a decade of building form-based reporting systems across six countries, I\'m convinced: voice AI will fundamentally reshape how the humanitarian sector generates evidence. The interface was always the bottleneck.',
    sections: [
      {
        content: `I managed data literacy trainings in Pashto and Dari because the tools we built didn't speak the language of the people using them. We designed dashboards in English for field teams who think in Hausa, Yoruba, Dari. The interface was the bottleneck — not the data, not the analysis, not the people.

Ten years of humanitarian field work convinced me of this. In Cox's Bazar I coordinated communication data across 1,100+ radio listening groups in refugee camps. In Ethiopia I managed post-distribution monitoring surveys across 1,559 households from five organizations. In Afghanistan I watched 63 women complete data literacy training in Pashto and Dari — training that was necessary because the reporting platform they needed to use was designed for English speakers sitting in front of laptops.

Every one of these experiences pointed to the same problem: the people with the most important data are the hardest for our systems to hear. Not because they lack information — because our interfaces demand literacy and screen fluency that don't match the reality on the ground.`,
      },
      {
        heading: 'Why Voice Changes Everything',
        content: `Speaking is 3-4x faster than typing. It captures nuance no checkbox will. And the language infrastructure is finally being built — Google's WAXAL project released 11,000+ hours of speech across 21 African languages from 2 million recordings. The Gates Foundation's African Next Voices initiative adds 18 more. Meta's Omnilingual ASR now supports 1,600+ languages. These aren't features. They're the foundation of a completely different data paradigm.

Consider what this means practically: a farmer in Kano or a health worker in Kandahar doesn't need to read a form. She just speaks. One spoken sentence — "Borehole contaminated in Ward 7, cholera cases rising, we need ORS supplies by Thursday" — contains six structured data points. No form needed. Voice-to-schema AI handles the rest.

The voice AI market crossed $22 billion this year. Cost per voice query: under $0.01. The infrastructure cost is collapsing at the same time the capability is expanding. This is the inflection point the humanitarian sector has been waiting for — even if most of it doesn't realize it yet.`,
      },
      {
        heading: 'The Reporting System I Built — And Its Limits',
        content: `I coordinated a reporting platform where over 100 organizations across Afghanistan submit operational data to the Humanitarian Response Plan. In a single month, partners reported millions of services to beneficiaries across thousands of locations. Over 50 organizations creating hundreds of reports. That system works — it took years to build and scale.

But here's what it can't do: collapse the time between a field observation and a decision. The reporting cycle is monthly. Dashboards update after data cleaning. By the time a winterization capacity gap shows up on a coordinator's screen, the cold wave may have already hit.

Modern voice AI doesn't just transcribe — it extracts entities, classifies urgency, geo-tags, and maps speech into structured schemas automatically. The same information that takes a reporting officer 30 minutes to enter into a form takes 30 seconds to speak. That's not incremental improvement. That's a different paradigm for evidence generation.`,
      },
      {
        heading: 'The Organizations That Move First Will Hear What Others Can\'t',
        content: `The organizations that adopt voice-native data collection won't just improve response rates. They'll hear from people our current systems have been silencing for decades. The displaced mother in northeast Nigeria who thinks in Hausa. The community health worker in rural Afghanistan who can describe a cholera outbreak in Dari but can't navigate an English-language form. The market trader in a flood-affected zone who knows exactly what supplies are needed but has no way to feed that intelligence into the coordination system.

These aren't hypothetical users. These are the people I've worked with for a decade. Their intelligence is the most valuable data in any humanitarian response — and our tools have been structurally excluding them.

As the humanitarian sector manages the current shift — shrinking budgets, rising needs, growing scrutiny on impact — voice data is one of the quick wins that remains available even in the face of funding shortfalls. It gives every actor an equal playing ground to understand the needs of beneficiaries.

After a decade of building platforms that run on forms, and working within the limitations of form-based data systems, I'm now building the ones that run on voice.`,
      },
    ],
    relatedSlugs: [
      'the-form-is-already-dead',
      'voice-infrastructure-inequality',
    ],
  },

  'the-form-is-already-dead': {
    slug: 'the-form-is-already-dead',
    title: 'From Forms to Voice: The Deeper Inclusive Transition',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    date: 'March 2026',
    excerpt:
      'I\'ve spent years building reporting systems where 71 organizations submit 244 reports a month. Every number started as a human observation that had to survive a form before it became actionable. Voice-to-schema AI ends that entire pipeline.',
    sections: [
      {
        content: `I've spent years building reporting systems where 71 organizations submit 244 reports a month, tracking 3.8 million services across 1,322 locations. The data is powerful. But every number started as a human observation that had to survive a form, a cleaning process, and a monthly reporting cycle before it became actionable.

And I say that as someone who built the forms.

Every humanitarian data form is an act of pre-judgment. Someone in a capital city decides which questions matter, which response options exist, which categories are worth tracking. The beneficiary's job is to fit their reality into those boxes. The field officer's job is to translate what they see into pre-coded categories. The analyst's job is to aggregate those categories into something meaningful.

At every step, context is lost. Nuance is stripped. The original observation is compressed into something our systems can process — not something that reflects what actually happened.`,
      },
      {
        heading: 'What Forms Cost Us',
        content: `A form asks "Was the assistance adequate?" — Yes or No. But a displaced woman in northeast Nigeria doesn't think in yes or no. She thinks: "The rice came but it was half of what we needed, my daughter is sick and there's no medicine at the clinic, and I'm afraid to go to the distribution point alone."

None of that fits a checkbox. We did the best we could with the tools we had. But we must also acknowledge how structurally inadequate those tools were for understanding the real needs of the most vulnerable. The humanitarian agenda was designed to centre affected voices. Our data infrastructure has been doing the opposite — encoding their realities into categories we find convenient to analyse.

Even qualitative methods — the approach we trust to preserve nuance — pass through layers of interpretation. An enumerator translates. A researcher codes themes. An analyst writes findings. The original intent of the person who spoke has been reshaped at least three times before it informs a decision.

I've conducted several Key Informant Interviews in my humanitarian career, and during the COVID-19 pandemic, I led secondary data analysis using the DEEP platform with several steps of workflow designed to reduce cognitive bias. The rigour was real. But the original voices of affected populations were still mediated through documents written about them, not by them.`,
      },
      {
        heading: 'Voice-to-Schema: The Technical Shift',
        content: `One spoken sentence — "Borehole contaminated in Ward 7, cholera cases rising, we need ORS supplies by Thursday" — contains six structured data points. Location: Ward 7. Infrastructure affected: borehole. Status: contaminated. Health impact: cholera. Need: ORS supplies. Urgency: Thursday.

No form needed. Voice-to-schema AI handles the extraction, classification, and structuring automatically. The original recording remains as the auditable source of truth — something no form-based system has ever provided.

Modern voice AI doesn't just transcribe. It extracts entities, classifies urgency, detects sentiment, geo-tags references, and maps speech into analytical frameworks. It does this in real time, at scale, for under a cent per interaction.

The same information that takes a reporting officer 30 minutes to enter into a form takes 30 seconds to speak. Multiply that across 200+ organizations and thousands of field workers, and you're looking at a fundamental acceleration of the evidence generation pipeline.

But the real gain isn't speed — it's fidelity. Voice captures what forms can't: emphasis, uncertainty, urgency, context. When a health worker says "cholera cases rising" with alarm in her voice, that urgency is data. A checkbox marked "health concern" strips all of that away.`,
      },
      {
        heading: 'The Question Isn\'t Whether — It\'s Who Goes First',
        content: `Voice AI VC investment surged 7x in two years. About 78% of businesses are deploying it. The voice AI market crossed $22 billion. Cost per query: under $0.01. The commercial sector has already moved.

The humanitarian sector hasn't. Not because the technology doesn't work — but because our institutional architecture is built around forms. Our M&E frameworks assume structured questionnaires. Our databases assume tabular data. Our quality assurance processes assume manual review of coded responses.

The question isn't whether voice replaces humanitarian forms. It's who redesigns and leverages their voice data pipeline first. The first mover advantage here isn't about technology — it's about evidence quality. The organization that builds voice-native data collection will generate richer, more timely, more inclusive evidence than any competitor still running on forms.

After a decade of building platforms that run on forms, and working within the limitations of form-based data systems, I'm now building the ones that run on voice. The form served us well. But its time is over.`,
      },
    ],
    relatedSlugs: [
      'voice-is-the-future-of-humanitarian-data',
      'the-voices-our-data-systems-silence',
    ],
  },

  'africa-will-define-voice-ai': {
    slug: 'africa-will-define-voice-ai',
    title: 'Africa Will Define How the World Uses Voice AI',
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '9 min',
    date: 'March 2026',
    excerpt:
      'Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI. And this time, the continent won\'t just adopt — it will lead.',
    sections: [
      {
        content: `Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI.

I've built data systems in Maiduguri, Addis Ababa, Cox's Bazar, and Kabul. The pattern is consistent — the further you get from capital cities and English-language interfaces, the more our data systems fail the people who need them most. But everyone can speak. Every community, every market, every family has oral communication as its primary mode.

That's not a limitation. That's a design specification.`,
      },
      {
        heading: 'The Leapfrog That\'s Already Happening',
        content: `Africa has 2,000+ languages, most primarily oral. Traditional NLP depends on parallel text datasets that barely exist for these languages. You can't build a translation model on text that was never written down. But speech? Speech exists everywhere.

Google's WAXAL released 11,000+ hours across 21 Sub-Saharan African languages from 2 million recordings. The cost per voice AI query has dropped to $0.001-$0.01 — cheaper than an SMS in most African markets. Meta's Omnilingual ASR now covers 1,600+ languages. Microsoft's PazaBench benchmarks ASR across 39 African languages.

The infrastructure for voice-native AI on the continent is being built right now — faster than most people realize. And unlike developed markets retrofitting voice onto legacy systems, African markets can build voice-first from the ground up. There are no legacy text-based systems to migrate from. The greenfield advantage is enormous.

Africa won't just adopt voice AI. Africa will define how the world uses it.`,
      },
      {
        heading: 'What I Saw in the Field',
        content: `I've seen what happens when data systems assume English literacy. In northeast Nigeria, I built cluster information management from scratch during the crisis response — dashboards and factsheets that served coordination but often couldn't capture what a community leader in a displacement camp actually wanted to communicate. In Afghanistan, we delivered Humanitarian Data Literacy training in Pashto and Dari because English-language tools created a barrier to the very partners we depended on for data.

In Cox's Bazar, I coordinated data across 1,100+ radio listening groups in refugee camps. Our structured surveys still couldn't capture what displaced Rohingya families actually prioritised. The forms asked what we wanted to know. Not what they needed to tell us.

The lesson was always the same: the interface excludes before the data even arrives. And the exclusion tracks perfectly with language and literacy — the communities with the most to contribute are the ones our systems are least equipped to hear.

Voice-native AI removes that barrier entirely. Not as an accessibility addon. As the primary interface.`,
      },
      {
        heading: 'From Humanitarian Lesson to Founder Conviction',
        content: `This isn't just a humanitarian insight. It's a commercial thesis.

78% of Nigerians send voice messages daily. The country has 200 million people and a $2.3 billion urban service economy where less than 5% of transactions happen on formal platforms. Why? Because the platforms are text-based, designed for formal addresses, built for stable internet, and assume digital payment accounts.

That's why Vendoh — the voice-first service marketplace I'm building — uses voice as the primary interface, not as an alternative. Voice-enabled discovery in Nigerian English and Pidgin. Intelligent proximity matching. Voice-driven service requests. Because that's how people actually communicate.

The implications extend far beyond any single platform. Voice-first AI in African markets isn't an accessibility feature — it's the default interaction model for a continent where oral communication has always been primary. The companies and organizations that understand this will build the infrastructure layer for the next phase of African digital development.

The question isn't whether Africa embraces voice AI. It's whether the rest of the world learns from how Africa deploys it.`,
      },
    ],
    relatedSlugs: [
      'voice-infrastructure-inequality',
      'from-humanitarian-data-to-digitising-africas-markets',
    ],
  },

  'voice-powered-decision-intelligence': {
    slug: 'voice-powered-decision-intelligence',
    title: 'From Reporting Platforms to Voice-Powered Decision Intelligence',
    category: 'Opinion / Technical',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '11 min',
    date: 'March 2026',
    excerpt:
      'A field officer in Kabul told me: "By the time our data reaches Kabul, the situation has already moved." He was right. Voice AI combined with agentic AI collapses the pipeline from weeks to seconds.',
    sections: [
      {
        content: `I was coordinating a program where 200+ organizations reported into a system I helped build. We tracked 3.4 million services across thousands of locations. We produced winterization dashboards, drought monitoring maps, predictive targeting studies. 23.7 million Afghans — more than half the population — needed humanitarian assistance. The data mattered.

And yet, in a coordination meeting, a field officer said: "By the time our data reaches Kabul, the situation has already moved."

He was right. Our 50-step analysis workflow was rigorous. It was also slow. The monthly reporting cycle meant decisions were always based on last month's evidence. By the time a winterization capacity gap appeared on a coordinator's screen, the cold wave may have already hit.

This isn't a failure of the people or the analysis. It's a failure of the pipeline.`,
      },
      {
        heading: 'The Pipeline Problem',
        content: `I led a $9.7M USAID-funded program that integrated humanitarian reporting, geospatial analysis, climate early warning, and cash transfer coordination. Our team built the Humanitarian Spatial Data Center — drought monitoring with NDVI, precipitation forecasting, vegetation health indices at 250-meter resolution, updated monthly via Google Earth Engine.

The data was powerful. But the pathway from a field observation to a strategic decision still ran through a pipeline designed for thoroughness, not speed. Field worker observes. Enters data into form. Data is cleaned. Aggregated. Analyzed. Formatted. Reviewed. Published. Distributed. Read by decision-maker. Decision is made.

In my systems, we produced 67 information products in a single month — dashboards, snapshots, maps, situation reports — across 13 humanitarian clusters. Each product followed that pipeline: collect, clean, analyze, design, review, publish. That cycle takes days to weeks.

The products we published on ReliefWeb described situations that had already evolved by the time someone read them. Not because the analysis was wrong — because the pipeline was structurally slow.`,
      },
      {
        heading: 'Voice + Agentic AI = Decision Intelligence',
        content: `Now imagine a different architecture. A field worker speaks a situation update. She doesn't fill out a form — she describes what she sees. AI agents transcribe it, extract structured indicators, cross-reference it against NDVI drought data and supply chain positions, and generate a decision brief — in under a minute.

Every component of that pipeline exists today. Voice models handle Nigerian English, Pidgin, and low-resource languages. Agentic frameworks chain multi-step reasoning autonomously. Satellite data APIs provide real-time environmental monitoring. Cost per interaction: under a cent.

This is what I call the shift from reporting to decision intelligence. Instead of a pipeline that moves data from field to desk over weeks, you have a system that continuously processes voice inputs, cross-references multiple data streams, and delivers role-aware intelligence in real time.

The health worker gets a brief about disease trends in her catchment area. The logistics officer gets supply chain recommendations based on access constraints. The coordinator gets a multi-sectoral overview that highlights emerging gaps. The donor gets impact evidence. Each stakeholder receives the intelligence they need, formatted for their role, delivered when it's still actionable.`,
      },
      {
        heading: 'The Architecture of Decision Intelligence',
        content: `Voice-powered agentic AI collapses the traditional pipeline into three layers:

Voice as the input layer — no forms, no training required, no literacy barrier. Field workers, community leaders, beneficiaries themselves speak. The system listens, transcribes, extracts structure.

Autonomous agents that cross-reference voice inputs against satellite imagery, epidemiological baselines, historical trends, and supply data in parallel. These agents don't wait for human instruction. They continuously process, classify, flag anomalies, identify patterns, and update their understanding as new voice inputs arrive.

Role-aware briefs delivered to coordinators, logistics officers, program managers, and donors — each getting the evidence they need, in real time, formatted for their specific decisions.

I'm not suggesting AI replaces the coordinator's judgment. But instead of deciding based on a two-week-old report, they're acting on real-time, evidence-backed intelligence. That's the leap from data collection to decision intelligence — and it's not incremental improvement. It's the evolution from reporting platforms to something fundamentally different.`,
      },
      {
        heading: 'Why This Is What I\'m Building Toward',
        content: `The future isn't faster reporting. It's replacing reporting with continuous voice-driven intelligence.

The technology is ready. Large language models can read, understand, classify, and synthesize information. Multi-agent orchestration frameworks exist. Voice models work in dozens of low-resource languages and the coverage is expanding monthly. The cost structure has collapsed to fractions of a cent per interaction.

What's missing is someone who understands both the technology and the operational reality — someone who's built the reporting systems, managed the analytical workflows, coordinated the multi-cluster responses, and can see exactly where the pipeline breaks down and how voice-powered agentic AI can replace it.

That's the intersection where I sit. A decade of humanitarian information management taught me what the pipeline looks like. The next phase is rebuilding it from the voice up.`,
      },
    ],
    relatedSlugs: [
      'future-of-humanitarian-im-is-agentic',
      'voice-is-the-future-of-humanitarian-data',
    ],
  },

  'the-voices-our-data-systems-silence': {
    slug: 'the-voices-our-data-systems-silence',
    title: 'The Voices Our Data Systems Were Built to Silence',
    category: 'Opinion',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    date: 'March 2026',
    excerpt:
      'Accountability to Affected Populations has been a humanitarian commitment for over a decade. But our data collection tools — forms, checkboxes, pre-coded response categories — were never designed to listen. Voice AI changes the power dynamic.',
    sections: [
      {
        content: `For decades, we've relied on structured forms — checkboxes, dropdown menus, pre-coded response categories. Tools designed for analysts, not for the people living through crises.

I've managed needs assessments, response monitoring, and output reporting across Bangladesh, Ethiopia, Afghanistan, and Nigeria. The experience is the same everywhere: forms capture whether aid was received. They don't adequately capture what a mother actually needs, in her own words, with her own emphasis.

Data forms, by design, flatten context. They translate lived experience into categories someone in an office predetermined before going to the field. The voices the humanitarian agenda was built to uplift have been filtered through our tools before they ever reached a decision-maker.

We acknowledge we did the best we could with available resources. But "best we could" still meant: pre-coded forms, translated by intermediaries, interpreted by analysts, aggregated into dashboards that decision-makers read months later. The most vulnerable — women, children, displaced communities, people with disabilities — are represented as data points, not as people with context, priorities, and agency.`,
      },
      {
        heading: 'The Power Dynamic in Every Form',
        content: `Every humanitarian data form is an act of pre-judgment. Someone in a capital city decides which questions matter, which response options exist, which categories are worth tracking. The beneficiary's job is to fit their reality into those boxes.

In Cox's Bazar, I coordinated data across 1,100+ radio listening groups in refugee camps. Our structured surveys still couldn't capture what displaced Rohingya families actually prioritised. The forms asked what we wanted to know. Not what they needed to tell us.

Accountability to Affected Populations has been a humanitarian commitment for over a decade. The principle is clear: affected people should participate in decisions that impact their lives. But look at how we actually collect data from them.

We design forms in English. Translate them — often imperfectly — into local languages. Train enumerators to ask questions in a specific sequence. Offer pre-coded response options. Record answers in categories built for aggregation and dashboards.

At every step, the beneficiary's voice is compressed. Their priorities filtered through our framework. Their context stripped to fit our schema. The people closest to a crisis have always had the answers. Our tools just weren't built to listen.`,
      },
      {
        heading: 'Even Our Best Methods Mediate',
        content: `Even qualitative methods — the approach we trust to preserve nuance — pass through layers of interpretation. An enumerator translates. A researcher codes themes. An analyst writes findings. The original intent of the person who spoke has been reshaped at least three times before it informs a decision.

I've conducted several Key Informant Interviews in my humanitarian career, and during the COVID-19 pandemic, I led secondary data analysis using the DEEP platform with several steps of workflow designed to reduce cognitive bias. The rigour was real. But the original voices of affected populations were still mediated through documents written about them, not by them.

We did the best we could. And the results mattered — they informed decisions that affected millions of people. But the interface was always the bottleneck to evidence generation — not the data, not the analysis, not the people.

The question we need to ask ourselves is uncomfortable: in a sector built on the principle of centering affected populations, why have our data tools been structurally designed to exclude their direct input?`,
      },
      {
        heading: 'Voice Restores Agency',
        content: `Voice-native data collection inverts the power dynamic entirely. It doesn't ask what we want to know. It asks: what do you need us to hear?

With voice data, a beneficiary speaks — in her language, with her priorities, with her emphasis — and AI captures that as structured, analysable data without stripping the context. The original recording remains as the auditable source of truth. She can verify it, correct it, update it. That's accountability to affected populations — not as a reporting checkbox, but as system architecture.

Modern voice AI doesn't just transcribe. It extracts entities, classifies urgency, detects sentiment, and maps speech to analytical frameworks — while retaining the original recording as the auditable source. The person's own voice becomes the data. Not an intermediary's interpretation of what they said.

This is what truly inclusive evidence generation looks like: voice as the default input. Not a supplement. Not an accessibility feature. The primary way affected populations contribute to the humanitarian evidence base. In their language. In their words. In their framing.`,
      },
      {
        heading: 'A Forward-Looking Framework for Inclusive Evidence',
        content: `First — voice as the default input method. Not an alternative. The primary interface for how affected communities contribute to humanitarian evidence.

Second — AI-powered structuring that preserves context. Extract entities, classify urgency, map to analytical frameworks — while retaining the original recording as the auditable source of truth.

Third — multilingual by design. Google's WAXAL covers 21 African languages. Meta's Omnilingual ASR supports 1,600+. The infrastructure is arriving. Humanitarian systems need to integrate it now, not wait for perfection.

Fourth — beneficiary-owned feedback loops. When a person's spoken testimony is the data, they can verify it, correct it, update it. That's accountability to affected populations built into the system architecture.

Fifth — real-time evidence for real-time decisions. Voice collapses the collect-clean-analyse-report cycle into seconds. Decision-makers receive evidence while it's still actionable — not weeks after the situation has moved.

Voice data doesn't just improve collection. It restores the agency we've been designing out of our evidence systems for decades. After a decade of building platforms that run on forms, I'm now building the ones that run on voice.`,
      },
    ],
    relatedSlugs: [
      'the-form-is-already-dead',
      'voice-infrastructure-inequality',
    ],
  },

  'voice-infrastructure-inequality': {
    slug: 'voice-infrastructure-inequality',
    title: 'Voice Infrastructure Inequality: The New Digital Divide',
    category: 'Opinion / Research',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    date: 'March 2026',
    excerpt:
      'AI scores 80% accuracy in English. Below 55% in Yoruba, spoken by 50 million people. If voice is the future of data, then voice infrastructure inequality is the future of data exclusion.',
    sections: [
      {
        content: `Only about 20% of the world speaks English at home. Yet nearly half of all AI training data is in English. Large language models score about 80% accuracy in English — below 55% for Yoruba, a language spoken by 50 million people. About 93% of the world's 7,000 languages are digitally underrepresented. Swahili, spoken by 200 million people, has 500 times less digital content than German.

If voice is the future of data, then voice infrastructure inequality is the future of data exclusion. The languages AI can hear will determine whose reality gets captured — and whose gets erased.

That's not a technology problem. That's a structural inequality problem wearing a technology mask.`,
      },
      {
        heading: 'The Language Wall',
        content: `Access to voice AI infrastructure tracks almost perfectly with GDP. The languages with the most speech recognition support are the languages of the world's largest economies — English, Mandarin, German, Japanese. The languages with the least support belong to communities that already face the deepest data gaps.

Stanford research shows AI is leaving non-English speakers behind — not because they lack access, but because models don't work in their languages. Countries where low-resource languages dominate show AI adoption rates about 20% lower than high-resource language countries — even when internet connectivity is comparable. The barrier isn't devices or broadband. It's that the AI doesn't understand them.

This is structural inequality in the age of AI. Not a firewall or a paywall. A language wall. If the infrastructure powering artificial intelligence is not democratic enough to serve everyone, then technological evolution doesn't close gaps — it widens them. The people furthest from economic power become furthest from the data systems shaping their futures.`,
      },
      {
        heading: 'What This Means for Humanitarian Evidence',
        content: `Now consider what this means for humanitarian evidence. Every sector is moving toward AI-powered analytics — healthcare, climate adaptation, food security. These systems need input data. If voice is the future of that input, and voice infrastructure only works in about 7% of the world's languages, then about 93% of humanity risks being excluded from the evidence base that drives decisions about their lives.

I've lived this. In Afghanistan, we delivered data literacy training in Pashto and Dari because the platforms were English-only. In Maiduguri, I built information management for the North East Nigeria crisis response where community leaders had critical intelligence but no way to feed it into coordination systems in Hausa or Kanuri.

I've managed programs where 23.7 million Afghans needed humanitarian assistance — more than half the population. The data systems informing that response relied on English-language platforms. Imagine instead: voice-native systems in Dari, Pashto, Hazaragi, Uzbek — where affected communities contribute directly to the evidence in real time.

That's not a distant future. That's what should exist now.`,
      },
      {
        heading: 'The Infrastructure Being Built — And the Gap That Remains',
        content: `Africa has 2,000+ languages. Google's WAXAL covers 21. The Gates Foundation's African Next Voices covers 18. Important starts — but less than about 2% of the continent's linguistic diversity.

Meta's Omnilingual ASR now covers 1,600+ languages. Microsoft's PazaBench benchmarks ASR across 39 African languages. The technology is advancing. But investment follows commercial return, not humanitarian need. G7 languages get investment. Languages of the Sahel, the Horn of Africa, South and Southeast Asia — where humanitarian needs are greatest — do not.

The voice AI market is $22 billion. But that growth is concentrated in languages already well-served. If we don't invest in voice infrastructure for low-resource languages — the about 93% that are digitally underrepresented — then the voice data revolution will simply reproduce existing exclusions in a new medium.

Voice data gives every actor an equal playing ground. But only if the infrastructure is built to serve every language, not just the commercially profitable ones.`,
      },
      {
        heading: 'The Stakes Are Higher Than We Realize',
        content: `Here's the uncomfortable truth: if AI becomes the primary engine of evidence generation, and voice becomes the primary input, then voice infrastructure inequality becomes a direct determinant of whose needs are visible and whose are not.

This fits into a much larger conversation. AI is growing exponentially. If the infrastructure powering it isn't democratic enough to serve everyone, then technological evolution doesn't reduce inequality — it compounds it. The same communities marginalized by colonial economic structures, by the digital divide, by the English-language bias of the internet, will be marginalized again — this time by the languages their AI can't hear.

As the humanitarian sector repositions amid funding shortfalls, this isn't abstract. The communities with the greatest needs and the least voice infrastructure will face the widest evidence gaps — precisely when accurate data matters most.

As AI becomes the backbone of evidence generation in health, agriculture, education, and humanitarian response — communities whose languages lack voice infrastructure will be invisible in the data systems that shape their futures. Voice infrastructure inequality is the new digital divide. And it's already widening.

We can still build this differently. But the window is narrowing.`,
      },
    ],
    relatedSlugs: [
      'africa-will-define-voice-ai',
      'the-voices-our-data-systems-silence',
    ],
  },

  'building-voice-native-evidence-systems': {
    slug: 'building-voice-native-evidence-systems',
    title: 'Building Voice-Native Evidence Systems: From Theory to Architecture',
    category: 'Technical Vision',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '9 min',
    date: 'March 2026',
    excerpt:
      'What does a voice-native humanitarian evidence system actually look like? After a decade of building form-based platforms, here\'s the architecture I\'m working toward — and why it changes everything about how we generate evidence.',
    sections: [
      {
        content: `After a decade of building platforms that run on forms, and working within the limitations of form-based data systems, I'm now building the ones that run on voice. But what does that actually mean? Not as a thought experiment — as architecture.

I've spent enough time in the humanitarian sector to know that vision without implementation is just another conference slide. So let me be specific about what voice-native evidence generation looks like in practice, drawing on the operational realities I've encountered across six countries and the voice AI infrastructure that now makes this possible.`,
      },
      {
        heading: 'The Current Architecture — And Where It Breaks',
        content: `The evidence generation pipeline I've built and managed follows a consistent pattern across every humanitarian operation:

Design phase: subject matter experts design survey instruments, reporting templates, and indicator frameworks. This takes weeks. The instruments are in English, translated imperfectly, and assume a level of interface literacy that excludes the most vulnerable respondents.

Collection phase: trained enumerators administer forms — on tablets, on phones, on paper. Each interaction takes 20-45 minutes. The enumerator translates between the respondent's language and the form's language. Context is compressed into pre-coded categories.

Processing phase: data managers clean, validate, and aggregate submissions. They catch errors, reconcile inconsistencies, and prepare datasets for analysis. This takes days to weeks, depending on volume.

Analysis phase: analysts produce dashboards, situation reports, and information products. In Afghanistan, we produced 67 products in a single month across 13 clusters. Each product follows its own review and approval workflow.

Dissemination phase: products are published — on ReliefWeb, through coordination channels, to donors. By the time they're read, the situation they describe may have moved.

This pipeline works. I've built it at scale. But it's structurally slow, inherently exclusionary, and lossy at every transition point.`,
      },
      {
        heading: 'The Voice-Native Architecture',
        content: `A voice-native evidence system replaces the pipeline with a continuous flow. Here's the architecture:

Input layer: voice as the primary interface. No forms. No training required. Field workers, community leaders, health workers, and beneficiaries speak — in their language, with their priorities, with their context. The system listens in Dari, Pashto, Hausa, Yoruba, Pidgin, or any of the 1,600+ languages that modern ASR systems support.

Structuring layer: AI-powered extraction converts speech to structured data in real time. Entities are identified — locations, needs, quantities, urgency levels. Sentiment and emphasis are captured. The output is structured data that feeds into existing analytical frameworks. The original recording is preserved as the auditable source of truth.

Cross-reference layer: autonomous agents compare voice inputs against baseline data — satellite imagery, epidemiological trends, supply chain positions, historical patterns. Anomalies are flagged automatically. Contradictions between voice reports and other data sources are surfaced for human review.

Intelligence layer: role-aware briefs are generated for different stakeholders. The field coordinator gets operational intelligence. The program manager gets trend analysis. The donor gets impact evidence. Each stakeholder receives information formatted for their decisions, delivered at the frequency they need it.

Feedback layer: speakers can review, correct, and update their contributions. They see how their input was interpreted and can challenge the system's classification. This isn't just accuracy improvement — it's accountability to affected populations as system architecture.`,
      },
      {
        heading: 'The Cost Structure Has Collapsed',
        content: `This isn't aspirational technology. Every component exists today at scale.

Voice recognition: Whisper, WAXAL, Omnilingual ASR — sub-cent per interaction, supporting hundreds of languages including low-resource African languages.

Entity extraction and structuring: GPT-4o-class models extract structured data from unstructured speech with high accuracy. Custom fine-tuning for humanitarian taxonomies is straightforward.

Agentic orchestration: multi-agent frameworks coordinate complex workflows autonomously — the same technology that powers autonomous coding assistants can power autonomous evidence generation.

Satellite and climate data: Google Earth Engine, Climate Data Store, CHIRPS, FEWS NET — all accessible via API, all updatable in near-real-time.

The total cost of processing a single voice input through this entire pipeline — transcription, structuring, cross-referencing, and brief generation — is under $0.05. For context, the cost of administering a single form-based survey in the field runs $5-50 per household when you account for enumerator time, transport, data entry, and cleaning.

The economics aren't just favorable. They're transformational. Especially for a sector facing funding shortfalls and growing pressure to demonstrate impact efficiently.`,
      },
      {
        heading: 'What This Means for the Sector',
        content: `Voice-native evidence systems don't replace humanitarian analysts. They multiply their capacity. One analyst with voice-powered agentic AI support can process the information volume that currently requires a team of five. Not because the AI is smarter — because it handles the repetitive structural work and lets the human focus on judgment, context, and decision-making.

This matters now because the volume of humanitarian information is growing exponentially — more organizations, more reporting systems, more real-time data feeds, more beneficiary communication platforms. The analyst workforce can't scale to meet demand. You can't hire your way out of this problem.

For the organizations and actors who move first, the advantage isn't just efficiency. It's evidence quality. Voice-native systems capture what forms can't: context, emphasis, nuance, urgency. They include populations that form-based systems structurally exclude. They generate evidence in real time instead of on monthly cycles.

The interface was always the bottleneck to evidence generation — not the data, not the analysis, not the people. Voice removes the bottleneck. What follows is a fundamentally different relationship between the humanitarian sector and the communities it serves.

That's what I'm building toward.`,
      },
    ],
    relatedSlugs: [
      'voice-is-the-future-of-humanitarian-data',
      'future-of-humanitarian-im-is-agentic',
    ],
  },

  'disaster-loss-data-climate-adaptation': {
    slug: 'disaster-loss-data-climate-adaptation',
    title: 'Why Disaster Loss Data Matters More Than Ever for Climate Adaptation',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'In Cox\'s Bazar, host communities pushed back against reforestation — not because they opposed it, but because their own climate losses to coastal erosion and cyclones were undocumented and therefore unfundable. Disaster loss data is now the evidentiary backbone of the entire climate adaptation architecture.',
    keywords: [
      'disaster loss data',
      'climate adaptation',
      'Loss and Damage Fund',
      'DELTA Resilience',
      'Sendai Framework',
      'Belém Adaptation Indicators',
      'COP30',
      'Cox\'s Bazar',
      'host community climate vulnerability',
      'humanitarian data',
      'climate finance',
      'NDMA-NSO partnership',
    ],
    sections: [
      {
        content: `In Cox's Bazar, Bangladesh, I watched a reforestation programme collide with a community that was already losing ground — literally. The sudden influx of approximately 700,000 Rohingya refugees in 2017 had caused immense environmental strain, stripping hillsides of forest at a rate estimated at roughly four football fields every single day. IOM's reforestation effort — part of the broader Safe Access to Fuel and Energy Plus (SAFE+) programme — was replanting over 778 hectares with more than 775,000 trees, using Vetiver and Broom grass to stabilise soil against landslide and flood risk in and around the camps.

The host communities pushed back — hard. Not because they opposed reforestation. Because they were simultaneously dealing with rising sea levels eating into their own agricultural land, increasingly severe cyclone seasons battering their livelihoods, and the social and economic pressure of hosting one of the world's largest displaced populations on land they were already losing to the Bay of Bengal. IOM adopted a cash-for-work approach to the reforestation — hiring host community members for planting, site preparation, and nursery management — as a proven method for creating livelihood opportunities and reducing the refugee-host community tensions that were building across the district. The approach was smart: it turned an environmental intervention into an economic one, giving host communities a material stake in the programme's success.

But when we sat with local disaster management authorities to discuss reforestation priorities, the conversation still cut deeper than livelihoods. It was about competing vulnerabilities, compounding risks, and a community whose own climate losses — the land they were losing to the sea, the embankments failing each monsoon, the crops destroyed by cyclone flooding — felt invisible next to the scale and resourcing of the refugee response. Cash-for-work addressed the economic tension. It could not address the evidentiary one: that the host community's disaster losses were undocumented, unquantified, and therefore unfundable.

That experience crystallised something I had been observing across multiple crisis contexts: disaster loss data is no longer a back-office record-keeping exercise. It is the evidentiary backbone of the entire global climate adaptation architecture — and the communities that need it most are the ones whose losses are least documented.`,
      },
      {
        heading: 'The Evidence Gap Nobody Talks About',
        content: `The host communities around Cox's Bazar had a legitimate grievance: their flood losses, their coastal erosion, their cyclone damage — none of it was systematically recorded in a format that could compete for adaptation funding against the well-documented refugee response. The refugee operation had registration data, displacement tracking, cluster-level needs assessments, and donor reporting pipelines. The host community's climate losses had fragmented local records and anecdotal evidence.

This asymmetry is not unique to Bangladesh. Of 193 UN Member States, only [153 report to some degree](https://www.undrr.org/monitoring-sendai-framework) on the Sendai Framework targets, and significant data quality gaps persist even among those that do. Many countries — particularly in the Global South — still rely on paper-based disaster records or fragmented spreadsheets that cannot be aggregated, compared, or verified. The [Global Assessment Report 2025](https://www.undrr.org/gar/gar2025) estimated the true cost of disasters at $2.3 trillion globally — but in many of the most disaster-affected countries, the loss data that would justify DRR investment simply doesn't exist in a usable form.`,
      },
      {
        heading: 'Whose Responsibility Is This?',
        content: `Here is the uncomfortable truth that the Cox's Bazar experience laid bare: the responsibility for collecting disaster loss and damage data was never in the hands of humanitarian organisations in the first place.

IOM, UNHCR, WFP, and the cluster system collect operational data — displacement figures, needs assessments, response coverage — because they need it to run emergency programmes. That data is designed for coordination, not for national statistical accounting. It tracks what humanitarian agencies are doing. It does not systematically track what disasters are costing a country's population, infrastructure, agriculture, and ecosystems over time. Yet in the absence of functioning national systems, humanitarian data has become a proxy for loss data — and a poor one, because it captures response activity rather than comprehensive impact.

The responsibility for systematic, complete, and quality disaster loss and damage data sits with two national institutions: [National Disaster Management Agencies](https://www.undrr.org/building-risk-knowledge/disaster-data) (NDMAs), who collect operational impact data from the ground, and [National Statistical Offices](https://www.undrr.org/building-risk-knowledge/framework-disaster-statistics) (NSOs), who certify that data as official statistics meeting international standards. This is where the Sendai Framework places the mandate. This is where the [G-DRSF](https://www.undrr.org/building-risk-knowledge/framework-disaster-statistics) — endorsed by the UN Statistical Commission in March 2026 — assigns institutional roles.

But we must be honest about why these institutions have not always fulfilled this mandate. NDMAs in many countries operate with skeleton staff, outdated tools, and budgets that prioritise emergency response over data management. NSOs rarely have disaster statistics units — and when they do, those units compete for resources against census operations, economic surveys, and demographic monitoring. UNDRR's own [capacity assessments](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) have consistently found gaps in governance, technical infrastructure, data quality, and human capacity across the countries they support. The [UNDRR Strategic Framework 2026-2030](https://www.undrr.org/strategic-framework-2026-2030) identifies risk knowledge as a critical gap requiring systematic institutionalisation and resourcing — an acknowledgement that the mandate exists but the means to fulfil it often do not.

The result is predictable: one of the most common challenges among reporting countries is the [reliability of data and the systematisation of datasets](https://www.undrr.org/measurement-indicators-sendai-framework) from different sources generated by different institutions. Data completeness, consistency, and disaggregation remain uneven. And communities like those in Cox's Bazar — whose losses fall outside the humanitarian data pipeline and outside the capacity of under-resourced national systems — end up in an accountability void where nobody is counting what they have lost.

Meanwhile, humanitarian data capacity itself is shrinking. The [State of Open Humanitarian Data 2026](https://centre.humdata.org/) revealed that crisis data availability has fallen from 74% to 68% across 22 humanitarian operations. OCHA, UNHCR, and IOM have all experienced significant reductions in data staff. The proxy system is degrading at the same time as the demand for the real thing has never been higher.`,
      },
      {
        heading: 'Three Convergent Pressures',
        content: `What has changed is not the importance of disaster loss data — it has always mattered. What has changed is that three global policy processes now simultaneously demand it, and the consequences of not having it are financial.

**The [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data)** has $768 million in pledges against $580 billion in estimated need. Its first COP30 call for proposals made one thing clear: evidence-based loss data is the prerequisite for accessing finance. Communities like those around Cox's Bazar cannot access this funding without structured proof of what they have lost. **The [Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data)** — 59 indicators adopted at COP30 — require countries to demonstrate that disaster impacts are actually declining across sectors. You cannot demonstrate declining impact without historical loss baselines. **The [Sendai Framework Endgame](https://sendaimonitor.undrr.org/)** enters its final five-year implementation window in 2026, with the "Beyond the Numbers" acceleration strategy demanding disaggregated, validated, internationally comparable data. The 38 Sendai indicators feed directly into 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1.

Each process independently requires granular disaster loss data. Together, they create an unprecedented demand signal — and an unprecedented penalty for countries that cannot respond.`,
      },
      {
        heading: 'What Good Data Would Have Changed',
        content: `Back in Cox's Bazar, what would structured disaster loss data have changed? Everything about how that conversation with local disaster management authorities unfolded.

If the district had maintained disaggregated records — hectares of agricultural land lost to coastal erosion by year, number of households displaced by cyclone flooding by union, damage to embankments and infrastructure by monsoon season — the host community's climate vulnerability would have been quantifiable, comparable, and fundable. The reforestation programme would not have needed cash-for-work alone to earn community consent. It would have been framed from the outset as what it actually was: a dual-benefit climate adaptation measure where replanting stabilised hillsides for refugees at risk of landslide and restored watershed function for a host community losing agricultural land to erosion and flooding. The data would have made both vulnerabilities visible in the same frame — and made the case that investing in one community's resilience was inseparable from investing in the other's.

The consent problem we faced was, at its root, a data problem. The refugee response had data infrastructure — registration systems, displacement tracking, cluster-level needs assessments, donor reporting pipelines. The host community's climate losses had fragmented local records and anecdotal evidence. Cash-for-work could address the economic grievance. Only structured loss data could have addressed the deeper one: the feeling that your crisis does not count because nobody is counting it.`,
      },
      {
        heading: 'DELTA Resilience: The System Designed to Close the Gap',
        content: `This is precisely the problem that [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is designed to solve. Co-developed by [UNDRR, UNDP, and WMO](https://www.undrr.org/news/undp-wmo-and-undrr-issue-statement-tracking-hazardous-events-and-disaster-losses-and-damages) to replace the legacy DesInventar platform, DELTA is a comprehensive system of tools, standards, and governance frameworks built to give NDMAs and NSOs the infrastructure they have lacked. Its [Data Ecosystem Maturity Assessment](https://www.undrr.org/event/bonn-technical-forum-2025-scene-setting-webinar-data-ecosystem-maturity-assessment-towards) diagnoses gaps in governance, infrastructure, data quality, and human capacity before any technology is deployed.

Critically, DELTA applies [no minimum thresholds for recording](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience): localised, cascading, slow-onset, and rapid-onset events can all be documented consistently across sectors and scales. Legacy systems tend to capture headline disasters while the slow erosion of agricultural land, the seasonal flooding that displaces a few hundred families, and the localised landslide that destroys a school go unrecorded. For communities like those in Cox's Bazar, whose losses were incremental, compounding, and politically invisible, a no-threshold system means their crisis finally gets counted. DELTA uses universally unique identifiers (UUIDs) to systematically connect hazardous-event observations to their impacts — including [cascading and compound effects](https://www.undrr.org/event/bonn-technical-forum-2025-accelerating-tracking-hazardous-events-and-disasters) — producing the granular, multi-hazard loss records that the Sendai Framework, the Loss and Damage Fund, and the [Belém Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data) all require. Its "one-report-two-purposes" design means data entered once for the 38 Sendai indicators automatically feeds 12 SDG indicators, eliminating double-reporting. The [Arab States regional rollout](https://www.undrr.org/news/arab-states-accelerate-disaster-loss-and-damage-data-regional-rollout-delta-resilience), launched in Doha with 18 Member States, demonstrated the model: country-specific roadmaps drafted around institutional capacity, not technology wish lists.

The investment case is direct: disaster loss data is the input that makes every other DRR investment measurable. The countries that invest now will access the Loss and Damage Fund. Those that do not will find themselves locked out — not because their losses are less real, but because they cannot prove them.`,
      },
      {
        heading: 'Where We Go from Here',
        content: `The architecture is finally in place — DELTA Resilience, the G-DRSF, the Sendai Framework Monitor, the Loss and Damage Fund. What remains is the hardest part: building national capacity to collect, validate, analyse, and publish disaster loss data that meets these standards. This means investing in [data ecosystem maturity assessments](/expertise#data-analytics) before deploying technology, forging NDMA-NSO partnerships that outlast project cycles, and recognising that the data officer in a district disaster management office — the person who could have documented what Cox's Bazar's host communities were losing to the sea — is doing some of the most consequential climate work on the planet.

Every dollar of climate finance that flows to the wrong place because the loss data wasn't there is a dollar stolen from the communities who need it most. The data systems exist to prevent that. The question is whether we will build them fast enough.`,
      },
    ],
    relatedSlugs: [
      'desinventar-to-delta-resilience',
      'g-drsf-statisticians-disaster-managers',
      'delta-resilience-early-warning-anticipatory-action',
    ],
  },

  'building-systems-governments-can-own': {
    slug: 'building-systems-governments-can-own',
    title: 'Building Disaster Data Systems That Governments Can Own: Lessons from 10 Years in Humanitarian Information Management',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '10 min',
    date: 'April 2026',
    excerpt:
      'A flood vulnerability analysis I designed died quietly two years after I left — the trained staff member moved on, the dashboard stopped refreshing, and the analytical capability that informed life-saving decisions disappeared. The hardest lesson from a decade of building these platforms isn\'t technical. It\'s institutional.',
    sections: [
      {
        content: `In early 2019, I received a message from a former colleague in a mission I had left about two years earlier. The flood vulnerability and exposure analysis I had designed for displaced populations — a system that mapped how IDP settlement patterns intersected with flood risk across the response area to support contingency planning — was no longer being updated. The team member I had trained to maintain the analytical process had moved on. The live dashboard was gone. Only an old static version had been archived. And it was flood season again. They wanted to know whether the pattern of vulnerability and exposure among displaced populations had evolved — and they had no way to answer that question because the system that could tell them had died with the departure of the one person who knew how to run it.

That is how data innovations die operationally: not with a dramatic failure, but with a quiet erosion — a trained staff member leaves, a handover doesn't happen, a dashboard stops refreshing, and suddenly the analytical capability that informed life-saving decisions no longer exists. I wish I could say this surprised me. It didn't. I had seen it before, and I witnessed it again in the three countries where I worked afterward. Different systems, different organisations, the same pattern: an international organisation arrives, builds a sophisticated data platform, trains staff, produces impressive outputs for a year or two, and then leaves — taking the institutional knowledge, the server credentials, and the analytical momentum with them.

The hardest lesson from over a decade of building these platforms is not technical. It is this: the measure of a data system is not how sophisticated it is on launch day. It is whether it's still running two years after you leave.`,
      },
      {
        heading: 'The Graveyard of Humanitarian Data Platforms',
        content: `The humanitarian sector has a sustainability problem with data infrastructure. We celebrate launches, showcase dashboards at donor briefings, and write case studies about platforms "transforming decision-making." But we almost never return two years later to check whether they survived.

I have contributed to this graveyard. The systems that failed shared common traits: they were designed around international staff's analytical preferences rather than government workflows; hosted on servers controlled by the implementing organisation; built with tools the national team hadn't been trained to maintain; and their governance — who decides what data gets collected, who validates it, who publishes it — was never formally transferred. These failures reflect the fundamental misalignment between humanitarian project cycles (short, deliverable-driven, with rotating international staff) and what data systems need to survive: institutional permanence, local ownership, and sustained investment in human capacity.`,
      },
      {
        heading: 'The DELTA Resilience Connection',
        content: `These principles are now embedded in global architecture. [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) — the next-generation disaster tracking system — was designed around sovereign data ownership from the ground up. Its interoperability architecture (API-driven data exchange with meteorological services and sectoral ministries) integrates into existing government ecosystems rather than sitting alongside them.

The [Data Ecosystem Maturity Assessment (DEMA)](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) framework assesses governance, infrastructure, data quality, and human capacity before deploying technology. The G-DRSF institutionalises the NSO partnership by mandating statistical harmonisation between disaster management and official statistics.

These are governance improvements, not technical ones. And governance improvements determine whether systems survive.`,
      },
      {
        heading: 'What Makes a Data System Survive Its Creator',
        content: `After building or contributing to data platforms in six countries, I have distilled what works into four principles. None of them are technical. All of them are institutional.

**Institutional anchoring from Day 1.** The system must belong to government from the beginning, not be handed over at project close. This means the National Disaster Management Authority or the relevant ministry is the data owner from the first design meeting. It means the platform sits on government infrastructure (or government-controlled cloud), not on the implementing organisation's servers. It means the URL, the branding, and the access controls reflect government ownership.

**NSO partnerships.** National Statistical Offices outlive project cycles. They are the permanence anchor that project-funded NGOs cannot provide. The [G-DRSF (Global Disaster-Related Statistics Framework)](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/), endorsed by the UN Statistical Commission, formalises this insight at the global level — mandating that disaster data systems bridge the disaster management-NSO divide. In practice, this means involving the NSO from the data model design stage, not the validation stage. It means using statistical standards (p-codes, official administrative boundaries, internationally harmonised hazard classifications) that the NSO recognises. It means building a data pipeline where the disaster management authority collects operational data and the NSO certifies it as official statistics. When I conducted a data ecosystem audit at a UN agency's headquarters-level posting, the same principle applied: the system that survived was the one that aligned with existing institutional reporting flows, not the one that tried to replace them.

**Training-of-Trainers, not training-of-users.** Generic user training is expensive and ineffective. I have watched hundreds of staff trained on Power BI or QGIS who never used the tool again after training ended — because they lacked ongoing support, peer community, and institutional incentive. Training-of-Trainers (ToT) produces lasting capacity. Identify 3-5 national focal points per institution, invest heavily in their technical skills over months, and certify them only after they conduct a national workshop. Build a peer support structure so they troubleshoot without international assistance. The [Sendai Framework Academy](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) uses this model for DELTA Resilience. It creates self-sustaining knowledge ecosystems, not dependency relationships. When I built a coordination mechanism's analytical framework — a meta-analysis unifying data from five agencies across 1,559 households — it survived because the coordination mechanism owned it, not any single agency. The coordination leads maintained the analytical pipeline and onboarded new partner data. Governance was embedded in the structure, not in any individual.

**The politics of data ownership — and the politics of data suspension.** Data ownership is contested everywhere. Governments want control over publication, especially when data reveals politically sensitive patterns. Humanitarian organisations want open data for coordination. Donors want outputs demonstrating impact. These interests conflict, and if the governance structure doesn't resolve them at the design stage, the system becomes paralysed. But the politics can be even more brutal than paralysis. In one country where I served as programme coordinator, I witnessed a nationwide humanitarian reporting platform — the primary monitoring tool for over 115 partner organisations including UN clusters, NGOs, and working groups — suspended overnight when the sole donor froze funding. There was no phased transition plan. No bridge funding. No advance notification to the partners who depended on the system daily. The implementing organisation had no choice but to pause all operations immediately, and I was the one who had to communicate that decision to every partner across the response.

The consequences were immediate. The UN coordination body cancelled planned meetings with the implementing organisation and excluded it from critical information management discussions — a signal of institutional trust collapsing in real time. Partners who had built their coordination workflows around the platform were left without essential humanitarian data mid-response. Ethical questions surfaced about the reliability of an organisation that could suspend services without warning. And the episode exposed a structural vulnerability that no amount of technical sophistication could have prevented: a data system that serves an entire country's humanitarian coordination but depends on a single donor is a system with a single point of failure. The experience reinforced what I had been learning across every deployment: the politics of who funds, who hosts, and who controls a data system are not secondary concerns. They are the system's immune system. When the politics fail, the technology — no matter how well-designed — fails with it. The solution is tiered access and diversified ownership: government has sovereign control over raw data and publication; humanitarian partners access aggregated, anonymised data for coordination; donors receive pre-agreed outputs. And critically, no single donor or implementing partner should be the sole point of failure for a system that an entire response depends on. This requires formal data-sharing agreements, contingency plans for funding disruptions, and institutional anchoring deep enough that the system survives the departure — or suspension — of any single actor.`,
      },
      {
        heading: 'What I Would Do Differently',
        content: `In my earlier roles, I underestimated the time required for institutional anchoring. I moved too quickly to the technology — building dashboards, designing data models, training users — without investing enough in governance architecture. The dashboards looked impressive. The data models were sound. But the institutional foundations were shallow.

I also underestimated governance documentation: who owns what, who has admin access, what happens when staff leave, how disputes are resolved, what the escalation pathway looks like when the international organisation is no longer present. This documentation is tedious but essential.

The hardest conversation in humanitarian data work is not technical. It is telling a government official that current data quality is inadequate for international reporting, and that improving it requires resources, political commitment, and transparency about gaps. That conversation, handled badly, kills partnerships. Handled well, it begins genuine ownership.`,
      },
      {
        heading: 'Design for Departure',
        content: `The principle I now apply to every data platform: design for departure.

Before writing a single line of code, I ask: what happens when I leave? Who maintains the server? Who updates the data model when requirements change? Who trains the next cohort of data officers? Who troubleshoots failures at 2am before a donor briefing?

If I cannot answer with names — specific people in specific institutions with specific skills — I am not ready to build. The technology can wait. The institutional foundation cannot.`,
      },
    ],
    relatedSlugs: [
      'politics-of-humanitarian-data-infrastructure',
      'data-ecosystem-maturity-assessment-guide',
      'lessons-six-countries',
    ],
  },

  'desinventar-to-delta-resilience': {
    slug: 'desinventar-to-delta-resilience',
    title: 'The Evolution of National Disaster Tracking Systems: From DesInventar to DELTA Resilience',
    category: 'Observer Technical Deep Dive',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'The transition from DesInventar to DELTA Resilience is not a software upgrade. It is an architectural paradigm shift — from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Understanding how and why this evolution happened matters for every country navigating the transition.',
    keywords: [
      'DELTA Resilience',
      'DesInventar Sendai',
      'disaster tracking systems',
      'Sendai Framework Monitor',
      'WMO-CHE',
      'FRAME-ECO',
      'G-DRSF',
      'sovereign data ownership',
      'API-driven disaster data',
      'data migration',
      'Arab States rollout',
      'UNDRR UNDP WMO',
    ],
    sections: [
      {
        content: `Somewhere in a disaster management office, a data officer is trying to cross-reference five years of flood impact records with satellite-derived exposure data. The flood records exist in DesInventar Sendai — carefully entered, validated, and stored. But extracting them in a format that can be programmatically joined with geospatial data requires manual CSV exports, ad-hoc cleaning scripts, and reconciliation of inconsistent hazard classifications across reporting years. The process takes days. With an API, it would take minutes.

This scene plays out in dozens of countries. It captures the central tension in the evolution of national disaster tracking: the system that revolutionised disaster loss recording in the early 2000s has become insufficient for what the world now demands of it. The transition to [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is not a software upgrade. It is an architectural paradigm shift — from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Understanding how and why this evolution happened matters for every country navigating the transition.`,
      },
      {
        heading: 'The DesInventar Era: What It Built and Where It Hit the Wall',
        content: `DesInventar was revolutionary for its time. Launched in the early 2000s by La RED (the Network of Social Studies in the Prevention of Disasters in Latin America), and later adopted by UNDP and UNDRR for global deployment, it was the first system to enable countries to systematically record disaster losses at the sub-national level. Before DesInventar, most countries had no structured disaster database at all — loss data lived in newspaper clippings, ministerial memos, and the memories of provincial disaster officers.

At its peak, over 90 countries had DesInventar implementations. The system's "datacard" architecture — where each disaster event was recorded as a card with Serial (card number), Effects (impact indicators: deaths, injuries, houses destroyed, crops lost), and Geography (subnational administrative levels) — created a global standard for loss recording that enabled, for the first time, cross-country comparison of disaster impacts.

The [Sendai Framework Monitor](https://sendaimonitor.undrr.org/), launched in 2015, used DesInventar Sendai as its primary national data entry mechanism. The 38 Sendai indicators — covering mortality (Target A), affected people (Target B), economic losses (Target C), infrastructure damage (Target D), DRR strategies (Target E), international cooperation (Target F), and early warning (Target G) — were mapped onto DesInventar's datacard fields.

This worked. But it worked within constraints that became increasingly untenable as the DRR landscape evolved.

**Standalone architecture.** DesInventar installations were isolated — no mechanism for automated data exchange with meteorological services, health ministries, statistical offices, or humanitarian platforms. Integration required manual CSV exports and bespoke scripting.

**No API.** The absence of programmatic access made real-time data exchange — essential for early warning triggers, anticipatory action, and automated reporting — impossible without manual intervention.

**Ad-hoc hazard classification.** Countries classified hazards inconsistently. A "flood" in one country might encompass flash floods, riverine floods, and coastal inundation under a single category, while another recorded them as separate event types. Cross-country comparison and historical trend analysis suffered.

**Limited disaggregation.** Mandatory disaggregation by sex, age, and disability status — now required by the Sendai Framework — was not built into DesInventar's core architecture.

**Data ownership ambiguity.** Many DesInventar databases were hosted by implementing partners (UNDP, NGOs) rather than governments. When projects ended, databases often became inaccessible when servers were decommissioned — a pattern that has repeated across dozens of countries.`,
      },
      {
        heading: 'Why the World Outgrew DesInventar',
        content: `Three structural shifts in the DRR landscape made the limitations of DesInventar untenable.

**Compounding risks.** The era of single-hazard analysis is over. Countries now experience simultaneous earthquakes, floods, drought, and economic shocks. Coastal nations face cyclones, riverine flooding, and monsoon-related landslides within the same season. A tracking system that records events as isolated datacards — without the ability to model compound, cascading, and concurrent hazards — cannot capture the reality of 21st-century disaster risk.

**Demand for disaggregated data.** The Sendai Framework, SDGs, and UNFCCC now require impact data disaggregated by geography, sector, sex, age, and disability. The [59 Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data) adopted at COP30 require demonstrating declining disaster impacts across specific population groups. DesInventar's data model lacked this granularity.

**AI and interoperability.** GeoAI, machine learning-based damage assessment, and automated early warning systems demanded disaster data consumable programmatically — through APIs, standardised formats, at machine speed. DesInventar's manual-export architecture became a bottleneck.`,
      },
      {
        heading: 'What DELTA Resilience Actually Is',
        content: `[DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) — Disaster & Hazardous Events, Losses and Damages Tracking & Analysis — is the successor system, co-developed by UNDRR, UNDP, and WMO. The name itself signals the shift: from "inventory" (DesInventar) to "tracking and analysis" (DELTA). It is not a software update. It is a comprehensive system that includes tools, standards, methodologies, and governance frameworks.

Here is what changed across nine key dimensions:

**Architecture** — DesInventar was a standalone software application. DELTA is a comprehensive system with tools, standards, and methodologies.

**Data Ownership** — DesInventar databases were often hosted by external partners. DELTA is sovereign and country-owned: governments maintain full data control.

**Interoperability** — DesInventar was isolated, with manual CSV extraction. DELTA is API-ready, designed for multi-agency ecosystems.

**Hazard Classification** — DesInventar used ad-hoc or simplified categories. DELTA aligns with [WMO-CHE](https://www.undrr.org/building-risk-knowledge/disaster-data) methodology and ISC 2025 Hazard Information Profiles.

**Environmental Impact** — Not included in DesInventar. DELTA includes [FRAME-ECO](https://iucn.org/story/202603/loss-damage-webinar-accelerating-assessment-climate-and-disaster-related-biodiversity) (UNEP/UNU-EHS) for biodiversity and ecosystem loss.

**Statistical Framework** — DesInventar had informal alignment with statistical standards. DELTA has full G-DRSF alignment for international statistical harmonisation.

**Disaggregation** — DesInventar offered limited disaggregation. DELTA mandates disaggregation by geography, sector, sex, age, and disability.

**Reporting Coherence** — DesInventar was single-purpose (Sendai only). DELTA implements "one-report-two-purposes": 38 Sendai indicators automatically feed 12 SDG indicators.

**AI Readiness** — DesInventar required manual workflows. DELTA is designed for programmatic access and automated analytics.

**Sovereign data ownership.** This is the most consequential change. DELTA is built around the principle that governments own their data, their platforms, and their analytical outputs. The system can be deployed on government infrastructure, and countries maintain administrative control. This directly addresses the sustainability failure that killed so many DesInventar implementations — when the international partner leaves, the system stays.

**WMO-CHE hazard classification.** DELTA uses the World Meteorological Organization's Climate and Hazardous Events (CHE) methodology, aligned with the International Science Council's 2025 Hazard Information Profiles. This standardises event classification globally — a flood in any DELTA-implementing country is categorised using the same taxonomy, making cross-country comparison reliable for the first time.

**FRAME-ECO.** Developed with UNEP and UNU-EHS, this component allows countries to quantify losses to biodiversity and ecosystem services — a dimension entirely absent from DesInventar. As climate adaptation increasingly recognises the role of ecosystems in disaster risk reduction (mangrove protection against storm surge, wetland absorption of flood waters), the ability to track ecosystem losses becomes essential for policy coherence.

**G-DRSF alignment.** The [Global Disaster-Related Statistics Framework](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/), endorsed by the UN Statistical Commission in March 2026, provides the internationally harmonised standards that bridge National Disaster Management Agencies (NDMAs) and National Statistical Offices (NSOs). DELTA operationalises these standards, ensuring that disaster data meets the rigour required for official statistics while remaining operationally relevant for disaster management.`,
      },
      {
        heading: 'The Migration Challenge',
        content: `The transition from DesInventar to DELTA is not a simple data transfer. It is a complex migration that must preserve historical records while upgrading the data model.

**Schema mapping** is critical. Every DesInventar datacard must be mapped to corresponding DELTA variables while preserving the multi-year historical baseline that the Sendai Framework requires for trend analysis. Automated validation scripts flag duplicates, inconsistencies, and records that violate G-DRSF standards — for example, events where mortality exceeds affected population (disturbingly common) or missing administrative geography codes.

**The tiered approach** recognises vastly different digital maturity levels: Foundational countries digitise historical records on DELTA; Interoperable countries prioritise API development and hazard classification standardisation; Advanced countries focus on G-DRSF harmonisation and FRAME-ECO integration.

**Parallel-run verification** is mandatory: both systems operate concurrently for one reporting cycle, with records compared for accuracy before legacy decommissioning.

The [Arab States regional rollout](https://www.undrr.org/news/arab-states-accelerate-disaster-loss-and-damage-data-regional-rollout-delta-resilience), launched in Doha in October 2025 with 18 Member States, was the first large-scale deployment — demonstrating a model where country-specific roadmaps were drafted around institutional capacity rather than technology wish lists. The [HNPW 2026 session](https://www.undrr.org/event/hnpw-2026-delta-resilience-enabling-use-disaster-impact-data-risk-informed-inclusive-climate) showcased how the system enables disaster impact data for humanitarian decision-making — including anticipatory action triggers, impact-based forecasting, and identification of marginalised populations.`,
      },
      {
        heading: 'What This Means for Practitioners',
        content: `For disaster data officers, IM coordinators, and NDMA staff, the transition reshapes daily work in four concrete ways.

**Data entry feeds two reporting obligations simultaneously.** The "one-report-two-purposes" design means entering data against the 38 Sendai indicators automatically generates the 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1 — eliminating the double-reporting burden that has exhausted national statistical capacity for years.

**Databases are no longer isolated.** DELTA's API architecture means disaster data can be consumed by meteorological services for forecast verification, by statistical offices for official publication, by humanitarian platforms for coordination, and by analytical tools for trend analysis — all without manual exports.

**Hazard classifications are globally standardised.** WMO-CHE and ISC Hazard Information Profiles mean flood data from one DELTA country is directly comparable with flood data from any other. This matters for regional risk assessments, cross-border early warning, and international reporting.

**New skills are required.** The shift from standalone record-keeping to an interoperable ecosystem demands skills in API management, data governance, and statistical quality assurance that were not part of the DesInventar training curriculum. The Sendai Framework Academy's Training-of-Trainers model is designed to build these skills nationally.`,
      },
      {
        heading: 'The Road Ahead',
        content: `The transition from DesInventar to DELTA represents something larger than a technical migration. It is the transition from record-keeping to risk knowledge. Record-keeping tells a country what happened. Risk knowledge tells it what is likely to happen, who is most vulnerable, and what can be done about it — with the statistical rigour, disaggregation, and interoperability that modern climate policy demands.

What is underway is a strategic repositioning of national disaster management agencies from reactive record-keepers to data-driven architects of resilience. It is also the only pathway to the high-fidelity evidence base that the [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data), the [Belém Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data), and the Sendai Framework's final implementation window require.

Risk knowledge is the only currency that will keep countries competitive for climate finance in the next decade. DELTA Resilience is how they mint it.`,
      },
    ],
    relatedSlugs: [
      'disaster-loss-data-climate-adaptation',
      'g-drsf-statisticians-disaster-managers',
      'delta-resilience-early-warning-anticipatory-action',
    ],
  },

  'g-drsf-statisticians-disaster-managers': {
    slug: 'g-drsf-statisticians-disaster-managers',
    title: 'The Global Disaster-Related Statistics Framework: Why Statisticians and Disaster Managers Must Finally Speak the Same Language',
    category: 'Cornerstone / Policy Explainer',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'During a UN consultancy, I needed to integrate disaster impact data with population statistics. The two agencies\' offices were close by — their data might as well have been on different planets. The G-DRSF, endorsed in March 2026, finally gives statisticians and disaster managers a shared vocabulary.',
    keywords: [
      'G-DRSF',
      'Global Disaster-Related Statistics Framework',
      'UN Statistical Commission',
      'NDMA',
      'NSO',
      'p-codes',
      'official statistics',
      'one-report-two-purposes',
      'Sendai Framework',
      'SDG indicators',
      'disaster statistics',
      'WMO-CHE',
      'data harmonisation',
    ],
    sections: [
      {
        content: `During a consultancy with a UN agency, I needed to integrate disaster impact data from the national disaster management commission with population statistics from the national statistical agency for a climate-informed cash targeting model. The two agencies' offices were close by. Their data might as well have been on different planets.

The disaster commission used sub-national geographic codes based on their own internal taxonomy. The statistical agency used the official p-code system aligned with OCHA's Common Operational Datasets. The disaster commission counted "affected households." The statistical agency counted "individuals" using census definitions. The disaster commission classified events by operational response type. The statistical agency needed events classified by internationally comparable hazard categories.

Neither dataset was wrong. They were produced by different institutional cultures for different purposes using different standards — and they could not be combined without weeks of manual harmonisation. I'm a disaster risk and humanitarian data systems architect who has spent a decade working at this exact fault line, and the experience has convinced me that the single most important development in disaster data governance this decade is not a new platform or a new indicator. It is the [Global Disaster-Related Statistics Framework (G-DRSF)](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/) — endorsed by the UN Statistical Commission on 9 March 2026 — which for the first time gives disaster managers and statisticians a shared vocabulary, shared standards, and a shared reason to work together.`,
      },
      {
        heading: 'What the G-DRSF Is',
        content: `The G-DRSF is the first internationally harmonised framework for producing disaster-related statistics. Developed through comprehensive global consultation in 2025, it provides the statistical standards, definitions, and methodologies that bridge two institutional worlds: the National Disaster Management Agencies (NDMAs) who collect operational disaster data, and the National Statistical Offices (NSOs) who produce the official statistics that governments and international bodies rely on for policy and finance decisions.

Before the G-DRSF, these two worlds operated in parallel. NDMAs collected data for operational purposes — which villages were flooded, how many houses were damaged, how many people needed emergency assistance. NSOs produced statistics for policy purposes — poverty rates, GDP impacts, population demographics. The data rarely met. When it did, the reconciliation was manual, ad-hoc, and unreproducible.

The G-DRSF changes this by establishing:

**Shared definitions** for what constitutes a "disaster," a "hazardous event," a "loss," and a "damage" — aligned with the Sendai Framework's terminology and the WMO-CHE hazard classification system.

**Shared geographic standards** using p-codes and official administrative boundary systems, ensuring that disaster data can be linked to census data, health data, education data, and economic data without geographic reconciliation.

**Shared quality assurance protocols** that specify what completeness, accuracy, timeliness, and consistency mean for disaster data — giving NSOs a framework for certifying NDMA data as official statistics.

**Shared disaggregation requirements** mandating that disaster impact data be broken down by geography, sector, sex, age, and disability — aligning with both the Sendai Framework's Leave No One Behind commitment and the SDG disaggregation standards.`,
      },
      {
        heading: 'Why This Matters: One Report, Two Purposes',
        content: `The most consequential design feature of the G-DRSF is what UNDRR calls the "one-report-two-purposes" principle. Data entered once to meet the [38 Sendai Framework indicators](https://sendaimonitor.undrr.org/) — covering mortality (Target A), affected people (Target B), economic losses (Target C), infrastructure damage (Target D), DRR strategies (Target E), international cooperation (Target F), and early warning systems (Target G) — automatically feeds 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1.

This is not a minor efficiency gain. For developing countries with limited statistical capacity, the elimination of double-reporting is transformative. Many national statistics offices have between 2-5 staff dedicated to disaster-related statistics. Asking them to separately compile Sendai reports and SDG reports — using different methodologies, different formats, and different timelines — was a capacity burden that many countries simply could not meet.

The reporting cycle that the G-DRSF standardises follows global milestones in April and October, allowing countries to synchronise their disaster data production with both the Sendai Framework Monitor reporting windows and the SDG Voluntary National Review calendar. This synchronisation means that the same dataset, produced once, is valid for multiple international accountability mechanisms.`,
      },
      {
        heading: 'The NDMA-NSO Challenge',
        content: `The G-DRSF provides the framework. Making it work requires solving the hardest problem in disaster data governance: the institutional relationship between the NDMA and the NSO.

These are different organisations with different mandates, different cultures, and different relationships with political authority. NDMAs operate under operational urgency — data needs measured in hours and days. NSOs operate under statistical rigour — data needs measured in quarters and years. An NDMA data officer reporting "approximately 5,000 households affected" is doing good disaster management. An NSO statistician requiring sampling methodology and confidence intervals is doing good statistics. Both are right. The G-DRSF gives them a protocol for reconciling their rightness.

**Data ownership and p-codes.** Where disaster data has political sensitivity — which is most countries — the question of data ownership is contested. A Memorandum of Understanding (MoU) between the NDMA and NSO — signed before data collection begins — specifies data flows, validation protocols, publication authority, and dispute resolution. This governance document reflects a political agreement about how disaster data will be produced and certified.

Equally critical: the standardisation of geographic identifiers (p-codes). P-codes are the bridge between operational disaster data and statistical population data. Without valid p-codes, a flood impact cannot be linked to census figures or health facility density. With p-codes, the linkage is automatic. Ensuring consistent p-code usage is one of the highest-impact, lowest-cost interventions in disaster data quality. DELTA Resilience mandates this. Many legacy systems did not.`,
      },
      {
        heading: 'The COP30 Dimension',
        content: `The G-DRSF's March 2026 endorsement positions it as the data backbone for the post-COP30 reporting landscape. The [59 Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data) adopted at COP30 require countries to monitor adaptation progress across agriculture, health, infrastructure, and livelihoods — many requiring historical disaster loss baselines.

The COP30 "State of Loss and Damage Report" will rely on data produced through national DELTA Resilience systems aligned with G-DRSF standards. Countries that have not operationalised the G-DRSF will find their loss claims unverifiable — and in a resource-scarce environment where the [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data) has $768 million against $580 billion in estimated need, unverifiable claims will not be funded.

This creates a direct financial incentive for G-DRSF adoption. It is no longer about good practice. It is about access to climate finance.`,
      },
      {
        heading: 'How DELTA Resilience Operationalises the G-DRSF',
        content: `The G-DRSF provides the standards. [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) provides the system that turns those standards into a working data ecosystem.

DELTA's data model is built around G-DRSF definitions. Its hazard classification uses WMO-CHE. Its disaggregation structure implements G-DRSF requirements for sex, age, disability, and geographic breakdown. Its API architecture enables automated data exchange between NDMA and NSO systems.

The [Data Ecosystem Maturity Assessment (DEMA)](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) is conducted before DELTA deployment, assessing data governance, technical infrastructure, data quality, and human capacity. DELTA begins with governance and builds technology on institutional foundations — a sequencing that distinguishes it from predecessors like DesInventar.`,
      },
      {
        heading: 'What Practitioners Should Do Now',
        content: `If you work in disaster data at any level — national, regional, or global — here are three immediate actions:

**Read the G-DRSF.** The [e-learning course on UN SDG:Learn](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/) is free, self-paced, and takes approximately 8 hours. It covers the framework's structure, definitions, and practical application. This is now essential knowledge for anyone working in DRR data.

**Map your current data against G-DRSF standards.** Take your national disaster database — whatever system it uses — and check: are your hazard classifications aligned with WMO-CHE? Are your geographic identifiers using valid p-codes? Is your disaggregation capturing sex, age, and disability? Is your mortality data cross-referenced with affected population data for consistency?

**Start the NDMA-NSO conversation.** If your country does not have a formal data-sharing agreement between the disaster management agency and the statistical office, begin that conversation now. The G-DRSF gives you the framework. The Loss and Damage Fund gives you the incentive. But the MoU is something that must be negotiated locally, and it takes time.`,
      },
      {
        heading: 'The Governance Reform',
        content: `The G-DRSF is not a statistics reform. It is a governance reform. It changes the institutional relationship between the organisations that collect disaster data and the organisations that certify it. It creates shared accountability for data quality. It establishes shared standards that make data interoperable across national and international systems.

And governance reforms only succeed when the people who collect the data and the people who certify the data learn to trust each other. The G-DRSF provides the framework for that trust. The rest is politics, patience, and the slow, unglamorous work of building institutional partnerships that outlast project cycles.`,
      },
    ],
    relatedSlugs: [
      'desinventar-to-delta-resilience',
      'disaster-loss-data-climate-adaptation',
      'data-ecosystem-maturity-assessment-guide',
    ],
  },

  'delta-resilience-early-warning-anticipatory-action': {
    slug: 'delta-resilience-early-warning-anticipatory-action',
    title: 'From Forecast to Action: Operationalising Early Warning and Anticipatory Action with DELTA Resilience',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. The combination — forecast plus impact profile — is what makes anticipatory action evidence-based rather than speculative. DELTA Resilience is the first national disaster data system designed to provide that missing link at scale.',
    keywords: [
      'DELTA Resilience',
      'anticipatory action',
      'early warning systems',
      'EW4All',
      'impact-based forecasting',
      'CHIRPS',
      'NDVI',
      'forecast-based financing',
      'risk knowledge',
      'WMO',
      'Anticipation Hub',
      'drought triggers',
      'flood triggers',
      'heat action plans',
    ],
    sections: [
      {
        content: `I was in a room designing anticipatory action triggers for a humanitarian response. We had good climate forecasts — CHIRPS rainfall anomaly data, NDVI vegetation stress indicators, WFP food price monitoring. We knew a drought was developing in several provinces. We had a general sense that it would be bad.

What we did not have was structured historical loss data that could tell us: "The last three times rainfall deficit exceeded this threshold, it displaced approximately X thousand people, destroyed Y hectares of wheat, and overwhelmed Z health facilities in these specific districts." We were designing triggers in the dark — calibrating thresholds based on expert judgment and proxy data rather than empirical impact records.

That experience crystallised a conviction: early warning without historical loss context is a forecast without meaning. A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. The combination — forecast plus impact profile — is what makes anticipatory action evidence-based rather than speculative. And [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is the first national disaster data system designed to provide that missing link at scale.`,
      },
      {
        heading: 'The Missing Pillar',
        content: `The Early Warnings for All (EW4All) initiative, led by UNDRR and WMO, is built on four pillars: risk knowledge, detection and monitoring, dissemination and communication, and preparedness for response. These pillars are not equally developed. Dissemination and communication is the most reported capability, at 42% of WMO Member States. Risk knowledge — the foundational layer that gives meaning to everything else — is the [least reported, at just 20%](https://link.springer.com/article/10.1007/s13753-025-00622-9).

This asymmetry is the central problem. Countries are investing in weather stations, satellite monitoring, and SMS alert systems — the detection and communication pillars — without investing in the risk knowledge layer that tells you what those alerts should trigger. A flood warning that says "river levels will exceed 5 metres in District X within 48 hours" is valuable. A flood warning that says "river levels will exceed 5 metres in District X within 48 hours, and based on historical impact data, this will likely displace 12,000 people, damage 40 health facilities, and destroy 3,000 hectares of rice paddies, with women-headed households in the eastern sub-districts being disproportionately affected" is transformative.

The second warning enables anticipatory action — pre-positioning relief supplies, pre-authorising cash transfers, activating evacuation protocols — targeted to specific populations in specific geographies based on empirical evidence. The first warning enables general preparedness. The gap between them is the gap between reacting to disaster and preventing its worst consequences.

DELTA Resilience is the risk knowledge backbone that closes this gap.`,
      },
      {
        heading: 'How DELTA Enables Impact-Based Triggers',
        content: `An anticipatory action trigger is a pre-agreed threshold that, when crossed, automatically activates a pre-funded response. The most common triggers combine a hazard forecast (e.g., rainfall deficit exceeding a certain percentile) with a vulnerability indicator (e.g., food insecurity classification above a certain phase) and — ideally — a historical impact profile that predicts the likely consequences.

DELTA Resilience provides the third component. Here is how:

**Disaggregated loss records create historical impact profiles.** DELTA mandates disaggregation by geography (sub-national administrative levels with p-codes), sector (agriculture, health, infrastructure, housing), and population characteristics (sex, age, disability). This means that for every hazard type, in every district, the system accumulates a structured record of what happened: how many people were displaced, how many crops were destroyed, how many facilities were damaged, and who was disproportionately affected.

Over time, these records build impact profiles — empirical distributions of expected consequences for a given hazard type in a given geography. When a forecast indicates that a similar hazard is approaching, the impact profile provides the evidence base for predicting what will happen and who will be affected.

**WMO-CHE standardised hazard classification enables event matching.** One of the fundamental requirements for impact-based triggers is the ability to compare current forecasts with historical events. If the historical database classifies floods using inconsistent categories — sometimes "flash flood," sometimes "riverine flood," sometimes just "flood" — then matching current forecasts to historical impacts becomes unreliable. DELTA's adoption of the WMO Climate and Hazardous Events (CHE) methodology ensures that hazard events are classified consistently across time and geography, making historical matching reliable.

**FRAME-ECO adds environmental vulnerability indicators.** Ecosystem degradation — deforestation, wetland loss, mangrove destruction — directly affects disaster impact. A community protected by intact mangroves experiences less storm surge damage than one where the mangroves have been cleared. DELTA's FRAME-ECO component, developed with UNEP and UNU-EHS, tracks environmental losses alongside human and economic losses, enabling triggers that account for changing environmental vulnerability.

**API-ready architecture enables automated trigger verification.** Anticipatory action systems need to verify triggers in near-real-time — checking whether current conditions match the pre-agreed thresholds. DELTA's API architecture allows automated queries: "Return all flood events in District X where displacement exceeded 5,000 people in the last 10 years" can be answered programmatically, enabling trigger verification pipelines that operate at machine speed rather than requiring manual data extraction.`,
      },
      {
        heading: 'Three Use Cases',
        content: `**Drought anticipatory action.** In drought-prone regions, triggers typically combine rainfall anomaly (CHIRPS data), vegetation stress (NDVI from satellite imagery), and food security classification (IPC phase). What they often lack is the historical impact profile: when these conditions occurred previously in a specific zone, what was the actual impact on agricultural livelihoods, displacement, and malnutrition?

DELTA loss records, accumulated over multiple drought cycles and disaggregated by zone and sector, provide this profile. A trigger that says "CHIRPS rainfall deficit > 1.5 standard deviations AND NDVI anomaly < -0.2 AND historical DELTA records show agricultural loss > $5M and displacement > 10,000 under similar conditions" is fundamentally more evidence-based than one relying on rainfall and NDVI alone.

This analytical framework — layering hydrometeorological hazard indicators onto vulnerability data from multiple sectors and overlaying response coverage to identify [anticipatory action gaps](/expertise#climate-analytics) — is increasingly crucial. The framework works, but historical loss data is often fragmented and requires extensive harmonisation. DELTA provides it in a structured, queryable format.

**Flood anticipatory action.** In flood-prone regions, anticipatory action protocols are increasingly linked to hydrological forecasts — river level predictions, inundation models, and satellite-based flood extent mapping. The [WFP Forecast-based Financing programmes](https://www.wfp.org/anticipatory-actions) have demonstrated the operational viability of this approach.

DELTA enhances these protocols by providing the impact context: not just "a flood is coming" but "a flood of this magnitude in this district has historically displaced X people, damaged Y schools, and affected Z hectares of standing crops." This transforms anticipatory action from hazard-based (acting on the forecast) to impact-based (acting on predicted consequences), enabling more precise targeting of pre-positioned resources.

**Heat action plans.** As extreme heat events become more frequent and more severe, countries are developing heat action plans that trigger specific responses — opening cooling centres, pre-positioning rehydration supplies, issuing health advisories — when temperature forecasts exceed pre-agreed thresholds. DELTA's health facility damage records and heat-related mortality data, disaggregated by geography and population characteristics, enable impact-based heat triggers: "Temperature forecast > 45°C for 3+ consecutive days AND historical DELTA records show heat-related health facility overwhelm and excess mortality in this district under similar conditions."`,
      },
      {
        heading: 'The Institutional Challenge',
        content: `The technical architecture is in place. The institutional architecture is not — and this is where DELTA's potential for anticipatory action will be realised or squandered.

In most countries, the organisations responsible for anticipatory action (humanitarian agencies, Red Cross/Red Crescent societies, sometimes government disaster management agencies) operate in a different institutional silo from the organisations responsible for disaster loss data (NDMAs, statistical offices). The forecast data comes from meteorological services — a third silo. Connecting these three data streams — forecast, historical loss, and anticipatory action protocol — requires interoperability between institutions that often have no formal data-sharing agreement.

DELTA's API architecture is designed to bridge this. Its exchange protocols establish automated data flows between meteorological services, sectoral ministries, and the national disaster database. But APIs are technical instruments. They connect systems, not institutions. The institutional work — the MoUs, the joint working groups, the shared governance of trigger thresholds — must be done by people.

The [HNPW 2026 session on DELTA Resilience](https://www.undrr.org/event/hnpw-2026-delta-resilience-enabling-use-disaster-impact-data-risk-informed-inclusive-climate) specifically highlighted how disaster impact data can inform anticipatory action through impact-based triggers, strengthen impact-based forecasting and risk models, identify high-risk and marginalised population groups, and assess the effectiveness of early actions. This agenda signals that UNDRR sees the anticipatory action connection as a primary use case for DELTA, not a secondary one.

The [Anticipation Hub](https://www.anticipation-hub.org/about/what-is-anticipatory-action) — the primary global knowledge platform for anticipatory action — documents country protocols, evidence bases, and implementation lessons. As more countries adopt DELTA, the opportunity to systematically link national loss databases with anticipatory action trigger frameworks will grow. But it requires deliberate institutional design, not just technical interoperability.`,
      },
      {
        heading: 'Connecting to Climate Finance',
        content: `The connection between DELTA, anticipatory action, and climate finance is direct.

The [UNFCCC Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data) requires countries to demonstrate both historical losses (to justify funding) and forward-looking risk reduction measures (to demonstrate capacity). DELTA provides historical loss evidence; anticipatory action protocols demonstrate forward-looking capacity. Together, they create a complete narrative: "Here is what disasters have cost us. Here is what we are doing to prevent recurrence. Here is the data that proves both claims."

Countries competitive for Loss and Damage Fund disbursements will be those that can tell this data-backed story. DELTA + anticipatory action + G-DRSF-compliant reporting is the architecture that enables it.`,
      },
      {
        heading: 'From Forecast to Evidence',
        content: `Anticipatory action is not forecasting. It is forecasting calibrated by evidence — evidence of what happened before, to whom, and with what consequences. The forecast tells you what is coming. The evidence tells you what to do about it, for whom, and where.

DELTA Resilience provides the evidence. Its disaggregated, standardised, API-ready loss records are the raw material from which impact-based triggers can be built, validated, and automated. Its interoperability architecture connects the disaster database to the meteorological services and humanitarian coordination platforms that operationalise anticipatory action.

The technology is ready. The standards are ready. What remains is the institutional work: connecting the organisations that hold the data with the organisations that make the decisions. That work is slow, political, and unglamorous. But it is the work that turns a forecast into a life saved.`,
      },
    ],
    relatedSlugs: [
      'desinventar-to-delta-resilience',
      'disaster-loss-data-climate-adaptation',
      'g-drsf-statisticians-disaster-managers',
    ],
  },

  'data-ecosystem-maturity-assessment-guide': {
    slug: 'data-ecosystem-maturity-assessment-guide',
    title: 'The Data Ecosystem Maturity Assessment: A Practitioner\'s Guide to Diagnosing National Disaster Data Readiness',
    category: 'Tutorial / Technical Deep Dive',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'On my first week at a UN agency headquarters, I asked: "How many data systems does this Division use?" The answer took three weeks to assemble. That experience of mapping before building became the foundation for every data system project since. A maturity assessment is not a delay — it is the investment that ensures the system you build is the system that survives.',
    sections: [
      {
        content: `I was hired by a UN agency's headquarters division to audit and redesign their crisis information management architecture. On my first week, I asked a straightforward question: "How many data systems does this Division use?" The answer took three weeks to assemble. Not because people were uncooperative, but because nobody had a complete picture. Incident monitoring lived in one platform. Knowledge management lived in another. Situation reports came from a third. Country alerts from a fourth. Each system solved a specific problem well, but they had never been mapped as an ecosystem — the result was duplication, gaps, and interoperability failures that no single system owner could see.

That experience of mapping before building became the foundation for every data system project since. Through data ecosystem assessments across multiple contexts, the single most important lesson is this: a maturity assessment is not a delay. It is the investment that ensures the system you build is the system that survives.

This post is the practitioner's guide I wish I had when I started — grounded in the [DEMA framework](https://www.undrr.org/event/bonn-technical-forum-2025-scene-setting-webinar-data-ecosystem-maturity-assessment-towards) developed by UNDRR and UNDP, and informed by what I have seen go wrong when the assessment step is skipped.`,
      },
      {
        heading: 'Why Assess Before You Build',
        content: `The humanitarian and DRR sectors have a pattern: identify a data gap, deploy a technology solution, train users, and move on. The maturity assessment step — understanding the institutional, technical, and human landscape before choosing a technology — is frequently skipped because it feels like overhead. It is not overhead. It is the most consequential phase of any data system deployment.

Without a maturity assessment, you risk deploying technology that the institution cannot sustain, producing poor data faster with more attractive formatting, and missing governance gaps that will kill the system after the project cycle ends. I have seen all three — sometimes in the same deployment.

The [UNDP-UNDRR Data and Digital Maturity for Disaster Risk Reduction](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) working paper provides the theoretical foundation. The DEMA framework operationalises it into a structured, facilitated self-assessment that countries can own. What follows is how it works in practice.`,
      },
      {
        heading: 'The Five Dimensions',
        content: `The DEMA framework evaluates a national disaster data ecosystem across five interconnected dimensions. Each has subdimensions with specific indicators scored against a five-phase maturity scale — from Phase 1 (incomplete, ad hoc) through Phase 3 (managed and defined) to Phase 5 (state of the art, transformative). The framework is diagnostic, not punitive — it is designed to support reflection and identify concrete actions, not to rank countries.

**Dimension 1: Actors and Roles.** This dimension maps who participates in the data ecosystem and whether their roles are understood. The key actors are data producers (NDMAs, meteorological services, sectoral ministries), data users (planners, policy-makers, humanitarian coordinators), and intermediaries (statistical offices, UN agencies, research institutions). In every ecosystem assessment I have conducted, the same pattern emerges: actors are identifiable, but their roles in the data production chain — who collects, who validates, who publishes, who certifies — are either undefined or informally negotiated. This is the most common Phase 2 finding: roles are recognised but reactive, dependent on personal relationships rather than institutional mandates.

The [G-DRSF](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/) provides the reference architecture for these roles, particularly the relationship between the National Disaster Management Authority (operational data collection) and the National Statistical Office (statistical certification). Where this relationship is formalised, the ecosystem is resilient. Where it depends on individuals, it is fragile.

**Dimension 2: Data Supply.** Data supply assesses the quality of available disaster data — its accessibility, relevance, accuracy, timeliness, and clarity. This is where the gap between what countries report and what is actually usable becomes visible. I have reviewed national disaster databases where completeness rates for mandatory fields — hazard type, date, administrative geography code, mortality, affected population — fell below 60%. Records where mortality exceeded affected population. Events recorded without valid [p-codes](https://cod.unocha.org/) aligned with OCHA Common Operational Datasets. Hazard classifications that shifted terminology between reporting years, blocking trend analysis.

The quality problems are not random. They concentrate in specific time periods (election years, funding transitions), specific geographies (remote provinces with weaker NDMA capacity), and specific hazard types (slow-onset events like drought and coastal erosion are consistently under-recorded compared to rapid-onset events like floods and earthquakes).

**Dimension 3: Data Demand.** This is the dimension most assessments neglect entirely — and the one that determines whether a data system is actually used. Data demand captures the applications and use cases the data is meant to serve: [Sendai Framework](https://sendaimonitor.undrr.org/) reporting, SDG indicator computation, Loss and Damage Fund evidence requirements, early warning triggers, anticipatory action thresholds, national DRR strategy development, and climate adaptation planning.

The critical diagnostic question is whether supply meets demand. In my experience, the answer is almost always no — but not for the reasons people assume. The data gap is rarely about volume. It is about format, disaggregation, and interoperability. Countries often have substantial disaster data, but it is locked in formats (paper records, isolated spreadsheets, legacy databases) that cannot serve the analytical and reporting demands now placed on it by the Sendai Framework Monitor, the [Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data), and the [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data).

**Dimension 4: Data Infrastructure.** Data infrastructure covers the institutional, physical, and digital means for storing, sharing, and consuming data — from individual laptops to organisation-specific archives to online information management systems and geospatial data-sharing platforms.

The key subdimensions are technical interoperability (can systems exchange data programmatically?) and operationalised common standards (are shared codes, schemas, and formats in use?). [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) requires API-driven data exchange with meteorological services and statistical offices. For countries where the NDMA's primary data tool is a standalone spreadsheet on a single staff member's laptop — and I have seen this in more countries than I expected — the infrastructure gap is not about purchasing servers. It is about institutional architecture: where data lives, who controls access, and what happens when that staff member leaves.

A common failure mode is assuming cloud hosting solves everything. Cloud solves hardware but raises data sovereignty concerns. Hybrid models — cloud compute with local storage — are often the pragmatic answer.

**Dimension 5: Data Ecosystem Governance.** Governance determines whether the ecosystem holds together when external support ends. It covers policies and standards (does a national data strategy exist? are common data standards mandated?), dedicated budget (is disaster data funded from national budget or entirely donor-dependent?), collaboration and inclusion (are data-sharing agreements formalised between NDMA-NSO, NDMA-meteorological service, NDMA-sectoral ministries?), capacity (are human skills being built and retained?), and governance ethics and trust (are there protocols for privacy, responsible data use, and accountability?).

In my experience, the governance dimension is the strongest predictor of system survival. I have seen technically sophisticated platforms fail because there was no legal mandate for data collection, no MoU between the NDMA and NSO, and no data-sharing agreement with the meteorological service. Conversely, I have seen basic systems survive for years because the governance architecture was sound — roles were assigned, budgets were allocated, and the data pipeline did not depend on any single person or organisation.

The distinction between de jure governance (what the law says) and de facto governance (what actually happens) is critical. Assess both.`,
      },
      {
        heading: 'The Data Quality Assessment Tool',
        content: `Alongside the DEMA, UNDRR has developed a complementary [Data Quality Assessment Tool](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) that evaluates the quality of specific data streams — hazardous event data, disaster event data, and losses and damages data — against four quality criteria, each scored on the same five-phase maturity scale.

**Accuracy:** Are events verified through triangulation of multiple authoritative sources, or recorded with frequent errors and no verification process?

**Completeness:** Are all critical fields populated — temporal, spatial, technical characteristics, triggers, cascades, source — or are records patchy with key information missing?

**Consistency:** Are events classified using controlled vocabularies and standardised formats, or do terminology and coding shift between time periods and data sources?

**Interoperability:** Are hazardous event data and loss/impact databases linked through shared codes, APIs, or schemas — or do they exist in incompatible silos?

The Data Quality Assessment Tool complements the DEMA by drilling into the data itself rather than the ecosystem that produces it. The DEMA tells you whether the institutions, infrastructure, and governance are in place. The quality tool tells you whether the data those institutions produce is actually fit for purpose. Both are needed. A mature ecosystem can still produce poor data if quality assurance processes are weak. Good data can still be unusable if the ecosystem cannot share, validate, or publish it.`,
      },
      {
        heading: 'Running the Assessment: The DEMA Process',
        content: `The DEMA is designed as a facilitated self-assessment — owned by national actors, not conducted on them. The process follows four phases:

**Phase 1: Desk research.** Review existing risk data availability, stakeholder mapping, previous assessments, data governance and policy instruments, and current platforms and tools. This gives the facilitator an initial picture of the ecosystem before engaging stakeholders directly.

**Phase 2: Surveys and interviews.** Structured engagement with all actors in the ecosystem — data producers, users, and intermediaries. This ensures all actors are identified, gives an initial indication of maturity levels, and surfaces themes for deeper discussion.

**Phase 3: Multi-stakeholder workshop.** A facilitated workshop bringing all stakeholders together to discuss the current state, agree on maturity scores, and identify short-, medium-, and long-term actions to advance to the next maturity phase. This is where ownership is built — the scores and action plan are co-created, not imposed.

**Phase 4: Reporting and action plan.** A final report with maturity scores, findings, and country-specific, action-oriented recommendations. The action plan assigns stakeholders to specific activities with agreed timelines, reinforcing national ownership and institutional memory.

For complex ecosystems, the full process takes 6-10 weeks including preparation and reporting.`,
      },
      {
        heading: 'The Assessment That Saves the System',
        content: `A maturity assessment is the single most consequential deliverable in a DELTA Resilience deployment. It prevents mismatched system designs, identifies governance gaps before they become fatal, quantifies training and migration needs, and — critically — builds the national ownership that determines whether the system survives its creator.

The DEMA is not a delay. It is the foundation that ensures the system you build is the system that lasts.`,
      },
    ],
    relatedSlugs: [
      'building-systems-governments-can-own',
      'g-drsf-statisticians-disaster-managers',
      'lessons-six-countries',
    ],
  },

  'lessons-six-countries': {
    slug: 'lessons-six-countries',
    title: 'Lessons from Building Humanitarian Data Platforms Across Multiple Crisis Contexts',
    category: 'Field Reflection / Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'Multiple countries. Seven data platforms. A decade of work. Each one taught me something I could not have learned from a textbook. Six principles emerged across all of them — and none are about technology.',
    sections: [
      {
        content: `Multiple countries. Seven data platforms. A decade of work. Each one built under different constraints — funding pressure, active conflict, pandemic restrictions, institutional fragmentation, political upheaval. Each one produced outputs that mattered to people making decisions under pressure: cluster coordinators deciding where to deploy assessment teams, government officials deciding which provinces to prioritise for drought response, cash working groups deciding whether their transfers were reaching the right households.

And each one taught me something I could not have learned from a textbook, a conference presentation, or a best-practice guide.

This post distills what those platforms taught me — the cross-cutting principles that apply regardless of the crisis, the technology, or the institutional context. Six principles emerged. None of them are about technology.`,
      },
      {
        heading: 'Principle 1: Build for the Worst Network, Not the Best',
        content: `My first field posting placed me in a conflict-affected region with a 2G connection that dropped every afternoon when the generator ran out of fuel. I built 5W dashboards in Excel — not because I wanted to, but because it was the only software every partner already had installed, that worked offline, and that could be emailed on a 2G connection. The dashboards were ugly. They were functional. They were used.

Every humanitarian data platform is designed in a capital city with reliable internet and tested in a field office where the connection drops when it rains. If your system requires 4G to function, it will not function where it is needed most. The constraint is not bandwidth — it is the assumption that bandwidth will be available. Design for offline-first with synchronisation, and you will never be caught by a generator failure.`,
      },
      {
        heading: 'Principle 2: The Coordination Mechanism Is the Product, Not the Dashboard',
        content: `In one of the largest refugee responses on the planet — nearly a million displaced people in a concentrated geographic area — the information management challenge was not data scarcity. It was data flood. I led inter-sector analytical reports combining health, nutrition, WASH, education, and protection data into a unified framework. The reports became reference documents not because we had the best data, but because the coordination mechanism that produced them was trusted by the organisations that consumed them.

A dashboard that nobody trusts is a decoration. A coordination mechanism that produces trusted analysis — even if it is a simple table in a PDF — is an information management system. Invest in the process (shared questions, shared data standards, shared review) and the technology will follow. Start with the technology and the process will not materialise.`,
      },
      {
        heading: 'Principle 3: Invest in Data Governance Before Data Collection',
        content: `Five humanitarian organisations were each running post-distribution monitoring for their cash transfer programmes using different tools, different questions, different sampling strategies, and different definitions of "success." The cash working group could not answer a basic question: "Is our collective cash programming working?"

I built a unified analytical framework — nine analytical pillars covering adequacy, timeliness, utilisation, market access, protection, targeting accuracy, satisfaction, coping, and impact — and harmonised data from over 1,500 households into a single analytical ecosystem. The framework worked because we invested months in governance before collecting a single data point. We agreed on shared definitions, shared indicators, shared disaggregation, and what "success" meant. When I left, it survived — because it was owned by the coordination mechanism, not by any single agency.

Multi-partner analytics only works when you govern before you collect. Skip this step and you will spend more time harmonising incompatible data than you would have spent negotiating shared standards upfront.`,
      },
      {
        heading: 'Principle 4: Start with a Maturity Assessment, Not a Technology Choice',
        content: `A headquarters posting taught me this principle most clearly. The division had multiple incident-monitoring and knowledge-management tools running in parallel. Each had been built to solve a specific problem. None had been mapped as an ecosystem.

The audit took six weeks. The platform design took four. The audit was the more valuable deliverable — because it prevented building a solution to a problem that was not fully understood.

Don't build until you've mapped what already exists. The audit always reveals surprises — systems nobody remembers building, data flows that depend on one person's email habits, governance gaps that no technology can solve.`,
      },
      {
        heading: 'Principle 5: Build for Departure',
        content: `The largest platform work of my career was a multi-million-dollar DRR, climate preparedness, and information management programme in a conflict-affected country — a multi-hazard analysis platform and a humanitarian reporting system that onboarded 200+ partner organisations. Both were significant technical achievements. Both were vulnerable to political change, funding cycles, and staff turnover. The components that were most resilient were the ones most deeply anchored in government workflows — built around NDMA requirements, their geographic taxonomies, their briefing templates.

But "build for departure" assumes there is a legitimate government to depart to — and this assumption does not hold everywhere. In contexts where a [de facto authority](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/) controls the territory but lacks international recognition — where donor conditions prohibit sharing programme data with the governing authority — the principle hits a wall. This is the data ownership dilemma in [contested legitimacy](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/), and it remains one of the most consequential unresolved challenges in humanitarian data governance.

The system must work after you leave. Before writing a single line of code, answer: who will maintain the server, who will update the data model, who will train the next cohort? If the answers are "the international consultant," the system has an expiration date. And if the answer is "nobody — because no recognised institution can legally receive it" — then the system has a deeper problem that no amount of technical design can solve.`,
      },
      {
        heading: 'Principle 6: Train the Trainers, Not the Users',
        content: `This principle emerged across every posting, but crystallised in the environments where I saw the sharpest contrast between trained individuals and trained institutions. Generic user training evaporates within months. Invest in 3-5 national focal points per institution, certify them as trainers through a structured Training-of-Trainers programme, and build a peer support network. This is the only model that produces lasting capacity.

My academic foundation — a Commonwealth Scholarship and subsequent analytics certifications — shaped the ability to think about disaster risk as a system of interacting variables (hazard, exposure, vulnerability, capacity) rather than as a sequence of emergency responses. The best analytical frameworks in humanitarian IM are the ones simple enough to implement under operational pressure but rigorous enough to withstand methodological scrutiny. My best work has happened at this intersection: academically grounded frameworks implemented with field pragmatism.`,
      },
      {
        heading: 'What I Still Get Wrong',
        content: `Honesty requires this section.

I still underestimate the time data governance work takes. Data infrastructure is like an iceberg: the visible tip — dashboards, platforms, analytical outputs — is what gets funded, celebrated, and counted toward programme KPIs. But the mass below the waterline — data-sharing agreements, institutional roles, governance frameworks — is what determines whether the whole thing stays upright. I still feel the pull to start building the visible part before the foundations beneath it are secure, because building is satisfying and governance negotiation is slow.

I still overestimate the transferability of skills. A data officer trained in one context does not automatically become effective in a different context with different data, different stakeholders, and different institutional incentives. Skills transfer requires contextualisation that I don't always budget time for.

And I still struggle with the hardest question in humanitarian data work: when is "good enough" actually good enough? The tension between statistical rigour and operational urgency is real, and I have not resolved it. I have only learned to name it honestly and let the operational context — not my analytical preferences — determine the answer.`,
      },
      {
        heading: 'The Platforms Change',
        content: `The platforms change. Excel gave way to Power BI. KoboToolbox replaced paper forms. Legacy disaster databases are being replaced by sovereign, API-ready national systems. The next generation will use AI agents and automated analytical pipelines.

The principles don't change. Build for the worst conditions. Invest in coordination before technology. Govern before you collect. Assess before you deploy. Build for departure. Train the trainers.

And the most important principle is the one the sector keeps forgetting: design for departure. Because the measure of a data platform is not what it produces while you're there. It's what it produces after you've gone.`,
      },
    ],
    relatedSlugs: [
      'building-systems-governments-can-own',
      'politics-of-humanitarian-data-infrastructure',
      'data-ecosystem-maturity-assessment-guide',
    ],
  },

  'politics-of-humanitarian-data-infrastructure': {
    slug: 'politics-of-humanitarian-data-infrastructure',
    title: 'The Politics of Humanitarian Data Infrastructure: Who Owns the System When Everyone Walks Away?',
    category: 'Opinion / Field Reflection',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'I wrote the email at 11am. It went to over 115 organisations — UN clusters, NGOs, working groups — telling them the nationwide humanitarian reporting platform was suspended immediately. Afghanistan in 2025 was a stress test that revealed a system-wide architectural flaw: nobody owns continuity.',
    sections: [
      {
        content: `I wrote the email at 11am. It went to over 115 organisations — UN clusters, NGOs, working groups, coordination bodies — all of whom relied on the nationwide humanitarian reporting platform I helped manage as programme coordinator. The message was simple and devastating: the platform's sole donor had frozen all funding. Operations were being suspended immediately. There was no phased transition. No bridge funding. No contingency plan. No advance notice. The system that an entire country's humanitarian coordination depended on was going dark.

I knew, as I pressed send, what would happen next. I had spent that entire week receiving similar emails from other partners — their own USAID programme suspension notices arriving one after another. I had built enough data systems across several countries to understand that what was about to unfold was not a technical failure. It was a political one — a structural collapse that had been designed into the system from the beginning, waiting for the moment when a single point of failure would be tested.

Afghanistan in 2025 was that moment.`,
      },
      {
        heading: 'What Happened When the Platform Went Dark',
        content: `The sequence was predictable in hindsight and catastrophic in practice.

The United States had been funding [43% of all humanitarian aid to Afghanistan](https://www.unocha.org/publications/report/afghanistan/afghanistan-overview-funding-shortfall-and-impact-humanitarian-operations-14-august-2025) — approximately $562 million. When the funding freeze hit, it did not arrive with a transition plan. It arrived as a stop order. The implementing organisation I worked for — the organisation that built, maintained, and hosted the platform — had no independent revenue stream for this programme. The platform ran on a single donor's money. When that money stopped, the platform stopped.

The consequences rippled outward in concentric circles of institutional failure. The lead UN coordination agency cancelled planned meetings with the implementing organisation and excluded it from critical information management discussions — institutional preservation in real time, distancing itself from a partner that could no longer deliver. Partners who had built their reporting workflows around the platform were left without access to essential humanitarian data mid-response. Cluster leads lost their evidence base. Working groups lost their analytical inputs. The shared picture of who was doing what, where, for whom simply vanished.

The reputational risk landed squarely on the implementing partner — even though the structural failure was never theirs alone to prevent. The donor decided to freeze funding. The coordination body decided to cut ties. The partners had no alternative system. Every actor retreated into self-preservation. Nobody fought for the shared infrastructure — because nobody owned it enough to fight for it.`,
      },
      {
        heading: 'The Power Map Nobody Draws',
        content: `What the Afghanistan experience exposed is a power structure in humanitarian data infrastructure that everyone navigates but nobody maps.

**The donor controls funding.** A single government funded nearly half of all humanitarian operations in Afghanistan. One political decision in Washington collapsed humanitarian data infrastructure in over 50 countries in real time — because the funding model never required diversification or contingency. What happened in Afghanistan and several other countries was a perfect storm, arriving at the period when major donor governments were competing on who could cut more humanitarian funding. Germany, the UK, France, Japan, and Saudi Arabia all reduced aid budgets simultaneously. Total global humanitarian funding [fell from $37 billion in 2024 to $20.5 billion in 2025](https://www.devex.com/news/how-humanitarian-funding-collapsed-in-2025-111612) — its lowest level in a decade. The Council on Foreign Relations called it ["the great aid recession"](https://www.cfr.org/articles/great-aid-recession-2025s-humanitarian-crash-nine-charts). The Carnegie Endowment described it as a ["painful, seismic shift"](https://carnegieendowment.org/research/2025/12/the-painful-seismic-shift-in-humanitarian-aidand-whats-next?lang=en) — not a temporary dip but a structural contraction in the global development partnership.

**The UN coordination body controls legitimacy and access.** The lead coordination agency determines whose data is authoritative and which platforms are endorsed. When funding was cut, its decision to distance itself from the implementing partner was a withdrawal of legitimacy — the platform's technical capabilities had not changed, only its funding.

**The implementing partner controls the platform.** But operational control without financial independence is an illusion. The implementing partner could not keep the platform running without the donor's money, could not transfer it without the coordination body's endorsement, and could not preserve partner access without both.

**The government controls sovereignty — in theory.** In principle, the government of Afghanistan — like any sovereign state — has the right and responsibility to own its humanitarian data infrastructure. But Afghanistan presented a familiar dilemma: a globally unrecognised Taliban leadership, banned under multi-donor funding agreements from accessing data on Afghan populations for understandable protection concerns — a topic explored further below. Even setting aside this legitimacy constraint, the broader reality applies across most developing country contexts: the capacity to absorb a nationwide reporting platform overnight is nonexistent. Sovereignty without capacity is a constitutional right without operational meaning.

But Afghanistan exposes an even deeper dilemma — one that the humanitarian data community has barely begun to articulate.`,
      },
      {
        heading: 'The Data Ownership Dilemma Under Contested Legitimacy',
        content: `What happens to data sovereignty when the international community does not recognise the government that claims it?

Afghanistan under Taliban rule is not a failed state. It is a [de facto authority](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/) — an entity that exercises effective territorial control, provides basic governance functions, and administers the population, but lacks international recognition. The Taliban have not been recognised by most UN Member States, and most donor countries as of 2025 were not maintaining a formal embassy in Kabul. Moreover, the donor conditions attached to humanitarian funding — particularly from the United States — explicitly prohibit sharing proprietary data, programme information, and institutional resources with the Taliban administration.

This creates an extraordinary paradox for data infrastructure. The humanitarian sector's best-practice principle is sovereign government ownership of data systems — build for the government, anchor in national institutions, transfer administrative control. But when the governing authority is sanctioned, unrecognised, or classified as a designated entity under counter-terrorism legislation, that principle collides with the legal and political conditions attached to the funding that built the system in the first place.

Afghanistan is not alone in this predicament. Nearly [200 million people](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/) live in areas where non-state armed actors or de facto authorities exercise some degree of territorial control. In Yemen, [the Houthis have seized equipment — laptops, routers, communication devices — from UN agencies and NGOs](https://www.hrw.org/news/2026/01/08/houthi-detentions-halting-aid-crisis-hit-yemen), crippling their ability to manage data and deliver aid. The Houthi resistance to WFP's biometric registration system was driven not by data protection concerns but by [geopolitical sovereignty claims over population data](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/). In Sudan, both the Sudanese Armed Forces and the Rapid Support Forces have used bureaucratic control — visa restrictions, customs seizures, travel permits — to [restrict humanitarian data flows and operational access](https://www.acaps.org/en/thematics/all-topics/humanitarian-access). In Libya, competing administrations in Tripoli and the east have each claimed authority over humanitarian coordination, creating parallel data governance structures with no unified national owner.

In each of these contexts, the data infrastructure question is not simply "who hosts the server?" It is: to whom can you legally, ethically, and operationally transfer data sovereignty when the entity that controls the territory is the entity your donor prohibits you from engaging with?

This is the data ownership dilemma in contested legitimacy — and it has no clean resolution. The [IASC Operational Guidance on Data Responsibility](https://interagencystandingcommittee.org/sites/default/files/migrated/2023-04/IASC%20Operational%20Guidance%20on%20Data%20Responsibility%20in%20Humanitarian%20Action,%202023.pdf) establishes principles for data protection in humanitarian action, but it was not designed for contexts where the sovereign authority itself is the data protection risk. The [USAID Inspector General's assessments](https://oig.usaid.gov/node/7705) of Afghanistan programming documented the tension between operational necessity and anti-terrorism compliance — a tension that extends directly to data infrastructure ownership. And the academic literature on [digitisation and sovereignty in humanitarian space](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/) has identified the fundamental problem: humanitarian organisations depend on grants of sovereign authority to operate, but the digital infrastructure they build generates data assets whose ownership is contested by the very authorities that granted access.

The practical consequence is paralysis. Data systems in these contexts cannot be transferred to the de facto government (donor conditions prohibit it), cannot remain with the implementing partner indefinitely (funding is temporary), and cannot be handed to the UN coordination body (which lacks the technical infrastructure and mandate to host them). The data sits in an institutional no-man's-land — owned by everyone in principle, controlled by no one in practice, and vulnerable to exactly the kind of overnight collapse that Afghanistan demonstrated.

**Nobody controls continuity.** This is the structural flaw. Continuity — the thing that matters most to the 115+ organisations whose daily coordination depends on the platform — is a shared responsibility that no single actor is mandated, funded, or structured to deliver. Every actor has a legitimate mandate. None of those mandates include ensuring that the shared data infrastructure survives when any one of them walks away.`,
      },
      {
        heading: 'This Is Not an Afghanistan Problem',
        content: `It would be comforting to treat this as a unique failure — a perfect storm of political disruption, donor concentration, and institutional dysfunction specific to one country. It was not. Afghanistan was a stress test that revealed a system-wide architectural flaw.

The evidence is now overwhelming. The [State of Open Humanitarian Data 2026](https://www.unocha.org/publications/report/world/state-open-humanitarian-data-2026-assessing-data-availability-across-humanitarian-crises), published by OCHA's Centre for Humanitarian Data, documented that crisis data availability fell from 74% to 68% across 22 humanitarian operations. OCHA's own information management capacity was cut by approximately 25%. UNHCR and IOM — two of the largest operational data producers in the system — saw data staff reductions of approximately 40%. The Centre for Humanitarian Data warned that ["2024 may be the high-water mark of data availability for years to come"](https://centre.humdata.org/risk-to-data-availability-in-2025/).

The Center for Global Development framed it as ["the coming humanitarian data drought"](https://www.cgdev.org/blog/coming-humanitarian-data-drought). [UN News reported](https://news.un.org/en/story/2025/04/1161971) budget cuts "devastating data gathering." [Devex documented](https://www.devex.com/news/how-humanitarian-funding-collapsed-in-2025-111612) the broader collapse: humanitarian funding fell to $20.5 billion — its lowest level in a decade. And [OCHA's Afghanistan assessment](https://www.unocha.org/publications/report/afghanistan/afghanistan-impact-us-funding-suspension-humanitarian-response-19-may-2025) found 78% of coordination positions at national and sub-national level expected to be impacted. These are the information managers, GIS officers, and cluster coordinators who produce the analytical outputs that decision-making depends on.

The pattern is structural, not incidental. Humanitarian data infrastructure globally is built on the same fragile foundations: single-donor dependency, implementing-partner-hosted platforms, coordination mechanisms that assume continuous funding, and an absence of contingency protocols for when those assumptions fail.`,
      },
      {
        heading: 'The Architecture of Resilience',
        content: `What would a resilient humanitarian data infrastructure look like? Not a different platform — a different governance architecture.

**Sovereign government hosting.** Data infrastructure that serves a country's humanitarian coordination should be hosted on infrastructure that the country's government controls. When the implementing organisation leaves — or is forced to leave — the data stays. The [UNDRR Strategic Framework 2026-2030](https://www.undrr.org/strategic-framework-2026-2030) identifies this principle as a critical gap requiring systematic attention.

**Diversified, multi-donor funding.** No data platform that serves an entire country's coordination should depend on a single donor. This requires pooled funding mechanisms, cost-sharing agreements, and minimum reserve requirements that guarantee operational continuity during transition periods.

**Mandatory contingency protocols.** The Afghanistan platform had no contingency plan for donor withdrawal — no bridge funding, no phased transition, no data escrow. Every humanitarian data platform should have a documented protocol specifying what happens when the primary donor withdraws, how long operations can continue on reserves, and how partner data is preserved during any transition.

**Data continuity agreements.** Partner data submitted to a coordination platform must remain accessible regardless of the platform's operational status. Data escrow — standard in commercial software — is virtually nonexistent in humanitarian data systems. The [Grand Bargain 2.0](https://interagencystandingcommittee.org/grand-bargain) provides a policy framework, but the operational mechanisms have not been built.

**Intersectoral governance that assigns continuity.** Someone must own continuity — not the platform, not the data, but the ongoing availability of the shared coordination infrastructure. This means a continuity mandate assigned to a specific body, ideally the coordination mechanism itself, with the authority and resources to ensure the system survives the withdrawal of any single actor.`,
      },
      {
        heading: 'The Conversation Nobody Wants to Have',
        content: `The reason this architecture does not exist is not technical. It is political: building resilient data infrastructure requires every actor to cede some control. Donors must accept that funding does not buy unilateral control over continuity. Coordination bodies must accept responsibility for the infrastructure they endorse. Implementing partners must accept that the platforms they build belong to the coordination mechanism. Governments must invest in the capacity to host and govern these systems.

The humanitarian data drought is not a future risk. It is a present reality. The communities that depend on these systems — the 23.7 million people in need of humanitarian assistance in Afghanistan alone — are losing the data infrastructure that enables their response to be coordinated, targeted, and accountable. The question is not whether we can afford to build resilient data governance. The question is whether we can afford not to — knowing what happens when a single email at 11am can take an entire country's coordination infrastructure offline.`,
      },
    ],
    relatedSlugs: [
      'building-systems-governments-can-own',
      'lessons-six-countries',
      'data-ecosystem-maturity-assessment-guide',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

/**
 * Best-effort ISO date for OpenGraph & JSON-LD. Posts use friendly strings
 * like "April 2026" — we coerce these to the 1st of that month so search
 * engines and social platforms still get a valid datetime.
 */
function toIsoDate(friendly: string): string {
  const parsed = Date.parse(friendly)
  if (!isNaN(parsed)) return new Date(parsed).toISOString()
  // "April 2026" → "April 1, 2026"
  const fallback = Date.parse(friendly + ' 1')
  if (!isNaN(fallback)) return new Date(fallback).toISOString()
  return new Date().toISOString()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const url = `https://alexnwoko.com/blog/${post.slug}`
  const keywords = getPostKeywords(post)
  const isoDate = toIsoDate(post.date)
  // Auto-generated OG image (see opengraph-image.tsx in this folder).
  // Next.js automatically routes this URL to our edge function so each post
  // gets its own social-share card AND a structured-data image.
  const ogImageUrl = `${url}/opengraph-image`

  return {
    title: post.title,
    description: post.excerpt,
    keywords,
    authors: [{ name: 'Alex Nwoko', url: 'https://alexnwoko.com' }],
    creator: 'Alex Nwoko',
    publisher: 'Alex Nwoko',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Alex Nwoko Portfolio',
      type: 'article',
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: ['Alex Nwoko'],
      tags: keywords.slice(0, 12),
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@alexnwoko',
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    category: post.pillar,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = post.relatedSlugs
    .map((slug) => blogPosts[slug])
    .filter(Boolean)

  // Build JSON-LD structured data so Google understands this is an article
  // by Alex Nwoko, with publish date, keywords, and full body text — all
  // signals that improve eligibility for rich results and Knowledge Graph
  // attribution. The JSON object is fully internal (no user input) so the
  // dangerouslySetInnerHTML usage is safe — JSON.stringify produces a string
  // that cannot break out of the script tag.
  const url = `https://alexnwoko.com/blog/${post.slug}`
  const isoDate = toIsoDate(post.date)
  const keywords = getPostKeywords(post)
  // Auto-generated OG image — also used as the article image for rich results.
  // This resolves the "Missing field image" warning in Google's Rich Results Test.
  const ogImageUrl = `${url}/opengraph-image`
  const articleBody = post.sections
    .map((s) => `${s.heading ? s.heading + '. ' : ''}${s.content}`)
    .join('\n\n')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  const wordCount = articleBody.split(/\s+/).filter(Boolean).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleBody,
    wordCount,
    datePublished: isoDate,
    dateModified: isoDate,
    keywords: keywords.join(', '),
    articleSection: post.pillar,
    inLanguage: 'en',
    url,
    image: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: 'Alex Nwoko',
      url: 'https://alexnwoko.com',
      jobTitle: 'Disaster Risk and Humanitarian Data Systems Architect',
      sameAs: [
        'https://www.linkedin.com/in/alex-nwoko/',
        'https://github.com/alex-nwoko',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Alex Nwoko',
      url: 'https://alexnwoko.com',
    },
  }

  // Replace `</` with `<\/` to prevent any chance of breaking out of the
  // script tag (defence-in-depth even though our content is fully internal).
  const safeJsonLd = JSON.stringify(jsonLd).replace(/<\//g, '<\\/')

  return (
    <article className="pt-24 pb-16">
      {/* JSON-LD structured data — emits a BlogPosting schema for search engines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
      {/* Back Link */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <Link
          href="/blog"
          className="text-sm text-dusty-orange hover:text-darkred transition-colors font-medium"
        >
          ← Back to My Blog
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-6 mb-12">
        {/* Pillar Color Indicator */}
        <div className="h-1 w-12 mb-6 rounded-full" style={{ backgroundColor: post.pillarColor }} />

        {/* Category, Read Time, Date */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-coffee-muted">
          <span className="font-medium">{post.category}</span>
          <span>&middot;</span>
          <span>{post.readTime} read</span>
          <span>&middot;</span>
          <span>{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author Byline */}
        <div className="border-t border-beige-300 pt-6">
          <p className="text-coffee-light/85 text-sm">
            By <span className="font-semibold">Alex Nwoko</span>
          </p>
        </div>
      </header>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="font-reading text-lg text-coffee-light/85 leading-relaxed space-y-6">
          {post.sections.map((section, idx) => (
            <div key={idx}>
              {section.heading && (
                <h2 className="font-serif text-2xl text-coffee mt-12 mb-6">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-6">
                {section.content.split('\n\n').map((paragraph, pIdx) =>
                  renderBlock(paragraph, pIdx)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share buttons — sit just below the article body and above Continue Reading */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <ShareButtons url={url} title={post.title} />
      </div>

      {/* Continue Reading Section */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6">
          <div className="border-t border-beige-300 pt-12">
            <h3 className="font-serif text-2xl text-coffee mb-8">Continue Reading</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-2xl border border-beige-300 p-8 card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded"
                      style={{
                        color: relatedPost.pillarColor,
                        backgroundColor: relatedPost.pillarColor + '10',
                      }}
                    >
                      {relatedPost.pillar}
                    </span>
                    <span className="text-xs text-coffee-muted">
                      {relatedPost.readTime} read
                    </span>
                  </div>
                  <h4 className="font-serif text-xl text-coffee mb-3 group-hover:text-dusty-orange transition-colors">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-coffee-muted leading-relaxed mb-4">
                    {relatedPost.excerpt}
                  </p>
                  <span className="text-sm text-dusty-orange font-medium">
                    Read more &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
