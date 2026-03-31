import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BlogSection {
  heading?: string
  content: string
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
}

const blogPosts: Record<string, BlogPost> = {
  'from-humanitarian-data-to-digitising-africas-markets': {
    slug: 'from-humanitarian-data-to-digitising-africas-markets',
    title: "From Humanitarian Data Systems to Digitising Africa's Market Ecosystems",
    category: 'Opinion / Founder Reflection',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    readTime: '12 min',
    date: 'March 2026',
    excerpt:
      'How a decade of building data systems in humanitarian crises led to a thesis about digitising African informal commerce.',
    sections: [
      {
        content: `I'm standing in Mile 12 market in Lagos, watching. The market stretches across several city blocks—30,000 traders, billions in daily transactions, zero digital footprint. A woman haggles with a vendor over tomatoes, a builder negotiates prices for sand delivery, a tailor takes an order for traditional fabric work. Everything happens in voice, in cash, in the physical meeting of buyer and seller. And I'm thinking: this looks exactly like the information chaos of a humanitarian emergency.

It's not a perfect analogy, but it's not wrong either. In both cases, you have fragmented information, no shared view of reality, decisions made on gut feeling instead of evidence, and invisible transactions that nobody can see. The difference is that one is a crisis and the other is just how 95% of African commerce works.`,
      },
      {
        heading: 'The Pattern I Kept Seeing',
        content: `For a decade, I built data systems for humanitarian response. The core problem never changed: fragmented information. In refugee camps, in flood-affected zones, in conflict-affected areas—the pattern was always the same. Data scattered across organizations, no shared view of reality, decisions made on incomplete information, analysts working in silos.

The systems I led—ReportHub for multi-cluster reporting, HSDC for geospatial intelligence, deploying DEEP for situational analysis—were all attempts to solve this. Create shared standards, connect the data, make the invisible visible, turn information into action.

Then I stepped back and realized something: this exact pattern exists in African informal commerce. In Mile 12 market, in Balogun market in Lagos, in Makola market in Accra, in every major trading hub across the continent. 30,000 traders with no digital presence, buyers with no way to discover them, prices that vary wildly with no transparency, trust built only through physical proximity.

The humanitarian skills translate perfectly. Building trust infrastructure—that's what seller verification systems do. Designing for low-connectivity environments—that's what offline-first platforms do. Creating systems that work for low-literacy populations—that's accessible design. Making invisible information visible—that's exactly what market-enablement platforms do.

The insight wasn't hard to see once I stopped thinking about crises and started thinking about constraints.`,
      },
      {
        heading: 'Why Most Tech Solutions Get Africa Wrong',
        content: `Most marketplace platforms are designed for formal economies. Fixed addresses. Reliable internet. Digital payment infrastructure. Standardized pricing. Clear supply chains. These assumptions are baked into the entire architecture.

Nigeria's markets don't work like that. Mile 12 has 30,000 traders but no formal addresses—the market is a geography without a coordinate system. Balogun market does billions in annual trade with zero digital records. Sellers communicate through voice messages and personal referrals. Price discovery happens through haggling and personal relationships, not through algorithms.

The pattern of failure is predictable: import a Western marketplace model, spend VC money on user acquisition, discover that unit economics don't work because the entire infrastructure assumption was wrong. The market isn't "digitally backward"—it's working perfectly well for how it actually functions. What's needed isn't disruption. It's enhancement.

The pattern of failure looks like this: entrepreneur sees African market, thinks "inefficiency," builds Uber-for-commerce, tries to fit physical markets into digital platform assumptions, watches it fail. Then the founder either pivots or gives up.

What's actually needed is founders who understand that the constraint IS the design requirement. Yes, sellers don't have fixed addresses—so the system needs to work with fluid geographies. Yes, buyers rely on personal referrals—so the system needs to amplify and systematize word-of-mouth. Yes, payment is cash—so the system needs to build trust mechanisms that work in cash ecosystems.

This is the opposite of importing a model. It's building from first principles.`,
      },
      {
        heading: 'What a Decade of Crisis Response Taught Me About Building for Africa',
        content: `I didn't plan to go from humanitarian data systems to building marketplace platforms. But looking back, I can trace a straight line from Maiduguri to Lagos, from Crisis to Commerce.

Trust as infrastructure: In humanitarian response, you build verification systems because your decisions affect lives. Partner vetting, beneficiary registration, feedback loops, audit trails. In Vendoh, the escrow-protected payment model and review system are exactly this: trust infrastructure. In MAKKET, seller verification backed by market association legitimacy is the same pattern—you make invisible credentials visible and verifiable.

Voice-first by necessity: I learned about voice interfaces in places where most people didn't have smartphones—where voice messages were how information moved. In Maiduguri, our entire beneficiary communication system ran on SMS and USSD because that's what worked. When I built Vendoh's voice interface for Nigerian English and Pidgin, it wasn't innovation—it was applying a lesson learned in every humanitarian posting. Talk to the users in their language, literally. Voice carries nuance, builds rapport, works across literacy levels.

Geospatial intelligence for commerce: The same GIS skills I used to map flood risk and identify humanitarian access routes can map market catchment areas, optimize delivery routes, and identify underserved commercial zones. MAKKET's dataset of 600+ Nigerian markets with geolocation data is essentially a humanitarian-style baseline assessment applied to commerce. Every market has a story: population density, transportation access, seasonal variation, competitive intensity. Map it, understand it, act on it.

Design for the constraint: Humanitarian systems must work on 2G, on basic phones, with unreliable power, in conflict zones. Both Vendoh and MAKKET inherit this discipline by default. Not because we're trying to be noble, but because it's the right design decision for the environments where the most value is at stake.

The insight is that humanitarian response has inadvertently developed design patterns and systems thinking approaches that are exactly what African commerce needs.`,
      },
      {
        heading: 'Two Platforms, One Thesis',
        content: `Vendoh is a voice-first AI service marketplace. The market is massive: Nigeria has a $2.3 billion urban service market, and less than 5% is digitally intermediated. Plumbing, electrical, carpentry, salon services, home maintenance—work that happens in every city but has no digital discovery mechanism. Customers call friends, neighbors, relatives. If you need a plumber, you ask someone who knows a plumber.

MAKKET is a market-enablement platform for physical market traders. The market is continent-scale: Africa has $200+ billion in informal commerce annual transactions. Traders with inventory, buyers with cash, millions in daily transactions, zero digital footprint.

On the surface, they're different platforms for different markets. But they share the same foundational conviction: Africa's informal economies don't need to be replaced by digital alternatives. They need to be enhanced with digital infrastructure that respects how they already work. The goal isn't disruption—it's visibility, trust, and efficiency.

Enhance the market, never displace it. That's the thesis.`,
      },
      {
        heading: 'The Road Ahead',
        content: `Both platforms are built on this principle: start with the constraint, respect the existing economy, add digital infrastructure that makes the invisible visible.

Nigeria first. Lagos, Abuja, Port Harcourt. Then expand across West Africa—Ghana, Kenya. Eventually continental. The vision is an infrastructure layer that makes African commerce visible, trustworthy, and efficient.

There's a call to action embedded in this. The biggest untapped opportunity in African tech isn't competing with established platforms—it's building the infrastructure for the 95% of commerce that no platform has touched. The market that's working perfectly well without digital intermediation, but could be dramatically more powerful with the right digital layer.

That's where the interesting problem is. That's where the builders should be looking.`,
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
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
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

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'Alex Nwoko' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: ['Alex Nwoko'],
    },
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

  return (
    <article className="pt-24 pb-16">
      {/* Back Link */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <Link
          href="/blog"
          className="text-sm text-dusty-orange hover:text-darkred transition-colors font-medium"
        >
          ← Back to Field Notes
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
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <div className="font-reading text-lg text-coffee-light/85 leading-relaxed space-y-6">
          {post.sections.map((section, idx) => (
            <div key={idx}>
              {section.heading && (
                <h2 className="font-serif text-2xl text-coffee mt-12 mb-6">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-6">
                {section.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
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
