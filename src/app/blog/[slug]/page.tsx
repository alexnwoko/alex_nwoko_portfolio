import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import ShareButtons from '@/components/ShareButtons'
import { getTopicsForPost } from '@/lib/topics'

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
    // parseInline runs on the bold lead-in text too, so any markdown
    // links inside the bold (e.g. `**The [Loss and Damage Fund](url)**`)
    // render as proper hyperlinks instead of leaking literal `[brackets]`.
    return (
      <p key={key}>
        <strong className="text-coffee font-semibold">{parseInline(boldText)}</strong>
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
      'While working abroad over the last decade, I visited Nigeria every few months. Every visit, the same struggle, finding reliable services, navigating markets blind, and watching trust deficits hold back an entire economy from going digital. Then a realisation hit me.',
    sections: [
      {
        content: `While mostly working abroad over the last decade, in Afghanistan, Bangladesh, Ethiopia, and Switzerland, I visited Nigeria every few months to take intermittent breaks. And every single visit, I faced the same challenges: the struggle of finding reliable services, the frustration of navigating markets with no information to guide you, and the palpable trust deficit that has held back African markets from going digital.

I'd try to find a good plumber. I'd ask a cousin, who'd ask a neighbour, who'd give me a number that might or might not work. I'd go to a market looking for something specific and spend hours navigating stalls because there's no directory, no reviews, no way to know who's trustworthy until after you've already paid. Every visit, the same friction. Every visit, the same thought growing louder in the back of my mind.

Because during those same years, I was building information systems for humanitarian emergencies, platforms that helped hundreds of organisations coordinate, dashboards that tracked millions of services to vulnerable populations, geospatial tools that mapped risk across entire countries. I was solving exactly these problems, fragmented information, invisible actors, broken trust, in some of the world's most complex operating environments.

And I kept asking myself: why can't this power be deployed into the market ecosystem back home?`,
      },
      {
        heading: 'The Realisation That Changed Everything',
        content: `The realisation didn't come in a single moment. It built up over years of those visits home, each time noticing the same patterns I was solving professionally in crisis zones playing out in everyday Nigerian commerce.

In a humanitarian operation, the core challenge is always the same: too many actors, too little shared information, and no infrastructure connecting them. Organisations collect data in silos. If you want to see the full picture, who's doing what, where, for whom, you have to piece it together manually from dozens of sources.

Now think about an African market. Thousands of sellers, each operating independently. Buyers who have no way to discover them except through personal networks. Prices that vary from stall to stall. Quality that's impossible to assess until after a transaction. Trust that exists only within existing relationships.

It's the same structural problem. Different context, same underlying challenge: how do you create shared visibility, build trust at scale, and connect people who need each other but can't find each other?

The systems I led and managed in my humanitarian career, reporting platforms, geospatial analysis tools, data coordination mechanisms, were all built to make the invisible visible. To create trust where none existed. To connect fragmented actors into a functioning ecosystem.

I started running the idea past a few friends. Could the same systems thinking that powered humanitarian coordination power African commerce? Every conversation made me more convinced. Not just that it was possible, but that it was necessary. That the trust deficit holding back African markets could be addressed with the right digital infrastructure, built by someone who understood the constraints from the inside.

The ambition crystallised: help Africa's markets and service sector transition into the digital phase. Help Africans do business with Africans, with the trust, visibility, and efficiency they deserve.`,
      },
      {
        heading: 'Why My Humanitarian Experience Matters Here',
        content: `People sometimes ask me: "What does humanitarian work have to do with building a tech startup?" Everything, it turns out.

Building trust where none exists: In crisis response, trust is oxygen. You build verification systems because decisions affect lives. Partner vetting, beneficiary registration, feedback loops, audit trails, every mechanism exists to ensure that when someone claims something, you can verify it. That same discipline translates directly to marketplace trust. Seller verification. Payment protection. Review systems. Making invisible credentials visible and verifiable. This is exactly what African markets need, a trust infrastructure layer.

Designing for real-world constraints: Humanitarian systems must work on 2G networks, on basic phones, with unreliable power, in areas where infrastructure is a variable you design around, not a given you can assume. African commerce operates under identical constraints. Most platforms fail here because they're designed for environments with stable internet, fixed addresses, and digital payment infrastructure. I spent ten years designing for the opposite. That's an advantage you can't learn from a textbook.

Geospatial intelligence: The same GIS skills I used to map flood risk and identify access routes now help me map market catchment areas, understand population density patterns, and identify underserved commercial zones. MAKKET's dataset of hundreds of Nigerian markets with geolocation data is essentially a humanitarian-style baseline assessment applied to commerce. Every market has a story, population, transportation, seasonal variation, competitive intensity. Map it, understand it, build for it.

Communication that actually works: In the field, I learned that voice messages are how information moves in communities where literacy varies and screens aren't the primary interface. Seventy-eight percent of Nigerians send voice messages daily. That's not a limitation to work around, it's a design specification to build on.

These aren't abstract skills. They're hard-won operational instincts from a decade of building in the world's most challenging environments. And they translate directly to the challenge of digitising Africa's informal economies.`,
      },
      {
        heading: 'Why Most Tech Solutions Get Africa Wrong',
        content: `Most marketplace platforms are designed for formal economies. They assume fixed addresses, reliable internet, digital payment accounts, and standardised pricing. These assumptions are so deeply baked into the architecture that most founders don't even realise they're making them.

Nigeria's markets don't work like that. Balogun market does enormous volumes of trade with zero digital records. Sellers communicate through voice messages and personal referrals. Price discovery happens through haggling and relationships, not algorithms. There are no formal addresses, the market is a geography without a coordinate system.

The pattern of failure is predictable: a founder sees an African market, sees "inefficiency," imports a Western marketplace model, spends investor money on user acquisition, and discovers that the entire infrastructure assumption was wrong. The market isn't "digitally backward." It's working perfectly well for how it actually functions.

What's needed isn't disruption. It's enhancement. Start with how the market actually operates and add a digital layer that makes it work better, without trying to replace what's already there. This is what I experienced on every visit home. The markets work. The service providers are skilled. The commerce is vibrant. What's missing is the connective digital tissue that makes it all visible, trustworthy, and scalable.

This is the opposite of importing a model. It's building from first principles, by someone who's lived on both sides of the problem.`,
      },
      {
        heading: 'Vendoh and MAKKET: Two Platforms, One Conviction',
        content: `This is why I'm building two platforms.

Vendoh is a voice-first AI service marketplace for Nigeria's urban service economy, plumbers, electricians, carpenters, salon professionals, home maintenance providers. It's a massive market where less than 5% of transactions happen on formal platforms. If you need a plumber in Lagos today, you ask a friend, exactly the frustration I experienced on every visit home. Vendoh makes that discovery instant, voice-powered, and trust-protected with escrow payments.

MAKKET digitises Nigeria's physical markets, connecting buyers with traders across hundreds of markets. Unlike e-commerce platforms that try to replace markets, MAKKET enhances the existing ecosystem. It makes discovery possible beyond your immediate neighbourhood, makes seller credentials visible, and creates a digital layer on top of commerce that's been working for generations.

They look like different platforms. But underneath, they share one conviction: Africa's informal economies don't need to be replaced by digital alternatives. They need to be enhanced with digital infrastructure that respects how they already work.

Enhance the market, never displace it. That's the thesis. And it comes directly from a decade of humanitarian work where I learned the hard way that systems succeed when they work with existing realities, not against them.`,
      },
      {
        heading: 'Helping Africans Do Business with Africans',
        content: `Africa's informal commerce is a multi-trillion-dollar economy operating almost entirely offline. Street traders, market vendors, service professionals, and micro-entrepreneurs move more capital through person-to-person transactions than many formal financial institutions touch. Yet this entire ecosystem remains invisible to digital platforms.

The biggest untapped opportunity in African tech isn't competing with established platforms, it's building infrastructure for the vast majority of commerce that no platform has reached. Commerce that works perfectly well without digital intermediation, but could be dramatically more powerful with the right digital layer.

We're starting with Nigeria, Lagos, Abuja, Port Harcourt. Proving the model, measuring what works, then expanding. Not because we're being cautious, but because that's another lesson from humanitarian operations: density before breadth. Go deep in one location before going wide across many.

Looking back, those visits home, the frustration of finding a plumber, the hours lost in markets, the trust deficit I experienced as a customer, weren't just inconveniences. They were the problem statement for everything I'm building now. A decade of building digital systems in crisis zones gave me the tools. Coming home gave me the purpose.

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
      'Dashboards are tools for looking. Systems are tools for changing. Why organizations confuse the two, and why it matters.',
    sections: [
      {
        content: `A humanitarian coordinator walks into my office. "Can you make me a dashboard?" she asks.

This is a phrase I've heard a hundred times. And every time, I know that the question is not actually about dashboards.

What she's really asking is: "Can you help me see what's happening in my program?" or "Can you help me make better decisions?" or "Can you give me something to show my donors?" The dashboard is just the medium she's imagining.

But dashboards are rarely the answer. And if you build the wrong thing at the beginning, you end up in a familiar place: a beautiful visualization that nobody uses, updated once and then abandoned, a monument to someone's good intentions.`,
      },
      {
        heading: 'The Dashboard Trap',
        content: `Dashboards become graveyards. I've seen it dozens of times across humanitarian organizations. Someone commissions a beautiful dashboard, maps, charts, metrics, all color-coded and interactive. It launches to fanfare. Then it's updated three times and nobody looks at it again.

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

Dashboards are fine tools for certain purposes, general awareness, donor reporting, directional understanding. But if you want to actually change how an organization operates, if you want to build something that gets used, you need to build a system.

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
      'How AI agents, not just tools, will transform humanitarian information management. Introducing the concept of AISA.',
    sections: [
      {
        content: `I'm watching an analyst spend three weeks on what should be a two-day job.

She's sitting in a Nairobi office, working on a situation analysis for a new conflict-affected area. The task is straightforward: read reports from dozens of sources, classify the information by sector, identify key trends, cross-reference with historical data, synthesize into a single analytical product, and produce a situation report that senior management can use to make decisions.

Three weeks. In that time, she's manually searching databases, reading PDFs, categorizing information in spreadsheets, cross-checking dates and numbers, consolidating into a single narrative. The work is artisanal. It requires human judgment, she needs to assess source credibility, handle contradictions, extract meaning from messy data. But so much of it is structural work that a machine could do.

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

Product generation agents draft analytical outputs, situation reports, trend analysis, early warning signals, critical updates, and flag them for human review.

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

Agentic systems aren't replacing analysts. They're multiplying their capacity. One analyst with AISA support can do the work of five analysts without it. That's not because the agents are smarter, it's because they handle the repetitive structural work and let the humans focus on judgment.

This matters now because the technology is ready. Large language models can read, understand, classify, and synthesize information. Multi-agent orchestration frameworks exist. We know how to build agentic systems. The missing piece is someone building it for humanitarian use.`,
      },
      {
        heading: 'Closing Provocation',
        content: `The question isn't whether AI will transform humanitarian information management. It will. The question is whether we'll build the right kind of AI.

Will we build systems that augment human judgment or bypass it? Will we build for transparency and explainability or opacity? Will we build for the constraints of humanitarian work, sparse data, ethical complexity, political sensitivity, or will we import standard models that don't fit?

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
        content: `I managed data literacy trainings in Pashto and Dari because the tools we built didn't speak the language of the people using them. We designed dashboards in English for field teams who think in Hausa, Yoruba, Dari. The interface was the bottleneck, not the data, not the analysis, not the people.

Ten years of humanitarian field work convinced me of this. In Cox's Bazar I coordinated communication data across 1,100+ radio listening groups in refugee camps. In Ethiopia I managed post-distribution monitoring surveys across 1,559 households from five organizations. In Afghanistan I watched 63 women complete data literacy training in Pashto and Dari, training that was necessary because the reporting platform they needed to use was designed for English speakers sitting in front of laptops.

Every one of these experiences pointed to the same problem: the people with the most important data are the hardest for our systems to hear. Not because they lack information, because our interfaces demand literacy and screen fluency that don't match the reality on the ground.`,
      },
      {
        heading: 'Why Voice Changes Everything',
        content: `Speaking is 3-4x faster than typing. It captures nuance no checkbox will. And the language infrastructure is finally being built, Google's WAXAL project released 11,000+ hours of speech across 21 African languages from 2 million recordings. The Gates Foundation's African Next Voices initiative adds 18 more. Meta's Omnilingual ASR now supports 1,600+ languages. These aren't features. They're the foundation of a completely different data paradigm.

Consider what this means practically: a farmer in Kano or a health worker in Kandahar doesn't need to read a form. She just speaks. One spoken sentence: "Borehole contaminated in Ward 7, cholera cases rising, we need ORS supplies by Thursday", contains six structured data points. No form needed. Voice-to-schema AI handles the rest.

The voice AI market crossed $22 billion this year. Cost per voice query: under $0.01. The infrastructure cost is collapsing at the same time the capability is expanding. This is the inflection point the humanitarian sector has been waiting for, even if most of it doesn't realize it yet.`,
      },
      {
        heading: 'The Reporting System I Built. And Its Limits',
        content: `I coordinated a reporting platform where over 100 organizations across Afghanistan submit operational data to the Humanitarian Response Plan. In a single month, partners reported millions of services to beneficiaries across thousands of locations. Over 50 organizations creating hundreds of reports. That system works, it took years to build and scale.

But what it can't do: collapse the time between a field observation and a decision. The reporting cycle is monthly. Dashboards update after data cleaning. By the time a winterization capacity gap shows up on a coordinator's screen, the cold wave may have already hit.

Modern voice AI doesn't just transcribe, it extracts entities, classifies urgency, geo-tags, and maps speech into structured schemas automatically. The same information that takes a reporting officer 30 minutes to enter into a form takes 30 seconds to speak. That's not incremental improvement. That's a different paradigm for evidence generation.`,
      },
      {
        heading: 'The Organizations That Move First Will Hear What Others Can\'t',
        content: `The organizations that adopt voice-native data collection won't just improve response rates. They'll hear from people our current systems have been silencing for decades. The displaced mother in northeast Nigeria who thinks in Hausa. The community health worker in rural Afghanistan who can describe a cholera outbreak in Dari but can't navigate an English-language form. The market trader in a flood-affected zone who knows exactly what supplies are needed but has no way to feed that intelligence into the coordination system.

These aren't hypothetical users. These are the people I've worked with for a decade. Their intelligence is the most valuable data in any humanitarian response, and our tools have been structurally excluding them.

As the humanitarian sector manages the current shift, shrinking budgets, rising needs, growing scrutiny on impact, voice data is one of the quick wins that remains available even in the face of funding shortfalls. It gives every actor an equal playing ground to understand the needs of beneficiaries.

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

At every step, context is lost. Nuance is stripped. The original observation is compressed into something our systems can process, not something that reflects what actually happened.`,
      },
      {
        heading: 'What Forms Cost Us',
        content: `A form asks "Was the assistance adequate?", Yes or No. But a displaced woman in northeast Nigeria doesn't think in yes or no. She thinks: "The rice came but it was half of what we needed, my daughter is sick and there's no medicine at the clinic, and I'm afraid to go to the distribution point alone."

None of that fits a checkbox. We did the best we could with the tools we had. But we must also acknowledge how structurally inadequate those tools were for understanding the real needs of the most vulnerable. The humanitarian agenda was designed to centre affected voices. Our data infrastructure has been doing the opposite, encoding their realities into categories we find convenient to analyse.

Even qualitative methods, the approach we trust to preserve nuance, pass through layers of interpretation. An enumerator translates. A researcher codes themes. An analyst writes findings. The original intent of the person who spoke has been reshaped at least three times before it informs a decision.

I've conducted several Key Informant Interviews in my humanitarian career, and during the COVID-19 pandemic, I led secondary data analysis using the DEEP platform with several steps of workflow designed to reduce cognitive bias. The rigour was real. But the original voices of affected populations were still mediated through documents written about them, not by them.`,
      },
      {
        heading: 'Voice-to-Schema: The Technical Shift',
        content: `One spoken sentence: "Borehole contaminated in Ward 7, cholera cases rising, we need ORS supplies by Thursday", contains six structured data points. Location: Ward 7. Infrastructure affected: borehole. Status: contaminated. Health impact: cholera. Need: ORS supplies. Urgency: Thursday.

No form needed. Voice-to-schema AI handles the extraction, classification, and structuring automatically. The original recording remains as the auditable source of truth, something no form-based system has ever provided.

Modern voice AI doesn't just transcribe. It extracts entities, classifies urgency, detects sentiment, geo-tags references, and maps speech into analytical frameworks. It does this in real time, at scale, for under a cent per interaction.

The same information that takes a reporting officer 30 minutes to enter into a form takes 30 seconds to speak. Multiply that across 200+ organizations and thousands of field workers, and you're looking at a fundamental acceleration of the evidence generation pipeline.

But the real gain isn't speed, it's fidelity. Voice captures what forms can't: emphasis, uncertainty, urgency, context. When a health worker says "cholera cases rising" with alarm in her voice, that urgency is data. A checkbox marked "health concern" strips all of that away.`,
      },
      {
        heading: 'The Question Isn\'t Whether, It\'s Who Goes First',
        content: `Voice AI VC investment surged 7x in two years. About 78% of businesses are deploying it. The voice AI market crossed $22 billion. Cost per query: under $0.01. The commercial sector has already moved.

The humanitarian sector hasn't. Not because the technology doesn't work, but because our institutional architecture is built around forms. Our M&E frameworks assume structured questionnaires. Our databases assume tabular data. Our quality assurance processes assume manual review of coded responses.

The question isn't whether voice replaces humanitarian forms. It's who redesigns and leverages their voice data pipeline first. The first mover advantage here isn't about technology, it's about evidence quality. The organization that builds voice-native data collection will generate richer, more timely, more inclusive evidence than any competitor still running on forms.

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
    title: 'Africa Will Define How Africa Uses Voice AI',
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '9 min',
    date: 'March 2026',
    excerpt:
      'Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI. And this time, the continent won\'t just adopt, it will lead.',
    sections: [
      {
        content: `Africa skipped landlines for mobile. Skipped bank branches for M-Pesa. Next: skipping text-based interfaces for voice-first AI.

I've built data systems in Maiduguri, Addis Ababa, Cox's Bazar, and Kabul. The pattern is consistent, the further you get from capital cities and English-language interfaces, the more our data systems fail the people who need them most. But everyone can speak. Every community, every market, every family has oral communication as its primary mode.

That's not a limitation. That's a design specification.`,
      },
      {
        heading: 'The Leapfrog That\'s Already Happening',
        content: `Africa has 2,000+ languages, most primarily oral. Traditional NLP depends on parallel text datasets that barely exist for these languages. You can't build a translation model on text that was never written down. But speech? Speech exists everywhere.

Google's WAXAL released 11,000+ hours across 21 Sub-Saharan African languages from 2 million recordings. The cost per voice AI query has dropped to $0.001-$0.01, cheaper than an SMS in most African markets. Meta's Omnilingual ASR now covers 1,600+ languages. Microsoft's PazaBench benchmarks ASR across 39 African languages.

The infrastructure for voice-native AI on the continent is being built right now, faster than most people realize. And unlike developed markets retrofitting voice onto legacy systems, African markets can build voice-first from the ground up. There are no legacy text-based systems to migrate from. The greenfield advantage is enormous.

Africa won't just adopt voice AI. Africa will define how the world uses it.`,
      },
      {
        heading: 'What I Saw in the Field',
        content: `I've seen what happens when data systems assume English literacy. In northeast Nigeria, I built cluster information management from scratch during the crisis response, dashboards and factsheets that served coordination but often couldn't capture what a community leader in a displacement camp actually wanted to communicate. In Afghanistan, we delivered Humanitarian Data Literacy training in Pashto and Dari because English-language tools created a barrier to the very partners we depended on for data.

In Cox's Bazar, I coordinated data across 1,100+ radio listening groups in refugee camps. Our structured surveys still couldn't capture what displaced Rohingya families actually prioritised. The forms asked what we wanted to know. Not what they needed to tell us.

The lesson was always the same: the interface excludes before the data even arrives. And the exclusion tracks perfectly with language and literacy, the communities with the most to contribute are the ones our systems are least equipped to hear.

Voice-native AI removes that barrier entirely. Not as an accessibility addon. As the primary interface.`,
      },
      {
        heading: 'From Humanitarian Lesson to Founder Conviction',
        content: `This isn't just a humanitarian insight. It's a commercial thesis.

78% of Nigerians send voice messages daily. The country has 200 million people and a $2.3 billion urban service economy where less than 5% of transactions happen on formal platforms. Why? Because the platforms are text-based, designed for formal addresses, built for stable internet, and assume digital payment accounts.

That's why Vendoh, the voice-first service marketplace I'm building, uses voice as the primary interface, not as an alternative. Voice-enabled discovery in Nigerian English and Pidgin. Intelligent proximity matching. Voice-driven service requests. Because that's how people actually communicate.

The implications extend far beyond any single platform. Voice-first AI in African markets isn't an accessibility feature, it's the default interaction model for a continent where oral communication has always been primary. The companies and organizations that understand this will build the infrastructure layer for the next phase of African digital development.

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
        content: `I was coordinating a program where 200+ organizations reported into a system I helped build. We tracked 3.4 million services across thousands of locations. We produced winterization dashboards, drought monitoring maps, predictive targeting studies. 23.7 million Afghans, more than half the population, needed humanitarian assistance. The data mattered.

And yet, in a coordination meeting, a field officer said: "By the time our data reaches Kabul, the situation has already moved."

He was right. Our 50-step analysis workflow was rigorous. It was also slow. The monthly reporting cycle meant decisions were always based on last month's evidence. By the time a winterization capacity gap appeared on a coordinator's screen, the cold wave may have already hit.

This isn't a failure of the people or the analysis. It's a failure of the pipeline.`,
      },
      {
        heading: 'The Pipeline Problem',
        content: `I led a $9.7M USAID-funded program that integrated humanitarian reporting, geospatial analysis, climate early warning, and cash transfer coordination. Our team built the Humanitarian Spatial Data Center, drought monitoring with NDVI, precipitation forecasting, vegetation health indices at 250-meter resolution, updated monthly via Google Earth Engine.

The data was powerful. But the pathway from a field observation to a strategic decision still ran through a pipeline designed for thoroughness, not speed. Field worker observes. Enters data into form. Data is cleaned. Aggregated. Analyzed. Formatted. Reviewed. Published. Distributed. Read by decision-maker. Decision is made.

In my systems, we produced 67 information products in a single month, dashboards, snapshots, maps, situation reports, across 13 humanitarian clusters. Each product followed that pipeline: collect, clean, analyze, design, review, publish. That cycle takes days to weeks.

The products we published on ReliefWeb described situations that had already evolved by the time someone read them. Not because the analysis was wrong, because the pipeline was structurally slow.`,
      },
      {
        heading: 'Voice + Agentic AI = Decision Intelligence',
        content: `Now imagine a different architecture. A field worker speaks a situation update. She doesn't fill out a form, she describes what she sees. AI agents transcribe it, extract structured indicators, cross-reference it against NDVI drought data and supply chain positions, and generate a decision brief, in under a minute.

Every component of that pipeline exists today. Voice models handle Nigerian English, Pidgin, and low-resource languages. Agentic frameworks chain multi-step reasoning autonomously. Satellite data APIs provide real-time environmental monitoring. Cost per interaction: under a cent.

This is what I call the shift from reporting to decision intelligence. Instead of a pipeline that moves data from field to desk over weeks, you have a system that continuously processes voice inputs, cross-references multiple data streams, and delivers role-aware intelligence in real time.

The health worker gets a brief about disease trends in her catchment area. The logistics officer gets supply chain recommendations based on access constraints. The coordinator gets a multi-sectoral overview that highlights emerging gaps. The donor gets impact evidence. Each stakeholder receives the intelligence they need, formatted for their role, delivered when it's still actionable.`,
      },
      {
        heading: 'The Architecture of Decision Intelligence',
        content: `Voice-powered agentic AI collapses the traditional pipeline into three layers:

Voice as the input layer, no forms, no training required, no literacy barrier. Field workers, community leaders, beneficiaries themselves speak. The system listens, transcribes, extracts structure.

Autonomous agents that cross-reference voice inputs against satellite imagery, epidemiological baselines, historical trends, and supply data in parallel. These agents don't wait for human instruction. They continuously process, classify, flag anomalies, identify patterns, and update their understanding as new voice inputs arrive.

Role-aware briefs delivered to coordinators, logistics officers, program managers, and donors, each getting the evidence they need, in real time, formatted for their specific decisions.

I'm not suggesting AI replaces the coordinator's judgment. But instead of deciding based on a two-week-old report, they're acting on real-time, evidence-backed intelligence. That's the leap from data collection to decision intelligence, and it's not incremental improvement. It's the evolution from reporting platforms to something fundamentally different.`,
      },
      {
        heading: 'Why This Is What I\'m Building Toward',
        content: `The future isn't faster reporting. It's replacing reporting with continuous voice-driven intelligence.

The technology is ready. Large language models can read, understand, classify, and synthesize information. Multi-agent orchestration frameworks exist. Voice models work in dozens of low-resource languages and the coverage is expanding monthly. The cost structure has collapsed to fractions of a cent per interaction.

What's missing is someone who understands both the technology and the operational reality, someone who's built the reporting systems, managed the analytical workflows, coordinated the multi-cluster responses, and can see exactly where the pipeline breaks down and how voice-powered agentic AI can replace it.

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
      'Accountability to Affected Populations has been a humanitarian commitment for over a decade. But our data collection tools, forms, checkboxes, pre-coded response categories, were never designed to listen. Voice AI changes the power dynamic.',
    sections: [
      {
        content: `For decades, we've relied on structured forms, checkboxes, dropdown menus, pre-coded response categories. Tools designed for analysts, not for the people living through crises.

I've managed needs assessments, response monitoring, and output reporting across Bangladesh, Ethiopia, Afghanistan, and Nigeria. The experience is the same everywhere: forms capture whether aid was received. They don't adequately capture what a mother actually needs, in her own words, with her own emphasis.

Data forms, by design, flatten context. They translate lived experience into categories someone in an office predetermined before going to the field. The voices the humanitarian agenda was built to uplift have been filtered through our tools before they ever reached a decision-maker.

We acknowledge we did the best we could with available resources. But "best we could" still meant: pre-coded forms, translated by intermediaries, interpreted by analysts, aggregated into dashboards that decision-makers read months later. The most vulnerable, women, children, displaced communities, people with disabilities, are represented as data points, not as people with context, priorities, and agency.`,
      },
      {
        heading: 'The Power Dynamic in Every Form',
        content: `Every humanitarian data form is an act of pre-judgment. Someone in a capital city decides which questions matter, which response options exist, which categories are worth tracking. The beneficiary's job is to fit their reality into those boxes.

In Cox's Bazar, I coordinated data across 1,100+ radio listening groups in refugee camps. Our structured surveys still couldn't capture what displaced Rohingya families actually prioritised. The forms asked what we wanted to know. Not what they needed to tell us.

Accountability to Affected Populations has been a humanitarian commitment for over a decade. The principle is clear: affected people should participate in decisions that impact their lives. But look at how we actually collect data from them.

We design forms in English. Translate them, often imperfectly, into local languages. Train enumerators to ask questions in a specific sequence. Offer pre-coded response options. Record answers in categories built for aggregation and dashboards.

At every step, the beneficiary's voice is compressed. Their priorities filtered through our framework. Their context stripped to fit our schema. The people closest to a crisis have always had the answers. Our tools just weren't built to listen.`,
      },
      {
        heading: 'Even Our Best Methods Mediate',
        content: `Even qualitative methods, the approach we trust to preserve nuance, pass through layers of interpretation. An enumerator translates. A researcher codes themes. An analyst writes findings. The original intent of the person who spoke has been reshaped at least three times before it informs a decision.

I've conducted several Key Informant Interviews in my humanitarian career, and during the COVID-19 pandemic, I led secondary data analysis using the DEEP platform with several steps of workflow designed to reduce cognitive bias. The rigour was real. But the original voices of affected populations were still mediated through documents written about them, not by them.

We did the best we could. And the results mattered, they informed decisions that affected millions of people. But the interface was always the bottleneck to evidence generation, not the data, not the analysis, not the people.

The question we need to ask ourselves is uncomfortable: in a sector built on the principle of centering affected populations, why have our data tools been structurally designed to exclude their direct input?`,
      },
      {
        heading: 'Voice Restores Agency',
        content: `Voice-native data collection inverts the power dynamic entirely. It doesn't ask what we want to know. It asks: what do you need us to hear?

With voice data, a beneficiary speaks, in her language, with her priorities, with her emphasis, and AI captures that as structured, analysable data without stripping the context. The original recording remains as the auditable source of truth. She can verify it, correct it, update it. That's accountability to affected populations, not as a reporting checkbox, but as system architecture.

Modern voice AI doesn't just transcribe. It extracts entities, classifies urgency, detects sentiment, and maps speech to analytical frameworks, while retaining the original recording as the auditable source. The person's own voice becomes the data. Not an intermediary's interpretation of what they said.

This is what truly inclusive evidence generation looks like: voice as the default input. Not a supplement. Not an accessibility feature. The primary way affected populations contribute to the humanitarian evidence base. In their language. In their words. In their framing.`,
      },
      {
        heading: 'A Forward-Looking Framework for Inclusive Evidence',
        content: `First, voice as the default input method. Not an alternative. The primary interface for how affected communities contribute to humanitarian evidence.

Second, AI-powered structuring that preserves context. Extract entities, classify urgency, map to analytical frameworks, while retaining the original recording as the auditable source of truth.

Third, multilingual by design. Google's WAXAL covers 21 African languages. Meta's Omnilingual ASR supports 1,600+. The infrastructure is arriving. Humanitarian systems need to integrate it now, not wait for perfection.

Fourth, beneficiary-owned feedback loops. When a person's spoken testimony is the data, they can verify it, correct it, update it. That's accountability to affected populations built into the system architecture.

Fifth, real-time evidence for real-time decisions. Voice collapses the collect-clean-analyse-report cycle into seconds. Decision-makers receive evidence while it's still actionable, not weeks after the situation has moved.

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
        content: `Only about 20% of the world speaks English at home. Yet nearly half of all AI training data is in English. Large language models score about 80% accuracy in English, below 55% for Yoruba, a language spoken by 50 million people. About 93% of the world's 7,000 languages are digitally underrepresented. Swahili, spoken by 200 million people, has 500 times less digital content than German.

If voice is the future of data, then voice infrastructure inequality is the future of data exclusion. The languages AI can hear will determine whose reality gets captured, and whose gets erased.

That's not a technology problem. That's a structural inequality problem wearing a technology mask.`,
      },
      {
        heading: 'The Language Wall',
        content: `Access to voice AI infrastructure tracks almost perfectly with GDP. The languages with the most speech recognition support are the languages of the world's largest economies, English, Mandarin, German, Japanese. The languages with the least support belong to communities that already face the deepest data gaps.

Stanford research shows AI is leaving non-English speakers behind, not because they lack access, but because models don't work in their languages. Countries where low-resource languages dominate show AI adoption rates about 20% lower than high-resource language countries, even when internet connectivity is comparable. The barrier isn't devices or broadband. It's that the AI doesn't understand them.

This is structural inequality in the age of AI. Not a firewall or a paywall. A language wall. If the infrastructure powering artificial intelligence is not democratic enough to serve everyone, then technological evolution doesn't close gaps, it widens them. The people furthest from economic power become furthest from the data systems shaping their futures.`,
      },
      {
        heading: 'What This Means for Humanitarian Evidence',
        content: `Now consider what this means for humanitarian evidence. Every sector is moving toward AI-powered analytics, healthcare, climate adaptation, food security. These systems need input data. If voice is the future of that input, and voice infrastructure only works in about 7% of the world's languages, then about 93% of humanity risks being excluded from the evidence base that drives decisions about their lives.

I've lived this. In Afghanistan, we delivered data literacy training in Pashto and Dari because the platforms were English-only. In Maiduguri, I built information management for the North East Nigeria crisis response where community leaders had critical intelligence but no way to feed it into coordination systems in Hausa or Kanuri.

I've managed programs where 23.7 million Afghans needed humanitarian assistance, more than half the population. The data systems informing that response relied on English-language platforms. Imagine instead: voice-native systems in Dari, Pashto, Hazaragi, Uzbek, where affected communities contribute directly to the evidence in real time.

That's not a distant future. That's what should exist now.`,
      },
      {
        heading: 'The Infrastructure Being Built. And the Gap That Remains',
        content: `Africa has 2,000+ languages. Google's WAXAL covers 21. The Gates Foundation's African Next Voices covers 18. Important starts, but less than about 2% of the continent's linguistic diversity.

Meta's Omnilingual ASR now covers 1,600+ languages. Microsoft's PazaBench benchmarks ASR across 39 African languages. The technology is advancing. But investment follows commercial return, not humanitarian need. G7 languages get investment. Languages of the Sahel, the Horn of Africa, South and Southeast Asia, where humanitarian needs are greatest, do not.

The voice AI market is $22 billion. But that growth is concentrated in languages already well-served. If we don't invest in voice infrastructure for low-resource languages, the about 93% that are digitally underrepresented, then the voice data revolution will simply reproduce existing exclusions in a new medium.

Voice data gives every actor an equal playing ground. But only if the infrastructure is built to serve every language, not just the commercially profitable ones.`,
      },
      {
        heading: 'The Stakes Are Higher Than We Realize',
        content: `Here's the uncomfortable truth: if AI becomes the primary engine of evidence generation, and voice becomes the primary input, then voice infrastructure inequality becomes a direct determinant of whose needs are visible and whose are not.

This fits into a much larger conversation. AI is growing exponentially. If the infrastructure powering it isn't democratic enough to serve everyone, then technological evolution doesn't reduce inequality, it compounds it. The same communities marginalized by colonial economic structures, by the digital divide, by the English-language bias of the internet, will be marginalized again, this time by the languages their AI can't hear.

As the humanitarian sector repositions amid funding shortfalls, this isn't abstract. The communities with the greatest needs and the least voice infrastructure will face the widest evidence gaps, precisely when accurate data matters most.

As AI becomes the backbone of evidence generation in health, agriculture, education, and humanitarian response, communities whose languages lack voice infrastructure will be invisible in the data systems that shape their futures. Voice infrastructure inequality is the new digital divide. And it's already widening.

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
      'What does a voice-native humanitarian evidence system actually look like? After a decade of building form-based platforms, here\'s the architecture I\'m working toward, and why it changes everything about how we generate evidence.',
    sections: [
      {
        content: `After a decade of building platforms that run on forms, and working within the limitations of form-based data systems, I'm now building the ones that run on voice. But what does that actually mean? Not as a thought experiment, as architecture.

I've spent enough time in the humanitarian sector to know that vision without implementation is just another conference slide. So let me be specific about what voice-native evidence generation looks like in practice, drawing on the operational realities I've encountered across six countries and the voice AI infrastructure that now makes this possible.`,
      },
      {
        heading: 'The Current Architecture. And Where It Breaks',
        content: `The evidence generation pipeline I've built and managed follows a consistent pattern across every humanitarian operation:

Design phase: subject matter experts design survey instruments, reporting templates, and indicator frameworks. This takes weeks. The instruments are in English, translated imperfectly, and assume a level of interface literacy that excludes the most vulnerable respondents.

Collection phase: trained enumerators administer forms, on tablets, on phones, on paper. Each interaction takes 20-45 minutes. The enumerator translates between the respondent's language and the form's language. Context is compressed into pre-coded categories.

Processing phase: data managers clean, validate, and aggregate submissions. They catch errors, reconcile inconsistencies, and prepare datasets for analysis. This takes days to weeks, depending on volume.

Analysis phase: analysts produce dashboards, situation reports, and information products. In Afghanistan, we produced 67 products in a single month across 13 clusters. Each product follows its own review and approval workflow.

Dissemination phase: products are published, on ReliefWeb, through coordination channels, to donors. By the time they're read, the situation they describe may have moved.

This pipeline works. I've built it at scale. But it's structurally slow, inherently exclusionary, and lossy at every transition point.`,
      },
      {
        heading: 'The Voice-Native Architecture',
        content: `A voice-native evidence system replaces the pipeline with a continuous flow. Here's the architecture:

Input layer: voice as the primary interface. No forms. No training required. Field workers, community leaders, health workers, and beneficiaries speak, in their language, with their priorities, with their context. The system listens in Dari, Pashto, Hausa, Yoruba, Pidgin, or any of the 1,600+ languages that modern ASR systems support.

Structuring layer: AI-powered extraction converts speech to structured data in real time. Entities are identified, locations, needs, quantities, urgency levels. Sentiment and emphasis are captured. The output is structured data that feeds into existing analytical frameworks. The original recording is preserved as the auditable source of truth.

Cross-reference layer: autonomous agents compare voice inputs against baseline data, satellite imagery, epidemiological trends, supply chain positions, historical patterns. Anomalies are flagged automatically. Contradictions between voice reports and other data sources are surfaced for human review.

Intelligence layer: role-aware briefs are generated for different stakeholders. The field coordinator gets operational intelligence. The program manager gets trend analysis. The donor gets impact evidence. Each stakeholder receives information formatted for their decisions, delivered at the frequency they need it.

Feedback layer: speakers can review, correct, and update their contributions. They see how their input was interpreted and can challenge the system's classification. This isn't just accuracy improvement, it's accountability to affected populations as system architecture.`,
      },
      {
        heading: 'The Cost Structure Has Collapsed',
        content: `This isn't aspirational technology. Every component exists today at scale.

Voice recognition: Whisper, WAXAL, Omnilingual ASR, sub-cent per interaction, supporting hundreds of languages including low-resource African languages.

Entity extraction and structuring: GPT-4o-class models extract structured data from unstructured speech with high accuracy. Custom fine-tuning for humanitarian taxonomies is straightforward.

Agentic orchestration: multi-agent frameworks coordinate complex workflows autonomously, the same technology that powers autonomous coding assistants can power autonomous evidence generation.

Satellite and climate data: Google Earth Engine, Climate Data Store, CHIRPS, FEWS NET, all accessible via API, all updatable in near-real-time.

The total cost of processing a single voice input through this entire pipeline, transcription, structuring, cross-referencing, and brief generation, is under $0.05. For context, the cost of administering a single form-based survey in the field runs $5-50 per household when you account for enumerator time, transport, data entry, and cleaning.

The economics aren't just favorable. They're transformational. Especially for a sector facing funding shortfalls and growing pressure to demonstrate impact efficiently.`,
      },
      {
        heading: 'What This Means for the Sector',
        content: `Voice-native evidence systems don't replace humanitarian analysts. They multiply their capacity. One analyst with voice-powered agentic AI support can process the information volume that currently requires a team of five. Not because the AI is smarter, because it handles the repetitive structural work and lets the human focus on judgment, context, and decision-making.

This matters now because the volume of humanitarian information is growing exponentially, more organizations, more reporting systems, more real-time data feeds, more beneficiary communication platforms. The analyst workforce can't scale to meet demand. You can't hire your way out of this problem.

For the organizations and actors who move first, the advantage isn't just efficiency. It's evidence quality. Voice-native systems capture what forms can't: context, emphasis, nuance, urgency. They include populations that form-based systems structurally exclude. They generate evidence in real time instead of on monthly cycles.

The interface was always the bottleneck to evidence generation, not the data, not the analysis, not the people. Voice removes the bottleneck. What follows is a fundamentally different relationship between the humanitarian sector and the communities it serves.

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
      'In Cox\'s Bazar, host communities pushed back against reforestation. Not because they opposed it, but because their own climate losses to coastal erosion and cyclones were undocumented and therefore unfundable. Disaster loss data is now the evidentiary backbone of the entire climate adaptation architecture.',
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
        content: `In Cox's Bazar, Bangladesh, I watched a reforestation programme collide with a community that was already losing ground, literally. The sudden influx of approximately 700,000 Rohingya refugees in 2017 had caused immense environmental strain, stripping hillsides of forest at a rate estimated at roughly four football fields every single day. IOM's reforestation effort, part of the broader Safe Access to Fuel and Energy Plus (SAFE+) programme, was replanting over 778 hectares with more than 775,000 trees. The goal was to stabilise soil against landslide and flood risk in and around the camps.

The host communities pushed back, and hard. Not because they opposed reforestation. They were dealing simultaneously with rising sea levels eating into their own agricultural land, increasingly severe cyclone seasons battering their livelihoods, and the social and economic pressure of hosting one of the world's largest displaced populations on land they were already losing to the Bay of Bengal. IOM adopted a cash-for-work approach to the reforestation, hiring host community members for planting, site preparation, and nursery management. It was a proven method for creating livelihood opportunities and reducing the refugee-host community tensions that were building across the district. The approach was smart. It turned an environmental intervention into an economic one and gave host communities a material stake in the programme's success.

But when we sat with local disaster management authorities to discuss reforestation priorities, the conversation still cut deeper than livelihoods. It was about competing vulnerabilities, compounding risks, and a community whose own climate losses felt invisible next to the scale and resourcing of the refugee response. The land they were losing to the sea. The embankments failing each monsoon. The crops destroyed by cyclone flooding. Cash-for-work addressed the economic tension. It could not address the evidentiary one: that the host community's disaster losses were undocumented, unquantified, and therefore unfundable.

That experience crystallised something I had been observing across multiple crisis contexts. Disaster loss data is no longer a back-office record-keeping exercise. It is the evidentiary backbone of the entire global climate adaptation architecture. And the communities that need it most are usually the ones whose losses are least documented.`,
      },
      {
        heading: 'The Evidence Gap Nobody Talks About',
        content: `The host communities around Cox's Bazar had a legitimate grievance. Their flood losses, their coastal erosion, their cyclone damage. None of it was systematically recorded in a format that could compete for adaptation funding against the well-documented refugee response. The refugee operation had registration data, displacement tracking, cluster-level needs assessments, and donor reporting pipelines. The host community's climate losses had fragmented local records and anecdotal evidence.

This asymmetry is not unique to Bangladesh. Of 193 UN Member States, only [153 report to some degree](https://www.undrr.org/monitoring-sendai-framework) on the Sendai Framework targets, and significant data quality gaps persist even among those that do. Many countries, particularly in the Global South, still rely on paper-based disaster records or fragmented spreadsheets that cannot be aggregated, compared, or verified. The [Global Assessment Report 2025](https://www.undrr.org/gar/gar2025) estimated the true cost of disasters at $2.3 trillion globally. Yet in many of the most disaster-affected countries, the loss data that would justify DRR investment simply doesn't exist in a usable form.`,
      },
      {
        heading: 'Whose Responsibility Is This?',
        content: `The Cox's Bazar experience laid bare an uncomfortable truth. The responsibility for collecting disaster loss and damage data was never in the hands of humanitarian organisations in the first place.

IOM, UNHCR, WFP, and the cluster system collect operational data (displacement figures, needs assessments, response coverage) because they need it to run emergency programmes. That data is designed for coordination, not for national statistical accounting. It tracks what humanitarian agencies are doing. It does not systematically track what disasters are costing a country's population, infrastructure, agriculture, and ecosystems over time. Yet in the absence of functioning national systems, humanitarian data has become a proxy for loss data, and a poor one at that, because it captures response activity rather than comprehensive impact.

The responsibility for systematic, complete, and quality disaster loss and damage data sits with two national institutions. [National Disaster Management Agencies](https://www.undrr.org/building-risk-knowledge/disaster-data) (NDMAs) collect operational impact data from the ground. [National Statistical Offices](https://www.undrr.org/building-risk-knowledge/framework-disaster-statistics) (NSOs) certify that data as official statistics meeting international standards. This is where the Sendai Framework places the mandate. This is also where the [G-DRSF](https://www.undrr.org/building-risk-knowledge/framework-disaster-statistics), endorsed by the UN Statistical Commission in March 2026, assigns institutional roles.

But we have to be honest about why these institutions have not always fulfilled this mandate. NDMAs in many countries operate with skeleton staff, outdated tools, and budgets that prioritise emergency response over data management. NSOs rarely have disaster statistics units. When they do, those units compete for resources against census operations, economic surveys, and demographic monitoring. UNDRR's own [capacity assessments](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) have consistently found gaps in governance, technical infrastructure, data quality, and human capacity across the countries they support. The [UNDRR Strategic Framework 2026-2030](https://www.undrr.org/strategic-framework-2026-2030) identifies risk knowledge as a critical gap requiring systematic institutionalisation and resourcing. An acknowledgement, basically, that the mandate exists but the means to fulfil it often do not.

The result is predictable. One of the most common challenges among reporting countries is the [reliability of data and the systematisation of datasets](https://www.undrr.org/measurement-indicators-sendai-framework) from different sources generated by different institutions. Data completeness, consistency, and disaggregation remain uneven. And communities like those in Cox's Bazar, whose losses fall outside both the humanitarian data pipeline and the capacity of under-resourced national systems, end up in an accountability void where nobody is counting what they have lost.

Meanwhile, humanitarian data capacity itself is shrinking. The [State of Open Humanitarian Data 2026](https://centre.humdata.org/) revealed that crisis data availability has fallen from 74% to 68% across 22 humanitarian operations. OCHA, UNHCR, and IOM have all experienced significant reductions in data staff. The proxy system is degrading at the same time as the demand for the real thing has never been higher.`,
      },
      {
        heading: 'Two Convergent Pressures',
        content: `The importance of disaster loss data has not changed. It has always mattered. What has changed is that two global policy processes now simultaneously demand it, and the consequences of not having it are financial.

**The [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data)** has $768 million in pledges against $580 billion in estimated need. Its first COP30 call for proposals made one thing clear: evidence-based loss data is the prerequisite for accessing finance. Communities like those around Cox's Bazar cannot access this funding without structured proof of what they have lost. **The [Sendai Framework Endgame](https://sendaimonitor.undrr.org/)** enters its final five-year implementation window in 2026, with the "Beyond the Numbers" acceleration strategy demanding disaggregated, validated, internationally comparable data. The 38 Sendai indicators feed directly into 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1.

Each process independently requires granular disaster loss data. Together, they create an unprecedented demand signal, and an unprecedented penalty for countries that cannot respond.`,
      },
      {
        heading: 'What Good Data Would Have Changed',
        content: `Back in Cox's Bazar, what would structured disaster loss data have changed? Almost everything about how that conversation with local disaster management authorities unfolded.

Imagine the district had maintained disaggregated records: hectares of agricultural land lost to coastal erosion by year, number of households displaced by cyclone flooding by union, damage to embankments and infrastructure by monsoon season. The host community's climate vulnerability would have been quantifiable, comparable, and fundable. The reforestation programme would not have needed cash-for-work alone to earn community consent. It would have been framed from the outset as what it actually was, a dual-benefit climate adaptation measure where replanting stabilised hillsides for refugees at risk of landslide and restored watershed function for a host community losing agricultural land to erosion and flooding. The data would have made both vulnerabilities visible in the same frame, and made the case that investing in one community's resilience was inseparable from investing in the other's.

The consent problem we faced was, at its root, a data problem. The refugee response had data infrastructure (registration systems, displacement tracking, cluster-level needs assessments, donor reporting pipelines). The host community's climate losses had fragmented local records and anecdotal evidence. Cash-for-work could address the economic grievance. Only structured loss data could have addressed the deeper one: the feeling that your crisis does not count because nobody is counting it.`,
      },
      {
        heading: 'DELTA Resilience: The System Designed to Close the Gap',
        content: `This is precisely the problem that [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is designed to solve. Co-developed by [UNDRR, UNDP, and WMO](https://www.undrr.org/news/undp-wmo-and-undrr-issue-statement-tracking-hazardous-events-and-disaster-losses-and-damages) to replace the legacy DesInventar platform, DELTA is a comprehensive system of tools, standards, and governance frameworks built to give NDMAs and NSOs the infrastructure they have lacked. Its [Data Ecosystem Maturity Assessment](https://www.undrr.org/event/bonn-technical-forum-2025-scene-setting-webinar-data-ecosystem-maturity-assessment-towards) diagnoses gaps in governance, infrastructure, data quality, and human capacity before any technology is deployed.

Critically, DELTA applies [no minimum thresholds for recording](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience). Localised, cascading, slow-onset, and rapid-onset events can all be documented consistently across sectors and scales. Legacy systems tend to capture headline disasters while the slow erosion of agricultural land, the seasonal flooding that displaces a few hundred families, and the localised landslide that destroys a school go unrecorded. For communities like those in Cox's Bazar, whose losses were incremental, compounding, and politically invisible, a no-threshold system means their crisis finally gets counted. DELTA uses universally unique identifiers (UUIDs) to systematically connect hazardous-event observations to their impacts (including [cascading and compound effects](https://www.undrr.org/event/bonn-technical-forum-2025-accelerating-tracking-hazardous-events-and-disasters)), producing the granular, multi-hazard loss records that the Sendai Framework, the Loss and Damage Fund, and the [Belém Indicators](https://unece.org/statistics/documents/2025/08/presentations/indicators-global-goal-adaptation-update-uae-belem-0) all require. Its "one-report-two-purposes" design means data entered once for the 38 Sendai indicators automatically feeds 12 SDG indicators, eliminating double-reporting. The [Arab States regional rollout](https://www.undrr.org/news/arab-states-accelerate-disaster-loss-and-damage-data-regional-rollout-delta-resilience), launched in Doha with 18 Member States, demonstrated the model: country-specific roadmaps drafted around institutional capacity, not technology wish lists.

The investment case is direct. Disaster loss data is the input that makes every other DRR investment measurable. The countries that invest now will access the Loss and Damage Fund. Those that do not will find themselves locked out, not because their losses are less real, but because they cannot prove them.`,
      },
      {
        heading: 'Where We Go from Here',
        content: `The architecture is finally in place: DELTA Resilience, the G-DRSF, the Sendai Framework Monitor, the Loss and Damage Fund. What remains is the hardest part. Building national capacity to collect, validate, analyse, and publish disaster loss data that meets these standards. That means investing in [data ecosystem maturity assessments](/expertise#data-analytics) before deploying technology, forging NDMA-NSO partnerships that outlast project cycles, and recognising that the data officer in a district disaster management office, the person who could have documented what Cox's Bazar's host communities were losing to the sea, is doing some of the most consequential climate work on the planet.

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
      'A flood vulnerability analysis I designed died quietly two years after I left, the trained staff member moved on, the dashboard stopped refreshing, and the analytical capability that informed life-saving decisions disappeared. The hardest lesson from a decade of building these platforms isn\'t technical. It\'s institutional.',
    sections: [
      {
        content: `In early 2019, I received a message from a former colleague in a mission I had left about two years earlier. The flood vulnerability and exposure analysis I had designed for displaced populations, a system that mapped how IDP settlement patterns intersected with flood risk across the response area to support contingency planning, was no longer being updated. The team member I had trained to maintain the analytical process had moved on. The live dashboard was gone. Only an old static version had been archived. And it was flood season again. They wanted to know whether the pattern of vulnerability and exposure among displaced populations had evolved, and they had no way to answer that question because the system that could tell them had died with the departure of the one person who knew how to run it.

That is how data innovations die operationally: not with a dramatic failure, but with a quiet erosion, a trained staff member leaves, a handover doesn't happen, a dashboard stops refreshing, and suddenly the analytical capability that informed life-saving decisions no longer exists. I wish I could say this surprised me. It didn't. I had seen it before, and I witnessed it again in the three countries where I worked afterward. Different systems, different organisations, the same pattern: an international organisation arrives, builds a sophisticated data platform, trains staff, produces impressive outputs for a year or two, and then leaves, taking the institutional knowledge, the server credentials, and the analytical momentum with them.

The hardest lesson from over a decade of building these platforms is not technical. It is this: the measure of a data system is not how sophisticated it is on launch day. It is whether it's still running two years after you leave.`,
      },
      {
        heading: 'The Graveyard of Humanitarian Data Platforms',
        content: `The humanitarian sector has a sustainability problem with data infrastructure. We celebrate launches, showcase dashboards at donor briefings, and write case studies about platforms "transforming decision-making." But we almost never return two years later to check whether they survived.

I have contributed to this graveyard. The systems that failed shared common traits: they were designed around international staff's analytical preferences rather than government workflows; hosted on servers controlled by the implementing organisation; built with tools the national team hadn't been trained to maintain; and their governance, who decides what data gets collected, who validates it, who publishes it, was never formally transferred. These failures reflect the fundamental misalignment between humanitarian project cycles (short, deliverable-driven, with rotating international staff) and what data systems need to survive: institutional permanence, local ownership, and sustained investment in human capacity.`,
      },
      {
        heading: 'The DELTA Resilience Connection',
        content: `These principles are now embedded in global architecture. [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), the next-generation disaster tracking system, was designed around sovereign data ownership from the ground up. Its interoperability architecture (API-driven data exchange with meteorological services and sectoral ministries) integrates into existing government ecosystems rather than sitting alongside them.

The [Data Ecosystem Maturity Assessment (DEMA)](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) framework assesses governance, infrastructure, data quality, and human capacity before deploying technology. The G-DRSF institutionalises the NSO partnership by mandating statistical harmonisation between disaster management and official statistics.

These are governance improvements, not technical ones. And governance improvements determine whether systems survive.`,
      },
      {
        heading: 'What Makes a Data System Survive Its Creator',
        content: `After building or contributing to data platforms in six countries, I have distilled what works into four principles. None of them are technical. All of them are institutional.

**Institutional anchoring from Day 1.** The system must belong to government from the beginning, not be handed over at project close. This means the National Disaster Management Authority or the relevant ministry is the data owner from the first design meeting. It means the platform sits on government infrastructure (or government-controlled cloud), not on the implementing organisation's servers. It means the URL, the branding, and the access controls reflect government ownership.

**NSO partnerships.** National Statistical Offices outlive project cycles. They are the permanence anchor that project-funded NGOs cannot provide. The [G-DRSF (Global Disaster-Related Statistics Framework)](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/), endorsed by the UN Statistical Commission, formalises this insight at the global level, mandating that disaster data systems bridge the disaster management-NSO divide. In practice, this means involving the NSO from the data model design stage, not the validation stage. It means using statistical standards (p-codes, official administrative boundaries, internationally harmonised hazard classifications) that the NSO recognises. It means building a data pipeline where the disaster management authority collects operational data and the NSO certifies it as official statistics. When I conducted a data ecosystem audit at a UN agency's headquarters-level posting, the same principle applied: the system that survived was the one that aligned with existing institutional reporting flows, not the one that tried to replace them.

**Training-of-Trainers, not training-of-users.** Generic user training is expensive and ineffective. I have watched hundreds of staff trained on Power BI or QGIS who never used the tool again after training ended, because they lacked ongoing support, peer community, and institutional incentive. Training-of-Trainers (ToT) produces lasting capacity. Identify 3-5 national focal points per institution, invest heavily in their technical skills over months, and certify them only after they conduct a national workshop. Build a peer support structure so they troubleshoot without international assistance. The [Sendai Framework Academy](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) uses this model for DELTA Resilience. It creates self-sustaining knowledge ecosystems, not dependency relationships. When I built a coordination mechanism's analytical framework, a meta-analysis unifying data from five agencies across 1,559 households, it survived because the coordination mechanism owned it, not any single agency. The coordination leads maintained the analytical pipeline and onboarded new partner data. Governance was embedded in the structure, not in any individual.

**The politics of data ownership, and the politics of data suspension.** Data ownership is contested everywhere. Governments want control over publication, especially when data reveals politically sensitive patterns. Humanitarian organisations want open data for coordination. Donors want outputs demonstrating impact. These interests conflict, and if the governance structure doesn't resolve them at the design stage, the system becomes paralysed. But the politics can be even more brutal than paralysis. In one country where I served as programme coordinator, I witnessed a nationwide humanitarian reporting platform, the primary monitoring tool for over 115 partner organisations including UN clusters, NGOs, and working groups, suspended overnight when the sole donor froze funding. There was no phased transition plan. No bridge funding. No advance notification to the partners who depended on the system daily. The implementing organisation had no choice but to pause all operations immediately, and I was the one who had to communicate that decision to every partner across the response.

The consequences were immediate. The UN coordination body cancelled planned meetings with the implementing organisation and excluded it from critical information management discussions, a signal of institutional trust collapsing in real time. Partners who had built their coordination workflows around the platform were left without essential humanitarian data mid-response. Ethical questions surfaced about the reliability of an organisation that could suspend services without warning. And the episode exposed a structural vulnerability that no amount of technical sophistication could have prevented: a data system that serves an entire country's humanitarian coordination but depends on a single donor is a system with a single point of failure. The experience reinforced what I had been learning across every deployment: the politics of who funds, who hosts, and who controls a data system are not secondary concerns. They are the system's immune system. When the politics fail, the technology, no matter how well-designed, fails with it. The solution is tiered access and diversified ownership: government has sovereign control over raw data and publication; humanitarian partners access aggregated, anonymised data for coordination; donors receive pre-agreed outputs. And critically, no single donor or implementing partner should be the sole point of failure for a system that an entire response depends on. This requires formal data-sharing agreements, contingency plans for funding disruptions, and institutional anchoring deep enough that the system survives the departure, or suspension, of any single actor.`,
      },
      {
        heading: 'What I Would Do Differently',
        content: `In my earlier roles, I underestimated the time required for institutional anchoring. I moved too quickly to the technology, building dashboards, designing data models, training users, without investing enough in governance architecture. The dashboards looked impressive. The data models were sound. But the institutional foundations were shallow.

I also underestimated governance documentation: who owns what, who has admin access, what happens when staff leave, how disputes are resolved, what the escalation pathway looks like when the international organisation is no longer present. This documentation is tedious but essential.

The hardest conversation in humanitarian data work is not technical. It is telling a government official that current data quality is inadequate for international reporting, and that improving it requires resources, political commitment, and transparency about gaps. That conversation, handled badly, kills partnerships. Handled well, it begins genuine ownership.`,
      },
      {
        heading: 'Design for Departure',
        content: `The principle I now apply to every data platform: design for departure.

Before writing a single line of code, I ask: what happens when I leave? Who maintains the server? Who updates the data model when requirements change? Who trains the next cohort of data officers? Who troubleshoots failures at 2am before a donor briefing?

If I cannot answer with names, specific people in specific institutions with specific skills, I am not ready to build. The technology can wait. The institutional foundation cannot.`,
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
    date: 'February 2026',
    excerpt:
      'The transition from DesInventar to DELTA Resilience is not a software upgrade. It is an architectural shift, from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Understanding how and why this evolution happened matters for every country navigating the transition.',
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
        content: `Somewhere in a disaster management office, a data officer is trying to cross-reference five years of flood impact records with satellite-derived exposure data. The flood records exist in DesInventar Sendai, carefully entered, validated, and stored. But extracting them in a format that can be programmatically joined with geospatial data requires manual CSV exports, ad-hoc cleaning scripts, and reconciliation of inconsistent hazard classifications across reporting years. The process takes days. With an API, it would take minutes.

This scene plays out in dozens of countries. It captures the central tension in the evolution of national disaster tracking: the system that revolutionised disaster loss recording in the early 2000s has become insufficient for what the world now demands of it. The transition to [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is not a software upgrade. It is an architectural shift, from a standalone record-keeping tool to a sovereign, interoperable, AI-ready data ecosystem. Understanding how and why this evolution happened matters for every country navigating the transition.`,
      },
      {
        heading: 'The DesInventar Era: What It Built and Where It Hit the Wall',
        content: `DesInventar was revolutionary for its time. Launched in the early 2000s by La RED (the Network of Social Studies in the Prevention of Disasters in Latin America), and later adopted by UNDP and UNDRR for global deployment, it was the first system to enable countries to systematically record disaster losses at the sub-national level. Before DesInventar, most countries had no structured disaster database at all, loss data lived in newspaper clippings, ministerial memos, and the memories of provincial disaster officers.

At its peak, over 90 countries had DesInventar implementations. The system's "datacard" architecture, where each disaster event was recorded as a card with Serial (card number), Effects (impact indicators: deaths, injuries, houses destroyed, crops lost), and Geography (subnational administrative levels), created a global standard for loss recording that enabled, for the first time, cross-country comparison of disaster impacts.

The [Sendai Framework Monitor](https://sendaimonitor.undrr.org/), launched in 2015, used DesInventar Sendai as its primary national data entry mechanism. The 38 Sendai indicators, covering mortality (Target A), affected people (Target B), economic losses (Target C), infrastructure damage (Target D), DRR strategies (Target E), international cooperation (Target F), and early warning (Target G), were mapped onto DesInventar's datacard fields.

This worked. But it worked within constraints that became increasingly untenable as the DRR landscape evolved.

**Standalone architecture.** DesInventar installations were isolated, no mechanism for automated data exchange with meteorological services, health ministries, statistical offices, or humanitarian platforms. Integration required manual CSV exports and bespoke scripting.

**No API.** The absence of programmatic access made real-time data exchange, essential for early warning triggers, anticipatory action, and automated reporting, impossible without manual intervention.

**Ad-hoc hazard classification.** Countries classified hazards inconsistently. A "flood" in one country might encompass flash floods, riverine floods, and coastal inundation under a single category, while another recorded them as separate event types. Cross-country comparison and historical trend analysis suffered.

**Limited disaggregation.** Mandatory disaggregation by sex, age, and disability status, now required by the Sendai Framework, was not built into DesInventar's core architecture.

**Data ownership ambiguity.** Many DesInventar databases were hosted by implementing partners (UNDP, NGOs) rather than governments. When projects ended, databases often became inaccessible when servers were decommissioned, a pattern that has repeated across dozens of countries.`,
      },
      {
        heading: 'Why the World Outgrew DesInventar',
        content: `Three structural shifts in the DRR landscape made the limitations of DesInventar untenable.

**Compounding risks.** The era of single-hazard analysis is over. Countries now experience simultaneous earthquakes, floods, drought, and economic shocks. Coastal nations face cyclones, riverine flooding, and monsoon-related landslides within the same season. A tracking system that records events as isolated datacards, without the ability to model compound, cascading, and concurrent hazards, cannot capture the reality of 21st-century disaster risk.

**Demand for disaggregated data.** The Sendai Framework, SDGs, and UNFCCC now require impact data disaggregated by geography, sector, sex, age, and disability. The [59 Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data) adopted at COP30 require demonstrating declining disaster impacts across specific population groups. DesInventar's data model lacked this granularity.

**AI and interoperability.** GeoAI, machine learning-based damage assessment, and automated early warning systems demanded disaster data consumable programmatically, through APIs, standardised formats, at machine speed. DesInventar's manual-export architecture became a bottleneck.`,
      },
      {
        heading: 'What DELTA Resilience Actually Is',
        content: `[DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), Disaster & Hazardous Events, Losses and Damages Tracking & Analysis, is the successor system, co-developed by UNDRR, UNDP, and WMO. The name itself marks the shift: from "inventory" (DesInventar) to "tracking and analysis" (DELTA). It is not a software update. It is a comprehensive system that includes tools, standards, methodologies, and governance frameworks.

Here is what changed across nine key dimensions:

**Architecture**, DesInventar was a standalone software application. DELTA is a comprehensive system with tools, standards, and methodologies.

**Data Ownership**, DesInventar databases were often hosted by external partners. DELTA is sovereign and country-owned: governments maintain full data control.

**Interoperability**, DesInventar was isolated, with manual CSV extraction. DELTA is API-ready, designed for multi-agency ecosystems.

**Hazard Classification**, DesInventar used ad-hoc or simplified categories. DELTA aligns with [WMO-CHE](https://www.undrr.org/building-risk-knowledge/disaster-data) methodology and ISC 2025 Hazard Information Profiles.

**Environmental Impact**, Not included in DesInventar. DELTA includes [FRAME-ECO](https://iucn.org/story/202603/loss-damage-webinar-accelerating-assessment-climate-and-disaster-related-biodiversity) (UNEP/UNU-EHS) for biodiversity and ecosystem loss.

**Statistical Framework**, DesInventar had informal alignment with statistical standards. DELTA has full G-DRSF alignment for international statistical harmonisation.

**Disaggregation**, DesInventar offered limited disaggregation. DELTA mandates disaggregation by geography, sector, sex, age, and disability.

**Reporting Coherence**, DesInventar was single-purpose (Sendai only). DELTA implements "one-report-two-purposes": 38 Sendai indicators automatically feed 12 SDG indicators.

**AI Readiness**, DesInventar required manual workflows. DELTA is designed for programmatic access and automated analytics.

**Sovereign data ownership.** This is the most consequential change. DELTA is built around the principle that governments own their data, their platforms, and their analytical outputs. The system can be deployed on government infrastructure, and countries maintain administrative control. This directly addresses the sustainability failure that killed so many DesInventar implementations, when the international partner leaves, the system stays.

**WMO-CHE hazard classification.** DELTA uses the World Meteorological Organization's Climate and Hazardous Events (CHE) methodology, aligned with the International Science Council's 2025 Hazard Information Profiles. This standardises event classification globally, a flood in any DELTA-implementing country is categorised using the same taxonomy, making cross-country comparison reliable for the first time.

**FRAME-ECO.** Developed with UNEP and UNU-EHS, this component allows countries to quantify losses to biodiversity and ecosystem services, a dimension entirely absent from DesInventar. As climate adaptation increasingly recognises the role of ecosystems in disaster risk reduction (mangrove protection against storm surge, wetland absorption of flood waters), the ability to track ecosystem losses becomes essential for policy coherence.

**G-DRSF alignment.** The [Global Disaster-Related Statistics Framework](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/), endorsed by the UN Statistical Commission in March 2026, provides the internationally harmonised standards that bridge National Disaster Management Agencies (NDMAs) and National Statistical Offices (NSOs). DELTA operationalises these standards, ensuring that disaster data meets the rigour required for official statistics while remaining operationally relevant for disaster management.`,
      },
      {
        heading: 'The Migration Challenge',
        content: `The transition from DesInventar to DELTA is not a simple data transfer. It is a complex migration that must preserve historical records while upgrading the data model.

**Schema mapping** is critical. Every DesInventar datacard must be mapped to corresponding DELTA variables while preserving the multi-year historical baseline that the Sendai Framework requires for trend analysis. Automated validation scripts flag duplicates, inconsistencies, and records that violate G-DRSF standards, for example, events where mortality exceeds affected population (disturbingly common) or missing administrative geography codes.

**The tiered approach** recognises vastly different digital maturity levels: Foundational countries digitise historical records on DELTA; Interoperable countries prioritise API development and hazard classification standardisation; Advanced countries focus on G-DRSF harmonisation and FRAME-ECO integration.

**Parallel-run verification** is mandatory: both systems operate concurrently for one reporting cycle, with records compared for accuracy before legacy decommissioning.

The [Arab States regional rollout](https://www.undrr.org/news/arab-states-accelerate-disaster-loss-and-damage-data-regional-rollout-delta-resilience), launched in Doha in October 2025 with 18 Member States, was the first large-scale deployment, demonstrating a model where country-specific roadmaps were drafted around institutional capacity rather than technology wish lists. The [HNPW 2026 session](https://www.undrr.org/event/hnpw-2026-delta-resilience-enabling-use-disaster-impact-data-risk-informed-inclusive-climate) showcased how the system enables disaster impact data for humanitarian decision-making, including anticipatory action triggers, impact-based forecasting, and identification of marginalised populations.`,
      },
      {
        heading: 'What This Means for Practitioners',
        content: `For disaster data officers, IM coordinators, and NDMA staff, the transition reshapes daily work in four concrete ways.

**Data entry feeds two reporting obligations simultaneously.** The "one-report-two-purposes" design means entering data against the 38 Sendai indicators automatically generates the 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1, eliminating the double-reporting burden that has exhausted national statistical capacity for years.

**Databases are no longer isolated.** DELTA's API architecture means disaster data can be consumed by meteorological services for forecast verification, by statistical offices for official publication, by humanitarian platforms for coordination, and by analytical tools for trend analysis, all without manual exports.

**Hazard classifications are globally standardised.** WMO-CHE and ISC Hazard Information Profiles mean flood data from one DELTA country is directly comparable with flood data from any other. This matters for regional risk assessments, cross-border early warning, and international reporting.

**New skills are required.** The shift from standalone record-keeping to an interoperable ecosystem demands skills in API management, data governance, and statistical quality assurance that were not part of the DesInventar training curriculum. The Sendai Framework Academy's Training-of-Trainers model is designed to build these skills nationally.`,
      },
      {
        heading: 'The Road Ahead',
        content: `The transition from DesInventar to DELTA represents something larger than a technical migration. It is the transition from record-keeping to risk knowledge. Record-keeping tells a country what happened. Risk knowledge tells it what is likely to happen, who is most vulnerable, and what can be done about it, with the statistical rigour, disaggregation, and interoperability that modern climate policy demands.

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
      'During a UN consultancy, I needed to integrate disaster impact data with population statistics. The two agencies\' offices were close by, their data might as well have been on different planets. The G-DRSF, endorsed in March 2026, finally gives statisticians and disaster managers a shared vocabulary.',
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

Neither dataset was wrong. They were produced by different institutional cultures for different purposes using different standards, and they could not be combined without weeks of manual harmonisation. I'm a disaster risk and humanitarian data systems architect who has spent a decade working at this exact fault line, and the experience has convinced me that the single most important development in disaster data governance this decade is not a new platform or a new indicator. It is the [Global Disaster-Related Statistics Framework (G-DRSF)](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/), endorsed by the UN Statistical Commission on 9 March 2026, which for the first time gives disaster managers and statisticians a shared vocabulary, shared standards, and a shared reason to work together.`,
      },
      {
        heading: 'What the G-DRSF Is',
        content: `The G-DRSF is the first internationally harmonised framework for producing disaster-related statistics. Developed through comprehensive global consultation in 2025, it provides the statistical standards, definitions, and methodologies that bridge two institutional worlds: the National Disaster Management Agencies (NDMAs) who collect operational disaster data, and the National Statistical Offices (NSOs) who produce the official statistics that governments and international bodies rely on for policy and finance decisions.

Before the G-DRSF, these two worlds operated in parallel. NDMAs collected data for operational purposes, which villages were flooded, how many houses were damaged, how many people needed emergency assistance. NSOs produced statistics for policy purposes, poverty rates, GDP impacts, population demographics. The data rarely met. When it did, the reconciliation was manual, ad-hoc, and unreproducible.

The G-DRSF changes this by establishing:

**Shared definitions** for what constitutes a "disaster," a "hazardous event," a "loss," and a "damage", aligned with the Sendai Framework's terminology and the WMO-CHE hazard classification system.

**Shared geographic standards** using p-codes and official administrative boundary systems, ensuring that disaster data can be linked to census data, health data, education data, and economic data without geographic reconciliation.

**Shared quality assurance protocols** that specify what completeness, accuracy, timeliness, and consistency mean for disaster data, giving NSOs a framework for certifying NDMA data as official statistics.

**Shared disaggregation requirements** mandating that disaster impact data be broken down by geography, sector, sex, age, and disability, aligning with both the Sendai Framework's Leave No One Behind commitment and the SDG disaggregation standards.`,
      },
      {
        heading: 'Why This Matters: One Report, Two Purposes',
        content: `The most consequential design feature of the G-DRSF is what UNDRR calls the "one-report-two-purposes" principle. Data entered once to meet the [38 Sendai Framework indicators](https://sendaimonitor.undrr.org/), covering mortality (Target A), affected people (Target B), economic losses (Target C), infrastructure damage (Target D), DRR strategies (Target E), international cooperation (Target F), and early warning systems (Target G), automatically feeds 12 SDG indicators across targets 1.5, 11.5, 11.b, and 13.1.

This is not a minor efficiency gain. For developing countries with limited statistical capacity, the elimination of double-reporting is transformative. Many national statistics offices have between 2-5 staff dedicated to disaster-related statistics. Asking them to separately compile Sendai reports and SDG reports, using different methodologies, different formats, and different timelines, was a capacity burden that many countries simply could not meet.

The reporting cycle that the G-DRSF standardises follows global milestones in April and October, allowing countries to synchronise their disaster data production with both the Sendai Framework Monitor reporting windows and the SDG Voluntary National Review calendar. This synchronisation means that the same dataset, produced once, is valid for multiple international accountability mechanisms.`,
      },
      {
        heading: 'The NDMA-NSO Challenge',
        content: `The G-DRSF provides the framework. Making it work requires solving the hardest problem in disaster data governance: the institutional relationship between the NDMA and the NSO.

These are different organisations with different mandates, different cultures, and different relationships with political authority. NDMAs operate under operational urgency, data needs measured in hours and days. NSOs operate under statistical rigour, data needs measured in quarters and years. An NDMA data officer reporting "approximately 5,000 households affected" is doing good disaster management. An NSO statistician requiring sampling methodology and confidence intervals is doing good statistics. Both are right. The G-DRSF gives them a protocol for reconciling their rightness.

**Data ownership and p-codes.** Where disaster data has political sensitivity, which is most countries, the question of data ownership is contested. A Memorandum of Understanding (MoU) between the NDMA and NSO, signed before data collection begins, specifies data flows, validation protocols, publication authority, and dispute resolution. This governance document reflects a political agreement about how disaster data will be produced and certified.

Equally critical: the standardisation of geographic identifiers (p-codes). P-codes are the bridge between operational disaster data and statistical population data. Without valid p-codes, a flood impact cannot be linked to census figures or health facility density. With p-codes, the linkage is automatic. Ensuring consistent p-code usage is one of the highest-impact, lowest-cost interventions in disaster data quality. DELTA Resilience mandates this. Many legacy systems did not.`,
      },
      {
        heading: 'The COP30 Dimension',
        content: `The G-DRSF's March 2026 endorsement positions it as the data backbone for the post-COP30 reporting landscape. The [59 Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data) adopted at COP30 require countries to monitor adaptation progress across agriculture, health, infrastructure, and livelihoods, many requiring historical disaster loss baselines.

The COP30 "State of Loss and Damage Report" will rely on data produced through national DELTA Resilience systems aligned with G-DRSF standards. Countries that have not operationalised the G-DRSF will find their loss claims unverifiable, and in a resource-scarce environment where the [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data) has $768 million against $580 billion in estimated need, unverifiable claims will not be funded.

This creates a direct financial incentive for G-DRSF adoption. It is no longer about good practice. It is about access to climate finance.`,
      },
      {
        heading: 'How DELTA Resilience Operationalises the G-DRSF',
        content: `The G-DRSF provides the standards. [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) provides the system that turns those standards into a working data ecosystem.

DELTA's data model is built around G-DRSF definitions. Its hazard classification uses WMO-CHE. Its disaggregation structure implements G-DRSF requirements for sex, age, disability, and geographic breakdown. Its API architecture enables automated data exchange between NDMA and NSO systems.

The [Data Ecosystem Maturity Assessment (DEMA)](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) is conducted before DELTA deployment, assessing data governance, technical infrastructure, data quality, and human capacity. DELTA begins with governance and builds technology on institutional foundations, a sequencing that distinguishes it from predecessors like DesInventar.`,
      },
      {
        heading: 'What Practitioners Should Do Now',
        content: `If you work in disaster data at any level, national, regional, or global, here are three immediate actions:

**Read the G-DRSF.** The [e-learning course on UN SDG:Learn](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/) is free, self-paced, and takes approximately 8 hours. It covers the framework's structure, definitions, and practical application. This is now essential knowledge for anyone working in DRR data.

**Map your current data against G-DRSF standards.** Take your national disaster database, whatever system it uses, and check: are your hazard classifications aligned with WMO-CHE? Are your geographic identifiers using valid p-codes? Is your disaggregation capturing sex, age, and disability? Is your mortality data cross-referenced with affected population data for consistency?

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
    date: 'February 2026',
    excerpt:
      'A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. The combination, forecast plus impact profile, is what makes anticipatory action evidence-based rather than speculative. DELTA Resilience is the first national disaster data system designed to provide that missing link at scale.',
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
        content: `I was in my office attempting a pilot design for drought anticipatory action triggers for a humanitarian response in Afghanistan. From the GIS team, I had access to good climate forecasts, CHIRPS rainfall anomaly data, NDVI vegetation stress indicators, food price monitoring report extract. We knew a drought was developing in several provinces. We had a general sense that it would be bad.

What I did not have was the "structured historical loss data" that could tell us: "The last three times rainfall deficit exceeded this threshold, it displaced approximately X thousand people, destroyed Y hectares of wheat, and cascading cholera outbreak from drought overwhelmed Z health facilities in these specific districts." I was designing triggers in the dark, calibrating thresholds based on expert judgment and proxy data rather than empirical impact records.

That experience crystallised a conviction: early warning without historical loss context is a forecast without meaning. A meteorological forecast tells you what is coming. Historical loss data tells you what it will do when it arrives. The combination, forecast plus impact profile, is what makes anticipatory action evidence-based rather than speculative. And [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is the first national disaster data system designed to provide that missing link at scale.`,
      },
      {
        heading: 'The Missing Pillar',
        content: `The Early Warnings for All (EW4All) initiative, led by UNDRR and WMO, is built on four pillars: risk knowledge, detection and monitoring, dissemination and communication, and preparedness for response. These pillars are not equally developed. Dissemination and communication is the most reported capability, at 42% of WMO Member States. Risk knowledge, the foundational layer that gives meaning to everything else, is the [least reported, at just 20%](https://link.springer.com/article/10.1007/s13753-025-00622-9).

This asymmetry is the central problem. Countries are investing in weather stations, satellite monitoring, and SMS alert systems, the detection and communication pillars, without investing in the risk knowledge layer that tells you what those alerts should trigger. A flood warning that says "river levels will exceed 5 metres in District X within 48 hours" is valuable. A flood warning that says "river levels will exceed 5 metres in District X within 48 hours, and based on historical impact data, this will likely displace 12,000 people, damage 40 health facilities, and destroy 3,000 hectares of rice paddies, with women-headed households in the eastern sub-districts being disproportionately affected" is transformative.

The second warning enables anticipatory action, pre-positioning relief supplies, pre-authorising cash transfers, activating evacuation protocols, targeted to specific populations in specific geographies based on empirical evidence. The first warning enables general preparedness. The gap between them is the gap between reacting to disaster and preventing its worst consequences.

DELTA Resilience is the risk knowledge backbone that closes this gap.`,
      },
      {
        heading: 'How DELTA Enables Impact-Based Triggers',
        content: `An anticipatory action trigger is a pre-agreed threshold that, when crossed, automatically activates a pre-funded response. The most common triggers combine a hazard forecast (e.g. rainfall deficit exceeding a certain percentile) with a vulnerability indicator (e.g. food insecurity classification above a certain phase) and, ideally, a historical impact profile that predicts the likely consequences.

DELTA Resilience provides the third component. Here is how:

**Disaggregated loss records create historical impact profiles.** DELTA mandates disaggregation by geography (sub-national administrative levels with p-codes), sector (agriculture, health, infrastructure, housing), and population characteristics (sex, age, disability). This means that for every hazard type, in every district, the system accumulates a structured record of what happened: how many people were displaced, how many crops were destroyed, how many facilities were damaged, and who was disproportionately affected.

Over time, these records build impact profiles, empirical distributions of expected consequences for a given hazard type in a given geography. When a forecast indicates that a similar hazard is approaching, the impact profile provides the evidence base for predicting what will happen and who will be affected.

**WMO-CHE standardised hazard classification enables event matching.** One of the fundamental requirements for impact-based triggers is the ability to compare current forecasts with historical events. If the historical database classifies floods using inconsistent categories, sometimes "flash flood," sometimes "riverine flood," sometimes just "flood", then matching current forecasts to historical impacts becomes unreliable. DELTA's adoption of the WMO Climate and Hazardous Events (CHE) methodology ensures that hazard events are classified consistently across time and geography, making historical matching reliable.

**FRAME-ECO adds environmental vulnerability indicators.** Ecosystem degradation, deforestation, wetland loss, mangrove destruction, directly affects disaster impact. A community protected by intact mangroves experiences less storm surge damage than one where the mangroves have been cleared. DELTA's FRAME-ECO component, developed with UNEP and UNU-EHS, tracks environmental losses alongside human and economic losses, enabling triggers that account for changing environmental vulnerability.

**API-ready architecture enables automated trigger verification.** Anticipatory action systems need to verify triggers in near-real-time, checking whether current conditions match the pre-agreed thresholds. DELTA's API architecture allows automated queries: "Return all flood events in District X where displacement exceeded 5,000 people in the last 10 years" can be answered programmatically, enabling trigger verification pipelines that operate at machine speed rather than requiring manual data extraction.`,
      },
      {
        heading: 'Three Use Cases',
        content: `**Drought anticipatory action.** In drought-prone regions, triggers typically combine rainfall anomaly (CHIRPS data), vegetation stress (NDVI from satellite imagery), and food security classification (IPC phase). What they often lack is the historical impact profile: when these conditions occurred previously in a specific zone, what was the actual impact on agricultural livelihoods, displacement, and malnutrition?

DELTA loss records, accumulated over multiple drought cycles and disaggregated by zone and sector, provide this profile. A trigger that says "CHIRPS rainfall deficit > 1.5 standard deviations AND NDVI anomaly < -0.2 AND historical DELTA records show agricultural loss > $5M and displacement > 10,000 under similar conditions" is fundamentally more evidence-based than one relying on rainfall and NDVI alone.

This analytical framework, layering hydrometeorological hazard indicators onto vulnerability data from multiple sectors and overlaying response coverage to identify [anticipatory action gaps](/expertise#climate-analytics), is increasingly crucial. The framework works, but historical loss data is often fragmented and requires extensive harmonisation. DELTA provides it in a structured, queryable format.

**Flood anticipatory action.** In flood-prone regions, anticipatory action protocols are increasingly linked to hydrological forecasts, river level predictions, inundation models, and satellite-based flood extent mapping. The [WFP Forecast-based Financing programmes](https://www.wfp.org/anticipatory-actions) have demonstrated the operational viability of this approach.

DELTA enhances these protocols by providing the impact context: not just "a flood is coming" but "a flood of this magnitude in this district has historically displaced X people, damaged Y schools, and affected Z hectares of standing crops." This transforms anticipatory action from hazard-based (acting on the forecast) to impact-based (acting on predicted consequences), enabling more precise targeting of pre-positioned resources.

**Heat action plans.** As extreme heat events become more frequent and more severe, countries are developing heat action plans that trigger specific responses, opening cooling centres, pre-positioning rehydration supplies, issuing health advisories, when temperature forecasts exceed pre-agreed thresholds. DELTA's health facility damage records and heat-related mortality data, disaggregated by geography and population characteristics, enable impact-based heat triggers: "Temperature forecast > 45°C for 3+ consecutive days AND historical DELTA records show heat-related health facility overwhelm and excess mortality in this district under similar conditions."`,
      },
      {
        heading: 'The Institutional Challenge',
        content: `The technical architecture is in place. The institutional architecture is not, and this is where DELTA's potential for anticipatory action will be realised or squandered.

In most countries, the organisations responsible for anticipatory action (humanitarian agencies, Red Cross/Red Crescent societies, sometimes government disaster management agencies) operate in a different institutional silo from the organisations responsible for disaster loss data (NDMAs, statistical offices). The forecast data comes from meteorological services, a third silo. Connecting these three data streams, forecast, historical loss, and anticipatory action protocol, requires interoperability between institutions that often have no formal data-sharing agreement.

DELTA's API architecture is designed to bridge this. Its exchange protocols establish automated data flows between meteorological services, sectoral ministries, and the national disaster database. But APIs are technical instruments. They connect systems, not institutions. The institutional work, the MoUs, the joint working groups, the shared governance of trigger thresholds, must be done by people.

The [HNPW 2026 session on DELTA Resilience](https://www.undrr.org/event/hnpw-2026-delta-resilience-enabling-use-disaster-impact-data-risk-informed-inclusive-climate) specifically highlighted how disaster impact data can inform anticipatory action through impact-based triggers, strengthen impact-based forecasting and risk models, identify high-risk and marginalised population groups, and assess the effectiveness of early actions. This agenda signals that UNDRR sees the anticipatory action connection as a primary use case for DELTA, not a secondary one.

The [Anticipation Hub](https://www.anticipation-hub.org/about/what-is-anticipatory-action), the primary global knowledge platform for anticipatory action, documents country protocols, evidence bases, and implementation lessons. As more countries adopt DELTA, the opportunity to systematically link national loss databases with anticipatory action trigger frameworks will grow. But it requires deliberate institutional design, not just technical interoperability.`,
      },
      {
        heading: 'Connecting to Climate Finance',
        content: `The connection between DELTA, anticipatory action, and climate finance is direct.

The [UNFCCC Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data) requires countries to demonstrate both historical losses (to justify funding) and forward-looking risk reduction measures (to demonstrate capacity). DELTA provides historical loss evidence; anticipatory action protocols demonstrate forward-looking capacity. Together, they create a complete narrative: "Here is what disasters have cost us. Here is what we are doing to prevent recurrence. Here is the data that proves both claims."

Countries competitive for Loss and Damage Fund disbursements will be those that can tell this data-backed story. DELTA + anticipatory action + G-DRSF-compliant reporting is the architecture that enables it.`,
      },
      {
        heading: 'From Forecast to Evidence',
        content: `Anticipatory action is not forecasting. It is forecasting calibrated by evidence, evidence of what happened before, to whom, and with what consequences. The forecast tells you what is coming. The evidence tells you what to do about it, for whom, and where.

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
      'On my first week at a UN agency headquarters, I asked: "How many data systems does this Division use?" The answer took three weeks to assemble. That experience of mapping before building became the foundation for every data system project since. A maturity assessment is not a delay, it is the investment that ensures the system you build is the system that survives.',
    sections: [
      {
        content: `I was hired by a UN agency's headquarters division to audit and redesign their crisis information management architecture. On my first week, I asked a straightforward question: "How many data systems does this Division use?" The answer took three weeks to assemble. Not because people were uncooperative, but because nobody had a complete picture. Incident monitoring lived in one platform. Knowledge management lived in another. Situation reports came from a third. Country alerts from a fourth. Each system solved a specific problem well, but they had never been mapped as an ecosystem, the result was duplication, gaps, and interoperability failures that no single system owner could see.

That experience of mapping before building became the foundation for every data system project since. Through data ecosystem assessments across multiple contexts, the single most important lesson is this: a maturity assessment is not a delay. It is the investment that ensures the system you build is the system that survives.

This post is the practitioner's guide I wish I had when I started, grounded in the [DEMA framework](https://www.undrr.org/event/bonn-technical-forum-2025-scene-setting-webinar-data-ecosystem-maturity-assessment-towards) developed by UNDRR and UNDP, and informed by what I have seen go wrong when the assessment step is skipped.`,
      },
      {
        heading: 'Why Assess Before You Build',
        content: `The humanitarian and DRR sectors have a pattern: identify a data gap, deploy a technology solution, train users, and move on. The maturity assessment step, understanding the institutional, technical, and human landscape before choosing a technology, is frequently skipped because it feels like overhead. It is not overhead. It is the most consequential phase of any data system deployment.

Without a maturity assessment, you risk deploying technology that the institution cannot sustain, producing poor data faster with more attractive formatting, and missing governance gaps that will kill the system after the project cycle ends. I have seen all three, sometimes in the same deployment.

The [UNDP-UNDRR Data and Digital Maturity for Disaster Risk Reduction](https://www.undp.org/sites/g/files/zskgke326/files/2022-11/UNDP-UNDRR%20Data%20and%20Digital%20Maturity%20for%20DRR-2022_0.pdf) working paper provides the theoretical foundation. The DEMA framework operationalises it into a structured, facilitated self-assessment that countries can own. What follows is how it works in practice.`,
      },
      {
        heading: 'The Five Dimensions',
        content: `The DEMA framework evaluates a national disaster data ecosystem across five interconnected dimensions. Each has subdimensions with specific indicators scored against a five-phase maturity scale, from Phase 1 (incomplete, ad hoc) through Phase 3 (managed and defined) to Phase 5 (state of the art, transformative). The framework is diagnostic, not punitive, it is designed to support reflection and identify concrete actions, not to rank countries.

**Dimension 1: Actors and Roles.** This dimension maps who participates in the data ecosystem and whether their roles are understood. The key actors are data producers (NDMAs, meteorological services, sectoral ministries), data users (planners, policy-makers, humanitarian coordinators), and intermediaries (statistical offices, UN agencies, research institutions). In every ecosystem assessment I have conducted, the same pattern emerges: actors are identifiable, but their roles in the data production chain, who collects, who validates, who publishes, who certifies, are either undefined or informally negotiated. This is the most common Phase 2 finding: roles are recognised but reactive, dependent on personal relationships rather than institutional mandates.

The [G-DRSF](https://www.unsdglearn.org/courses/disaster-related-statistics-framework/) provides the reference architecture for these roles, particularly the relationship between the National Disaster Management Authority (operational data collection) and the National Statistical Office (statistical certification). Where this relationship is formalised, the ecosystem is resilient. Where it depends on individuals, it is fragile.

**Dimension 2: Data Supply.** Data supply assesses the quality of available disaster data, its accessibility, relevance, accuracy, timeliness, and clarity. This is where the gap between what countries report and what is actually usable becomes visible. I have reviewed national disaster databases where completeness rates for mandatory fields, hazard type, date, administrative geography code, mortality, affected population, fell below 60%. Records where mortality exceeded affected population. Events recorded without valid [p-codes](https://cod.unocha.org/) aligned with OCHA Common Operational Datasets. Hazard classifications that shifted terminology between reporting years, blocking trend analysis.

The quality problems are not random. They concentrate in specific time periods (election years, funding transitions), specific geographies (remote provinces with weaker NDMA capacity), and specific hazard types (slow-onset events like drought and coastal erosion are consistently under-recorded compared to rapid-onset events like floods and earthquakes).

**Dimension 3: Data Demand.** This is the dimension most assessments neglect entirely, and the one that determines whether a data system is actually used. Data demand captures the applications and use cases the data is meant to serve: [Sendai Framework](https://sendaimonitor.undrr.org/) reporting, SDG indicator computation, Loss and Damage Fund evidence requirements, early warning triggers, anticipatory action thresholds, national DRR strategy development, and climate adaptation planning.

The critical diagnostic question is whether supply meets demand. In my experience, the answer is almost always no, but not for the reasons people assume. The data gap is rarely about volume. It is about format, disaggregation, and interoperability. Countries often have substantial disaster data, but it is locked in formats (paper records, isolated spreadsheets, legacy databases) that cannot serve the analytical and reporting demands now placed on it by the Sendai Framework Monitor, the [Belém Adaptation Indicators](https://www.undrr.org/building-risk-knowledge/disaster-data), and the [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data).

**Dimension 4: Data Infrastructure.** Data infrastructure covers the institutional, physical, and digital means for storing, sharing, and consuming data, from individual laptops to organisation-specific archives to online information management systems and geospatial data-sharing platforms.

The key subdimensions are technical interoperability (can systems exchange data programmatically?) and operationalised common standards (are shared codes, schemas, and formats in use?). [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) requires API-driven data exchange with meteorological services and statistical offices. For countries where the NDMA's primary data tool is a standalone spreadsheet on a single staff member's laptop, and I have seen this in more countries than I expected, the infrastructure gap is not about purchasing servers. It is about institutional architecture: where data lives, who controls access, and what happens when that staff member leaves.

A common failure mode is assuming cloud hosting solves everything. Cloud solves hardware but raises data sovereignty concerns. Hybrid models, cloud compute with local storage, are often the pragmatic answer.

**Dimension 5: Data Ecosystem Governance.** Governance determines whether the ecosystem holds together when external support ends. It covers policies and standards (does a national data strategy exist? are common data standards mandated?), dedicated budget (is disaster data funded from national budget or entirely donor-dependent?), collaboration and inclusion (are data-sharing agreements formalised between NDMA-NSO, NDMA-meteorological service, NDMA-sectoral ministries?), capacity (are human skills being built and retained?), and governance ethics and trust (are there protocols for privacy, responsible data use, and accountability?).

In my experience, the governance dimension is the strongest predictor of system survival. I have seen technically sophisticated platforms fail because there was no legal mandate for data collection, no MoU between the NDMA and NSO, and no data-sharing agreement with the meteorological service. Conversely, I have seen basic systems survive for years because the governance architecture was sound, roles were assigned, budgets were allocated, and the data pipeline did not depend on any single person or organisation.

The distinction between de jure governance (what the law says) and de facto governance (what actually happens) is critical. Assess both.`,
      },
      {
        heading: 'The Data Quality Assessment Tool',
        content: `Alongside the DEMA, UNDRR has developed a complementary [Data Quality Assessment Tool](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) that evaluates the quality of specific data streams, hazardous event data, disaster event data, and losses and damages data, against four quality criteria, each scored on the same five-phase maturity scale.

**Accuracy:** Are events verified through triangulation of multiple authoritative sources, or recorded with frequent errors and no verification process?

**Completeness:** Are all critical fields populated, temporal, spatial, technical characteristics, triggers, cascades, source, or are records patchy with key information missing?

**Consistency:** Are events classified using controlled vocabularies and standardised formats, or do terminology and coding shift between time periods and data sources?

**Interoperability:** Are hazardous event data and loss/impact databases linked through shared codes, APIs, or schemas, or do they exist in incompatible silos?

The Data Quality Assessment Tool complements the DEMA by drilling into the data itself rather than the ecosystem that produces it. The DEMA tells you whether the institutions, infrastructure, and governance are in place. The quality tool tells you whether the data those institutions produce is actually fit for purpose. Both are needed. A mature ecosystem can still produce poor data if quality assurance processes are weak. Good data can still be unusable if the ecosystem cannot share, validate, or publish it.`,
      },
      {
        heading: 'Running the Assessment: The DEMA Process',
        content: `The DEMA is designed as a facilitated self-assessment, owned by national actors, not conducted on them. The process follows four phases:

**Phase 1: Desk research.** Review existing risk data availability, stakeholder mapping, previous assessments, data governance and policy instruments, and current platforms and tools. This gives the facilitator an initial picture of the ecosystem before engaging stakeholders directly.

**Phase 2: Surveys and interviews.** Structured engagement with all actors in the ecosystem, data producers, users, and intermediaries. This ensures all actors are identified, gives an initial indication of maturity levels, and surfaces themes for deeper discussion.

**Phase 3: Multi-stakeholder workshop.** A facilitated workshop bringing all stakeholders together to discuss the current state, agree on maturity scores, and identify short-, medium-, and long-term actions to advance to the next maturity phase. This is where ownership is built, the scores and action plan are co-created, not imposed.

**Phase 4: Reporting and action plan.** A final report with maturity scores, findings, and country-specific, action-oriented recommendations. The action plan assigns stakeholders to specific activities with agreed timelines, reinforcing national ownership and institutional memory.

For complex ecosystems, the full process takes 6-10 weeks including preparation and reporting.`,
      },
      {
        heading: 'The Assessment That Saves the System',
        content: `A maturity assessment is the single most consequential deliverable in a DELTA Resilience deployment. It prevents mismatched system designs, identifies governance gaps before they become fatal, quantifies training and migration needs, and, critically, builds the national ownership that determines whether the system survives its creator.

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
      'Multiple countries. Seven data platforms. A decade of work. Each one taught me something I could not have learned from a textbook. Six principles emerged across all of them, and none are about technology.',
    sections: [
      {
        content: `Multiple countries. Seven data platforms. A decade of work. Each one built under different constraints, funding pressure, active conflict, pandemic restrictions, institutional fragmentation, political upheaval. Each one produced outputs that mattered to people making decisions under pressure: cluster coordinators deciding where to deploy assessment teams, government officials deciding which provinces to prioritise for drought response, cash working groups deciding whether their transfers were reaching the right households.

And each one taught me something I could not have learned from a textbook, a conference presentation, or a best-practice guide.

This post distills what those platforms taught me, the cross-cutting principles that apply regardless of the crisis, the technology, or the institutional context. Six principles emerged. None of them are about technology.`,
      },
      {
        heading: 'Principle 1: Build for the Worst Network, Not the Best',
        content: `My first field posting placed me in a conflict-affected region with a 2G connection that dropped every afternoon when the generator ran out of fuel. I built 5W dashboards in Excel, not because I wanted to, but because it was the only software every partner already had installed, that worked offline, and that could be emailed on a 2G connection. The dashboards were ugly. They were functional. They were used.

Every humanitarian data platform is designed in a capital city with reliable internet and tested in a field office where the connection drops when it rains. If your system requires 4G to function, it will not function where it is needed most. The constraint is not bandwidth, it is the assumption that bandwidth will be available. Design for offline-first with synchronisation, and you will never be caught by a generator failure.`,
      },
      {
        heading: 'Principle 2: The Coordination Mechanism Is the Product, Not the Dashboard',
        content: `In one of the largest refugee responses on the planet, nearly a million displaced people in a concentrated geographic area, the information management challenge was not data scarcity. It was data flood. I led inter-sector analytical reports combining health, nutrition, WASH, education, and protection data into a unified framework. The reports became reference documents not because we had the best data, but because the coordination mechanism that produced them was trusted by the organisations that consumed them.

A dashboard that nobody trusts is a decoration. A coordination mechanism that produces trusted analysis, even if it is a simple table in a PDF, is an information management system. Invest in the process (shared questions, shared data standards, shared review) and the technology will follow. Start with the technology and the process will not materialise.`,
      },
      {
        heading: 'Principle 3: Invest in Data Governance Before Data Collection',
        content: `Five humanitarian organisations were each running post-distribution monitoring for their cash transfer programmes using different tools, different questions, different sampling strategies, and different definitions of "success." The cash working group could not answer a basic question: "Is our collective cash programming working?"

I built a unified analytical framework, nine analytical pillars covering adequacy, timeliness, utilisation, market access, protection, targeting accuracy, satisfaction, coping, and impact, and harmonised data from over 1,500 households into a single analytical ecosystem. The framework worked because we invested months in governance before collecting a single data point. We agreed on shared definitions, shared indicators, shared disaggregation, and what "success" meant. When I left, it survived, because it was owned by the coordination mechanism, not by any single agency.

Multi-partner analytics only works when you govern before you collect. Skip this step and you will spend more time harmonising incompatible data than you would have spent negotiating shared standards upfront.`,
      },
      {
        heading: 'Principle 4: Start with a Maturity Assessment, Not a Technology Choice',
        content: `A headquarters posting taught me this principle most clearly. The division had multiple incident-monitoring and knowledge-management tools running in parallel. Each had been built to solve a specific problem. None had been mapped as an ecosystem.

The audit took six weeks. The platform design took four. The audit was the more valuable deliverable, because it prevented building a solution to a problem that was not fully understood.

Don't build until you've mapped what already exists. The audit always reveals surprises, systems nobody remembers building, data flows that depend on one person's email habits, governance gaps that no technology can solve.`,
      },
      {
        heading: 'Principle 5: Build for Departure',
        content: `The largest platform work of my career was a multi-million-dollar DRR, climate preparedness, and information management programme in a conflict-affected country, a multi-hazard analysis platform and a humanitarian reporting system that onboarded 200+ partner organisations. Both were significant technical achievements. Both were vulnerable to political change, funding cycles, and staff turnover. The components that were most resilient were the ones most deeply anchored in government workflows, built around NDMA requirements, their geographic taxonomies, their briefing templates.

But "build for departure" assumes there is a legitimate government to depart to, and this assumption does not hold everywhere. In contexts where a [de facto authority](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/) controls the territory but lacks international recognition, where donor conditions prohibit sharing programme data with the governing authority, the principle hits a wall. This is the data ownership dilemma in [contested legitimacy](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/), and it remains one of the most consequential unresolved challenges in humanitarian data governance.

The system must work after you leave. Before writing a single line of code, answer: who will maintain the server, who will update the data model, who will train the next cohort? If the answers are "the international consultant," the system has an expiration date. And if the answer is "nobody, because no recognised institution can legally receive it", then the system has a deeper problem that no amount of technical design can solve.`,
      },
      {
        heading: 'Principle 6: Train the Trainers, Not the Users',
        content: `This principle emerged across every posting, but crystallised in the environments where I saw the sharpest contrast between trained individuals and trained institutions. Generic user training evaporates within months. Invest in 3-5 national focal points per institution, certify them as trainers through a structured Training-of-Trainers programme, and build a peer support network. This is the only model that produces lasting capacity.

My academic foundation, a Commonwealth Scholarship and subsequent analytics certifications, shaped the ability to think about disaster risk as a system of interacting variables (hazard, exposure, vulnerability, capacity) rather than as a sequence of emergency responses. The best analytical frameworks in humanitarian IM are the ones simple enough to implement under operational pressure but rigorous enough to withstand methodological scrutiny. My best work has happened at this intersection: academically grounded frameworks implemented with field pragmatism.`,
      },
      {
        heading: 'What I Still Get Wrong',
        content: `Honesty requires this section.

I still underestimate the time data governance work takes. Data infrastructure is like an iceberg: the visible tip, dashboards, platforms, analytical outputs, is what gets funded, celebrated, and counted toward programme KPIs. But the mass below the waterline, data-sharing agreements, institutional roles, governance frameworks, is what determines whether the whole thing stays upright. I still feel the pull to start building the visible part before the foundations beneath it are secure, because building is satisfying and governance negotiation is slow.

I still overestimate the transferability of skills. A data officer trained in one context does not automatically become effective in a different context with different data, different stakeholders, and different institutional incentives. Skills transfer requires contextualisation that I don't always budget time for.

And I still struggle with the hardest question in humanitarian data work: when is "good enough" actually good enough? The tension between statistical rigour and operational urgency is real, and I have not resolved it. I have only learned to name it honestly and let the operational context, not my analytical preferences, determine the answer.`,
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
      'I wrote the email at 11am. It went to over 115 organisations, UN clusters, NGOs, working groups, telling them the nationwide humanitarian reporting platform was suspended immediately. Afghanistan in 2025 was a stress test that revealed a system-wide architectural flaw: nobody owns continuity.',
    sections: [
      {
        content: `I wrote the email at 11am. It went to over 115 organisations, UN clusters, NGOs, working groups, coordination bodies, all of whom relied on the nationwide humanitarian reporting platform I helped manage as programme coordinator. The message was simple and devastating: the platform's sole donor had frozen all funding. Operations were being suspended immediately. There was no phased transition. No bridge funding. No contingency plan. No advance notice. The system that an entire country's humanitarian coordination depended on was going dark.

I knew, as I pressed send, what would happen next. I had spent that entire week receiving similar emails from other partners, their own USAID programme suspension notices arriving one after another. I had built enough data systems across several countries to understand that what was about to unfold was not a technical failure. It was a political one, a structural collapse that had been designed into the system from the beginning, waiting for the moment when a single point of failure would be tested.

Afghanistan in 2025 was that moment.`,
      },
      {
        heading: 'What Happened When the Platform Went Dark',
        content: `The sequence was predictable in hindsight and catastrophic in practice.

The United States had been funding [43% of all humanitarian aid to Afghanistan](https://www.unocha.org/publications/report/afghanistan/afghanistan-overview-funding-shortfall-and-impact-humanitarian-operations-14-august-2025), approximately $562 million. When the funding freeze hit, it did not arrive with a transition plan. It arrived as a stop order. The implementing organisation I worked for, the organisation that built, maintained, and hosted the platform, had no independent revenue stream for this programme. The platform ran on a single donor's money. When that money stopped, the platform stopped.

The consequences rippled outward in concentric circles of institutional failure. The lead UN coordination agency cancelled planned meetings with the implementing organisation and excluded it from critical information management discussions, institutional preservation in real time, distancing itself from a partner that could no longer deliver. Partners who had built their reporting workflows around the platform were left without access to essential humanitarian data mid-response. Cluster leads lost their evidence base. Working groups lost their analytical inputs. The shared picture of who was doing what, where, for whom simply vanished.

The reputational risk landed squarely on the implementing partner, even though the structural failure was never theirs alone to prevent. The donor decided to freeze funding. The coordination body decided to cut ties. The partners had no alternative system. Every actor retreated into self-preservation. Nobody fought for the shared infrastructure, because nobody owned it enough to fight for it.`,
      },
      {
        heading: 'The Power Map Nobody Draws',
        content: `What the Afghanistan experience exposed is a power structure in humanitarian data infrastructure that everyone navigates but nobody maps.

**The donor controls funding.** A single government funded nearly half of all humanitarian operations in Afghanistan. One political decision in Washington collapsed humanitarian data infrastructure in over 50 countries in real time, because the funding model never required diversification or contingency. What happened in Afghanistan and several other countries was a perfect storm, arriving at the period when major donor governments were competing on who could cut more humanitarian funding. Germany, the UK, France, Japan, and Saudi Arabia all reduced aid budgets simultaneously. Total global humanitarian funding [fell from $37 billion in 2024 to $20.5 billion in 2025](https://www.devex.com/news/how-humanitarian-funding-collapsed-in-2025-111612), its lowest level in a decade. The Council on Foreign Relations called it ["the great aid recession"](https://www.cfr.org/articles/great-aid-recession-2025s-humanitarian-crash-nine-charts). The Carnegie Endowment described it as a ["painful, seismic shift"](https://carnegieendowment.org/research/2025/12/the-painful-seismic-shift-in-humanitarian-aidand-whats-next?lang=en), not a temporary dip but a structural contraction in the global development partnership.

**The UN coordination body controls legitimacy and access.** The lead coordination agency determines whose data is authoritative and which platforms are endorsed. When funding was cut, its decision to distance itself from the implementing partner was a withdrawal of legitimacy, the platform's technical capabilities had not changed, only its funding.

**The implementing partner controls the platform.** But operational control without financial independence is an illusion. The implementing partner could not keep the platform running without the donor's money, could not transfer it without the coordination body's endorsement, and could not preserve partner access without both.

**The government controls sovereignty, in theory.** In principle, the government of Afghanistan, like any sovereign state, has the right and responsibility to own its humanitarian data infrastructure. But Afghanistan presented a familiar dilemma: a globally unrecognised Taliban leadership, banned under multi-donor funding agreements from accessing data on Afghan populations for understandable protection concerns, a topic explored further below. Even setting aside this legitimacy constraint, the broader reality applies across most developing country contexts: the capacity to absorb a nationwide reporting platform overnight is nonexistent. Sovereignty without capacity is a constitutional right without operational meaning.

But Afghanistan exposes an even deeper dilemma, one that the humanitarian data community has barely begun to articulate.`,
      },
      {
        heading: 'The Data Ownership Dilemma Under Contested Legitimacy',
        content: `What happens to data sovereignty when the international community does not recognise the government that claims it?

Afghanistan under Taliban rule is not a failed state. It is a [de facto authority](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/), an entity that exercises effective territorial control, provides basic governance functions, and administers the population, but lacks international recognition. The Taliban have not been recognised by most UN Member States, and most donor countries as of 2025 were not maintaining a formal embassy in Kabul. Moreover, the donor conditions attached to humanitarian funding, particularly from the United States, explicitly prohibit sharing proprietary data, programme information, and institutional resources with the Taliban administration.

This creates an extraordinary paradox for data infrastructure. The humanitarian sector's best-practice principle is sovereign government ownership of data systems, build for the government, anchor in national institutions, transfer administrative control. But when the governing authority is sanctioned, unrecognised, or classified as a designated entity under counter-terrorism legislation, that principle collides with the legal and political conditions attached to the funding that built the system in the first place.

Afghanistan is not alone in this predicament. Nearly [200 million people](https://odi.org/en/insights/seeing-beyond-state-de-facto-authorities-humanitarian-system-implications/) live in areas where non-state armed actors or de facto authorities exercise some degree of territorial control. In Yemen, [the Houthis have seized equipment, laptops, routers, communication devices, from UN agencies and NGOs](https://www.hrw.org/news/2026/01/08/houthi-detentions-halting-aid-crisis-hit-yemen), crippling their ability to manage data and deliver aid. The Houthi resistance to WFP's biometric registration system was driven not by data protection concerns but by [geopolitical sovereignty claims over population data](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/). In Sudan, both the Sudanese Armed Forces and the Rapid Support Forces have used bureaucratic control, visa restrictions, customs seizures, travel permits, to [restrict humanitarian data flows and operational access](https://www.acaps.org/en/thematics/all-topics/humanitarian-access). In Libya, competing administrations in Tripoli and the east have each claimed authority over humanitarian coordination, creating parallel data governance structures with no unified national owner.

In each of these contexts, the data infrastructure question is not simply "who hosts the server?" It is: to whom can you legally, ethically, and operationally transfer data sovereignty when the entity that controls the territory is the entity your donor prohibits you from engaging with?

This is the data ownership dilemma in contested legitimacy, and it has no clean resolution. The [IASC Operational Guidance on Data Responsibility](https://interagencystandingcommittee.org/sites/default/files/migrated/2023-04/IASC%20Operational%20Guidance%20on%20Data%20Responsibility%20in%20Humanitarian%20Action,%202023.pdf) establishes principles for data protection in humanitarian action, but it was not designed for contexts where the sovereign authority itself is the data protection risk. The [USAID Inspector General's assessments](https://oig.usaid.gov/node/7705) of Afghanistan programming documented the tension between operational necessity and anti-terrorism compliance, a tension that extends directly to data infrastructure ownership. And the academic literature on [digitisation and sovereignty in humanitarian space](https://pmc.ncbi.nlm.nih.gov/articles/PMC10153061/) has identified the fundamental problem: humanitarian organisations depend on grants of sovereign authority to operate, but the digital infrastructure they build generates data assets whose ownership is contested by the very authorities that granted access.

The practical consequence is paralysis. Data systems in these contexts cannot be transferred to the de facto government (donor conditions prohibit it), cannot remain with the implementing partner indefinitely (funding is temporary), and cannot be handed to the UN coordination body (which lacks the technical infrastructure and mandate to host them). The data sits in an institutional no-man's-land, owned by everyone in principle, controlled by no one in practice, and vulnerable to exactly the kind of overnight collapse that Afghanistan demonstrated.

**Nobody controls continuity.** This is the structural flaw. Continuity, the thing that matters most to the 115+ organisations whose daily coordination depends on the platform, is a shared responsibility that no single actor is mandated, funded, or structured to deliver. Every actor has a legitimate mandate. None of those mandates include ensuring that the shared data infrastructure survives when any one of them walks away.`,
      },
      {
        heading: 'This Is Not an Afghanistan Problem',
        content: `It would be comforting to treat this as a unique failure, a perfect storm of political disruption, donor concentration, and institutional dysfunction specific to one country. It was not. Afghanistan was a stress test that revealed a system-wide architectural flaw.

The evidence is now overwhelming. The [State of Open Humanitarian Data 2026](https://www.unocha.org/publications/report/world/state-open-humanitarian-data-2026-assessing-data-availability-across-humanitarian-crises), published by OCHA's Centre for Humanitarian Data, documented that crisis data availability fell from 74% to 68% across 22 humanitarian operations. OCHA's own information management capacity was cut by approximately 25%. UNHCR and IOM, two of the largest operational data producers in the system, saw data staff reductions of approximately 40%. The Centre for Humanitarian Data warned that ["2024 may be the high-water mark of data availability for years to come"](https://centre.humdata.org/risk-to-data-availability-in-2025/).

The Center for Global Development framed it as ["the coming humanitarian data drought"](https://www.cgdev.org/blog/coming-humanitarian-data-drought). [UN News reported](https://news.un.org/en/story/2025/04/1161971) budget cuts "devastating data gathering." [Devex documented](https://www.devex.com/news/how-humanitarian-funding-collapsed-in-2025-111612) the broader collapse: humanitarian funding fell to $20.5 billion, its lowest level in a decade. And [OCHA's Afghanistan assessment](https://www.unocha.org/publications/report/afghanistan/afghanistan-impact-us-funding-suspension-humanitarian-response-19-may-2025) found 78% of coordination positions at national and sub-national level expected to be impacted. These are the information managers, GIS officers, and cluster coordinators who produce the analytical outputs that decision-making depends on.

The pattern is structural, not incidental. Humanitarian data infrastructure globally is built on the same fragile foundations: single-donor dependency, implementing-partner-hosted platforms, coordination mechanisms that assume continuous funding, and an absence of contingency protocols for when those assumptions fail.`,
      },
      {
        heading: 'The Architecture of Resilience',
        content: `What would a resilient humanitarian data infrastructure look like? Not a different platform, a different governance architecture.

**Sovereign government hosting.** Data infrastructure that serves a country's humanitarian coordination should be hosted on infrastructure that the country's government controls. When the implementing organisation leaves, or is forced to leave, the data stays. The [UNDRR Strategic Framework 2026-2030](https://www.undrr.org/strategic-framework-2026-2030) identifies this principle as a critical gap requiring systematic attention.

**Diversified, multi-donor funding.** No data platform that serves an entire country's coordination should depend on a single donor. This requires pooled funding mechanisms, cost-sharing agreements, and minimum reserve requirements that guarantee operational continuity during transition periods.

**Mandatory contingency protocols.** The Afghanistan platform had no contingency plan for donor withdrawal, no bridge funding, no phased transition, no data escrow. Every humanitarian data platform should have a documented protocol specifying what happens when the primary donor withdraws, how long operations can continue on reserves, and how partner data is preserved during any transition.

**Data continuity agreements.** Partner data submitted to a coordination platform must remain accessible regardless of the platform's operational status. Data escrow, standard in commercial software, is virtually nonexistent in humanitarian data systems. The [Grand Bargain 2.0](https://interagencystandingcommittee.org/grand-bargain) provides a policy framework, but the operational mechanisms have not been built.

**Intersectoral governance that assigns continuity.** Someone must own continuity, not the platform, not the data, but the ongoing availability of the shared coordination infrastructure. This means a continuity mandate assigned to a specific body, ideally the coordination mechanism itself, with the authority and resources to ensure the system survives the withdrawal of any single actor.`,
      },
      {
        heading: 'The Conversation Nobody Wants to Have',
        content: `The reason this architecture does not exist is not technical. It is political: building resilient data infrastructure requires every actor to cede some control. Donors must accept that funding does not buy unilateral control over continuity. Coordination bodies must accept responsibility for the infrastructure they endorse. Implementing partners must accept that the platforms they build belong to the coordination mechanism. Governments must invest in the capacity to host and govern these systems.

The humanitarian data drought is not a future risk. It is a present reality. The communities that depend on these systems, the 23.7 million people in need of humanitarian assistance in Afghanistan alone, are losing the data infrastructure that enables their response to be coordinated, targeted, and accountable. The question is not whether we can afford to build resilient data governance. The question is whether we can afford not to, knowing what happens when a single email at 11am can take an entire country's coordination infrastructure offline.`,
      },
    ],
    relatedSlugs: [
      'building-systems-governments-can-own',
      'lessons-six-countries',
      'data-ecosystem-maturity-assessment-guide',
    ],
  },

  'the-72-hour-problem': {
    slug: 'the-72-hour-problem',
    title: 'The 72-Hour Post Disaster Problem',
    category: 'Field Reflection',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '7 min',
    date: 'April 2026',
    excerpt:
      'The first 72 hours of a sudden-onset disaster are an information black hole. Good IM isn\'t about perfect data, it\'s about being useful under imperfect conditions. Here\'s what I\'ve learned designing for that window.',
    sections: [
      {
        content: `On a Sunday afternoon in October 2023, a magnitude 6.3 earthquake struck Herat province in Afghanistan. By Monday morning, our [Humanitarian Spatial Data Center](https://www.undrr.org/) team in Kabul was being asked the questions we always get in the first 24 hours of a sudden-onset disaster, and which we never have full answers to.

How many villages are affected? Which roads are passable? Where are the field hospitals? How many people have been displaced? Which communities had vulnerable populations to begin with?

The honest answer to most of those questions, on the morning after a disaster, is: we don't fully know yet. Field teams are still moving. Phone lines are still down in places. Damage assessments are days away from being completed. Population baselines are months out of date.

This is the 72-hour problem. The window when decisions matter most is also the window when information is most incomplete. And the temptation, for everyone in the room, is to wait for better data before acting.

After ten years of doing this work, Bangladesh after a cyclone, Ethiopia during a drought escalation, Afghanistan after multiple earthquakes, I've come to a hard conclusion: good information management in the first 72 hours is not about delivering perfect data. It's about being useful under conditions where perfect data is structurally impossible.`,
      },
      {
        heading: 'Why the First 72 Hours Are Different',
        content: `Standard humanitarian information management is built for steady-state coordination. A monthly 5W reporting cycle. Quarterly multi-sector needs assessments. Annual Humanitarian Needs Overview cycles. Each of those products assumes time to clean data, validate sources, and reconcile contradictions.

A sudden-onset event collapses that timeline. The Inter-Cluster Coordination Team meets within hours of the event. Resource mobilisation appeals go out within days. Donor commitments are negotiated based on whatever evidence exists at the moment.

Decisions made in this window have outsized consequences. Pre-positioning supplies in the wrong district means relief takes 36 extra hours to arrive. Activating a flash appeal with the wrong affected-population estimate locks the response into a budget envelope that may not fit reality. Failing to flag a vulnerable group early means they get coded out of the response architecture for months.

And yet the data systems we build are mostly designed for the steady state, not for the surge.`,
      },
      {
        heading: 'What Doesn\'t Work',
        content: `**Waiting for clean data.** I've watched senior IM officers refuse to publish a hazard map until every administrative boundary code was verified. By the time the map went out, the response decisions it was meant to inform had already been made, based on someone\'s WhatsApp screenshot of a sketch on a notebook page.

**Insisting on the standard reporting template.** Partner organisations in the first 48 hours can\'t fill out a 60-field 5W. They\'re mobilising staff, opening field offices, sourcing fuel. Asking them to populate every disaggregation cell guarantees you get a blank or a fabrication.

**Producing the perfect product.** A 40-page situation analysis published on day five is operationally less valuable than a 1-page snapshot published on day one. The decision-maker has already made the day-one decision.

**Ignoring open-source signals.** [GDACS](https://www.gdacs.org/) alerts, USGS shake maps, [GloFAS](https://www.globalfloods.eu/) discharge forecasts, satellite imagery from Sentinel and MODIS, even social-media geolocation, these are imperfect, but they exist within hours of an event. Treating them as too crude for "official" products means you publish nothing while the world burns.`,
      },
      {
        heading: 'What Works: Pre-Positioned Information Architecture',
        content: `The shift in my thinking, over many sudden-onset events, was this: the first 72 hours don\'t reward better real-time data collection. They reward pre-positioned information architecture that can be flexed to a specific event.

**Baseline layers, ready to go.** Population estimates by admin-3 (with [WorldPop](https://www.worldpop.org/) and Microsoft building footprints as the foundation). Health facility locations. School locations. Roads with passability classification. Pre-event vulnerability indices. None of these need to be collected after the disaster, they can sit in a sovereign database and be intersected with the event footprint within an hour of the alert.

**Standardised event-impact templates.** A one-pager with a fixed structure: hazard summary, affected administrative units, exposure estimates from baseline layers, immediate humanitarian implications, known partner presence. Designed to be filled in at 80% confidence, not 100%.

**A go-to data triangulation protocol.** GDACS for the initial alert. USGS or WMO for technical hazard parameters. Open-source remote sensing for damage extent. Pre-positioned partner contact lists for ground-truthing. The protocol exists before the event so the first hour isn\'t spent inventing it.

**Decision-rights agreements signed in advance.** Who can approve publication of a flash analytical product without full data validation? In Afghanistan, we had a written protocol that the Country Technical Advisor (me) could approve a 72-hour rapid analysis with a "preliminary, subject to revision" disclaimer. That single protocol unlocked products that would otherwise have sat for days awaiting sign-off.`,
      },
      {
        heading: 'The 80% Principle',
        content: `Here is the principle I now apply: 80% confidence in 4 hours beats 100% confidence in 4 days.

This isn\'t a license to be sloppy. It\'s a recognition that humanitarian decisions are made under uncertainty whether or not you publish data, and that a transparent estimate with a confidence band is more useful than silence.

Every rapid product I publish carries the same disclaimer: preliminary estimate based on [sources X, Y, Z], confidence level [low/medium/high], to be revised within [N] hours as field reports arrive. That disclaimer protects the IM unit\'s credibility AND empowers decision-makers to act on the best evidence available.

In Afghanistan, after the Herat earthquake, this approach let us publish an initial affected-population estimate within 18 hours that was within 12% of the final verified figure five days later. That early estimate informed the first round of cluster activation, partner deployment, and donor briefings. Was it perfect? No. Was it useful? Materially.`,
      },
      {
        heading: 'What I Now Do Before Every Posting',
        content: `When I arrive in a new country office, the first 72-hour audit I run is structural, not operational. I ask:

- What baseline layers exist and how current are they?
- Where are they hosted? Can the IM team access them under emergency conditions?
- What is the standard structure of a rapid analytical product? Is it pre-templated?
- Who can approve publication without standard validation?
- What are the data triangulation defaults?
- How do field reports flow into the analytical pipeline?

If any of those questions don\'t have a clear answer, I work on them before the next event, not after. Because the next event is always coming, and the 72 hours after it arrive whether the architecture is ready or not.

The goal of humanitarian information management isn\'t perfect data. It\'s decision-support that arrives in time to matter. Build for that, and the rest follows.`,
      },
    ],
    relatedSlugs: [
      'lessons-six-countries',
      'building-systems-governments-can-own',
      'the-im-coordination-trap',
    ],
  },

  'from-maiduguri-to-machine-learning': {
    slug: 'from-maiduguri-to-machine-learning',
    title: 'From Maiduguri to Machine Learning',
    category: 'Career Narrative',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '10 min',
    date: 'April 2026',
    excerpt:
      'My career arc, from emailing Excel files over 2G in Maiduguri to architecting AI-enabled platforms, was never planned. It was driven by repeatedly hitting the limits of existing tools and asking what should come next.',
    sections: [
      {
        content: `In 2017, in Maiduguri, I was building 5W tracking products for the Food Security Sector in Excel. Partners would email me their monthly distribution reports, sometimes as attachments, sometimes as photos of printed pages, occasionally as WhatsApp text messages, and I would consolidate everything by hand into a master workbook. The dashboard, such as it was, was a series of pivot tables I refreshed every Wednesday.

That sounds primitive in retrospect, and it was. But it worked. The workbook reached the cluster lead, the OCHA office, the donor desk, and ultimately the Federal Ministry of Humanitarian Affairs. People made decisions from it. 1.4 million people received food assistance through programmes informed in part by what that Excel file said about coverage gaps.

What changed me wasn\'t the tool. It was the moment I realised the tool was the bottleneck. There was a question I couldn\'t answer in Excel, about the spatial distribution of cash interventions across Borno, Yobe, and Adamawa, that I could have answered in QGIS in 20 minutes. But I didn\'t know QGIS yet. So I left it unanswered.

That gap, between the question and the tool, has defined every step of my career since.`,
      },
      {
        heading: 'The Arc',
        content: `Looking back, my career has moved through five distinct technical eras, each driven by a question my previous toolkit couldn\'t answer.

**Era 1, Excel and email (Maiduguri, 2017).** Manual aggregation of partner submissions. Worked because everyone had Excel. Failed because: no spatial intelligence, no real-time updates, no version control, no audit trail.

**Era 2, KoboToolbox and QGIS (Maiduguri / Cox\'s Bazar, 2018-2019).** Mobile data collection replaced paper. Spatial analysis replaced distance estimation. Suddenly I could overlay partner coverage on flood vulnerability maps and see the gap. I produced the Shelter/NFI Sector\'s rainy-season contingency plan for Borno using flood vulnerability mapping that wouldn\'t have been possible the year before.

**Era 3, Power BI and PostgreSQL (Ethiopia / Afghanistan, 2020-2024).** Dashboards became products in their own right. Live, interactive, queryable. Power BI on top of a PostgreSQL backend let me build the [Cash Working Group dashboard suite](/blog/data-ecosystem-maturity-assessment-guide) tracking 521,000 beneficiaries across 20 implementing partners with USD 6.78 million distributed. I also rebuilt the data pipeline at UNICEF Ethiopia after auditing the existing system and finding 40% missing location fields.

**Era 4, AI-enabled analysis (Bangladesh / Afghanistan, 2020-2025).** The [DEEP platform](https://www.thedeep.io/) for AI-assisted document classification. AI-enabled features inside Power BI for trend detection. Google Earth Engine for semi-automated raster analysis. The COVID-19 secondary data analysis I led in Bangladesh processed hundreds of documents into structured indicators in days rather than weeks.

**Era 5, Agentic and voice-first (now).** Building toward systems that don\'t wait for human prompts. Agents that monitor, classify, and synthesise. Voice as the primary input layer. This is where I am now, both in my [innovation work on Vendoh and MAKKET](/founder-journey) and in my conviction about [where humanitarian IM is heading](/blog/future-of-humanitarian-im-is-agentic).`,
      },
      {
        heading: 'The Constants Underneath the Tool Changes',
        content: `Five technical eras. Five different stacks. But the core principles never changed.

**Design for the worst network you\'ll encounter.** Excel survived in Maiduguri because everyone had it offline. Power BI in Ethiopia worked because we built it on top of a hybrid cloud-and-local architecture. The next-generation tools have to work the same way: in environments where the connection drops when the generator runs out of fuel.

**Govern before you collect.** Every dashboard I built that survived past project close did so because the data governance was sorted before the technology. Who owns the data? Who validates it? Who publishes it? When I built the unified analytical framework for the Ethiopia Cash and Market Feasibility Assessment, 372 household surveys, 44 market assessments, 36 government interviews across 7 woredas, it worked because the seven analytical pillars were agreed upfront.

**Train trainers, not users.** The biggest mistake I made early on was thinking that handing a partner a Power BI link was the same as enabling them to use it. When I led an Afghanistan-wide data literacy needs assessment across the IM community, the partners told us the same thing, they wanted practical, hands-on capacity building, not generic workshops. The Train-of-Trainers model is the only thing I\'ve seen produce lasting capacity.

**The reporting product is a coordination artifact, not a technical output.** A dashboard that the cluster lead trusts is worth more than a dashboard that\'s technically superior but politically isolated. The information management work is at least as much about institutional relationships as it is about software.`,
      },
      {
        heading: 'The Maiduguri Lesson That Still Drives Me',
        content: `That moment in Maiduguri, looking at a question Excel couldn\'t answer, taught me a habit I\'ve kept ever since.

When I hit the limit of a tool, my first response is no longer to work harder within it. My first response is to ask: what tool would solve this in 20 minutes instead of 4 hours? And then I learn that tool. QGIS in 2018. Power BI in 2020. PostgreSQL in 2022. Google Earth Engine in 2023. Now agentic frameworks and voice-AI integration.

The pattern isn\'t about chasing new technology. It\'s about refusing to let the tool define the question. Humanitarian decision-makers face questions every week that the existing tooling can\'t answer in time. Someone has to learn the next tool fast enough to answer them.

That\'s how I\'ve ended up with a stack that spans Python and PostgreSQL and Power BI and Google Earth Engine and DEEP and now AI agents, not because I planned to, but because the questions kept getting bigger and the tools kept needing to grow.`,
      },
      {
        heading: 'What I Tell People Starting Out',
        content: `When humanitarian IM officers early in their careers ask me what to learn next, I tell them the same thing every time: don\'t learn tools. Learn questions.

Spend a week with the cluster coordinator and write down every question they ask that the current dashboard can\'t answer. Then go figure out what tool answers it. Maybe it\'s a Power BI feature you haven\'t learned. Maybe it\'s a QGIS plug-in. Maybe it\'s a Python script. Whatever the tool, it\'s the question that gives the learning shape.

The technology will keep changing. Excel will stay alive in some corners. Power BI will be eclipsed. Voice and agentic AI will replace dashboards entirely within the decade. But the discipline of letting the operational question dictate the technical learning, that\'s the only career-long compounder I know.

That\'s what I learned in Maiduguri. It\'s what got me from there to where I am now. And it\'s what will keep working long after the current tools are gone.`,
      },
    ],
    relatedSlugs: [
      'lessons-six-countries',
      'voice-is-the-future-of-humanitarian-data',
      'future-of-humanitarian-im-is-agentic',
    ],
  },

  'the-case-for-anticipatory-cash': {
    slug: 'the-case-for-anticipatory-cash',
    title: 'The Case for Anticipatory Cash',
    category: 'Opinion',
    pillar: 'Climate & Cash',
    pillarColor: '#8B3A2F',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'Every dollar spent in advance of a slow-onset disaster is worth roughly five dollars spent after. Cash is the cleanest instrument for moving money before a crisis hits, and the data systems to trigger it now exist.',
    sections: [
      {
        content: `In Ethiopia between 2022 and 2023, I was consulting for UNICEF cash transfer program and the Ethiopia Cash Working Group as drought was tightening across the Somali, SNNP, and Oromia regions. The forecasts were clear: rainfall deficits were widening, [CHIRPS](https://www.chc.ucsb.edu/data/chirps) data showed below-average precipitation across multiple consecutive seasons, and the Standardised Precipitation Index was crossing thresholds we associated with mid-severity drought.

What we did not do, despite the forecasts, was release multi-purpose cash transfers in advance of the worst impacts. The funding mechanisms were post-onset. The humanitarian appeals were post-impact. By the time the CERF-funded MPC programme I monitored reached 185,000 beneficiaries with USD 3.2 million distributed, livelihoods had already been depleted, livestock had been sold at distress prices, and households had taken on debt to bridge the gap.

The economic literature on this is clear: anticipatory cash, deployed weeks before peak impact, costs a fraction of post-onset cash and produces materially better outcomes. The [World Food Programme estimates](https://www.wfp.org/anticipatory-actions) that anticipatory action can save up to USD 5 for every USD 1 invested. The [Anticipation Hub](https://www.anticipation-hub.org/about/what-is-anticipatory-action) documents case after case where pre-positioned cash transfers prevented the cascading losses that post-onset response had to mop up.

So why isn\'t anticipatory cash the default mode of humanitarian response for slow-onset disasters? The answer is institutional, not technical. The technology to forecast and trigger has existed for years. What\'s missing is the data architecture to authorise.`,
      },
      {
        heading: 'Why Cash Is the Right Instrument',
        content: `Cash is uniquely suited to anticipatory action for three reasons that other modalities can\'t match.

**Fungibility.** A household receiving USD 50 in advance of a drought\'s peak impact can use it to buy fertiliser to extend the planting season, repair a borehole, send a child to relatives in a less-affected area, or stockpile staple foods. The same USD 50 in food rations can do exactly one of those things. The flexibility of cash is what makes it preventive, recipients deploy it against the specific risk their household faces.

**Speed.** Mobile money rails, [M-Pesa](https://en.wikipedia.org/wiki/M-Pesa), [SafeBoda](https://safeboda.com/), regional bank transfers, can move funds in hours once the trigger fires. Procurement, shipping, and distribution of in-kind aid takes weeks. When the forecast tells you a flood will hit in 14 days, only cash can get to households in time to enable preventive action.

**Dignity.** Anticipatory cash treats recipients as economic actors making decisions about their own household risk. In-kind anticipatory aid, by contrast, is the humanitarian system telling people what they need before the disaster has even arrived. The accountability literature is unambiguous on which approach earns more trust.`,
      },
      {
        heading: 'The Data Systems Are Ready',
        content: `Here is what changed in the last five years: the technical components of an anticipatory cash trigger are all in place.

**Hazard forecasts.** [CHIRPS](https://www.chc.ucsb.edu/data/chirps) for rainfall, [GloFAS](https://www.globalfloods.eu/) for river discharge, NDVI and Vegetation Health Index for crop stress, sea-surface temperature for cyclone formation. These data streams are continuous, open, and global.

**Impact baselines.** [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), the next-generation national disaster loss tracking system co-developed by UNDRR, UNDP, and WMO, provides the historical impact records that turn a hazard forecast into an impact-based trigger. The forecast tells you the rainfall deficit will hit a specific threshold. The DELTA loss records tell you that the last three times the deficit hit that threshold in this district, it displaced X thousand people, destroyed Y hectares of crops, and pushed Z health facilities into overwhelm.

**Vulnerability layers.** Pre-positioned vulnerability indices, like the [social vulnerability index I built for Newcastle City Council](/expertise) during my MSc, identify the populations most at risk before the event. In Afghanistan, my team produced national flood, drought, avalanche, landslide, and extreme-temperature risk mapping at 4 km resolution that identified 223 of 401 districts in extreme to abnormally dry conditions.

**Disbursement infrastructure.** Mobile money, agent banking, and cash-in-hand mechanisms now reach the majority of vulnerable populations in most operating contexts. The CERF-funded MPC programme in Ethiopia disbursed USD 3.2 million across three regions through four implementing partners, the rails exist.

The pieces are all there. The data tells us when to act, who is at risk, and how to move the money. What\'s missing is the institutional decision to trigger before the event rather than after.`,
      },
      {
        heading: 'The Institutional Friction',
        content: `**The donor problem.** Most humanitarian funding mechanisms require evidence of impact before disbursement. CERF Rapid Response works post-onset. Country-based Pooled Funds work post-onset. Bilateral appeals are launched in response to declared emergencies. The architecture is reactive by design, and asking it to be anticipatory requires re-engineering risk appetites that have been calcified for decades.

**The trigger problem.** A pre-agreed trigger: "cash releases when CHIRPS rainfall deficit exceeds 1.5 standard deviations AND IPC food security classification reaches Phase 3 AND historical DELTA loss records indicate displacement greater than 5,000 in this zone", requires negotiation between donors, implementing partners, governments, and forecasters. The negotiation takes months. The drought doesn\'t wait.

**The verification problem.** Donor accountability frameworks were built around proving impact post-disbursement. Anticipatory cash is by definition disbursed before the impact materialises. Demonstrating value-for-money requires comparing what happened to a counterfactual where the cash wasn\'t released. That\'s methodologically harder than standard impact evaluation, and donor evaluation departments are still building the muscle.

**The political problem.** Releasing money for a disaster that hasn\'t yet happened looks, to a sceptical observer, like premature spending. If the forecast turns out wrong, the post-mortem is brutal. If the forecast was right and the cash prevented the worst impacts, there\'s no headline because nothing visible happened. The political incentives reward post-onset response over pre-onset prevention.

None of these are technical problems. All of them are solvable. But they require humanitarian leadership willing to take the institutional risk that the system structurally discourages.`,
      },
      {
        heading: 'What a Mature Anticipatory Cash System Looks Like',
        content: `Drawing on the Bangladesh shock-responsive cash work that informed USD 45.5 million in transfers reaching 2.5 million vulnerable people, on the Ethiopia CWG architecture, and on the [DELTA Resilience](/blog/delta-resilience-early-warning-anticipatory-action) framework I\'ve been writing about, here is what a mature anticipatory cash system requires.

**Pre-agreed triggers, pre-positioned funding, pre-vetted implementing partners.** All three have to be in place before the event. Negotiating any of them in the 14-day window between forecast and impact guarantees the cash arrives late.

**A multi-source forecast architecture with a clear decision protocol.** Not one forecast, several. Not a single threshold, an ensemble. A protocol that specifies what combination of signals fires the trigger, with named decision authority for the release.

**A grievance and accountability mechanism designed for the speed of disbursement.** Anticipatory cash means people receive transfers before the disaster materialises. Some of them will not understand why. The communication and complaints architecture has to be ready before the funds move.

**An impact verification framework built on counterfactuals.** Standard PDM doesn\'t cut it for anticipatory action. The evaluation has to compare what happened to a plausible alternative where the trigger didn\'t fire. That requires comparison groups, agreed methodology, and donor acceptance of the inherent uncertainty.

**An institutional learning loop.** Every trigger, fired or unfired, generates evidence about the system. False positives, false negatives, lead-time accuracy, beneficiary outcomes, all of these feed back into the next iteration of the trigger. Building that loop is harder than building any individual component.`,
      },
      {
        heading: 'The Window Is Open',
        content: `The COP30 [Loss and Damage Fund](https://www.undrr.org/building-risk-knowledge/disaster-data) and the Belém Adaptation Indicators have created the policy demand for anticipatory action evidence. DELTA Resilience and the [G-DRSF](/blog/g-drsf-statisticians-disaster-managers) have created the data architecture. Mobile money has created the disbursement rails. The forecasting science has matured. The case-study evidence is overwhelming.

What remains is institutional courage, donors willing to release funds before the disaster declares itself, governments willing to authorise pre-event transfers, implementing partners willing to be evaluated on counterfactual outcomes.

Every dollar of climate finance that arrives after the disaster is a dollar that could have prevented the disaster\'s worst consequences if it had arrived two weeks earlier. The data systems exist to make that timing possible. The question is whether we\'ll use them.`,
      },
    ],
    relatedSlugs: [
      'delta-resilience-early-warning-anticipatory-action',
      'measuring-joint-response-for-cash-transfer',
      'disaster-loss-data-climate-adaptation',
    ],
  },

  'measuring-joint-response-for-cash-transfer': {
    slug: 'measuring-joint-response-for-cash-transfer',
    title: 'Measuring Joint Response for Cash Transfer Programmes, A New Way of Using Humanitarian Meta-Data',
    category: 'Technical Deep Dive',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    readTime: '11 min',
    date: 'April 2026',
    excerpt:
      'Five organisations running cash transfer programmes in the same country produce five sets of post-distribution monitoring data using five different tools. The simple question: "is our collective cash response working?", becomes structurally unanswerable. Inter-agency PDM meta-analysis is how you answer it.',
    sections: [
      {
        content: `In Ethiopia, the Cash Working Group coordinated an impressive multi-purpose cash response that, in 2022 and 2023, reached tens of thousands of beneficiaries across multiple regions through a dozen-plus implementing partners. But here is the challenge, each cash working group partner had ran their own post-distribution monitoring. Each one used a slightly different questionnaire, a slightly different sampling strategy, a slightly different definition of "satisfaction" or "adequacy" or "market access."

When the Cash Working Group leadership asked the most basic possible question: "is our collective cash programming working?", the answer was structurally impossible to give. Not because the data didn\'t exist. Because the data existed in twelve incompatible silos that couldn\'t be combined without weeks of harmonisation work that nobody was funded to do.

This is the central problem in inter-agency cash coordination. Every individual partner produces good evidence about its own programme. The system as a whole produces no evidence about itself. And the donors, the government, and the affected populations all need answers about the system, not just the parts.

I\'ve been doing inter-agency PDM meta-analysis work across cash coordination contexts for years now, most extensively in Afghanistan and Ethiopia. Across every one of those engagements, the same lesson keeps surfacing: meta-analysis isn\'t a statistics exercise. It\'s a governance intervention disguised as one.`,
      },
      {
        heading: 'Why Individual PDMs Don\'t Add Up',
        content: `Take five partner PDMs from a typical inter-agency cash response.

Partner A surveys 400 beneficiaries with a 35-question instrument focused on transfer adequacy. Partner B surveys 1,200 with an 80-question instrument that includes detailed expenditure tracking. Partner C runs phone surveys only. Partner D uses face-to-face. Partner E weights its sample by household size; the others don\'t.

Each survey is internally valid. Each one tells you something true about its partner\'s programme. None of them, individually or summed, tells you whether the inter-agency response is working.

The reasons are technical:

**Different denominators.** "Beneficiary" means different things across partners, sometimes the head of household, sometimes everyone in the household, sometimes the registered recipient.

**Different question wording.** "Did the transfer meet your basic needs?" yields different answers than "Was the transfer amount sufficient?" Both questions appear, in different forms, across partner instruments.

**Different scale anchors.** A 5-point Likert satisfaction scale isn\'t arithmetically comparable to a 4-point scale, and direct dichotomous yes/no answers can\'t be averaged with either.

**Different sampling frames.** Partner A samples randomly within distribution lists. Partner B samples by geography. Partner C samples by enumerator convenience.

**Different recall windows.** "In the last 30 days" vs "since the most recent distribution" produce structurally different responses about the same underlying behaviour.

Aggregate across these incompatibilities and you don\'t get a richer picture. You get noise.`,
      },
      {
        heading: 'An Innovative Seven Pillar Meta-analysis Framework',
        content: `The framework I\'ve developed for inter-agency PDM meta-analysis in inter-agency multi-purpose cash coordination, organises the meta-analysis into seven pillars. Each pillar is defined narrowly enough that partner PDMs can be mapped to it cleanly, and broadly enough to capture the operationally meaningful dimensions of cash performance.

**Pillar 1, Programme Delivery and Beneficiary Profile.** Targeting mechanism, registration process, delivery modality, transfer mechanism, timeliness, perceived fairness. This is the operational hygiene layer. If partners are targeting different populations or distributing through different rails, the rest of the analysis has to control for it.

**Pillar 2, Satisfaction and Adequacy.** Satisfaction with transfer value, modality, and overall assistance, with explanatory feedback. This is where harmonisation work pays off most, Likert scales can be normalised to a common 0-100 index when you have the original variance structure.

**Pillar 3, Cash Utilisation and Markets.** Expenditure patterns, ability to meet basic needs, market access, price dynamics, constraints to cash use. The pillar that connects PDM data to the [Minimum Expenditure Basket](https://www.calpnetwork.org/themes/minimum-expenditure-basket/) review process.

**Pillar 4, Outcomes and Perceived Impact.** Beneficiary-reported outcomes on food security, dietary diversity, coping strategies, debt, health expenditures, education expenditures, shelter access, WASH access, livelihood recovery, household well-being. This is the layer where the question "is the cash actually changing lives?" gets answered.

**Pillar 5, Equity, Protection, and Safeguarding.** Disaggregated analysis by sex, age, disability, displacement status, and vulnerability characteristics. Protection risks. SEA and SH considerations. This pillar is structurally hard because most partner PDMs disaggregate inconsistently or not at all.

**Pillar 6, Accountability and Participation.** Information access, complaints and response mechanisms, trust in the assistance, community engagement. The pillar most often skipped in standard PDM, and most consequential for programme legitimacy.

**Pillar 7, Cross-Analysis and Learning.** Comparative analysis across partners and regions. Identification of patterns, divergences, good practices, and systemic constraints. This is where the meta-analysis adds value the individual PDMs can\'t.`,
      },
      {
        heading: 'The Real Work Is Harmonisation',
        content: `When I scope an inter-agency meta-analysis, I budget roughly 40% of the total effort for harmonisation. People who haven\'t done this work assume the time goes to analysis. It doesn\'t. The analysis is the easy part.

Harmonisation means:

**Variable mapping.** For every question in every partner PDM, identify which framework pillar it belongs to and which canonical indicator it operationalises. Build a master codebook that maps partner-specific variables to harmonised analytical variables.

**Standardisation of coding.** Recode partner-specific response options into a common scheme. Yes/No becomes 1/0. Likert becomes 0-100 normalised. Categorical becomes a defined ontology with stable labels.

**Geographic reconciliation.** Partner PDMs use partner-specific geographic codes. Map everything to OCHA Common Operational Datasets and admin-2 (woreda) p-codes. This single step takes a week of focused work and is the highest-impact intervention in data quality.

**Temporal alignment.** PDMs from different distribution rounds, different fiscal periods, different recall windows have to be aligned to a comparable analytical timeframe.

**Quality screening.** Records where mortality exceeds affected population. Records with impossible values (households of 47 people, transfer amounts of negative numbers). Duplicates across partner submissions. The cleaning is less interesting than the analysis but determines whether the analysis can stand.

**Reproducibility scripts.** Every harmonisation step gets coded as a reproducible Python or R script with version control. The next analyst inheriting the dataset has to be able to re-run the pipeline end-to-end.

When harmonisation is done well, the analytical layer becomes almost mechanical. When it\'s done poorly, no amount of analytical sophistication recovers the data.`,
      },
      {
        heading: 'Meta-Analysis as Governance',
        content: `The technical work above describes the visible product. The hidden product is governance.

Inter-agency PDM meta-analysis only works when partners agree to:

- Share their raw PDM datasets (not just summary findings)
- Adopt a harmonised reporting calendar so the data arrives in a usable window
- Use a shared codebook for at least the framework\'s core indicators
- Acknowledge comparative findings even when their own programme doesn\'t score well
- Fund the harmonisation work as a recurring coordination cost, not a one-off

Each of those agreements is a governance commitment. In every Cash Working Group I\'ve supported, securing them required formal coordination-body endorsement, partner-level technical review meetings, donor-level briefings on the limits of what comparative analysis can show, and clear written boundaries on what is and isn\'t in scope.

The meta-analysis report itself is a side effect of that governance work. The bigger product is the agreement to do it again next quarter, with a slightly tighter framework, slightly cleaner partner data, and slightly more decision-support value to the Cash Working Group as a body.`,
      },
      {
        heading: 'What This Approach Unlocks',
        content: `When inter-agency cash meta-analysis is operationalised properly, three things become possible that single-partner PDM can\'t deliver.

**System-level performance benchmarking.** Cross-partner comparison on harmonised indicators. Which partners are achieving higher satisfaction rates with smaller transfer values, and what can the rest learn? Which geographies show systematically lower outcomes, and is that a partner effect or a context effect?

**Equity audits at the response level.** Disaggregated outcomes by sex, age, disability, and displacement status across the entire response. Where individual partners may be reaching equity targets, the system as a whole may be missing them, or vice versa.

**Evidence for the [Minimum Expenditure Basket](/blog/the-case-for-anticipatory-cash) review.** Real expenditure patterns from harmonised data, capable of feeding the MEB taskforce with empirical evidence rather than partner-by-partner anecdote.

**Donor-quality evidence on collective contribution.** When a donor asks the Cash Working Group "what did your USD 50 million achieve?", the answer is no longer "here are 12 partner reports". It\'s a single integrated finding with confidence bands, methodology disclosure, and reproducible underlying data.`,
      },
      {
        heading: 'The Pattern Generalises',
        content: `This isn\'t a cash-specific problem. Any sector running multi-partner programming with partner-specific monitoring has the same fragmentation. Health, education, protection, WASH, food security, every cluster generates more individual partner data than aggregate response data.

Inter-agency meta-analysis is the bridge. The seven-pillar approach can be adapted to any sector by swapping the pillar definitions for sector-specific outcome dimensions. The harmonisation discipline stays the same. The governance work stays the same. The reproducible analytical pipeline stays the same.

What changes is the substantive question. For cash, it\'s "is the cash transfer system working?" For nutrition, it\'s "is the multi-partner nutrition response moving the IPC needle?" For protection, it\'s "are the inter-agency referral pathways functioning?" The method is general; the question is sector-specific.

The point of meta-analysis is not just better evidence, but to optimise joint approach of responding to development and humanitarian needs and measuring results and gaps, using a whole-of-system thinking. It\'s the institutional habit of asking system-level questions instead of partner-level ones, and building the data architecture that makes those questions answerable.`,
      },
    ],
    relatedSlugs: [
      'the-case-for-anticipatory-cash',
      'data-ecosystem-maturity-assessment-guide',
      'lessons-six-countries',
    ],
  },

  'geoai-for-humanitarians': {
    slug: 'geoai-for-humanitarians',
    title: 'GeoAI for Humanitarians: Getting Started',
    category: 'Tutorial',
    pillar: 'GIS',
    pillarColor: '#7B4B94',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'GeoAI is overhyped to outsiders and undertapped by the IM officers who would benefit most. After leading national hazard mapping in Afghanistan and rebuilding GIS workflows in Ethiopia, here\'s a practical guide for humanitarian practitioners ready to start.',
    sections: [
      {
        content: `Most humanitarian information management officers I work with have decent GIS skills. They can produce a partner-presence map in QGIS, build a flood vulnerability layer, run zonal statistics. What very few of them have is hands-on confidence with GeoAI, the application of machine learning techniques to geospatial data.

The hesitation is understandable. GeoAI sounds intimidating. Conference talks describe deep learning models trained on terabytes of satellite imagery to predict everything from crop yields to refugee flows. The barrier-to-entry signal is overwhelming.

In practice, most operational humanitarian GeoAI work is much simpler than the conference talks suggest. It\'s standard machine learning techniques applied to standard geospatial data, using tools that are mostly free and increasingly approachable. After supervising national flood, drought, avalanche, landslide, and extreme-temperature risk mapping at 4 km resolution in Afghanistan, and after rebuilding the GIS workflow at UNICEF Ethiopia and FAO Nigeria, I\'m confident this is a tractable skill set for any IM officer who wants to add it.

This is the practical guide I wish I\'d had when I started.`,
      },
      {
        heading: 'What GeoAI Actually Is (and Isn\'t)',
        content: `GeoAI is the application of machine learning to data that has a spatial dimension. That\'s the whole definition.

It\'s not magic. It doesn\'t predict the future. It doesn\'t replace judgment. What it does is automate pattern recognition at a scale that manual analysis can\'t reach, and then surface those patterns as analytical inputs that a human practitioner uses to make decisions.

Three operational categories cover most humanitarian use cases:

**Classification.** "Is this satellite pixel forest, agriculture, or built-up?" "Is this household at high, medium, or low risk?" Classification problems are where most GeoAI gets used in humanitarian contexts.

**Regression and prediction.** "How much will the NDVI in this zone drop given current rainfall trends?" "How many people are likely displaced based on the destruction signature in this Sentinel-1 image?" Estimating continuous values from spatial inputs.

**Detection and segmentation.** "Where in this image are the buildings, and which ones are damaged?" "What is the boundary of the flood inundation in this scene?" Pulling specific features out of imagery automatically.

If your humanitarian question fits one of those three categories and has a spatial dimension, GeoAI is in scope. If it doesn\'t, no model will help you.`,
      },
      {
        heading: 'The Tool Stack That Actually Matters',
        content: `Forget the current research stacks for now. The tools below cover 90% of humanitarian GeoAI use cases.

**[Google Earth Engine](https://earthengine.google.com/).** This is the gateway. Free for non-commercial use, browser-based JavaScript or Python API, and the entire planetary archive of MODIS, Landsat, Sentinel, CHIRPS, and more is at your fingertips with one-line queries. My drought analysis in Afghanistan that identified 223 of 401 districts in extreme to abnormally dry conditions used Earth Engine for VHI/VCI/TCI computation at national scale. A workflow that would have required days of raster downloads and processing took an hour.

**[QGIS](https://qgis.org/).** Open-source, infinitely extensible. The QGIS-Python integration via PyQGIS lets you script anything. The processing toolbox includes most standard GIS operations. The Semi-Automatic Classification Plugin handles supervised classification of satellite imagery. Combined with QGIS, you can do most humanitarian GeoAI without writing a single deep-learning model.

**Python (Pandas, GeoPandas, Rasterio, scikit-learn).** When you need to script ETL pipelines, run a classification or regression model, or build a reproducible workflow, this is the stack. GeoPandas makes spatial data feel like dataframes. Rasterio handles satellite imagery natively. Scikit-learn covers classical machine learning end-to-end.

**[Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/).** The newer option, similar in spirit to Earth Engine but with stronger Python integration and access to additional datasets like the Microsoft global building footprints. Worth knowing about even if Earth Engine remains your daily driver.

**[WorldPop](https://www.worldpop.org/).** Population estimates at 100 m resolution, globally. The single most useful baseline layer for humanitarian exposure analysis, and the dataset I cite most often when scoping a new operation.

That\'s the working stack. Master those five and you can do most operational humanitarian GeoAI.`,
      },
      {
        heading: 'Three Use Cases to Start With',
        content: `**Use case 1: Drought monitoring with NDVI and CHIRPS.** This is the canonical starter project. Pull NDVI from MODIS for the last 12 months. Pull CHIRPS rainfall for the same period. Compare both against the long-term mean for the area of operations. Generate a monthly anomaly map. Add a Vegetation Health Index layer that combines vegetation stress with temperature anomaly.

In Afghanistan, this workflow, extended with Sentinel-1 SAR backscatter for flood detection and ASTER DEM for avalanche risk modelling, became the [iMMAP-OCHA Disaster Risk and Climate Outlook Mapping Methodology](/expertise) reference. Once you have it running for one country, replicating it for another takes hours, not weeks.

**Use case 2: Flood extent mapping with Sentinel-1 SAR.** SAR penetrates clouds, which makes it the only operational option for flood mapping in monsoon contexts. The classification logic is straightforward: water has very low backscatter compared to dry surfaces, so flooded areas show up as dark pixels in a SAR image. The hard part is distinguishing real water from shadows, urban reflections, and pre-existing water bodies, which is where simple thresholding gives way to supervised classification with a small training dataset.

I used variants of this workflow for flood vulnerability mapping in Borno, Yobe, and Adamawa during the rainy-season contingency planning at FAO Nigeria, and integrated GloFAS forecasts on top to produce the early-warning maps that fed the Shelter/NFI sector\'s preparedness plan.

**Use case 3: Building footprint extraction for displacement tracking.** The Microsoft global building footprints dataset has changed how rapid displacement assessment works. Combine it with pre-event and post-event satellite imagery, and you can detect new construction (informal settlements, displaced-population shelters) or destruction (conflict damage, disaster impact) at scale. The classification challenge, what counts as a "new building" vs noise, is non-trivial but tractable with simple change-detection workflows.`,
      },
      {
        heading: 'Where to Start: A Two-Week Plan',
        content: `Here\'s the project I tell IM officers to commit two weeks to as their entry into operational GeoAI.

**Week 1, Days 1–3.** Open a Google Earth Engine account. Run the introductory tutorials. Download the Earth Engine Python API (geemap is a friendly wrapper). Pick a country you know well, your current operating context.

**Week 1, Days 4–7.** Compute monthly NDVI mean for the last 24 months for your country. Compare to the 2015–2024 baseline. Generate an anomaly map. Export the result as a GeoTIFF.

**Week 2, Days 1–3.** Bring the GeoTIFF into QGIS. Overlay it with admin-2 boundaries from OCHA Common Operational Datasets. Compute zonal statistics, mean NDVI anomaly per district. Identify the top-10 most-stressed districts.

**Week 2, Days 4–5.** Cross-reference the stressed districts with WorldPop population estimates. Generate a "population in vegetation-stressed districts" estimate.

**Week 2, Days 6–7.** Write up a one-page methodological note explaining what you did, what the data sources are, what the limitations are, and what the analysis tells you about your operational context.

You\'re not going to publish this. You\'re going to learn from it. By the end of two weeks, you\'ll have run an end-to-end GeoAI workflow that mirrors a real humanitarian product. Every subsequent project gets easier.`,
      },
      {
        heading: 'The Pitfalls Nobody Warns You About',
        content: `**Model accuracy is not the same as operational utility.** A classifier that\'s 95% accurate on a held-out test set can be operationally useless if the 5% errors cluster in your most consequential decisions. Always validate against ground truth from the actual operational context, not just statistical metrics.

**Resolution matters more than algorithm.** A simple model on 10 m Sentinel data outperforms a sophisticated model on 250 m MODIS data for most local operational questions. Get the resolution right before getting the algorithm right.

**Uncertainty quantification is harder than prediction.** Producing an estimate is the easy part. Producing an honest confidence band around the estimate is what makes the product trustworthy. Most humanitarian GeoAI products skip this step. They shouldn\'t.

**Validation has a shelf life.** A model trained on 2022 imagery may not generalise to 2026 conditions. Land cover changes. Building patterns shift. The displacement signature in a SAR image looks different when the underlying landscape has been transformed by drought. Re-validate periodically.

**Open data has political constraints.** In some operating contexts, satellite imagery analysis is sensitive. Coordinate with the country office, the cluster lead, and (where appropriate) national authorities before publishing detailed spatial products. The technical work and the political work are inseparable.`,
      },
      {
        heading: 'GeoAI Augments Judgment, Doesn\'t Replace It',
        content: `The most common mistake I see in humanitarian GeoAI is treating model output as the answer rather than as input to the answer.

A classified flood-extent map is not a needs assessment. It\'s a starting point for a needs assessment. The difference matters. Operational decisions are made by people, informed by evidence, accountable to affected populations. GeoAI extends what evidence is possible to assemble; it doesn\'t replace the judgment that turns evidence into decisions.

The IM officers who get the most out of GeoAI are the ones who treat it as another tool in the analytical kit, not as a magic answer machine. Combine the GeoAI output with field reports, partner consultations, baseline household surveys, and operational context, and you have a picture you couldn\'t have built any other way.

That\'s the skill set worth building. Start with two weeks. Pick a country. Run the workflow. The rest follows.`,
      },
    ],
    relatedSlugs: [
      'delta-resilience-early-warning-anticipatory-action',
      'lessons-six-countries',
      'building-systems-governments-can-own',
    ],
  },

  'the-im-coordination-trap': {
    slug: 'the-im-coordination-trap',
    title: 'The IM Coordination Trap',
    category: 'Opinion',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    readTime: '8 min',
    date: 'April 2026',
    excerpt:
      'The biggest barriers to good information management in humanitarian response are not technical, they\'re political. Data sharing agreements that never get signed, institutional distrust that no dashboard can fix, and donor-imposed reporting cycles that don\'t match field reality. Technology is the easy part.',
    sections: [
      {
        content: `In Afghanistan, I once spent three months building what I believed was the perfect 5W reporting platform. It had standardised templates, dropdown-controlled p-codes, automated deduplication, real-time validation, role-based access controls, and a dashboard layer that turned partner submissions into instant cluster-level coverage maps. The technical work was sound. The architecture was rigorous. The product was beautiful.

It almost failed.

It didn\'t fail for technical reasons. It failed, almost, because three of the largest implementing partners in the country didn\'t want to submit their data through a centralised platform. They had political concerns about data ownership. They had legal concerns about beneficiary protection. They had institutional concerns about a single agency (mine) becoming the de facto information broker for the response. None of those concerns showed up in any technical specification. All of them threatened to make the platform irrelevant.

We rescued the system not by improving the software but by negotiating trust and through agreeing on verbal and non-written data governance protocol across 8 clusters that addressed every one of those concerns. Tiered access. Pseudonymisation rules. A formal escalation pathway for disputes. A clear commitment from funding partners that the platform was the cluster\'s, not the implementing organisation\'s. After that, the holdout partners came on board. ReportHub processed over 259 partner reports per month covering services to 2.28 million beneficiaries across 1,853 locations.

The lesson, after a decade of building IM systems across six countries, is one I have to keep relearning: the technology is the easy part.`,
      },
      {
        heading: 'The Trap',
        content: `The IM coordination trap is the assumption that better technology solves coordination problems. It rarely does. Coordination problems are political, not technical, and they require political solutions.

Three flavours of the trap show up consistently across operations.

**Trap 1: The Data-Sharing Agreement That Never Gets Signed.** A consortium identifies the need for shared monitoring. The technical team builds the platform. The partners agree in principle. Then the data-sharing agreement goes through legal review. Six months later, the agreement is still in draft. The platform is online but empty. Eventually it\'s shelved as "not adopted by partners", when the actual problem was that nobody owned the agreement\'s political negotiation.

**Trap 2: The Cluster Lead vs Partner Trust Deficit.** A cluster lead commissions a dashboard to track partner performance. Partners interpret this, sometimes correctly, as a surveillance instrument. They report selectively or not at all. The dashboard becomes a monument to coverage gaps that exist in the data because partners are protecting themselves, not because the gaps exist in reality.

**Trap 3: The Donor-Imposed Reporting Cycle That Doesn\'t Match Field Reality.** A major donor specifies a quarterly reporting cycle with 20 indicators. Partner field teams spend three weeks of every quarter filling out reports rather than delivering programmes. The data is collected, aggregated, and reported up. Nobody downstream uses it. The reporting exists because the funding requires it, not because anyone needed the information.

In each case, the technology can be perfect and the coordination still fails. The failure is upstream of the technology.`,
      },
      {
        heading: 'Why the Trap Is So Persistent',
        content: `Information managers are hired for technical skills. The job ad asks for Power BI, GIS, SQL, Python. The interview tests dashboard design and data architecture. Promotions reward visible technical product.

But the job actually requires political negotiation. Securing partner buy-in for data submission. Brokering data-sharing agreements. Defending the IM unit\'s neutrality when the cluster lead asks for partner-comparison products that risk making partners look bad. Pushing back on donor reporting requirements that don\'t serve operational needs.

None of those skills are in the job ad. None of them get tested in the interview. None of them produce visible technical artifacts. So they are systematically underweighted in how IM officers spend their time.

The result is an IM cadre that\'s technically over-skilled and politically under-prepared. We build excellent platforms in environments where the political ground is unstable, and we\'re surprised when the platforms don\'t take hold.

When I ran a country-wide IM capacity audit in Afghanistan across over 60 humanitarian organisations, the pattern was clear: most agencies had IM focal persons, but the weakest capacity was at the coordination level, not at the individual analyst level. The gap wasn\'t technical skill. It was the institutional muscle to coordinate analytical work across organisations, the political work that no amount of individual training fixes.`,
      },
      {
        heading: 'The Afghanistan Suspension as Case Study',
        content: `The clearest example I have of the IM coordination trap was the [Afghanistan platform suspension in 2025](/blog/politics-of-humanitarian-data-infrastructure). The platform, a nationwide humanitarian reporting system serving over 115 partner organisations, was technically excellent. Its architecture was modern, its uptime was high, its data quality was rigorous, its training programme was comprehensive.

It went dark overnight when its sole donor froze funding.

The technology had no defence. The institutional architecture had no defence. The partners who depended on the platform had no advance notice and no alternative. The lead UN coordination agency distanced itself from the implementing organisation rather than fighting for the shared infrastructure. Every actor retreated into self-preservation. Nobody owned continuity, so nobody fought for it.

This is the IM coordination trap at its most consequential. The technical work was good. The political architecture, diversified funding, mandatory contingency protocols, formal continuity agreements, sovereign data governance, was missing. When the political ground shifted, the technology went with it.

The lesson generalises beyond Afghanistan. Any humanitarian data system that depends on a single donor, a single implementing partner, or a single political configuration is a system with a single point of failure. And the failure mode isn\'t technical, it\'s institutional.`,
      },
      {
        heading: 'What Gets You Out of the Trap',
        content: `The escape from the coordination trap isn\'t better software. It\'s the boring institutional work that IM officers are not trained to do but that determines whether the software ever gets used.

**Negotiate the data governance before you build the platform.** Who owns the data? Who validates it? Who publishes it? What happens when partners disagree about a finding? Who can suspend a partner from the system? Get the answers in writing before a single line of code is written. The Afghanistan IM Capacity Assessment exercise I led demonstrated, painfully, that platforms built without this groundwork hit walls within months.

**Map the political stakeholders before you map the data sources.** For every dataset you want to consume, identify the political actor who controls access. Get explicit, written, time-bounded permissions before assuming the data will flow. The [data ecosystem maturity assessment framework](/blog/data-ecosystem-maturity-assessment-guide) bakes this in as Dimension 1 (Actors and Roles) for exactly this reason.

**Design the platform around the coordination mechanism, not the cluster lead.** Cluster leads change. Coordination mechanisms persist. Build the platform as a shared asset of the coordination architecture, with governance that survives leadership turnover. The cash working group I supported in Ethiopia continues to work because the analytical framework belongs to the coordination mechanism, not to any single agency.

**Build escalation pathways.** When two partners disagree on a finding, what happens? When a donor asks for a product the partners don\'t support, what happens? When a government counterpart objects to a publication, what happens? Pre-agreed escalation pathways prevent every dispute from becoming an existential crisis.

**Ration the information products.** Not every question needs a dashboard. Not every report needs to be quarterly. Cut the reporting burden to what\'s actually used. Less is more, almost always.

**Diversify funding from the start.** No coordination platform should depend on a single donor. The reserve mechanism, multi-donor pooled fund, or cost-sharing agreement has to exist on day one. Bolt-on diversification after a funding crisis is too late.`,
      },
      {
        heading: 'The Promotion Path That Doesn\'t Exist',
        content: `Here\'s the structural fix the IM cadre needs but doesn\'t have: a promotion path that rewards political and institutional work as much as it rewards technical work.

Right now, an IM officer who builds a beautiful platform gets visibility, recognition, and the next assignment. An IM officer who spends three months negotiating a data governance MoU gets… nothing visible. The MoU is invisible until it\'s tested, at which point its value is enormous, but the IM officer who built it has long since moved on.

The fix is structural. Performance frameworks for IM officers should explicitly evaluate political and institutional outcomes, data-sharing agreements signed, partner trust scores, coordination platform survival past project close, donor diversification metrics. Until those metrics exist, the IM cadre will keep falling into the coordination trap, and the platforms will keep dying when the political ground shifts.

The technology really is the easy part. We just keep being surprised by it.`,
      },
    ],
    relatedSlugs: [
      'politics-of-humanitarian-data-infrastructure',
      'building-systems-governments-can-own',
      'lessons-six-countries',
    ],
  },

  'invisible-disasters-invisible-funding': {
    slug: 'invisible-disasters-invisible-funding',
    title: 'Invisible Disasters, Invisible Funding: When Disaster Data Decides Who Gets Climate Finance',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    date: 'April 2026',
    excerpt:
      "Every year, millions experience flash floods, prolonged drought, and slow-onset hazards that never reach the world's primary disaster databases. Their losses are real, recurring, and devastating. Because they don't show up in the data, they rarely show up in the funding either.",
    keywords: [
      'disaster loss data',
      'climate finance',
      'EM-DAT',
      'CRED',
      'Loss and Damage Fund',
      'DELTA Resilience',
      'extensive risk',
      'intensive risk',
      'African disaster reporting',
      'Sendai Framework',
      'Green Climate Fund',
      'Adaptation Fund',
      'anticipatory action',
      'parametric insurance',
      'African Risk Capacity',
      'CCRIF',
      'G-DRSF',
      'COP28',
      'COP30',
      'climate finance evidence',
    ],
    sections: [
      {
        content: `What gets counted gets funded. What gets missed stays vulnerable.

In its [2025 Disasters in Numbers report](https://files.emdat.be/reports/2025_EMDAT_report.pdf), the [Centre for Research on the Epidemiology of Disasters (CRED)](https://www.cred.be/) recorded that natural hazards killed 16,607 people, affected 110.2 million more, and caused US$169.7 billion in economic losses in 2025. These are sobering numbers, and they deserve the attention they are getting.

But the more consequential story may be in the disasters those numbers never captured. Every year, millions of people experience flash floods, local storms, urban flooding, prolonged drought, and slow-onset heat events that never reach the world\'s primary disaster databases. Their losses are smaller in any single event but cumulatively devastating. They wear out household savings, strip away livelihoods, and quietly erode community resilience year after year.

And because these losses do not show up in the data, they rarely show up in the funding either. That is the gap this post examines.`,
      },
      {
        heading: 'The Data Gap Shaping Climate Finance',
        content: `Climate finance is one of the fastest growing areas of international cooperation. The [Loss and Damage Fund](https://unfccc.int/loss-and-damage-fund) operationalised at COP28, the [Green Climate Fund](https://www.greenclimate.fund/), the [Adaptation Fund](https://www.adaptation-fund.org/), and [anticipatory action](https://www.undrr.org/publication/briefing-note-anticipatory-action-innovative-tool-intersection-disaster-risk-reduction) mechanisms all share one feature. They depend on disaster risk evidence to decide where money goes, to whom, and under what conditions.

Most of that evidence flows from a small number of global datasets. [EM-DAT](https://www.emdat.be/), maintained by CRED, is the most widely cited. It underpins academic research, humanitarian appeals, donor analyses, and the evidence base for major climate finance allocations.

This is not a criticism of EM-DAT. It is a respected and transparent resource, and crucially, CRED flags its own limits. In the 2025 Disasters in Numbers report, CRED itself notes that "these estimates should be considered conservative with respect to what is truly lost," and that "economic losses in poorer and developing contexts are poorly reported." That candour deserves credit. It also confirms the problem.

If the single most cited disaster dataset openly concedes that poorer contexts are under-reported, and that same dataset anchors decisions about where billions in climate finance flow, then the blind spots in the data become blind spots in the funding.`,
      },
      {
        heading: 'How Missing Data Decides Who Gets Protected',
        content: `To be included in [EM-DAT](https://www.emdat.be/), a disaster must meet at least one of four criteria: 10 or more people reported killed, 100 or more people reported affected, a call for international assistance, or a declaration of a state of emergency. These thresholds were designed for analytical consistency, not for completeness. They work well for large, visible, and politically recognised events. They work poorly for everything else.

Three structural issues follow from this design.

First, the numerical thresholds are arbitrary. A community losing 8 lives to a flash flood, or 95 households displaced by a recurring storm, simply does not register. There is nothing in the methodology that distinguishes between "did not happen" and "did not cross the reporting line."

Second, the political triggers are political. A call for international assistance or a formal state of emergency is a government decision shaped by capacity, diplomacy, and domestic considerations. As [peer-reviewed reviews of the database note](https://link.springer.com/article/10.1186/s12889-024-21026-2), these triggers reflect "mainly political decisions" rather than actual disaster impacts.

Third, even the events that do make it in are often incomplete. [Recent analyses of the database](https://www.preventionweb.net/news/em-dat-and-quantitative-analysis) find that roughly a third of records do not contain the number of people affected, and a fifth do not record deaths. Economic losses are the least reliably recorded field of all, especially in low and middle income contexts.

None of this means EM-DAT should be discarded. It means EM-DAT should be recognised for what it is: a strong dataset for intensive, well-reported, politically acknowledged disasters. The problem is not that it fails at its design purpose. The problem is that it has been asked to carry far more decision weight than its design was ever meant to support.`,
      },
      {
        heading: 'Unseen Disasters, Unfunded Communities',
        content: `[UNDRR distinguishes between two kinds of disaster risk](https://www.preventionweb.net/understanding-disaster-risk/key-concepts/intensive-extensive-risk). Intensive risk describes large, infrequent events such as major earthquakes, category 5 storms, and catastrophic floods. These dominate global headlines and global datasets. Extensive risk describes the opposite: [low severity, high frequency events](https://www.undrr.org/terminology/extensive-disaster-risk), mostly linked to localised hazards such as flash floods, urban flooding, localised storms, landslides, and slow-onset drought and heat.

Extensive risk events rarely breach EM-DAT\'s thresholds. Yet their cumulative toll is extraordinary. Analyses drawing on [UNDRR\'s Global Assessment Report series](https://www.undrr.org/gar) find that small and recurrent disasters cause only about 14% of disaster mortality but drive [more than 40% of total economic losses in low and middle income countries](https://assets.publishing.service.gov.uk/media/57a08a0040f0b64974000382/hdq1016.pdf).

These are the losses that quietly wear out household savings, school buildings, clinic roofs, farm income, and community cohesion.

The 2025 data tells the same story in a single striking ratio. According to the 2025 Disasters in Numbers report, Africa accounted for 18.6% of global disaster deaths and 13.7% of people affected, but just 0.7% of reported economic losses (US$1.2 billion). The Americas, in contrast, accounted for 8.2% of global deaths but 65.2% of losses. African disasters are not cheap. African disaster losses are simply not being counted.

This is the invisible majority: populations exposed to regular, grinding hazards whose losses rarely appear in any global dataset. And because those losses are invisible, the communities that carry them are persistently under-represented in the risk evidence that shapes climate finance.`,
      },
      {
        heading: 'Invisible Losses, Invisible Finance: When Disaster Data Decides Who Gets Support',
        content: `If disaster data is incomplete, the climate finance architecture that relies on it inherits the same gaps. This is not a theoretical problem. It plays out across at least four real-world mechanisms.

**The Loss and Damage Fund.** The [Loss and Damage Fund](https://unfccc.int/loss-and-damage-fund), operationalised at COP28, is designed to support communities already experiencing climate-driven harm. Allocation will inevitably draw on historical loss evidence, whether at aggregate or country level. If extensive risk losses are systematically under-reported, the countries most in need of Loss and Damage finance may also be the least equipped to substantiate their claims. The fund risks reproducing the same geography of visibility we see in EM-DAT.

**Adaptation and resilience finance.** The [Green Climate Fund](https://www.greenclimate.fund/) and the [Adaptation Fund](https://www.adaptation-fund.org/) both require risk and vulnerability evidence in project proposals. When that evidence is drawn from datasets that privilege intensive risk, the resulting projects are more likely to target low-frequency, high-severity events. Extensive-risk communities, whose disaster experience is chronic rather than catastrophic, find themselves outside the evidence base needed to attract funding.

**[Anticipatory action](https://www.undrr.org/news/data-decisions-how-countries-fragile-and-climate-stressed-settings-are-using-disaster-data-act) and parametric insurance.** Anticipatory action is built on the principle of acting before a hazard arrives, using forecasts and pre-agreed triggers to release funds, pre-position supplies, or evacuate populations. As [the Anticipation Hub notes](https://www.preventionweb.net/news/making-sense-synergies-how-anticipatory-action-connects-other-approaches-and-sectors), anticipatory action does not happen in isolation; it is interwoven with disaster risk reduction, climate adaptation, social protection, and humanitarian response, all of which depend on the same underlying disaster data. Both forecast skill and trigger design depend on historical disaster records that document where, how often, and how severely past events have unfolded. Where extensive risk events are missing from the record, models underestimate frequency, triggers are calibrated too high, and pre-arranged finance fails to fire for the very communities anticipatory action was designed to protect.

Parametric insurance pools such as the [African Risk Capacity](https://www.arc.int/) and the [Caribbean Catastrophe Risk Insurance Facility](https://www.ccrif.org/) use hazard parameters such as rainfall, windspeed, or ground shaking, rather than measured losses, to issue rapid payouts. Pricing, payout thresholds, and basis-risk modelling all depend on long historical hazard and impact records. When extensive-risk events are absent from those records, the resulting products underprice slow-onset and recurrent risk, and underpay the communities that experience it most frequently.

**Sendai Framework monitoring.** [Sendai Framework Targets C and D](https://sendaimonitor.undrr.org/), which track disaster-related economic loss and damage to critical infrastructure, cannot be monitored credibly without sub-national, disaggregated data. Under-reporting in national submissions compounds global under-counting, leaving the international community with an incomplete picture of where progress is real and where it is stalling.

Taken together, these four mechanisms reveal the same pattern. Disaster data is not neutral infrastructure. It is a filter that decides whose suffering is visible, whose losses are credible, and whose claims on global finance are fundable.`,
      },
      {
        heading: 'Missing from the Data, Missing from the Funding',
        content: `If the problem is a design choice, the solution is also a design choice. A new generation of disaster-tracking systems is beginning to emerge, built specifically to see what EM-DAT was never designed to capture.

The most significant is UNDRR\'s [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), the Disaster and Hazardous Events, Losses and Damages Tracking and Analysis system. DELTA replaces the legacy DesInventar Sendai platform with a no-threshold, subnational, and disaggregated approach. It records events down to the local level, and disaggregates losses by geography, sector, sex, age, and disability. Critically, it is country-owned and interoperable, so national governments retain control over their own data while still contributing to global risk knowledge.

DELTA sits inside a wider policy architecture. The [Global Disaster-Related Statistics Framework](https://www.undrr.org/global-disaster-related-statistics-framework-faqs), co-developed by UNDRR and the UN Statistical Commission, provides the international standard that makes national disaster data comparable and policy-useable. Together, these tools offer the first serious chance to close the visibility gap that has defined global disaster tracking for decades.

But tools alone will not close that gap. Three shifts are needed.

Donors and multilateral funds must invest in national disaster-tracking systems as core climate finance infrastructure, not as back-office statistics. Climate finance application processes must explicitly accept and reward disaggregated, extensive-risk evidence, not just intensive-risk baselines. And global datasets must be read as starting points, not final authorities, on what has actually happened to the communities they describe.`,
      },
      {
        heading: 'Counting Disasters Differently',
        content: `The 2025 disaster numbers will make headlines, as they should. But the deeper story sits just outside the frame, in the floods that were never reported, the droughts that quietly hollowed out livelihoods, and the communities whose losses were real but uncounted.

Climate finance cannot reach people it cannot see. As the Loss and Damage Fund matures, and as DELTA Resilience rolls out across regions, we have a rare chance to align how we measure disasters with how we fund recovery and resilience.

What gets counted gets funded. What gets missed stays vulnerable. Our job now is to count differently.`,
      },
    ],
    relatedSlugs: [
      'disaster-loss-data-climate-adaptation',
      'desinventar-to-delta-resilience',
      'g-drsf-statisticians-disaster-managers',
    ],
  },

  'road-to-antalya-ncqg': {
    slug: 'road-to-antalya-ncqg',
    title: 'The Road to Antalya: Turning the NCQG Into Real-World Climate Finance',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '9 min',
    date: 'April 2026',
    excerpt:
      "A finance goal is only as honest as the data that tracks it. On the road to COP31, the New Collective Quantified Goal is about to meet that test, and the credibility of USD 300 billion a year will be decided not by negotiators but by the boring, technical, deeply political business of measurement.",
    keywords: [
      'NCQG', 'New Collective Quantified Goal', 'COP31', 'COP30', 'Antalya',
      'climate finance', 'Loss and Damage Fund', 'Article 9',
      'grant-equivalent', 'mobilisation', 'adaptation finance', 'transparency',
      'MRV', 'recipient-country data systems', 'climate diplomacy',
    ],
    sections: [
      {
        content: `*A finance goal is only as honest as the data that tracks it. On the road to COP31, the New Collective Quantified Goal is about to meet that test.*

When the gavel came down in Baku in November 2024, the headline number was USD 300 billion a year by 2035. It was hailed as a tripling of the old USD 100 billion goal and dismissed, almost in the same breath, as a fraction of what developing countries had asked for. Both readings were correct. But the number was never the hard part. The hard part is what the word "mobilise" hides. Who pays, in what form, on what terms, and how anyone will know whether it actually arrived in a household in Cox's Bazar or the Sahel.

That is the question the [New Collective Quantified Goal (NCQG)](https://unfccc.int/NCQG) now carries onto the road to Antalya. [COP30 in Belém](https://www.carbonbrief.org/cop30-key-outcomes-agreed-at-the-un-climate-talks-in-belem/) handed COP31 a goal that has been agreed but not operationalised. A destination, in other words, with no agreed map. The credibility of the NCQG will not be settled by the size of the headline figure. It will be settled by the boring, technical, deeply political business of measurement. And measurement is where I have spent my career.`,
      },
      {
        heading: 'The Number Everyone Argues About, and the One That Matters',
        content: `Let me be precise about what was actually decided, because the public conversation keeps collapsing two different things.

The NCQG, [adopted at COP29](https://www.wri.org/insights/cop29-outcomes-next-steps), sets a goal for developed countries to take the lead in mobilising at least USD 300 billion per year by 2035 for developing-country climate action. Around that core sits a wider, non-binding aspiration (the "Baku-to-Belém Roadmap to 1.3T") to scale finance from all sources to USD 1.3 trillion per year by the same date. The USD 100 billion that everyone still quotes is the *expiring* 2009 pledge, finally met (late, and contested) around 2022. It is the floor we are leaving, not the floor we are standing on.

The trouble is that USD 300 billion is a mobilisation target, and mobilisation is one of the most elastic words in climate diplomacy. A grant is mobilised finance. So is a market-rate loan that a country must repay with interest. So, with enough accounting creativity, is a guarantee that de-risks a private investment that might have happened anyway. When the unit of account is that flexible, the number stops being a measure of support and becomes a measure of reporting technique.

This is not a new challenge. It is the same one I have watched play out at national level for a decade, just with more zeros. What gets counted gets claimed, and the way we count shapes our shared sense of how much progress has been made.`,
      },
      {
        heading: 'Grants, Loans, and the Quiet Arithmetic of Debt',
        content: `At [COP30](https://odi.org/en/insights/cop30-whats-the-verdict/), the fault line that mattered most was composition. The Least Developed Countries and the African Group pushed for the goal, and especially any "tripling" of adaptation finance, to be anchored in grant-based and highly concessional finance. Developed countries resisted being pinned to public money alone, preferring language that lets loans, private capital, and mobilised investment count toward the target. The result, as [analysts noted](https://debtjustice.org.uk/blog/how-did-cop30-stand-up-against-debt-and-climate-justice-demands), reaffirmed obligations in principle while deferring the mechanics.

Why does this matter for a disaster-data specialist? Because the composition question is, at bottom, a counting question with a human edge. If a country facing recurrent floods receives its "climate finance" as loans, the money that arrives to build a seawall today becomes a debt-service line that crowds out the health budget tomorrow. We have already seen climate-vulnerable states spending more on debt repayment than on climate adaptation. A finance goal met largely through loans, even as it adds to a country's debt burden, can be recorded as success while leaving the recipient little better off. That is why the composition of the goal matters so much, and why so many delegations are working hard to get it right.

The honest version of the NCQG would track grant-equivalent value, not face value. That is the actual concessionality of each dollar, net of what gets repaid. That is a methodological choice, and methodological choices are never neutral. They decide whose accounting looks generous and whose vulnerability looks addressed.`,
      },
      {
        heading: 'You Cannot Manage What You Refuse to Measure',
        content: `This is where the NCQG meets the discipline I know best.

The goal comes with a measurement, reporting and transparency obligation, and COP30's [two-year work programme on climate finance](https://www.i4ce.org/en/climate-finance-cop30-progress-pitfalls-persistent-challenges-path-ahead/), covering Article 9.1 and the wider architecture of Article 9, is, in effect, a mandate to figure out how we will know whether the goal is being met. That sounds procedural. In practice, it is where much of the real work lies.

Consider what tracking USD 300 billion honestly would require. You need a shared definition of what counts as climate finance, so that the same dollar is not double-counted by a donor and a multilateral bank. You need to separate new and additional money from rebadged development aid. You need to distinguish committed from disbursed, and disbursed from actually-reaching-the-ground. And there is the part the climate-finance community consistently underweights: you need recipient-side data good enough to verify that the money did what it claimed to do.

I have built the recipient side of that ledger. In Afghanistan I mapped over thirty distinct disaster-data sources and negotiated the data-sharing agreements to bring them into a single [Humanitarian Spatial Data Centre](/projects) that supported risk-informed humanitarian response planning. The lesson was unambiguous. A financial flow is only as verifiable as the national system that receives it, which is why I keep returning to the argument that we have to [build data systems governments can actually own](/blog/building-systems-governments-can-own). Donor-side transparency dashboards are necessary but they are half a bridge. If the country on the other end cannot disaggregate where the money landed, by district, by sector, by who was actually reached, then "climate finance delivered" remains an assertion, not a fact.

This is why I read the NCQG transparency debate as continuous with the disaster-loss debate I have written about [before](/blog/invisible-disasters-invisible-funding). The same blind spots that keep extensive-risk losses out of global datasets will keep climate-finance outcomes unverifiable in exactly the same places. The geography of invisible losses and the geography of unaccountable finance are the same geography.`,
      },
      {
        heading: 'The Ministerial Dialogue Problem: Predictability You Can Bank',
        content: `One genuine advance in the NCQG package is the mandated biennial high-level ministerial dialogue on climate finance, with COP30 adding a [ministerial round table](https://www.cities-and-regions.org/cop30-outcomes-on-climate-finance-and-loss-damage/) on the goal's implementation. The intent is right. Pull finance out of the technical sub-rooms and force it onto ministers' desks on a predictable cycle.

But a dialogue is only as useful as what it is allowed to produce. If the round table yields communiqués and "reflections," it becomes another venue for restating positions. If it yields verifiable, forward-looking pledges, multi-year commitments a finance ministry in a vulnerable country can actually build a budget around, it changes the planning horizon of climate action.

Predictability is itself a form of finance. A national disaster management authority that knows what is coming over three years can pre-position, can design [anticipatory triggers](/blog/the-case-for-anticipatory-cash), can commit to multi-year resilience programmes. One that lurches from pledge to pledge cannot plan past the next emergency. The single most valuable thing COP31 in Antalya could extract from the ministerial process is not a bigger number. It is a more *predictable* one, on a published schedule, against which delivery can be tracked.`,
      },
      {
        heading: 'Broadening the Base Without Erasing the Principle',
        content: `The NCQG also reopened the oldest argument in the convention. Who counts as a contributor. Developed countries want the donor base broadened to include large emerging economies and the private sector. Developing countries see in that move an attempt to dilute the historical-responsibility principle baked into the UNFCCC since 1992.

I think both instincts contain something true, and the way through is, again, a measurement question rather than a moral standoff. Private capital is indispensable to reach USD 1.3 trillion. No plausible volume of public grants gets there alone. But private finance follows bankable risk, and bankable risk follows good data. Mobilising private investment into adaptation in the places that need it most is not primarily a pledging problem. It is an evidence problem. Insurers, blended-finance vehicles, and resilience bonds all price off historical hazard and loss records. Where those records are thin, which is precisely where vulnerability is highest, capital either stays away or prices in a penalty the poorest can least afford.

So broadening the base, done honestly, has a precondition that rarely makes the cover decision. Invest in the recipient-country data systems that let private and emerging-economy finance see the risk clearly enough to move. Otherwise "the private sector will fill the gap" is a sentence that describes capital flowing to the already-visible and away from the already-overlooked.`,
      },
      {
        heading: 'What I Will Be Watching in Antalya',
        content: `When negotiators reconvene in [Antalya in November 2026](https://unfccc.int/cop31/the-road-to-antalya), with Australia steering the negotiations and the Pacific shaping the pre-COP, I will not be reading the communiqué for the size of the number. I will be reading it for four things, all of them about measurement.

First, whether the two-year finance work programme produces a shared accounting methodology that tracks grant-equivalent value and separates new money from rebadged aid. Second, whether the ministerial process starts yielding multi-year, scheduled, verifiable pledges rather than restated ambition. Third, whether the transparency architecture finally treats recipient-country data systems as core finance infrastructure, not back-office statistics. And fourth, whether adaptation, chronically starved relative to mitigation, gets a tracked, ring-fenced share rather than a hopeful adjective.

The NCQG is, for now, a promise about quantity. The work between Belém and Antalya is to turn it into a promise about *verifiable delivery*. That conversion runs straight through the unglamorous machinery of definitions, baselines, and disaggregated national data, the machinery I have spent ten years building in places where it did not exist.

A number agreed in a plenary hall is an aspiration. A number you can track, by country, by sector, by who was actually reached, is a commitment. The road from Baku through Belém to Antalya is the road from the first to the second. We should judge COP31 by how far down that road it travels.

What gets counted gets funded. On the NCQG, we have finally agreed how much. We have not yet agreed how to count. That is the work of Antalya.`,
      },
    ],
    relatedSlugs: [
      'loss-and-damage-fund-make-or-break-year',
      'delta-grade-data-currency-of-climate-finance',
      'cop31-data-making-the-case',
    ],
  },

  'loss-and-damage-fund-make-or-break-year': {
    slug: 'loss-and-damage-fund-make-or-break-year',
    title: "From Pledge to Payout: A Defining Year for the Loss and Damage Fund",
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    date: 'April 2026',
    excerpt:
      "A fund exists when money reaches the people it was built for. By that test, the Loss and Damage Fund is still becoming real. With the first call for funding requests now open, the year between Belém and Antalya is when the Fund either delivers, or doesn't.",
    keywords: [
      'Loss and Damage Fund', 'FRLD', 'COP30', 'COP31', 'Antalya', 'Belém',
      'climate finance', 'Warsaw International Mechanism', 'Santiago Network',
      'Barbados Implementation Modalities', 'World Bank', 'direct access',
      'DELTA Resilience', 'G-DRSF', 'replenishment', 'climate justice',
    ],
    sections: [
      {
        content: `*A fund exists when money reaches the people it was built for. By that test, the Loss and Damage Fund is still becoming real, and the road to Antalya is where it either does or doesn't.*

In 2022, when the world finally agreed to create a fund for loss and damage, I watched the reaction ripple through the humanitarian data community with a wariness that surprised people outside it. We had seen this film before. A mechanism is announced. The announcement is the achievement. Then the slow years begin: the board seats, the hosting arrangements, the eligibility criteria. And somewhere in that machinery the original promise, that money would reach a fishing community whose coastline has already gone, quietly recedes.

Three years on, the [Fund for Responding to Loss and Damage (FRLD)](https://unfccc.int/fund-for-responding-to-loss-and-damage) is no longer an announcement. It has a board, a trustee, a host country, and, as of COP30, an open call for its first funding requests. That is real progress, and I want to give it its due. But the FRLD is now entering the phase where good intentions meet operational reality, and that phase is unforgiving. The road from Belém to [Antalya](https://unfccc.int/cop31/the-road-to-antalya) is the year the Fund stops being an architecture and starts being a payout, or doesn't.`,
      },
      {
        heading: 'What Belém Actually Delivered',
        content: `Let me start with the genuine advances, because cynicism is cheap and the people who built this deserve an accurate ledger.

[COP30 in Belém](https://www.lossanddamagecollaboration.org/resources/what-happened-on-loss-and-at-cop-30) stabilised the loss-and-damage architecture around three load-bearing pillars: the Warsaw International Mechanism (WIM) as the policy umbrella, the Santiago Network as the technical-assistance delivery arm, and the FRLD as the financing instrument. More concretely, on the first day of the conference the Fund launched its call for funding requests for the start-up phase, the [Barbados Implementation Modalities (BIM)](https://www.lossanddamagecollaboration.org/resources/rapid-reaction-launch-of-the-call-for-funding-requests-to-the-fund-for-responding-to-loss-and-damage). Around USD 250 million is allocated to this first window, with developing countries invited to submit requests for projects in the USD 5 to 20 million range.

That is the moment a fund becomes a fund: when a ministry in Tuvalu or Malawi can actually fill in an application. After years of structural debate, the FRLD finally has a front door.

But the proportions deserve honesty. Total pledges to the Fund stand at roughly [USD 750 million](https://compass.climatepolicyinitiative.org/themes/commitments-and-ambition/loss-and-damage). The [UNDRR-cited estimate](https://www.undp.org/geneva/blog/next-chapter-loss-and-damage-after-cop30-building-systems-countries-and-communities-need) of climate-related loss and damage facing developing countries is on the order of USD 580 billion a year by 2030. The Fund's entire capitalisation is roughly one part in eight hundred of a single year's need. That gap is not a criticism of the Fund, which is a genuine achievement won through years of patient negotiation, but a measure of the distance still to travel. Everything that follows has to be read against that ratio.`,
      },
      {
        heading: 'The Replenishment Problem Nobody Wants to Name',
        content: `The politics of the FRLD are dominated by a word that sounds technical and is in fact existential: replenishment.

The Fund was capitalised through voluntary pledges. Voluntary is the operative term. There is no agreed formula tying contributions to historical emissions, no assessed-contribution model of the kind that funds other multilateral institutions, and no trigger that automatically tops the Fund up as it disburses. Each replenishment cycle is therefore a fresh negotiation, vulnerable to the political weather of donor capitals: an election, a budget squeeze, a change of government, none of which has anything to do with whether a cyclone made landfall.

This is the structural fragility at the heart of loss-and-damage finance. A community whose losses are *irreversible*, land lost to the sea, a glacier-fed river gone, a heritage erased, needs a funding source that is *predictable*, because there is no rebuilding cycle to wait for. This means the most irreversible category of climate harm is, for now, supported by one of the least predictable forms of finance. That mismatch is not an oversight. It is the compromise that allowed the Fund to exist at all, and recognising it openly is simply the first step to strengthening it. I would welcome a conversation at Antalya about more automatic, needs-linked replenishment, building on the voluntary pledges that have carried the Fund this far.`,
      },
      {
        heading: 'The World Bank Question',
        content: `The second sensitivity is institutional. The World Bank serves as the FRLD's [interim trustee and the host of its secretariat](https://unfccc.int/fund-for-responding-to-loss-and-damage) for an initial four-year period, while the Fund's Board is hosted by the Republic of the Philippines. This arrangement was hard-won and remains contested.

The case for the World Bank is speed and fiduciary infrastructure. It can move money under recognised safeguards without building an institution from scratch. The case against is everything developing countries have learned from decades of dealing with it: high overheads, conditionalities, slow direct-access accreditation, and a governance structure weighted toward the very countries whose historical emissions created the need for the Fund in the first place. There is a deep discomfort in housing a fund premised on climate justice inside an institution many recipients experience as the opposite.

The interim period exists precisely so this can be revisited. The four-year clock and the agreed performance conditions mean COP31 and COP32 sit squarely inside the window where the question of transition to an independent secretariat becomes live. I do not think the answer is ideological. It is operational. Does the hosting arrangement let money reach vulnerable communities quickly and with low transaction cost, including through direct access rather than only through intermediaries? If the World Bank arrangement delivers fast, low-friction, [country-owned](/blog/building-systems-governments-can-own) disbursement, the case for disruption weakens. If it reproduces the slow, intermediary-heavy patterns recipients know too well, the case for independence becomes overwhelming. Either way, the test is delivery speed to the last mile, and that is measurable.`,
      },
      {
        heading: 'Eligibility: The Quiet Place Where Justice Is Decided',
        content: `Now to the part of the debate I care about most, because it is where my work and this fund collide.

Every fund must decide who is eligible and on what evidence. For loss and damage, that decision is morally loaded and technically treacherous. Define eligibility too narrowly, limiting it to sudden, attributable, headline catastrophes, and you exclude the slow-onset, recurrent, grinding harms that do the most cumulative damage to the poorest. Define it loosely and you invite the accusation that the Fund cannot demonstrate that money tracked to need.

Both horns of that dilemma are, underneath, a data problem. To access the Fund, a country has to substantiate its loss and damage. Substantiation means records: disaggregated, sub-national, credible records of what was lost, where, to whom, and how often. And here is the cruel asymmetry I have written about [before](/blog/invisible-disasters-invisible-funding): the countries with the greatest loss-and-damage exposure are frequently the countries with the weakest loss-and-damage data systems. The places most in need of the Fund are the least equipped to prove it.

I have lived inside this asymmetry. The legacy systems many disaster-prone countries still run, built for retrospective record-keeping, were never designed to generate the high-resolution, internationally comparable evidence a global fund demands. This is exactly the gap that [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), the Disaster and Hazardous Events, Losses and Damages tracking system replacing DesInventar, and the [Global Disaster-Related Statistics Framework (G-DRSF)](https://www.undrr.org/global-disaster-related-statistics-framework-faqs) were built to close: no-threshold recording, sub-national disaggregation by sex, age and disability, and statistical standards that make a national loss record legible to an international board.

The implication for the FRLD is direct and, to me, urgent. Investment in national loss-and-damage data systems is not a parallel technical agenda. It is part of the Fund's own delivery infrastructure. A fund that disburses against evidence, while doing nothing to help the most vulnerable countries generate that evidence, will systematically route money toward the better-documented and away from the genuinely-most-harmed. It will reproduce, in the disbursement of justice finance, the same visibility bias that distorts every other climate-finance channel.`,
      },
      {
        heading: 'The Santiago Network: Bridge or Bottleneck',
        content: `This is precisely why the [Santiago Network for Loss and Damage](https://www.adaptationcommunity.net/news/on-the-road-to-cop30-zooming-in-on-updates-on-loss-and-damage/) matters more than its modest profile suggests. Its mandate is technical assistance, helping countries identify needs, build capacity, and prepare for direct access to the Fund. With more than twenty requests for assistance already lodged, it is becoming the on-ramp between a country's situation and the Fund's front door.

Whether it becomes a bridge or a bottleneck depends on speed and substance. If the Santiago Network helps a vulnerable country stand up the loss-tracking and proposal-development capacity it needs to make a fundable, well-evidenced claim, beginning with the kind of [data ecosystem maturity assessment](/blog/data-ecosystem-maturity-assessment-guide) that tells you what a country can actually report, it closes the gap between pledge and need. If it becomes another slow accreditation gauntlet, it widens it. The COP31 review of the Network's performance should be judged by one question. Is it measurably shrinking the distance between the communities facing irreversible harm and the money meant to reach them?`,
      },
      {
        heading: 'What Antalya Has to Prove',
        content: `I am, on balance, more hopeful about the FRLD than my opening wariness might suggest, but my hope is conditional and it is entirely about execution. By the time delegates gather in [Antalya](https://unfccc.int/cop31/the-road-to-antalya) in November 2026, the Fund will have something it has never had before: a track record. The first BIM funding requests will have been received and, ideally, the first approvals made. We will finally be able to ask empirical questions instead of structural ones.

How long did it take from request to disbursement? What share went through direct access versus intermediaries? Did money reach slow-onset and recurrent harms, or only the photogenic catastrophes? And did the countries with the weakest data systems get help to compete, or were they quietly screened out by the evidence bar?

Those are measurement questions, and I will measure them. Because what ultimately defines a fund is not the pledge but the payout: its speed, its destination, and whether it reaches the people whose losses can never be undone.

A pledge is the beginning of a promise. A payout is that promise kept, reaching a community that has already lost what cannot be recovered. The work between Belém and Antalya is to carry the Fund from the first to the second, and that journey, from commitment to delivery, is the most important one it can make.`,
      },
    ],
    relatedSlugs: [
      'road-to-antalya-ncqg',
      'delta-grade-data-currency-of-climate-finance',
      'invisible-disasters-invisible-funding',
    ],
  },

  'delta-grade-data-currency-of-climate-finance': {
    slug: 'delta-grade-data-currency-of-climate-finance',
    title: 'DELTA-Grade Data: The Emerging Currency of Climate Finance on the Road to COP31',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    date: 'May 2026',
    excerpt:
      "Every climate fund on the road to Antalya disburses against evidence. The countries that can produce DELTA-grade loss data will compete for it. The ones that can't will watch it flow elsewhere, because data sovereignty has become climate sovereignty.",
    keywords: [
      'DELTA Resilience', 'DesInventar', 'G-DRSF', 'climate finance', 'COP31',
      'NCQG', 'Loss and Damage Fund', 'Green Climate Fund', 'Adaptation Fund',
      'data sovereignty', 'risk knowledge', 'disaster loss data',
      'maturity assessment', 'UNDRR Strategic Framework',
    ],
    sections: [
      {
        content: `*Every climate fund on the road to Antalya disburses against evidence. The countries that can produce DELTA-grade loss data will compete for it. The ones that can't will watch it flow elsewhere.*

A few years ago I sat across from a national disaster manager who had just been asked, by a major climate fund, to substantiate his country's flood losses over the previous decade. He had the losses. His communities had lived them. What he did not have was a record that could survive an international reviewer. No sub-national disaggregation, no consistent hazard classification, no continuous baseline. The events were real. The evidence was not fundable. He was, in the most literal sense, asset-rich and data-poor, and in the emerging climate-finance economy that combination is fatal.

I have thought about that meeting often as the COP cycle has turned finance from aspiration into machinery. The [NCQG](https://unfccc.int/NCQG), the [Loss and Damage Fund](https://unfccc.int/fund-for-responding-to-loss-and-damage), the Green Climate Fund, the Adaptation Fund. Every one of them allocates against risk and loss evidence. Much of the conversation, understandably, centres on the *supply* of climate finance: the pledges, the trillions, the donor base. I want to draw attention to something discussed less often: the *demand-side capability* a country needs to absorb it well. On the road to Antalya, I want to make an argument that sounds technical and is actually about justice. High-fidelity disaster data has become the hard currency of climate finance, and the transition to [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) is how vulnerable countries mint it.`,
      },
      {
        heading: 'The Quiet Repricing of Risk Knowledge',
        content: `Something has shifted in the last few years that I do not think the policy conversation has fully metabolised. We have moved, in the words of the [UNDRR Strategic Framework](https://www.undrr.org/about-undrr/strategic-framework), from passive, retrospective loss recording toward the active generation of risk knowledge, and risk knowledge is now the catalytic input to climate finance, not a back-office statistic.

The reason is structural. As the number of funding windows multiplies, so does the demand for evidence, and the reviewers behind each window have grown more sophisticated. They want disaggregation. They want methodologies aligned to recognised standards. They want continuity, so that a 2027 claim can be read against a 2008 baseline. In a resource-scarce environment (and despite the trillion-dollar headlines, the money reaching any single vulnerable country is scarce), the differentiator between countries is no longer whether they have suffered. It is whether they can *demonstrate* that suffering in a form the system will accept.

That is a repricing of risk knowledge, and it has a brutal corollary. The same loss, documented to DELTA-grade standards in one country and recorded in a dusty spreadsheet in another, will attract finance in the first and be invisible in the second. Data fidelity has become a sorting mechanism. I do not think this is how anyone intended climate justice to work. But intentions do not allocate money. Methodologies do.`,
      },
      {
        heading: 'What "DELTA-Grade" Actually Means',
        content: `When I say DELTA-grade, I mean something specific, drawn from the architecture of the system that is now replacing the legacy [DesInventar Sendai](/blog/desinventar-to-delta-resilience) platform across the world.

[DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience) (Disaster and Hazardous Events, Losses and Damages Tracking and Analysis) was co-developed by UNDRR with partners across the UN system to do four things its predecessor could not. It records without thresholds, so the small, recurrent, extensive-risk events that never crossed the old reporting lines finally enter the ledger. It disaggregates losses sub-nationally and by sex, age and disability, so a national figure can be resolved down to the district and the demographic. It is sovereign and country-owned, so governments retain control of their own data rather than surrendering it to an external host. And it is API-ready and interoperable, designed, as I explored in a recent [migration roadmap](/blog/desinventar-to-delta-resilience), to be "human-first but AI-ready," able to exchange data with national statistical offices, meteorological services, and the global frameworks at once.

Underneath sits the standardisation that makes the whole thing legible internationally. The [Global Disaster-Related Statistics Framework (G-DRSF)](https://www.undrr.org/global-disaster-related-statistics-framework-faqs), endorsed by the UN Statistical Commission, gives disaster managers and statisticians a [shared vocabulary and shared standards](/blog/g-drsf-statisticians-disaster-managers). Aligned hazard classifications. Consistent impact indicators. A common definition of what counts as a loss.

The phrase I keep returning to from this work is "one report, two purposes." Data entered once to meet the Sendai Framework's indicators feeds directly into a set of SDG indicators as well: captured once, disaggregated once, used across every global framework a country must report to. That efficiency is not just administrative tidiness. It is what turns a national data system from a compliance burden into a finance-generating asset.`,
      },
      {
        heading: 'The Garbage-In Problem at Trillion-Dollar Scale',
        content: `Here is the part that should worry anyone celebrating the size of the NCQG. A finance goal scaled to USD 1.3 trillion, allocated against evidence that is itself unreliable, does not produce 1.3 trillion dollars of well-targeted resilience. It produces 1.3 trillion dollars chasing whatever the data happens to show, and if the data systematically under-counts the poorest, the money systematically misses them. Scaling finance without scaling data fidelity simply industrialises the existing bias.

This is why I keep returning to one practical point. A maturity assessment is not a delay; it is the investment that ensures the system you build is the system that survives. Before a country migrates to DELTA, it needs an [honest diagnosis](/blog/data-ecosystem-maturity-assessment-guide) across four dimensions I have used repeatedly in the field. Data governance (are the legal mandates and the NDMA-NSO relationship in place to treat data as a public good?). Technical infrastructure (can the hosting and APIs handle high-frequency, increasingly automated data requests?). Data quality and standards (is the historical baseline complete enough to anchor reporting?). And human capacity (can national experts run the system, or will it depend forever on external contractors?).

Skip that diagnosis and you risk a familiar outcome in my field. A polished platform that produces low-fidelity data, which can be harder to work with than no platform at all, because it lends unreliable numbers a credible appearance. I have seen well-funded systems quietly fall out of use a couple of years after the consultants left, because the question of whether the institution could own them was never fully answered. At the trillion-dollar scale of climate finance, weak underlying data is not a small technical issue. It risks steering the largest pool of climate money ever assembled away from where it is most needed.`,
      },
      {
        heading: 'Data Sovereignty Is the Real Stake',
        content: `There is a deeper reason I care about getting this right, and it goes beyond fundability.

For decades, the disaster data of the Global South has lived on someone else's servers, in someone else's schema, governed by someone else's terms. The legacy model normalised a quiet dependency: countries generated the losses, external actors held the records, and the analytical authority, the power to say what a country's risk *is*, sat outside the country. DELTA's sovereign, country-owned design is a direct challenge to that arrangement. It says the national disaster management authority, not an external host, [holds and governs its own risk knowledge](/blog/building-systems-governments-can-own).

That matters enormously for climate negotiations. A country that owns DELTA-grade data walks into a finance conversation as an author of its own risk narrative, able to substantiate its claims on its own terms. A country still dependent on external datasets walks in as a subject of someone else's analysis, negotiating over numbers it cannot fully control. The transition to DELTA is, in this sense, a transfer of analytical power back to the countries that bear the risk. On the road to Antalya, I would frame it bluntly. Data sovereignty is climate sovereignty. The capacity to count your own losses is the capacity to claim your own finance.`,
      },
      {
        heading: 'What This Means for the Road to Antalya',
        content: `So when finance is debated in [Antalya](https://unfccc.int/cop31/the-road-to-antalya) this November, I will be listening for whether the negotiations treat data systems as what they have become (core finance infrastructure) or continue to treat them as "capacity building," a category that, in practice, is too often left under-resourced.

The asks are not exotic. Donors and the climate funds should finance national loss-and-damage data systems, including the DELTA migration and the maturity assessments that precede it, as a first-order investment, because every dollar of that infrastructure unlocks many dollars of well-targeted finance downstream. Fund application processes should explicitly recognise and reward disaggregated, extensive-risk evidence rather than privileging the intensive, headline events that legacy datasets over-represent. And the technical-assistance channels, the Santiago Network among them, should make data-system readiness an explicit deliverable, not an afterthought.

I keep coming back to the disaster manager across that table. His country's losses were real. What he lacked was the currency to convert them into support. The whole promise of the DELTA transition is that no future version of him should ever again be told that his community's suffering does not meet the evidentiary standard, not because the suffering wasn't real, but because the system to record it was never built.

In the climate-finance economy taking shape between Belém and Antalya, evidence is the hard currency. DELTA-grade data is how vulnerable countries mint it. The choice in front of every disaster-prone nation is not whether to migrate. It is whether to arrive at the next decade of climate finance as an author or as a subject. I know which side of that table I am trying to move people toward.

What gets counted gets funded. The countries learning to count themselves, to their own standard, on their own systems, are the ones who will be in the room when the money moves.`,
      },
    ],
    relatedSlugs: [
      'desinventar-to-delta-resilience',
      'g-drsf-statisticians-disaster-managers',
      'invisible-disasters-invisible-funding',
    ],
  },

  'from-early-warning-to-early-money': {
    slug: 'from-early-warning-to-early-money',
    title: 'From Early Warning to Early Action: Why Anticipatory Finance Belongs at the Heart of COP31',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate & Cash',
    pillarColor: '#8B3A2F',
    readTime: '9 min',
    date: 'April 2026',
    excerpt:
      "We can see most climate disasters coming. The question COP31 has to answer is whether the money can move before they arrive, and whether the trigger fires for the communities the forecast keeps missing.",
    keywords: [
      'anticipatory action', 'early warning', 'Early Warnings for All', 'EW4All',
      'forecast-based financing', 'COP31', 'NCQG', 'Loss and Damage Fund',
      'CHIRPS', 'NDVI', 'CERF', 'Anticipation Hub', 'climate finance',
      'GloFAS', 'humanitarian finance', 'pre-arranged finance',
    ],
    sections: [
      {
        content: `*We can see most climate disasters coming. The question COP31 has to answer is whether the money can move before they arrive, and whether the trigger fires for the communities the forecast keeps missing.*

In the 2024 winterisation season in Afghanistan, my team produced a set of maps that, on their face, looked unremarkable: snow cover, snow depth, precipitation and temperature, each compared against prior years. To a casual reader they were just shaded rasters. To the clusters preparing for a hard winter, they were a decision: where to pre-position, before the first households were cut off. That is the entire logic of anticipatory action in one product. You act on the forecast, not on the funeral. The hazard had not happened yet. The point was to move while it still hadn't.

As attention turns to [Antalya](https://unfccc.int/cop31/the-road-to-antalya), much of the climate-finance conversation understandably centres on the *volume* of finance. I would gently add a second question that tends to get less airtime: its *timing*. In disasters, when money arrives can matter as much as how much, because acting early often changes the entire course of a crisis.`,
      },
      {
        heading: 'The Economics We Cite, and Still Find Hard to Act On',
        content: `The case for acting early is, by now, almost a cliché in the resilience world: every dollar spent before a shock is worth several spent after. The [evidence base](https://www.anticipation-hub.org/) for anticipatory action (pre-positioning supplies, releasing cash, evacuating, reinforcing) consistently shows it reduces suffering and cost relative to waiting for the disaster to certify itself. I have written [before](/blog/the-case-for-anticipatory-cash) that anticipatory cash is one of the highest-use instruments we have. Predictable, dignified, and fast.

And yet the dominant model of climate and humanitarian finance remains reactive. Money flows after the flood crests, after the harvest fails, after the displacement. We have built an entire architecture optimised to respond to disasters we could have seen coming weeks out. The reason is not ignorance of the economics. It is that pre-arranged, trigger-based finance requires three things that are genuinely hard to assemble at once: a credible forecast, a pre-agreed trigger, and money that is already committed to move when the trigger fires. Get any one of them wrong and the system either fails to fire or fires into the void.

COP31 is where this stops being a humanitarian side-conversation and becomes central to the finance debate, because the [NCQG](https://unfccc.int/NCQG), the Loss and Damage Fund, and the [Early Warnings for All (EW4All)](https://www.un.org/en/climatechange/early-warnings-for-all) initiative all converge on the same operational question. Can the system act in advance?`,
      },
      {
        heading: 'The Trigger Is a Data Decision in Disguise',
        content: `Here is the part that most finance discussions skip, and the part I cannot stop thinking about.

A trigger, the pre-agreed threshold that releases anticipatory finance, is built from historical data. You set it by looking at the record: how often a hazard of a given magnitude has occurred, and what it did when it did. Rainfall thresholds, river-discharge levels, vegetation-stress indices like the [NDVI and VHI](https://www.undrr.org/understanding-disaster-risk) products I ran monthly in Afghanistan, [SPI](https://library.wmo.int/records/item/39629-standardized-precipitation-index-user-guide) drought indicators, all of them are calibrated against what the data says is normal and what counts as alarming.

Which means the trigger inherits every bias in the underlying record. And as I have argued repeatedly, the underlying record systematically under-counts the small, recurrent, [extensive-risk events](/blog/invisible-disasters-invisible-funding) that grind down the poorest communities. When those events are missing from the historical baseline, the model underestimates how often the hazard actually occurs. The trigger gets calibrated too high. And the pre-arranged finance, designed precisely to protect vulnerable communities, fails to fire for the very people it was meant to reach, because on paper their disaster never quite qualifies.

I have watched the converse work, too. In Ethiopia, the [cash programming I supported](/projects) leaned on climate-risk-informed targeting precisely because we had built the analytical layer to see the shock developing, combining minimum-expenditure-basket data, market assessments, and hazard indicators so the Cash Working Group could position ahead of the crisis rather than chase it. One delivered [CERF](https://cerf.un.org/) multi-purpose cash operation reached roughly 185,000 people, with the overwhelming majority reporting livelihood improvements. That worked because the data was good enough to justify acting early. The lesson generalises and it is uncomfortable: anticipatory action is only as equitable as the data its triggers are built on. Improve the forecast without improving the loss record, and you simply automate the existing blind spots faster.`,
      },
      {
        heading: 'EW4All Is a Finance Problem Wearing a Technology Badge',
        content: `The [Early Warnings for All](https://www.un.org/en/climatechange/early-warnings-for-all) initiative, the UN's drive to cover every person on Earth with multi-hazard early warning, is one of the most important things happening in my field, and it will feature prominently on the road to Antalya. But I want to push against how it is often framed, because the framing shapes the funding.

EW4All is usually presented as a technology and infrastructure programme: more sensors, better forecasts, faster dissemination. All necessary. But a warning that no one can act on is not protection. It is information. The pillar that consistently lags is the one that turns the warning into a response: the pre-arranged finance and the institutional readiness to spend it. I saw this directly: in Afghanistan, the forecasts and the bilingual Dari/Pashto warning products were the *easy* part. The hard part was wiring them to clusters and to money, so that a warning triggered a pre-agreed action rather than a meeting.

So my argument for COP31 is that early warning and anticipatory finance are [the same system](/blog/delta-resilience-early-warning-anticipatory-action), and they have to be funded as one. A warning without committed, fast-moving money is a smoke alarm in a building with no exits. The disaster funds being operationalised, including the FRLD's faster-disbursing windows, should be explicitly designed to support pre-arranged, trigger-based release, not only post-event reconstruction. The "last mile" of EW4All is not a transmission tower. It is a budget line that moves before the hazard does.`,
      },
      {
        heading: 'Slow-Onset Disasters Are the Strongest Case and the Worst Served',
        content: `There is a particular category that exposes the failure most sharply: slow-onset hazards. Drought. Heat. Creeping food insecurity. These are the disasters we can predict furthest in advance, sometimes months, and they are precisely the ones our reactive systems serve worst, because there is no single dramatic moment that triggers the cameras and the cheques.

My clearest memory of this is the 2020 desert locust upsurge in the Horn of Africa, the worst in a generation. Working IM for the FAO-led Agriculture Cluster in Ethiopia during the second swarm wave, the analytical task was to integrate swarm-tracking, vegetation and precipitation data with food-security projections so the response could get ahead of the damage to agro-pastoral livelihoods. The hazard was forecastable. The breeding areas were mappable. The window to act before the swarms matured was real. Whether that window got used came down, every time, to whether finance could move on a forecast rather than a body count.

Slow-onset disasters are the strongest possible argument for anticipatory finance: long lead times, clear indicators, enormous avoidable losses. And they are chronically under-served, because they do not fit the reactive funding cycle. If COP31 wants a concrete test of whether it is serious about anticipatory action, it is this. Does the finance architecture reward acting on a drought forecast in month one, or does it still wait for the famine to be declared in month nine?`,
      },
      {
        heading: 'What I Want From Antalya',
        content: `I am not asking COP31 to discover anticipatory action. The [Anticipation Hub](https://www.anticipation-hub.org/), the forecast-based financing community, and a decade of pilots have already proven it works. I am asking the finance negotiations to stop treating it as a niche humanitarian technique and start treating it as a design principle for climate money.

Concretely, three things. First, the climate and loss-and-damage funds should build in pre-arranged, trigger-based disbursement windows: money that is committed in advance to release on a forecast, with the speed that anticipatory action requires. Second, EW4All financing should be evaluated on the whole chain, all the way to the committed money and institutional readiness at the end of it, not just the forecasting hardware at the front. And third, the one closest to my own work: investment in the historical loss data that triggers are calibrated against, because a trigger built on a biased record protects the already-visible and abandons the already-overlooked.

We can see most of these disasters coming, and have been able to for some time. The unfinished work is not prediction. It is the plumbing that lets money move at the speed of a forecast rather than the speed of the disaster itself. On the road to Antalya, I will be watching the anticipatory-action agenda for one thing. When the warning fires, does support actually move, and does it reach the people the data most often leaves out?

A forecast tells you what is coming. Anticipatory finance decides whether knowing makes any difference. The whole point of seeing the disaster early is to spend before it arrives. Everything else is just a very well-documented response.`,
      },
    ],
    relatedSlugs: [
      'delta-resilience-early-warning-anticipatory-action',
      'the-case-for-anticipatory-cash',
      'road-to-antalya-ncqg',
    ],
  },

  'belem-adaptation-indicators-data-test': {
    slug: 'belem-adaptation-indicators-data-test',
    title: 'Measuring What Works: Helping the Belém Adaptation Indicators Live Up to Their Promise',
    category: 'Technical Deep Dive / Opinion',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '9 min',
    date: 'May 2026',
    excerpt:
      "COP30 finally gave the world a way to measure adaptation. COP31 has to prove that most countries can actually produce the numbers, or the indicators become one more standard the vulnerable are judged against and cannot meet.",
    keywords: [
      'Belém Adaptation Indicators', 'Global Goal on Adaptation', 'GGA',
      'COP30', 'COP31', 'UAE-Belém', 'adaptation finance', 'DELTA Resilience',
      'G-DRSF', 'disaggregation', 'national data systems',
      'data ecosystem maturity', 'NCQG', 'one report two purposes',
    ],
    sections: [
      {
        content: `*COP30 finally gave the world a way to measure adaptation. COP31 has to prove that most countries can actually produce the numbers, or the indicators become one more standard the vulnerable are judged against and cannot meet.*

For most of my career, adaptation has had a measurement problem that mitigation does not. A tonne of carbon avoided is a tonne, anywhere on Earth. But "a community made more resilient" resists that kind of clean accounting. Resilience is local, multi-dimensional, and slow. You can build a seawall and still lose the village to a hazard you didn't model. You can run a flawless early warning system and still measure your success only by the disaster that didn't happen, the hardest thing in the world to count. For years, this is why adaptation lost the funding argument to mitigation. It could not put a defensible number on the board.

[COP30 in Belém](https://www.carbonbrief.org/cop30-key-outcomes-agreed-at-the-un-climate-talks-in-belem/) tried to fix that. After two years of the UAE-Belém work programme, parties adopted a set of indicators, roughly sixty, now widely called the [Belém Adaptation Indicators](https://www.cities-and-regions.org/cop30-outcomes-on-climate-finance-and-loss-damage/), to track progress toward the Global Goal on Adaptation (GGA). On paper this is a genuine milestone. For the first time, the world has an agreed way to ask whether adaptation is actually happening. But I read it through the lens of a decade spent inside national data systems, and what I see is less a finish line than a starting gun. Because an indicator is only as real as a country's ability to report it, and on that, most of the conversation has been silent.`,
      },
      {
        heading: 'An Indicator Is a Promise to Measure',
        content: `There is a comfortable assumption buried in every framework of indicators. That once you have defined what to measure, the measuring will follow. I have spent ten years discovering how false that assumption is.

When I rebuilt a cash-transfer data pipeline in Ethiopia, I found roughly forty per cent of records were missing location fields, not because anyone was careless, but because the system had never been designed to capture them. In Afghanistan, before any analysis was possible, I had to map more than thirty separate disaster-data sources held by different agencies and negotiate the agreements to bring them together, because they had never been built to talk to each other. The lesson, repeated in every country I have worked in, is that the gap between defining an indicator and reporting it reliably is enormous, and it is widest exactly where vulnerability is highest.

So when sixty adaptation indicators are adopted in a plenary hall, my first question is not "are they the right indicators?" It is "who can actually produce them?" A country with a mature, disaggregated, interoperable data system will report against the Belém indicators and use them to substantiate its claims on adaptation finance. A country still running fragmented spreadsheets and paper records will face a new global standard it has no infrastructure to meet, and risk being judged as under-performing when that it is under-instrumented. The indicator framework, like every framework before it, quietly assumes a data capability that the most vulnerable countries do not yet have.`,
      },
      {
        heading: 'The Disaggregation That Decides Everything',
        content: `The Belém indicators inherit a requirement that runs through all the modern frameworks I work with, and it is the requirement I care about most. Disaggregation. An adaptation result averaged across a whole country tells you almost nothing useful. The question that matters is always *who*. Which districts, which households, which women, which people with disabilities, which displaced populations. National averages are where inequality goes to hide.

This is precisely the design principle behind the newer generation of disaster-data systems I have recently begun working with. [DELTA Resilience](https://www.undrr.org/building-risk-knowledge/disaster-losses-and-damages-tracking-system-delta-resilience), [replacing the legacy DesInventar platform](/blog/desinventar-to-delta-resilience), records losses sub-nationally and disaggregates by sex, age and disability. The [Global Disaster-Related Statistics Framework (G-DRSF)](https://www.undrr.org/global-disaster-related-statistics-framework-faqs), endorsed by the UN Statistical Commission, gives disaster managers and statisticians the [shared standards](/blog/g-drsf-statisticians-disaster-managers) that make such disaggregated data comparable across borders. These are not adaptation tools per se, but they are the data backbone that any credible adaptation measurement has to stand on. You cannot report a disaggregated adaptation indicator on top of a disaster data system that only records national totals.

There is an efficiency here that the adaptation community should seize rather than reinvent. The frameworks are converging. Data captured once, to G-DRSF standards, can feed the Sendai Framework, a set of SDG indicators, and now the GGA indicators, the "one report, several purposes" logic I have argued for elsewhere. The worst outcome from Belém would be a parallel adaptation-reporting bureaucracy, disconnected from the disaster-loss and statistical systems countries are already being asked to build. The best outcome is coherence: one disaggregated national data architecture serving every framework at once. That is not a technical nicety. It is the difference between a reporting burden that buries already-stretched national offices and an asset that pays them back across every obligation they carry.`,
      },
      {
        heading: 'Diagnose Before You Measure',
        content: `If COP31 is serious about the Belém indicators, the most useful thing it could fund is not more indicators. It is readiness, an honest diagnosis of whether countries can actually report what they have just committed to report.

I have argued before that a [maturity assessment is not a delay](/blog/data-ecosystem-maturity-assessment-guide). It is the investment that ensures the system you build is the system that survives. Before a country can credibly report against sixty adaptation indicators, someone has to ask the unglamorous questions across the dimensions that actually determine success. Is there a legal mandate and a working relationship between the disaster management authority and the national statistical office, or do they still operate on different planets? Does the technical infrastructure exist to host and exchange the data? Is the historical baseline complete enough to show change over time? And are there national experts who can run the system, or will it collapse the moment external consultants leave?

I have watched well-funded data systems die two years after launch because nobody asked those questions first. Introduce an indicator framework into an institution that cannot yet support it, and you risk the appearance of measurement rather than the real thing, which can mask gaps instead of revealing them. The road from Belém to Antalya is a chance to assess and strengthen national readiness, so that when countries report against the GGA, the numbers carry real weight.`,
      },
      {
        heading: 'The Adaptation Finance Loop',
        content: `This all connects back to the hardest number at COP30: the call to at least triple adaptation finance by 2035, embedded within the NCQG. It was rightly celebrated and rightly [questioned](https://www.eco-business.com/news/analysis-why-cop30s-tripling-adaptation-finance-target-is-less-ambitious-than-it-seems/). Tripling from a low and loosely defined base is less than it sounds, and "adaptation finance" remains slippery enough that tracking it honestly is its own challenge.

But notice the loop. Adaptation finance is supposed to flow toward measured adaptation need and demonstrated adaptation results. The Belém indicators are the instrument for measuring both. So the credibility of the finance target depends on the credibility of the indicators, which depends on the data systems underneath them. A tripling of adaptation finance allocated against weak or biased adaptation data does not produce three times the resilience in the right places. It produces three times the money chasing whatever the data happens to show, and if the data under-represents the most vulnerable, the money follows the data away from them.

This is the same argument I keep making about every climate fund, and the Belém indicators make it concrete. Measurement is not the bureaucratic afterthought to finance. Measurement is what decides whether finance lands where the need is or where the documentation is. Those are not the same place, and the gap between them is exactly where stronger national data systems are supposed to go.`,
      },
      {
        heading: 'What COP31 Should Carry to Antalya',
        content: `I want the adaptation conversation in [Antalya](https://unfccc.int/cop31/the-road-to-antalya) to grow up past the moment of adopting indicators and into the much harder work of making them reportable. That means treating national data-system readiness as a funded, first-order component of the adaptation agenda, not an assumption. It means deliberately wiring the Belém indicators into the disaster-loss and statistical systems countries are already building, through DELTA and the G-DRSF, so adaptation reporting is coherent rather than parallel. And it means insisting on disaggregation as non-negotiable, because an adaptation indicator that cannot tell you *who* was protected cannot tell you whether adaptation is reaching [the people who need it](/blog/the-voices-our-data-systems-silence).

We finally have a way to measure adaptation. That is real, and the people who negotiated it deserve credit. But a ruler is not the same as the ability to use it, and most of the world has just been handed a ruler without being asked whether they have anything to measure with. The work between Belém and Antalya is to close that gap, to make sure the Belém indicators measure adaptation as it is actually lived in the most exposed districts of the most exposed countries, and not just adaptation as it can be documented by those already equipped to document it.

What gets counted gets funded. We have decided what to count. Now we have to make sure everyone can count it, because an indicator the vulnerable cannot report is just one more standard they will be measured against and found wanting.`,
      },
    ],
    relatedSlugs: [
      'desinventar-to-delta-resilience',
      'g-drsf-statisticians-disaster-managers',
      'disaster-loss-data-climate-adaptation',
    ],
  },

  'cop31-data-making-the-case': {
    slug: 'cop31-data-making-the-case',
    title: 'COP31 and Data: Making the Case From the Field',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    date: 'May 2026',
    excerpt:
      "The most important climate finance argument at Antalya will not be made by a negotiator. It was already made, years ago, by communities whose losses no one wrote down. This is what I learned trying to write them down, and why data is now the gatekeeper of climate justice.",
    keywords: [
      'COP31', 'Antalya', 'climate finance', 'Cox\'s Bazar', 'visibility trap',
      'EM-DAT', 'DELTA Resilience', 'Loss and Damage Fund', 'humanitarian data',
      'Afghanistan HSDC', 'Ethiopia cash', 'extensive risk',
      'data sovereignty', 'data infrastructure', 'climate justice',
    ],
    sections: [
      {
        content: `*The most important climate finance argument at Antalya will not be made by a negotiator. It was already made, years ago, by communities whose losses no one wrote down. This is what I learned trying to write them down.*

In Cox's Bazar, in the footprint of the world's largest refugee settlement, I helped run a cash-for-work programme that paid people to plant trees and stabilise slopes. The Rohingya influx had stripped the surrounding hills for fuel and shelter, and the host communities, Bangladeshi villages that had absorbed nearly a million people almost overnight, were living with the consequences. Eroding slopes, failing land, monsoon and cyclone risk pressing in from the Bay of Bengal. We partnered with local disaster management committees, set up the beneficiary targeting and the payment cycles, and wired the field monitoring back to the seasonal contingency planning for the camps.

The programme worked. But the conversation that stayed with me was about something we were *not* funding. The host communities had their own climate losses. Coastal erosion, salinity, storm damage accumulating year after year. Those losses were, in the language of the global system, undocumented. No threshold crossed, no international appeal triggered, no line in any database that a climate fund would recognise. The damage was real. The people were real. The evidence, by the standards of the architecture that moves money, did not exist. And so neither did the funding.

I have carried that asymmetry through every role since, and it is the reason I want to make a specific argument as the world moves toward [COP31 in Antalya](https://unfccc.int/cop31/the-road-to-antalya). The decisive climate-finance fight of this cycle is not really about the size of the pledges. It is about who can prove their losses. Data is not the back office of climate finance. Data is the gatekeeper. And I have spent ten years watching it decide who gets through.`,
      },
      {
        heading: 'What I Learned Negotiating for Numbers',
        content: `When people hear "humanitarian data," they picture dashboards. The reality, in every country I have worked in, is closer to diplomacy.

In Afghanistan after 2021, before I could build anything, I had to find the data. It existed, held by the national disaster authority, by UN clusters, by line ministries, by meteorological services, in more than thirty separate places, in incompatible formats, governed by mutual suspicion. The technical work of integrating it into a single [Humanitarian Spatial Data Centre](/projects), built to support risk-informed humanitarian response planning, was the easy part. The hard part was negotiating the [data-sharing agreements](/blog/the-im-coordination-trap) that made the integration legal and trusted, and then producing the outputs in Dari and Pashto so the national authority could actually use them for its own loss reporting. We ended up running a platform that drew on those sources to serve more than two hundred partners. But the foundation was not code. It was trust, painstakingly assembled, that the data would be handled as a shared public good rather than extracted and taken away.

In Ethiopia, the lesson was about quality. I inherited a cash dataset where roughly forty per cent of records had no usable location. You cannot target a climate-shock-responsive programme on data that cannot tell you where people are. So I rebuilt the pipeline from the point of entry, validation rules, controlled fields, quality checks, not as a technical indulgence but because every downstream decision about who received support depended on it. When the Cash Working Group later positioned ahead of drought, releasing one CERF operation that reached around 185,000 people with most reporting improved livelihoods, it was that boring, invisible groundwork that made acting early defensible.

These are not war stories for their own sake. They are the texture of what "evidence-based climate finance" actually requires on the ground, and it is nothing like the clean abstraction the term implies in a negotiating text.`,
      },
      {
        heading: 'The Visibility Trap',
        content: `Step back from the field and the pattern becomes a structural injustice, and it is the heart of my case for COP31.

Almost every climate fund disburses against risk and loss evidence. The [Loss and Damage Fund](https://unfccc.int/fund-for-responding-to-loss-and-damage), the Green Climate Fund, the Adaptation Fund, the anticipatory-finance mechanisms, all of them, reasonably, want proof. But the proof flows from datasets that were never designed to see everyone. The most-cited global disaster database, [EM-DAT](https://www.emdat.be/), only records events that cross thresholds (ten dead, a hundred affected, an international appeal, a state of emergency) and even [acknowledges itself](/blog/invisible-disasters-invisible-funding) that economic losses in poorer contexts are badly under-reported. The result is a single, devastating statistic I keep returning to: in the 2025 global disaster figures, Africa accounted for nearly nineteen per cent of disaster deaths but well under one per cent of recorded economic losses. African disasters are not cheap. African losses are simply not counted.

This is the visibility trap, and it closes in two stages. First, the small, recurrent, slow-onset hazards that wear down the poorest communities never enter the record. Then, because they are not in the record, the communities that suffer them cannot substantiate a claim on the funds designed to help them. Invisibility in the data becomes invisibility in the finance. The places with the greatest need end up with the weakest evidence, and the architecture, running exactly as designed, routes money toward the well-documented and away from the overlooked.

My host communities in Cox's Bazar were caught in the first stage of that trap. Multiply them by every under-instrumented district on Earth and you have the quiet, structural reason climate finance keeps missing the people it is most meant for.`,
      },
      {
        heading: 'Making a Case for Data in Antalya',
        content: `If I had the floor at [Antalya](https://unfccc.int/cop31/the-road-to-antalya), I would make the case the way I have made it in field offices for a decade. Not as a plea for sympathy, but as an argument about plumbing.

Treat national disaster-data systems as climate-finance infrastructure, and fund them as such. Every dollar invested in a country's ability to record and substantiate its own losses unlocks many dollars of finance that can actually find their target, and protects against the far larger waste of money flowing to where the documentation is rather than where the need is. Build the DELTA migrations and, before them, the honest maturity assessments that decide whether a system will survive its own launch. Wire the funds' application processes to recognise disaggregated, extensive-risk evidence, so the grinding, recurrent losses count and not only the photogenic catastrophes. And make the technical-assistance channels, the Santiago Network among them, deliver data-system readiness as a named outcome, so the countries furthest behind are helped to compete rather than quietly disqualified.

None of this is glamorous. None of it will lead a communiqué. It is exactly the kind of unspectacular, foundational work that determines whether everything above it functions, which is precisely why it gets under-funded, and precisely why I keep insisting on it.

I think often about the host families in Cox's Bazar, planting trees on slopes they were trying to hold together, carrying climate losses that no system had bothered to write down. The tragedy was never that the world lacked compassion for them. It was that the world had no record of them, and in a finance architecture that runs on evidence, to be unrecorded is to be unfundable, no matter how real your suffering.

That is the case for data at COP31. Not data for its own sake. Data as the precondition for justice. The most important argument in Antalya will be about who gets to be visible enough to be helped, and we already know, from a decade of field experience, that visibility is something we build, deliberately, system by system, or fail to build and call it fate.

What gets counted gets funded. What gets missed stays vulnerable. Making the case for data is making the case for the people the data has always left out.`,
      },
    ],
    relatedSlugs: [
      'invisible-disasters-invisible-funding',
      'road-to-antalya-ncqg',
      'building-systems-governments-can-own',
    ],
  },

  'disaster-data-diplomacy': {
    slug: 'disaster-data-diplomacy',
    title: 'Disaster and Humanitarian Data Diplomacy: Negotiating the Numbers Behind Communities in Need',
    category: 'Opinion / Cornerstone',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '10 min',
    date: 'April 2026',
    excerpt:
      "In disaster and humanitarian data diplomacy, the numbers are the easy part. Deciding what they are allowed to mean, to the host government, to affected communities, to a watching world, is often the harder, and more consequential, work.",
    keywords: [
      'humanitarian data diplomacy', 'humanitarian principles', 'JIAF',
      'People in Need', 'data responsibility', 'do no harm', 'IASC',
      'host government relations', 'attention economy', 'mosaic effect',
      'data protection', 'OCHA', 'ICRC', 'CDA Collaborative',
    ],
    sections: [
      {
        content: `*In disaster and humanitarian data diplomacy, the numbers are the easy part. Deciding what they are allowed to mean is often the harder, and more consequential, work.*

Some of the most consequential decisions I have made in a decade of humanitarian data work were never about data at all. They were about a sentence. Whether a needs figure should be published this week or held. Whether a map should show a settlement at village resolution or stop at the district line. Whether a dataset disaggregated by group would help target assistance or quietly hand someone a targeting list of a different kind. These are not technical questions. They are diplomatic ones, and they are decided in rooms where the spreadsheet is the least important thing present.

We talk about humanitarian data as though it were a thermometer. You take the reading, you report the number, the number is the truth. In reality, every figure that leaves a crisis has passed through a series of negotiations. With the host government, over what the data implies about its competence and control. With affected communities, over whether being counted will protect them or expose them. And with the wider world, over how much attention the numbers should attract and at what cost. I have come to think of this as disaster data diplomacy, and it is the part of the job that almost never appears in a methodology note.`,
      },
      {
        heading: 'What Even Counts as a Disaster',
        content: `The diplomacy starts before a single record is entered, with a question that sounds academic and is anything but. What are we going to call this, and what are we going to count?

In the aftermath of a sudden emergency, multiple actors arrive with multiple datasets and multiple definitions. One agency's "affected population" is another's "people in need." A government's official figure and a cluster's assessment can differ by an order of magnitude, and neither is simply lying. They are measuring different things, for different purposes, with different thresholds. My job, repeatedly, has been to sit in the middle of that and negotiate a shared picture that everyone can live with, knowing that whichever numbers we settle on will travel far beyond the room and do work none of us fully control.

This is why the [humanitarian principles](https://www.unocha.org/humanitarian-principles) of neutrality and impartiality are so much harder in practice than on paper. The moment you decide which data sources are credible, you have made a political choice about whose account of the disaster counts. In one operation, the most complete records sat with the national authority but carried the authority's framing. In another, the more independent picture came from open-source satellite analysis but lacked the ground truth only local responders had. Choosing between them, or more often, reconciling them, is not a neutral act of data cleaning. It is a negotiation over whose version of events becomes the official one.`,
      },
      {
        heading: '"Who Is In Need" Is the Most Political Question We Ask',
        content: `If there is a single number that concentrates all of these tensions, it is the People in Need figure, the count at the centre of every humanitarian appeal and intersectoral analysis. I have argued elsewhere that [what gets counted decides who gets funded](/blog/invisible-disasters-invisible-funding). The People in Need figure is where that logic becomes a live negotiation.

On its face it is a technical product, built through severity scoring and intersectoral frameworks like the [JIAF](https://www.jiaf.info/). In practice it is one of the most politically loaded numbers in the entire response. A high figure can be read as an indictment of the government in place, evidence that it has failed to protect or provide for its own people. A low figure can starve a response of the resources real communities urgently need. I have sat in the analysis sessions where those two pressures meet, and the honest truth is that the methodology, however rigorous, never fully escapes them.

What I learned is that you cannot resolve this by pretending the politics away. You manage it by being scrupulous about method and transparent about uncertainty, so that the number can withstand scrutiny from any direction. When a government challenges a needs figure as exaggerated, your defence is not indignation. It is a defensible methodology, clear assumptions, and disaggregation that shows your work. The credibility of the number is what protects it, and protecting the number is, in the end, how you protect the people it represents. Get the method right and you can hold the line in the negotiation. Get it wrong and the figure becomes just another contested claim, easy to dismiss and easy to ignore.`,
      },
      {
        heading: 'Not De-Marketing the Government in the Chair',
        content: `Here is the part that is hardest to convey, and the part I think about most carefully. Effective humanitarian data work in someone else's country requires you to communicate need without turning that communication into a verdict on the administration in place at the time.

This is not about flattering anyone. It is about a practical reality. Response happens with the consent and cooperation of the host authorities, and a government that experiences every dataset as a political attack will, sooner or later, restrict the very data flows the response depends on. I have worked in contexts where the line between "documenting a humanitarian situation" and "embarrassing the state" was thin, contested, and watched closely. Cross that line carelessly and you do not win an argument. You lose access, and the people who pay for that loss are the affected communities, not the analysts.

So a great deal of the diplomacy is about framing without distortion. The same flood losses can be presented as "the scale of the disaster overwhelmed local capacity," which is true and protective of the partnership, or as "the government failed to prepare," which may also be arguable but ends the conversation. In Afghanistan, part of why we produced disaster and needs products bilingually, in Dari and Pashto, and shared open data directly with the national disaster authority, was precisely this. Data offered to a counterpart as a [shared instrument it can use](/blog/building-systems-governments-can-own) is data that strengthens cooperation, while the same data deployed as an external judgement invites the shutters to come down. The aim was never to soften the truth. It was to keep the channel open through which the truth could keep flowing.

There is a real ethical tension here, and I do not want to flatten it. There are moments when the data does implicate those in power, and concealment would itself be a harm. The skill, and it is a skill I am still refining, is knowing the difference between protective framing that keeps a response alive and self-censorship that betrays the people you serve. That judgement cannot be outsourced to a guideline. It is the diplomacy.`,
      },
      {
        heading: 'Do No Harm Is a Data Discipline, Not a Slogan',
        content: `The second negotiation is with the vulnerable people in the data themselves, and here the stakes are not reputational. They are physical.

[Do no harm](https://www.cdacollaborative.org/) is one of the oldest commitments in humanitarian work, and in the data age it has become, quietly, a technical discipline. Every decision about how granular to make a dataset is a decision about exposure. Disaggregating by ethnicity, religion, displacement status, or gender can make assistance far better targeted, and can also, in the wrong hands, become a map of where a persecuted group lives. The same categories that let us [hear the people our systems were built to silence](/blog/the-voices-our-data-systems-silence) can, mishandled, expose them. Geolocating a settlement to help deliver aid can also help someone find it who means harm. The same precision that makes data useful makes it dangerous, and the line between the two depends entirely on context.

I have made these trade-offs in practice. In one displacement response, the political constraints on data sharing were such that the protective move was to lean on open-source remote sensing rather than collect and hold sensitive personal records that could not be adequately secured. In others, the protective move was the opposite: collect carefully, but aggregate before release, publishing at a resolution coarse enough to protect individuals while still steering the response. There is a well-understood "mosaic effect" in this work, where several innocuous datasets combine to re-identify the very people each was anonymised to protect, and guarding against it is now part of the basic craft. The field has matured here, with the [ICRC's Handbook on Data Protection in Humanitarian Action](https://www.icrc.org/en/data-protection-humanitarian-action-handbook) and OCHA's [data responsibility guidance](https://centre.humdata.org/) giving practitioners real standards to work to. But standards inform judgement. They do not replace it. No guideline can tell you, for this group, in this place, this week, exactly how much to show.

The hardest version of this is the conflict between visibility and protection. Vivid, specific, human data drives attention and funding. It also concentrates risk on identifiable people. Every time I have chosen to blur, aggregate, or withhold, I have been trading some measure of advocacy power for some measure of safety, and I have not always found that trade comfortable. But the principle has to hold. The people in the dataset never consented to become evidence, and their safety cannot be spent to strengthen an argument, however good the cause.`,
      },
      {
        heading: 'The Attention Economy of Suffering',
        content: `The third negotiation is with the world, and it is the one we are least honest about.

Humanitarian communication runs on attention, and attention runs on emotion. The starkest number, the most affecting image, the single devastating statistic. These are what cut through a saturated news cycle and move donors. There is nothing inherently wrong with that. People who need help deserve to be seen, and dry, hedged, perfectly responsible data has never once unlocked an emergency appeal on its own. Part of doing this work well is knowing how to make suffering legible to people far away who have the power to respond.

But the attention economy has its own gravity, and it pulls against both of the negotiations above. The framing that generates the most global concern is often the one most likely to antagonise the host government or to expose the most vulnerable. The story that funds the response can be the story that complicates it. So the practitioner sits at a three-way junction, balancing impactful communication that draws the world's attention and resources, against the diplomatic relationships that keep the operation running, against the safety of the people whose situation is being communicated. There is rarely a clean answer. There is only a defensible one, arrived at deliberately rather than by accident or reflex.

What I have tried to hold onto is that all three obligations are real, and none can be allowed to silently win. Communicate too cautiously and you fail the people who need the world's attention to survive. Communicate too aggressively and you may lose the access, or endanger the very people, the attention was meant to help. The discipline is to keep all three in view at once and to make the trade-off consciously, knowing what you are trading and why.`,
      },
      {
        heading: 'The Craft No One Trains You For',
        content: `None of this appears in a data science curriculum. You learn it in the room, usually by getting the balance slightly wrong and watching what happens. A number that travelled further than intended, a map that showed a little too much, a framing that closed a door you needed open. Over time it stops feeling like a series of compromises to the data and starts feeling like the actual work, the part that determines whether all the careful collection and analysis ever does any good.

I have come to believe that disaster data diplomacy is a core humanitarian competency, as important as the statistics and the systems, and far less taught. We train people to build the dataset. We rarely train them to negotiate what it is allowed to mean, to whom, and at what risk. Yet that negotiation is where data either serves vulnerable people or quietly fails them.

The numbers, in the end, are the easy part. Anyone with the right tools can count. The real skill is knowing what the count is for, whose hands it will pass through, and what it might do when it gets there. A disaster figure is never just a fact. It is a fact with consequences, and somebody has to take responsibility for them before it is ever released. For a long time now, in a lot of difficult rooms, that somebody has been me. The work was never really about the data. It was about the diplomacy the data demanded.`,
      },
    ],
    relatedSlugs: [
      'disaster-data-diplomacy-in-fragility',
      'the-im-coordination-trap',
      'politics-of-humanitarian-data-infrastructure',
    ],
  },

  'disaster-data-diplomacy-in-fragility': {
    slug: 'disaster-data-diplomacy-in-fragility',
    title: 'Holding Data Carefully: Disaster Data Diplomacy in Fragile and Conflict Contexts',
    category: 'Opinion / Cornerstone',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    readTime: '11 min',
    date: 'May 2026',
    excerpt:
      "In a stable country, negotiating disaster data is hard. In a fragile one, where the government may be unrecognised, the conflict still live, and the population itself a contested fact, the same negotiation can decide who is reached, who is exposed, and who is simply erased.",
    keywords: [
      'fragile contexts', 'conflict-affected', 'de facto authorities',
      'humanitarian data', 'data responsibility', 'ICRC',
      'do no harm', 'data minimisation', 'mosaic effect',
      'Afghanistan', 'displacement classification',
      'humanitarian principles', 'access', 'neutrality',
    ],
    sections: [
      {
        content: `*In a stable country, negotiating disaster data is hard. In a fragile one, where the government may be unrecognised, the conflict still live, and the population itself a contested fact, the same negotiation can decide who is reached, who is exposed, and who is simply erased. This is the version of the job that keeps me up at night.*

There is a version of humanitarian data work that looks like a profession. Clean intake forms, validated pipelines, a dashboard that updates on schedule. Then there is the version I have spent most of my career doing, where the government holding the data is one the world has chosen not to recognise, where the conflict that caused the disaster has not ended, and where the simple act of recording who was harmed can place them in further danger. The methods are the same. The stakes are not even in the same universe.

I have [written before about disaster data diplomacy](/blog/the-im-coordination-trap), the constant negotiation over what to count, who to call "in need," and what can safely be said out loud. But that framing assumes a baseline of stability, a recognised authority, a functioning settlement between state and citizen, that simply does not exist in the places where humanitarian need is most acute. In fragile and conflict-affected contexts, every one of those negotiations gets harder, sharper, and more dangerous. The data has nowhere safe to land. And the practitioner in the middle is no longer balancing competing interests so much as trying to keep a fragile structure from collapsing onto the people it was meant to shelter.`,
      },
      {
        heading: "The Counterpart Problem: Negotiating With Authorities the World Won't Name",
        content: `In a stable country, you negotiate disaster data with a government that has a recognised mandate, an international seat, and an interest in being seen to respond. In a fragile context, the entity that actually controls territory, holds the records, and grants or denies your access may be one that donors, the UN system, and your own organisation cannot formally recognise. The disaster does not pause for that ambiguity. People still need counting, and the only counterpart in the room may be one you are not supposed to legitimise.

This is the defining dilemma of working in places under de facto authorities, and there is no clean way through it. Refuse all engagement and you lose access to the data, the territory, and ultimately the people. Engage too openly and you risk legitimising an unrecognised authority, breaching donor conditions, or becoming a channel for the political validation that authority craves. I have lived inside this tension. After 2021 in Afghanistan, the humanitarian community had to keep delivering and keep counting in a context where the authorities controlling the country were not recognised and were subject to sanctions, while millions of people remained in desperate need. The data work did not stop. It simply became a continuous negotiation over what could be shared with whom, what counted as technical cooperation versus political endorsement, and how to keep information flowing to those who needed it without handing anyone a propaganda victory.

The instrument I have learned to rely on most here is narrowness. You engage on the specific, technical, humanitarian task and refuse to let the engagement expand into anything that looks like recognition. Data shared to help a line ministry warn its own population of a flood is a different act from data shared to help an unrecognised authority claim international standing, even when it is the same data and the same official. Holding that distinction, in practice, under pressure, when both readings are available to anyone watching, is the diplomacy. It is exhausting, it is contested, and getting it wrong in either direction has real costs. Lost access on one side, complicity on the other.`,
      },
      {
        heading: 'When the Population Itself Is Contested',
        content: `In stable settings, the argument is usually about how many people are in need. In conflict, the argument is often about whether a population should be acknowledged to exist at all.

Displacement is the clearest example. Whether a group is described as refugees, internally displaced, migrants, or by some carefully negotiated phrase that avoids all three is rarely a neutral classification. It carries legal obligations, political claims, and a host government's anxieties about permanence and responsibility. I have worked in responses where the terminology for the displaced population was itself the product of long negotiation, because the host state resisted any language that implied a lasting presence or a recognised legal status. The people were unmistakably there, in their hundreds of thousands. What they could be called, and therefore what they could be counted as, was contested ground.

This matters because counting confers a kind of existence. A population that appears in the data becomes real to the response, to donors, to the systems that allocate help. A population that is defined out of the data, through a classification dispute or a deliberate omission, can be rendered invisible while remaining entirely present. In conflict, that erasure is sometimes the point. Parties to a conflict have clear interests in whose suffering is documented and whose is not, in which displacements are visible and which are denied. The humanitarian data practitioner who insists on counting a contested population is not performing a technical task. They are taking a position, whether they intend to or not, and they had better understand that going in.`,
      },
      {
        heading: 'Do No Harm Becomes Do Not Get People Killed',
        content: `In a stable context, the do-no-harm conversation is about privacy, dignity, and the risk that data exposes vulnerable people to discrimination or exploitation. In an active conflict, the same conversation is about whether your dataset becomes a targeting list.

This is the part of the work that has weighed on me most. When there are armed parties with an interest in knowing where a particular community, ethnic group, or displaced population is concentrated, the disaggregated data that makes assistance precise becomes the data that makes atrocity efficient. Geolocation that helps a convoy find a settlement can help something far worse find it too. Records of who belongs to which group, collected with the best intentions to ensure no one is excluded, can become the most dangerous documents in the country if they fall into the wrong hands or are compelled out of yours. The [ICRC's Handbook on Data Protection in Humanitarian Action](https://www.icrc.org/en/data-protection-humanitarian-action-handbook) and OCHA's [data responsibility guidance](https://centre.humdata.org/) exist precisely because the sector has learned, sometimes tragically, how real this is.

The practical consequence is that in fragile and conflict settings, the protective default inverts. In a stable country you collect richly and protect carefully. In a conflict you often collect deliberately less, because data you do not hold cannot be stolen, subpoenaed, or coerced from you. I have made the choice to rely on open-source and remote-sensing analysis rather than collect and store sensitive personal records that I could not guarantee to keep safe, accepting a less granular picture as the price of not creating a hazard. Aggregation before release stops being good practice and becomes a safety control. The "mosaic effect," where separate harmless datasets combine to re-identify the people each was meant to protect, stops being a theoretical risk and becomes an operational threat model. You start thinking less like a statistician and more like someone responsible for the physical safety of everyone in your files, because that is exactly what you are.`,
      },
      {
        heading: 'Communicating a Crisis Without Fuelling One',
        content: `The third negotiation, the one with the watching world, is also transformed by fragility. Humanitarian communication still runs on attention, and attention still requires the stark figure and the affecting image. But in a conflict, the framing that mobilises the most international concern can also inflame the conflict, endanger access, or be seized by one party as a weapon against another.

Numbers are never inert in a war. A casualty figure, a displacement total, an account of who did what to whom, can become evidence, accusation, and recruitment material all at once. A government or armed group that experiences your data as taking sides will respond accordingly. By closing access, by restricting movement, by treating humanitarian actors as combatants in an information war. So the communication that would be straightforwardly responsible in a stable disaster, name the scale, show the faces, drive the funding, has to be weighed against the risk that vivid documentation becomes fuel. I have sat with the discomfort of knowing that the most powerful way to tell a story was also the most likely to get the channel shut or to put identifiable people in the path of retaliation, and having to choose the quieter, safer telling instead.

This is where the principle of neutrality stops being an abstraction and becomes a survival strategy for the operation and the people in it. It is not that the suffering should be hidden. It is that in a contested environment, how it is communicated determines whether the response survives to keep reaching people, and whether the people in the data survive the attention. The discipline is to make need legible enough to mobilise help, without making it a contribution to the very conflict generating the need. There is no formula for that line. There is only judgement, exercised case by case, with incomplete information and real consequences either way.`,
      },
      {
        heading: 'Why the Hardest Places Have the Worst Data, and Why That Compounds',
        content: `All of this produces a bitter structural result that I keep running into. The contexts where data diplomacy is hardest, fragile, conflict-affected, governed by unrecognised or contested authorities, are exactly the contexts that end up with the thinnest, most fragmented, least trusted data. And that data poverty is not a coincidence. It is the direct product of the very difficulties I have described.

Where authorities are unrecognised, the formal data-sharing architecture that connects national systems to global ones is broken or suspended. Where conflict is live, collection is dangerous, partial, and constantly disrupted. Where populations are contested, whole categories of people are defined out of the statistics. Where do-no-harm requires collecting less, the record is deliberately sparse. Each protective and political necessity, individually justified, leaves the same mark. A weaker evidence base for the places that need help the most. And because so much of the global humanitarian and climate finance architecture allocates against evidence, [thin data becomes thin funding](/blog/invisible-disasters-invisible-funding). The hardest places to count become the hardest places to fund, on top of being the hardest places to live.

I do not have a tidy solution to offer, and I would be wary of any that is presented as simple. What I have is a conviction that this compounding penalty has to be named, because the systems that allocate global attention and resources tend to treat missing data as missing need, when in fragile contexts it is very often the opposite. The need is greatest precisely where it is hardest to document. Building data systems that can function under fragility, that are designed for contested authority, insecure collection, and protective minimalism rather than assuming the stable conditions that rarely apply, is some of the most important and least glamorous work in this field. It is work I am still learning how to do.`,
      },
      {
        heading: "The Work That Doesn't Make the Report",
        content: `None of the negotiations I have described appear in a situation report. The report shows the number. It does not show the week of careful conversation about whether the number could be published without getting someone hurt, or whether engaging the only available counterpart crossed a line, or whether the map should exist at all. In stable contexts that hidden work is significant. In fragile and conflict-affected ones it is the whole job, and the visible data products are merely what is left after every dangerous edge has been negotiated away.

I have come to believe that the ability to do this, to handle data responsibly where there is no recognised authority to hold it, no settled peace to protect it, and no safe assumption that being counted will help rather than harm, is among the most demanding competencies in humanitarian work. It is rarely taught, rarely credited, and almost never visible in the clean outputs it produces. But it is the difference between data that serves people in the worst places on earth and data that quietly betrays them.

The numbers are still the easy part. In fragility, knowing what a number might do, to a government, to a community, to a single identifiable person, before you ever let it out, is not a technical skill at all. It is a form of responsibility you carry alone, in rooms with no good options, on behalf of people who will never see the negotiation that kept them safe. That, far more than any system or statistic, is the work.`,
      },
    ],
    relatedSlugs: [
      'disaster-data-diplomacy',
      'politics-of-humanitarian-data-infrastructure',
      'invisible-disasters-invisible-funding',
    ],
  },

  'protected-into-invisibility-part-1': {
    slug: 'protected-into-invisibility-part-1',
    title: 'Protected Into Invisibility: Data Poverty and Fragility',
    category: 'Opinion / Cornerstone',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '7 min',
    date: 'April 2026',
    excerpt:
      "We promised to leave no one behind. But you cannot reach a person your systems cannot see, and decades of missing data, some of it the unintended cost of our own caution, have quietly turned a promise of inclusion into a machinery of exclusion. Part 1 of 2: the trap, how it compounds, and the uncomfortable role our own protective instincts play in it.",
    keywords: [
      'leave no one behind', 'inclusive data', 'data minimisation',
      'civil registration', 'CRVS', 'data responsibility', 'fragility',
      'surveillance gap', 'data marginalisation', 'CARE Principles',
      'displacement', 'invisible populations', 'data equity',
    ],
    sections: [
      {
        content: `*We promised to leave no one behind. But you cannot reach a person your systems cannot see, and decades of missing data, some of it the unintended cost of our own caution, have quietly turned a promise of inclusion into a machinery of exclusion. This is part one: the trap, how it compounds, and the uncomfortable role our own protective instincts play in it.*

In Afghanistan, my team built a [drought severity map](/projects) to support the response to a deepening agricultural crisis. It did its job well. District by district, it showed where conditions had tipped toward famine, where harvests had failed, where the need for agricultural, nutrition, food, WASH, and health support was most acute. We could point to the worst-hit areas with real confidence. What we could not do, beneath those shaded polygons, was see the affected families as one population. Every partner who managed to collect any semblance of individual-level needs or beneficiary data was holding it inside a silo of its own. Health, Food Security, WASH, Nutrition, Protection. Each partner, though never thorough on its own terms due to known access constraints, yet none could be safely combined with any other. The cost of that fragmentation was not abstract. In this scenario, what usually happens is that some families would end up registering two or three times across sectors and quietly receiving two or three overlapping rounds of assistance, while millions of other families, never picked up by any single partner's pipeline, received nothing at all. Inter-agency synchronisation was the obvious answer, and inter-agency synchronisation was exactly the thing the system had decided it could not afford to do. Each organisation cited reasons that were defensible on their own: data breach risk, donor compliance terms, the IASC's [data responsibility guidance](https://interagencystandingcommittee.org/operational-response/iasc-operational-guidance-data-responsibility-humanitarian-action), the lived memory of registries that had been weaponised in other crises. The collective result was that double counting, the very thing every actor wanted to avoid, became the price we had quietly accepted for protecting the people inside the data. And it was a price no one was prepared to commit any real action to change, even inside the UN. When a cholera outbreak hit, the two organisations holding most of the field-level case data spent more than a month debating whether to share a joint database that could give the response a single, coherent picture. Drought, cholera, food security, health, WASH, shelter, every sector ran into the same wall. A system that allocates assistance against evidence cannot help the person whose evidence cannot be safely combined with anyone else's. A family registered in four silos and a family registered in none start to look uncomfortably similar from where the response has to be coordinated.

That gap has stayed with me because it exposes a paradox at the centre of modern humanitarian and development work. The global community has made "[leave no one behind](https://www.data4sdgs.org/initiatives/inclusive-data-charter)" the moral spine of the 2030 Agenda. And yet leaving no one behind begins with a precondition we have not yet met. Everyone has to be visible to the response, not merely recorded somewhere by someone. The people most at risk of being left behind are, with bitter regularity, the people who are either uncounted in the first place or known only inside a silo no one is permitted to combine with another. We built a promise of inclusion on top of an evidence base structured around exclusion in both forms, and then expressed surprise when the same people kept getting missed.`,
      },
      {
        heading: 'The Scale of the Unseen',
        content: `This is not a marginal problem affecting a few edge cases. It is foundational, and the numbers are staggering once you go looking for them.

Around [800 million people](https://blogs.worldbank.org/en/digital-development/global-progress-in-identification--3-findings-from-the-latest-da) still lack any official proof of legal identity, down from over a billion a decade ago but still a population larger than most continents. More than [110 low and middle-income countries](https://oecd-development-matters.org/2019/12/06/counting-the-invisible-three-priorities-for-strengthening-statistical-capacities-in-the-sdg-era/) lack functional civil registration and vital statistics systems, the unglamorous infrastructure that records births and deaths. The poorest fifth of the global population accounts for [more than half of all unregistered births](https://oecd-development-matters.org/2019/12/06/counting-the-invisible-three-priorities-for-strengthening-statistical-capacities-in-the-sdg-era/). A child never registered at birth begins life statistically invisible, and that invisibility compounds across a lifetime: no documented identity, no claim on services, no entry in the datasets that decide where schools, clinics, and emergency relief are sent.

The result is that national averages, the figures that dominate policy, routinely [mask the people furthest behind](https://www.cgdev.org/blog/leave-no-one-behind-data-disaggregation-needs-catch). Aggregate progress on poverty or school enrolment can conceal stagnation or decline for the hardest-to-reach groups, because those groups are precisely the ones underrepresented in the data that produces the average. Migrants are [largely absent from official global statistics](https://reliefweb.int/report/world/leave-no-migrant-behind-2030-agenda-and-data-disaggregation). Stateless populations are, almost by definition, erased from the records of the states that deny them. The people we most need to see are the people our instruments are worst at seeing.`,
      },
      {
        heading: 'How the Trap Compounds',
        content: `What makes this so hard to escape is that it is not a single gap. It is a feedback loop that deepens with every turn, and I have watched it turn.

It starts with absence. A community is not registered, not surveyed, not connected to the systems that generate data, whether because it is remote, poor, displaced, marginalised, or some compounding combination of all four. Because it is absent from the data, it is absent from planning. Services are not sited there, programmes are not designed for it, funding formulas pass it over, because the evidence that would justify investment does not exist. Because investment passes it over, the community grows more marginalised, more remote from the formal systems, and therefore even harder to count next time. Each cycle, the gap widens. The under-counted become the under-served become the more-invisible. Decades of this produce communities that have been failed so consistently they have effectively dropped out of the official picture of their own countries.

Fragility accelerates every stage of this loop. In conflict-affected and fragile contexts, the registration systems are broken or were never built, collection is dangerous and partial, populations move and scatter, and whole groups may be deliberately excluded from official statistics by authorities with an interest in their invisibility. I have written before about how the hardest places to operate end up with the [thinnest, least trusted data](/blog/politics-of-humanitarian-data-infrastructure), and this is the development-scale version of that same injustice. The places with the deepest, most entrenched need are the places where the evidence of that need is weakest, and the global architecture, which allocates attention and resources against evidence, reads weak evidence as weak need. It is the same dynamic I traced in disaster finance in [Invisible Disasters, Invisible Funding](/blog/invisible-disasters-invisible-funding): missing data is treated as missing problem. In fragile contexts, it is usually the opposite.`,
      },
      {
        heading: "The Part We Don't Like to Admit",
        content: `Here is the uncomfortable turn, and the reason I wanted to write this. Some of the invisibility of people in our development and humanitarian data are the unintended and sometime accepted consequence of our own caution and data protection.

The humanitarian and development sectors have spent the last decade, rightly, building a serious ethic of [data responsibility](https://interagencystandingcommittee.org/operational-response/iasc-operational-guidance-data-responsibility-humanitarian-action): do no harm, minimise what you collect, protect what you hold, never let a dataset become a weapon against the people it describes. I believe in all of it. I have made the protective call myself, choosing to collect less in dangerous contexts precisely because data you do not hold cannot be stolen or coerced from you. That instinct has prevented real harm, and I would defend it again tomorrow.

But every protective choice has a shadow, and we have been slow to look at it honestly. Data minimised is also data missing. Granularity withheld to protect a vulnerable group is also granularity unavailable to advocate for that group, to fund services for it, to prove it was left behind. There is a growing body of work on what scholars have called the [surveillance gap, the harms of extreme privacy and data marginalisation](https://socialchangenyu.com/review/the-surveillance-gap-the-harms-of-extreme-privacy-and-data-marginalization/), and it names something practitioners feel but rarely say. That being unseen does not always mean safety. For the already-marginalised, absence from the data is frequently just another form of exclusion, this one with our fingerprints on it. It is the same pattern I have described in [voice infrastructure inequality](/blog/voice-infrastructure-inequality), where the populations our technologies serve worst are the ones already furthest from the table. We worried, correctly, about the harm of being counted in the wrong way. We attended far less to the harm of not being counted at all.

This is sharpened by the fact that much of our data-protection apparatus was designed in and for the global North, around individual privacy in high-capacity, rights-protecting states. Applied bluntly to populations whose problem is not over-surveillance but non-existence in the record, those frameworks can push the most vulnerable further into the dark. A privacy regime that makes it harder to count an undocumented migrant, a displaced minority, or an informal settlement does not always protect those people. Sometimes it simply guarantees they will remain unfunded and unreached, protected into invisibility. The road to that outcome is genuinely paved with good intentions, which is exactly what makes it so hard to challenge.`,
      },
      {
        heading: 'Where This Leaves Us',
        content: `So we are left with a hard picture. The people we have pledged hardest to reach are the people our systems are structured to miss; fragility deepens the gap at every turn; and some of the missing data is the unintended price of protective choices we made for genuinely good reasons and never went back to weigh. Naming that is not an argument for abandoning data responsibility. It is an argument for finishing it, for completing a half-built ethic that learned how to protect people from the harm of being counted badly but never learned to protect them from the harm of not being counted at all.

That is the problem. I do not think the answer is to swing back toward collecting everything about everyone, and I am wary of anyone who frames this as a simple choice between visibility and protection. There is a better path, one that treats representation as a right while keeping people safe, and it has a name. I propose data equity as the way to address these unintended consequences of data protection, and that is the subject of [part two](/blog/data-poverty-fragility-data-equity-part-2). What data equity actually means, why it is not the opposite of data protection, and what pushing for it looks like in practice.

What gets counted gets funded. What gets missed stays vulnerable. In part one I have tried to show how the missing got missed. In part two, I want to argue we can do something about it.`,
      },
    ],
    relatedSlugs: [
      'data-poverty-fragility-data-equity-part-2',
      'invisible-disasters-invisible-funding',
      'voice-infrastructure-inequality',
    ],
  },

  'data-poverty-fragility-data-equity-part-2': {
    slug: 'data-poverty-fragility-data-equity-part-2',
    title: 'From Data Poverty and Fragility to the Long Road to Data Equity',
    category: 'Opinion / Cornerstone',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '7 min',
    date: 'May 2026',
    excerpt:
      "Data equity is not the opposite of data protection. It is the harder, more relational work that lets people be both seen and safe, on their own terms. Part 2 of 2, on what pushing for it actually requires.",
    keywords: [
      'data equity', 'CARE Principles', 'Inclusive Data Charter',
      'Indigenous data governance', 'data sovereignty', 'representation',
      'civil registration', 'data responsibility', 'leave no one behind',
      'data minimisation', 'inclusive statistics', 'fragility',
    ],
    sections: [
      {
        content: `*In part one I argued that the people we pledge hardest to reach are the ones our data systems are built to miss, and that some of that invisibility is the unintended cost of our own protective caution. This is the answer I promised: data equity, why it is not the opposite of data protection, and what pushing for it actually requires.*

In [part one](/blog/protected-into-invisibility-part-1), I described a [drought severity map](/projects) my team built in Afghanistan that could show, district by district, where famine-like conditions and the need for agricultural, nutrition, food, WASH, and health assistance were most acute, but could not name a single one of the people inside those locations who were meant to receive it. I used that gap to trace a wider trap. A compounding cycle in which the under-counted become the under-served become the more-invisible, accelerated by fragility, and deepened, uncomfortably, by the very data-protection instincts we adopted to keep people safe. I closed by proposing data equity as the way to address those unintended consequences. This is what I meant.`,
      },
      {
        heading: 'Data Equity Is Not the Opposite of Data Protection',
        content: `So is there a balance? I think there is, but only if we stop framing this as a straight trade-off between visibility and protection, because that framing is the trap. The choice is not "expose people" versus "protect people into oblivion." The choice is whether we are willing to do the harder, more relational work that lets people be both seen and safe. That work has a name now, and it is data equity.

Data equity starts from a different premise than data minimisation. It treats representation as a right, not a risk to be managed downward. The [Inclusive Data Charter](https://www.data4sdgs.org/initiatives/inclusive-data-charter) frames it well. The goal is data that is genuinely representative of those usually marginalised, collected for all people regardless of location, ethnicity, gender, age, disability, or status. The point is not to collect more for its own sake, and certainly not to surveil. It is to deliberately close the representation gap that decades of passive and active exclusion have produced, and to do so on terms the represented communities actually control.

That last clause is where the balance lives. The reason granularity feels dangerous is that, historically, it has been extracted from communities and used on them, without their consent or benefit. The answer to that is not less data about the marginalised. It is a different relationship to it. This is precisely what the [CARE Principles for Indigenous Data Governance](https://www.gida-global.org/care), Collective benefit, Authority to control, Responsibility, and Ethics, were built to articulate. That the people in the data should hold meaningful authority over how it is collected, governed, and used. Pair CARE-style governance with the technical discipline of data responsibility and you get something better than minimisation. You get data that is granular enough to make people visible to the systems that serve them, and governed tightly enough that the visibility does not become exposure. Seen and safe, on their own terms, rather than absent and abandoned in the name of protection.`,
      },
      {
        heading: 'What Pushing for Data Equity Actually Looks Like',
        content: `I am wary of essays that diagnose a deep structural problem and then resolve it with three bullet points, so let me be honest about scale. Nothing here is quick, and some of it runs against the grain of how the sector is funded. But the direction is clear, and it is actionable.

It means treating the foundational systems, civil registration, legal identity, inclusive national statistics, as core development infrastructure deserving sustained investment, not as technical afterthoughts. A child registered at birth is a child the system can never again pretend not to see. It means building data systems designed for the conditions that actually prevail in fragile and marginalised contexts, contested authority, insecure collection, low trust, rather than systems that assume the stable conditions of the places that designed them. It means funding disaggregation deliberately, because the groups who are left behind are invisible in any aggregate, and an average will never reveal them. It means shifting governance toward the communities in the data, so that being counted becomes something done with people rather than to them, which is also, not coincidentally, what makes granularity safe enough to be worth having, and which echoes the case I made in [The Voices Our Data Systems Were Built to Silence](/blog/the-voices-our-data-systems-silence) and in [building systems governments can own](/blog/building-systems-governments-can-own). And it means the institutions that allocate global resources learning to read missing data as a warning sign rather than an all-clear, because in the places that matter most, the silence in the dataset is the loudest signal there is.

None of this dissolves the tension I sat inside throughout part one. Protection and visibility will always pull against each other, and the balance is genuinely hard to strike, especially when there are real people in front of you. But the current equilibrium is not neutral. It tilts, decade after decade, toward the invisibility of the already-excluded, and it does so partly through choices we made for good reasons and never revisited. Data equity is the attempt to retune that balance deliberately, with the people most affected holding the dial, rather than letting it settle by default in the place that leaves them out.`,
      },
      {
        heading: 'The Promise We Can Still Keep',
        content: `I still think about the families behind that severity map, the ones the data could place inside a shaded district but never name. We have spent years promising people like them that no one will be left behind. The quiet, difficult truth is that the promise cannot be kept by goodwill or funding alone. It can only be kept if we are willing to see people, carefully, accountably, and with their consent, because a person no system can see is a person every system will eventually fail.

Data equity is not a software feature or a single reform. It is a decision to finish the ethic we started. To keep everything we learned about protecting people from the harm of being counted badly, and add to it an equal commitment to protecting them from the harm of not being counted at all. Leaving no one behind was always, underneath the slogan, a data problem. It is long past time we treated it like one.

And here is the revelation in that, the part I wish we said aloud more often. The barrier was never our compassion. We have never lacked the will to include people. We have lacked the means to see them. "Leave no one behind" asks us to carry everyone forward while staying quiet on the humbler act everything else depends on, which is seeing them in the first place. To be counted, carefully and on your own terms, is the first form of being valued by a system. It is the moment a person stops being an abstraction and becomes someone a clinic, a cash transfer, or a convoy can actually be sent toward. So the promise is not waiting on a greater conscience or a larger cheque. It is waiting on a choice we are fully able to make. To build the systems that let the unseen become visible, safely, and to treat that visibility as the foundation of the dignity we keep pledging. The people we have promised not to leave behind are not lost. They are uncounted. And what is uncounted can still be counted safely, and with dignity, the moment we decide it must be.`,
      },
    ],
    relatedSlugs: [
      'protected-into-invisibility-part-1',
      'the-voices-our-data-systems-silence',
      'building-systems-governments-can-own',
    ],
  },
  'el-nino-cascading-hazards-anticipatory-action': {
    slug: 'el-nino-cascading-hazards-anticipatory-action',
    title: 'El Niño in 2026, the Cascading Hazards and the Timely Opening for Early Action',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '10 min',
    date: 'June 2026',
    excerpt:
      "A strong El Niño is a forecast we can already read. It is also a test of whether we are willing to act on what we know, in the closing months before what we know becomes what we are too late to prevent. The 2026–2027 cycle is the one in which the system either uses what it built, or does not.",
    keywords: [
      'El Niño', 'El Niño 2026', 'El Niño 2027', 'anticipatory action',
      'anticipatory finance', 'cascading hazards', 'compound shocks',
      'humanitarian forecasting', 'CERF', 'IFRC DREF', 'Start Fund',
      'WFP Anticipatory Action Fund', 'FAO SFERA', 'COP31', 'climate finance',
      'Anticipation Hub',
    ],
    sections: [
      {
        content: `*A strong El Niño is a forecast we can already read. It is also a test of whether we are willing to act on what we know, in the closing months before what we know becomes what we are too late to prevent.*

The [World Meteorological Organization, in its early-June 2026 update](https://wmo.int/news/media-centre/wmo-prepare-el-nino), confirms that El Niño conditions are developing. WMO puts the likelihood of an El Niño event during June to August 2026 at around 80 percent, with probabilities near or above 90 percent that the event will continue at least into November. Most forecast models suggest the event will be at least moderate, with the possibility of reaching strong intensity, and El Niño cycles typically last nine to twelve months once established. That is not a prediction in the loose sense. It is a forecast on which an entire architecture of anticipatory response now rests. The question is no longer whether the next twelve months will see a major El Niño-driven shock. The question is whether the system that has been built to act before the shock arrives will actually do so this time, or whether we will once again let the window close and respond at twice the cost to half the people.

I have watched the field move from a posture of "we cannot see this coming" to one of "we can see it coming, and we have an operational answer." The technology has arrived. The financing instruments exist. The frameworks are in place. What remains, with a strong El Niño now developing, is the decision.`,
      },
      {
        heading: 'The Hazard Map We Already Have',
        content: `El Niño is one of the few climate phenomena that does not require a leap of inference. The geographies it tends to hit, and the directions in which it tends to pull them, are well understood and stable across cycles. [FAO's June 2026 agricultural risk assessment](https://www.fao.org/newsroom/detail/el-ni%C3%B1o-is-coming.-here-is-where-the-risks-to-agriculture-are-highest/en) puts the current cycle at greater than 50 percent probability of agricultural drought across large parts of southern Africa, including Namibia, Botswana, Angola, Zambia, Zimbabwe, South Africa and parts of Mozambique and Madagascar. The same assessment puts Central America and the Caribbean at 70 percent probability of below-normal rainfall, with the highest risk concentrated along the Dry Corridor, in Colombia and Venezuela, and in Cuba, the Dominican Republic and Haiti. FAO extends the agricultural drought belt across the Sahel from Senegal through Côte d'Ivoire, Ghana, Togo, Benin and Nigeria, eastward into Ethiopia and Sudan, and into Asia from Pakistan and India through Myanmar, Thailand, Cambodia and Viet Nam, and on to the Philippines, Indonesia and Timor-Leste.

The scale of what this can do is not hypothetical. As [documented by FAO](https://openknowledge.fao.org/server/api/core/bitstreams/a80370e6-1845-4c16-aa6f-0b817b99032f/content), the 2015–2016 El Niño affected more than 60 million people across eastern and southern Africa, the Horn of Africa, Latin America and the Caribbean, and the Asia-Pacific region. The pathway was multi-sectoral: severe drought, flooding and temperature anomalies cascading into crop failures, livestock losses, food insecurity, water-system stress, and the protection and displacement consequences that follow when livelihoods collapse across whole agro-ecological zones at once. The 2023–2024 cycle hit southern Africa hard enough to trigger region-wide drought emergencies, parallel emergency appeals through OCHA, WFP and FAO, and the loss of pasture and livestock that, in FAO's framing, "quickly becomes a loss of assets and wealth" in regions where livestock underpins both food security and household income.

What is different now, and what the rest of this argument turns on, is that the forecast is reaching us at a moment when we already have the instruments to translate it into protection. The map exists. The triggers exist. The funding instruments exist. What is being tested is institutional speed.`,
      },
      {
        heading: 'Why a Climate Shock Is Always a Development Shock',
        content: `El Niño never acts in isolation. It interacts with existing conflict, debt distress, agricultural fragility, public-health systems and the climate trajectory it is itself layered onto. In every cycle, the same pattern repeats. Rainfall anomalies drive crop failures and livestock losses. Crop failures and livestock losses drive food insecurity, distress sales of productive assets, and migration. Migration drives protection risks. Public-health pressure follows the disrupted water, sanitation and nutrition pathway. By the time the formal humanitarian appeal is launched, what started as a meteorological deviation has become a multi-sectoral, multi-year erosion of the household and institutional capacity the country needs to absorb the next shock.

Macroeconomic research on the cost of strong El Niño cycles consistently finds measurable GDP losses in vulnerable countries and lifts in public debt that weaken the fiscal capacity of the very governments expected to lead the response. The implication is the one most practitioners have only described qualitatively. El Niño is a development shock as much as a climate shock. Viewed in that frame, anticipatory action is not a humanitarian nice-to-have. It is the cheapest available form of fiscal protection for low-income states already running thin.

The cascading nature of the impact also means there is no single window for action. The agricultural window opens first, before planting decisions are made for the affected season. The food-security and protection windows open as those decisions take effect. The health window opens as floods or drought interact with disease vectors. Each sector has its own trigger window, and each window forfeits its highest-return action if missed. I have written before about why building [systems governments can actually own](/blog/building-systems-governments-can-own) is the precondition for any of this to work at scale, and the cascading geography of El Niño impacts is exactly the test case that argument was built for.`,
      },
      {
        heading: 'The Evidence Has Caught Up to the Argument',
        content: `For most of the last decade, the operational case for anticipatory action rested on logic. It was obvious that preventing a livestock loss should cost less than replacing the herd, that a cash transfer arriving before a price spike should reach further than one arriving after. The argument was intuitive, but the evidence base was thin.

That has changed. The pattern is now visible across geographies and methodologies, and it is unusually consistent.

In the Horn of Africa, [modelling published on the economics of resilience and early action across Ethiopia, Kenya and Somalia](https://reliefweb.int/report/somalia/economics-resilience-drought-ethiopia-kenya-and-somalia) finds that every US$1 invested in resilience and anticipatory action generates between US$2.3 and US$3.3 in net benefits once avoided losses are counted. That is not an outlier. The 2023–2024 El Niño drought response in southern Africa, [evaluated by CGIAR](https://cgspace.cgiar.org/items/cf9261e1-d625-416f-9c0f-ce94a9b8b5ef), yielded a 30 percent net benefit on anticipatory investment. The same dollar, delivered early, carried the impact of US$1.30 delivered after the worst of the drought had landed.

[Multi-country analysis from FAO](https://openknowledge.fao.org/items/4aef7f11-07ce-487e-bfd3-cb9540cfd213) on anticipatory action ahead of drought finds avoided losses worth up to US$3 for every US$1 invested. The [Anticipation Hub's "An approach that works" briefing](https://www.anticipation-hub.org/Documents/Briefing/An_approach_that_works_FINAL.pdf) consolidates this into the most defensible operational claim the sector currently has. The [FAO/OCHA/WFP evidence base](https://openknowledge.fao.org/items/1e8372a0-97e7-4284-b2e3-5ecf2f773265) reinforces the same finding. Anticipatory action, evaluated on its own terms, produces multiples of post-event response in both cost-efficiency and outcome quality.

When evidence converges this consistently across institutions, methodologies and contexts, the appropriate response is no longer to ask whether it is true. It is to ask why the system still defaults to post-event response.`,
      },
      {
        heading: 'Why This Time Is Different',
        content: `The case for acting on the 2026–2027 El Niño is not only an evidence case. It is an infrastructure case. We have never entered an El Niño cycle as well-prepared as this one.

Anticipatory action frameworks are now operational across dozens of countries through [FAO's anticipatory action portfolio](https://www.fao.org/emergencies/partners/sfera/en), the [WFP Anticipatory Action Fund](https://www.wfp.org/anticipatory-actions), [IFRC's DREF](https://www.ifrc.org/happening-now/emergency-appeals/ifrc-disaster-response-emergency-fund), the [Start Network's Start Fund](https://startnetwork.org/funds/global-start-fund) and [Start Ready](https://startnetwork.org/funds/start-ready), backed by improving impact-based forecasting and stronger inter-agency coordination. For the 2026 cycle, these agencies have already activated frameworks for El Niño-driven hazards in Central America, East Africa and the Sahel, releasing pre-arranged anticipatory funding to communities in advance of the impact. That is not a sign that the system has solved the problem. It is a sign that the system can act at scale before the worst of the impact lands.

What makes this moment unusual is the alignment of three things at once. A clear forecast on a well-understood hazard. A convergent evidence base on the returns of acting early. And an operational architecture that has reached the point where activation is the binding decision, not the binding capability.

Regional preparedness is moving in step. In Latin America and the Caribbean, the [IFRC has set out how the region is preparing](https://www.ifrc.org/article/2026-el-nino-how-are-we-preparing-its-impact-latin-america-and-caribbean) for the 2026 El Niño impact, with national societies pre-positioning supplies and triggering anticipatory protocols across drought- and flood-exposed areas. In other words, the constraint is no longer technical. It is whether the institutions that hold the trigger are willing to pull it.`,
      },
      {
        heading: 'The Window Is Already Closing',
        content: `The most important thing to understand about anticipatory action is that its effectiveness is not constant across the timeline of a hazard. It is highest in the narrow window when the forecast is reliable enough to justify confident action and the lead time is long enough for the action to matter. Outside that window, every week of delay erodes the return.

Once impacts begin to materialise, the calculus inverts. The cheapest interventions, the early water-system maintenance, the pre-positioned livestock fodder, the cash transferred before food prices spike, are no longer available. What replaces them is more expensive, less effective, and reaches fewer people. The argument that "we should wait until we are sure" sounds prudent in a conference room. In an operational sense, it forfeits the most cost-effective chance to protect lives and livelihoods.

For the 2026–2027 cycle, the window is narrowing now. The agricultural decisions for the affected season in southern Africa are being made in the coming weeks. The pre-positioning decisions for eastern Africa flood-prone districts have a lead time of months, not seasons. The window is not closing dramatically. It is closing by attrition, one missed agricultural cycle and one delayed pre-positioning decision at a time.

The binding constraint, in other words, is speed of decision and flexibility of funding. Not capability.`,
      },
      {
        heading: 'What Different Actors Have to Do Now',
        content: `The audience for this argument is not a single institution. It is a set of actors with different levers, and the call to action looks different from each desk.

For humanitarian practitioners, the immediate task is to read the forecasts for location-specific risk, unlock the flexible and pooled financing that can move on a calendar a hazard sets, coordinate under humanitarian leadership and the AA Working Groups already in place, and treat trigger readiness, threshold settings, pre-positioning and simulation as live operational priorities for the next quarter. The single most important shift is to fund local actors to lead the response, not merely to implement an externally designed one. Local responders hold the operational knowledge the trigger architecture needs to land usefully, and the experience of the last two cycles is that the responses that worked best are the ones that local institutions owned.

For the wider humanitarian community, the call is to design for compounding drivers. An anticipatory response that addresses drought but not the conflict context it interacts with, or the price-shock economy it lands in, or the public-health vulnerability it amplifies, will run into the same wall the sector keeps hitting. El Niño 2026–2027 is multi-sectoral by design. Single-sector responses, however well executed, will under-perform what a coordinated one could deliver.

For donors, the lever is the one that decides whether any of the above is actually possible. Disbursements need to accelerate. No-regrets investments need backing. Reprogramming flexibility needs to be available where existing portfolios can be repurposed. Existing pooled instruments, [CERF](https://cerf.un.org/), [IFRC DREF](https://www.ifrc.org/happening-now/emergency-appeals/ifrc-disaster-response-emergency-fund), the [Start Fund](https://startnetwork.org/funds/global-start-fund) and [Start Ready](https://startnetwork.org/funds/start-ready), [FAO SFERA](https://www.fao.org/emergencies/partners/sfera/en), and the [WFP Anticipatory Action Fund](https://www.wfp.org/anticipatory-actions), need to be scaled and crisis modifiers fast-tracked. Anticipatory action does not lack institutional homes. It lacks the speed at which money moves through them.`,
      },
      {
        content: `A strong El Niño is one of the only major shocks the modern climate system gives us with this much notice. The forecast is in. The evidence is in. The operational architecture is in. The tools, the instruments and the lessons of the last cycle are all on the table. What remains is the decision to act inside a window that will not stay open.

We have spent a decade building the capacity to read this kind of forecast and act on it. The 2026–2027 cycle is the test of whether we will let what we built do its job.

*Tags: Anticipatory Action · Early Warning · Climate Finance*`,
      },
    ],
    relatedSlugs: [
      'anticipatory-action-data-evidence',
      'from-early-warning-to-early-money',
      'delta-resilience-early-warning-anticipatory-action',
    ],
  },
  'anticipatory-action-data-evidence': {
    slug: 'anticipatory-action-data-evidence',
    title: 'Anticipatory Action and the Data Evidence: Why Waiting Is No Longer Caution',
    category: 'Opinion / Cornerstone',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    readTime: '9 min',
    date: 'June 2026',
    excerpt:
      "The 2023–2024 El Niño response delivered a 30 percent efficiency gain on every dollar spent early. Horn of Africa modelling shows US$2.3 to US$3.3 in net benefit per dollar. Multi-country analysis puts avoided losses at up to US$3 per US$1. The evidence has converged. The only barriers left are the speed of decisions and the flexibility of funding.",
    keywords: [
      'anticipatory action', 'anticipatory cash', 'anticipatory finance',
      'El Niño 2026', 'evidence-based humanitarian action', 'return on investment',
      'CERF', 'IFRC DREF', 'Start Fund', 'WFP Anticipatory Action Fund',
      'FAO SFERA', 'impact-based forecasting', 'resilience compounding',
      'cash transfer programming', 'AA frameworks',
    ],
    sections: [
      {
        content: `*The 2023–2024 El Niño drought response in southern Africa is the cleanest piece of evidence the anticipatory action field has produced. The lesson is not theory. It is what happened the last time the system tried to act early, and it worked.*

A few years ago I was in my office attempting a pilot design for drought anticipatory action triggers for a humanitarian response in Afghanistan. The forecast layers were good. The food-security data was current. The pre-positioning logistics were in place. What was missing was the institutional permission to release the funding against a forecast rather than against an observed impact. The conversation that day was about evidence. We had no recent, attribution-clean case study showing that anticipatory disbursement actually outperformed reactive disbursement at the same scale. So the decision was deferred. The drought arrived. The response happened later, at higher cost, to fewer people.

Two years on, the evidence the field then lacked is on the table. The argument for acting early is no longer an appeal to logic. It is a citation. And with [a strong El Niño now developing through 2026, per WMO](https://wmo.int/news/media-centre/wmo-prepare-el-nino), the question is whether the data has finally outpaced the institutional caution that used to be its only counterweight.`,
      },
      {
        heading: 'The Evidence Is Unambiguous',
        content: `The cleanest case study the field has is the 2023–2024 southern Africa El Niño drought response, [evaluated by CGIAR](https://cgspace.cgiar.org/items/cf9261e1-d625-416f-9c0f-ce94a9b8b5ef). Every dollar of anticipatory investment delivered early carried the humanitarian impact of US$1.30 delivered later. A 30 percent efficiency gain on the identical dollar.

Translate that operationally. For a cash transfer coordinator, that means the same transfer envelope reaches further. For a food-security programme, that means the same food basket prevents more acute malnutrition. For a multi-cluster response, that means the same overall financing covers more households at the same level of protection. Thirty percent is not a marginal improvement. In an environment of stagnant humanitarian funding and rising needs, it is the difference between meeting the appeal and falling short.

The southern Africa finding is not an outlier. It sits inside a convergent body of evidence. [Modelling on the economics of resilience and early action across Ethiopia, Kenya and Somalia](https://reliefweb.int/report/somalia/economics-resilience-drought-ethiopia-kenya-and-somalia) finds US$2.3 to US$3.3 in net benefits per US$1 invested. [Multi-country analysis from FAO](https://openknowledge.fao.org/items/4aef7f11-07ce-487e-bfd3-cb9540cfd213) puts avoided losses at up to US$3 for every US$1 spent ahead of drought. The [FAO/OCHA/WFP evidence base on anticipatory action](https://openknowledge.fao.org/items/1e8372a0-97e7-4284-b2e3-5ecf2f773265) consolidates the case across geographies. Tufts and colleagues have separately mapped the [landscape of anticipatory action for health](https://fic.tufts.edu/wp-content/uploads/Landscape-of-AA-for-Health.pdf), with parallel findings on the value of acting before the disease pathway opens.

Three things are worth noting about this evidence. It is recent enough that the institutional and operational conditions still hold. It is methodologically diverse enough that the result is not an artefact of one evaluation framework. And it is geographically distributed enough that it cannot be dismissed as a single-context success. This is not theory. This is what the system did when it tried.`,
      },
      {
        heading: 'The Lives-Saved Argument the Data Underweights',
        content: `The ROI figures are the easy part of the argument. They are quantifiable, defensible and powerful in budget conversations. But they sit on top of a deeper set of outcomes that no dollar figure can fully represent, and those outcomes are the actual case for acting early.

The [2023–2024 southern Africa anticipatory response reached almost 2 million people](https://cgspace.cgiar.org/items/cf9261e1-d625-416f-9c0f-ce94a9b8b5ef) before the worst drought impacts hit. That number, read in operational detail, describes households that did not have to sell their livestock at distress prices. Children who did not slip into acute malnutrition because the cash transfer reached the household before food prices spiked. Families who did not split because the income source held. Communities that did not fragment into migration because the productive assets the local economy depends on were preserved.

Early cash means food bought before prices spike. Early water-system maintenance and pre-positioning means disease outbreaks contained before they spread. Early livestock support means herds not decimated. Early protection programming means protection risks that never become protection crises. None of those outcomes turn up clearly in a cost-benefit ratio. All of them are the actual purpose of the response.

The quantitative case is necessary because it gets the conversation through the budget meeting. The qualitative reality is suffering prevented at a scale a dollar figure cannot hold. We should make both arguments, in that order, and resist the temptation to let the easier metric crowd out the harder one.`,
      },
      {
        heading: 'The Compounding Effect of Acting Early',
        content: `Beyond the immediate efficiency and humanitarian arguments lies the most under-appreciated case for early action. Anticipatory response preserves the foundations of resilience that future shocks will land on.

The mechanism is straightforward and visible across every protracted-crisis context I have worked in. When a household is forced to liquidate productive assets to survive a shock, the household enters the next shock weaker. When farmers abandon fields, the social capital and local agricultural knowledge that the next season depends on is partly lost. When children are pulled from school during a drought, their lifetime earnings trajectory bends in ways the household will not recover from. When families fragment under migration pressure, the support networks that absorb the next shock are no longer in place.

Each shock that hits a household at depleted capacity erodes the base from which it absorbs the next. The trajectory is downward. Anticipatory action interrupts that trajectory. By preserving livestock, productive assets, family structures, school enrolment and local knowledge, it allows households to enter the next shock with their base intact. Resilience compounds. So does its erosion. The choice between early and late action is, in part, a choice between which of those compounding effects we put under way.

This logic is decisive in the Horn of Africa contexts I know best, in Ethiopia and Somalia, where conflict is ongoing, the climate trajectory is worsening, and shocks land before recovery from the previous one has completed. In those settings, the difference between acting early and acting late is the difference between communities that absorb shocks repeatedly and communities that fragment permanently. That is not a technical preference. It is a policy choice about which institutions and which households still exist a decade from now.`,
      },
      {
        heading: 'The Forecasting and Financing Have Caught Up',
        content: `The standard objection to acting on a forecast used to be that the forecast was not reliable enough, the financing was not flexible enough, or the operational architecture was not in place to translate a trigger into a response at scale. None of those objections still survives the current state of the field.

Forecasting has matured beyond the threshold the early debate set. Multi-model ensembles produced by national meteorological agencies and regional climate services are now reliable enough to trigger action with operational confidence on a range of slow-onset hazards. Impact-based forecasting, the discipline of moving from "drought is coming" to "drought will cut forage by 40 percent in this pastoral zone" or "flooding will block access to these health facilities for these days," has moved from research into operational use. It enables specificity. Specificity enables precise targeting. Targeting is the difference between cash that reaches the right household and cash that does not.

The financing architecture is operational. [CERF](https://cerf.un.org/), [IFRC DREF](https://www.ifrc.org/happening-now/emergency-appeals/ifrc-disaster-response-emergency-fund), the [Start Fund](https://startnetwork.org/funds/global-start-fund) and [Start Ready](https://startnetwork.org/funds/start-ready), [FAO SFERA](https://www.fao.org/emergencies/partners/sfera/en) and the [WFP Anticipatory Action Fund](https://www.wfp.org/anticipatory-actions) collectively form a financing layer that did not exist a decade ago. Pre-arranged agreements can disburse in days, and anticipatory action frameworks are now operational across dozens of countries through these agencies and a broader community of practice that has matured significantly over the last five years.

The data and delivery infrastructure is in place. Mobile money allows cash to reach a household in minutes once the trigger fires. Pre-positioned supplier networks shorten the delivery chain. SMS-based early warning bridges the last mile to affected populations. Satellite monitoring produces the impact data the trigger architecture depends on. And, as I have argued in my work on [DELTA Resilience as the data backbone for anticipatory action](/blog/delta-resilience-early-warning-anticipatory-action), the loss-data infrastructure that lets a trigger fire on the right threshold is finally being treated as essential infrastructure rather than optional reporting.

There is one further enabler that deserves naming. Locally-led anticipatory action, with community knowledge recognised as essential rather than peripheral, is finally beginning to receive its own funding lines. The evidence base from the last two cycles is unambiguous that the responses that worked best were the ones that local institutions and local actors led. The architecture is starting to align with that finding.`,
      },
      {
        heading: 'The Argument, Stated Plainly',
        content: `In June 2026, with [a strong El Niño developing, per WMO](https://wmo.int/news/media-centre/wmo-prepare-el-nino), three facts stack in favour of acting now.

The recent evidence on anticipatory investment is unambiguous. The 2023–2024 southern Africa response delivered a 30 percent efficiency gain. Horn of Africa modelling delivered US$2.3 to US$3.3 in net benefit per dollar. Multi-country analysis delivered up to US$3 in avoided losses per dollar. The pattern across geographies and methodologies is consistent enough that the burden of proof has shifted onto the case for delay.

Acting early preserves the foundations of resilience in contexts that have lost the slack to absorb compounding shocks. The downstream effects of a single avoided distress sale, or a single livestock herd preserved, or a single school year not abandoned, propagate forward into the household's capacity to survive the next event.

We have the forecasting, the financing, the data infrastructure and the operational frameworks to act at scale, now. The activations already under way across Central America, East Africa and the Sahel, through FAO, WFP, IFRC and partner agencies, are the visible evidence that the architecture works. The constraint is no longer capability.

The only barriers left are the speed of decision-making and the flexibility of funding. Both are choices, made by institutions, on a timeline they can change.`,
      },
      {
        content: `Waiting for impacts to materialise before acting is no longer caution. The evidence is too strong. The operational architecture is too mature. The cost of delay, in fiscal terms and in human terms, is too well-documented to be defensible by a precautionary framing. Inaction in the face of this much converging evidence is a choice the field can no longer claim it did not have.

I designed drought triggers in an office where the case for acting early was a strong intuition. It is now a citation. The data has caught up to the argument. The argument is the policy. The policy is the trigger we pull.

*Tags: Anticipatory Action · Data & Evidence · Climate Finance*`,
      },
    ],
    relatedSlugs: [
      'el-nino-cascading-hazards-anticipatory-action',
      'delta-resilience-early-warning-anticipatory-action',
      'the-case-for-anticipatory-cash',
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

  // Topic clusters this post belongs to — used for stronger semantic linkage
  // in the BlogPosting schema and to drive the BreadcrumbList that points
  // back at the primary topic hub (if any).
  const postTopics = getTopicsForPost(post.slug)
  const primaryTopic = postTopics[0]

  // BlogPosting + BreadcrumbList emitted together in a JSON-LD @graph so a
  // single <script> tag carries both. Article-level signals (headline,
  // body, keywords, image, author, publisher) sit alongside breadcrumb
  // navigation for richer crawler context.
  const breadcrumbItems = [
    { '@type': 'ListItem' as const, position: 1, name: 'Home', item: 'https://alexnwoko.com' },
    { '@type': 'ListItem' as const, position: 2, name: 'Blog', item: 'https://alexnwoko.com/blog' },
    ...(primaryTopic
      ? [{
          '@type': 'ListItem' as const,
          position: 3,
          name: primaryTopic.shortLabel,
          item: `https://alexnwoko.com/topics/${primaryTopic.slug}`,
        }]
      : []),
    {
      '@type': 'ListItem' as const,
      position: primaryTopic ? 4 : 3,
      name: post.title,
      item: url,
    },
  ]

  const blogPostingNode = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
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
    isPartOf: { '@id': 'https://alexnwoko.com/#website' },
    about: postTopics.length
      ? postTopics.map((t) => ({
          '@type': 'Thing',
          name: t.shortLabel,
          url: `https://alexnwoko.com/topics/${t.slug}`,
        }))
      : undefined,
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
      '@id': 'https://alexnwoko.com/#person',
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
      '@id': 'https://alexnwoko.com/#person',
      name: 'Alex Nwoko',
      url: 'https://alexnwoko.com',
    },
  }

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbItems,
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [blogPostingNode, breadcrumbNode],
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

      {/* Topic chips — link to the topic hubs this post belongs to.
          Strong internal-link signal for SEO; also gives readers an
          orientation into the rest of the corpus. */}
      {postTopics.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 mb-10">
          <p className="text-xs uppercase tracking-widest text-coffee-muted font-semibold mb-3">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {postTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-beige-300 bg-beige-100 text-coffee hover:bg-dusty-orange hover:text-white hover:border-dusty-orange transition-colors"
              >
                {t.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      )}

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
