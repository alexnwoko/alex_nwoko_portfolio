/**
 * Topic clusters.
 *
 * A topic is a thematic hub that aggregates blog posts from across the
 * pillars. Membership is intentionally non-exclusive — a single post can
 * (and often should) live in multiple topics. The topic pillar pages at
 * /topics/[slug] read from this catalogue.
 *
 * Each topic exposes:
 *   - SEO meta (title, description, keywords)
 *   - A short intro paragraph in Alex's voice
 *   - The list of post slugs that belong to it
 *   - FAQ Q&A pairs that map cleanly to FAQPage JSON-LD (AEO win)
 */

export interface TopicFAQ {
  question: string
  answer: string
}

export interface Topic {
  slug: string
  /** Page H1 + Schema name */
  title: string
  /** Short navigation label shown in footer / chips */
  shortLabel: string
  /** One-line lede shown under the H1 */
  tagline: string
  /** Meta description (155-165 chars) */
  metaDescription: string
  /** Page keywords */
  keywords: string[]
  /** 2-3 short paragraphs introducing the topic in Alex's voice */
  intro: string[]
  /** Slugs of posts belonging to this topic, in display order */
  postSlugs: string[]
  /** Q&A pairs surfaced on the page and emitted as FAQPage JSON-LD */
  faqs: TopicFAQ[]
}

export const TOPICS: Topic[] = [
  {
    slug: 'cop31',
    title: 'COP31, Climate Finance and the Data That Decides Who Gets Funded',
    shortLabel: 'COP31',
    tagline:
      'Essays on the road to Antalya: NCQG, the Loss and Damage Fund, the Belém adaptation indicators, and the measurement systems quietly deciding which countries can compete for the money.',
    metaDescription:
      'A field-led analysis of the data architecture behind COP31, the New Collective Quantified Goal, the Loss and Damage Fund and the Belém Adaptation Indicators. By Alex Nwoko.',
    keywords: [
      'COP31',
      'COP31 Antalya',
      'New Collective Quantified Goal',
      'NCQG',
      'Loss and Damage Fund',
      'Belém Adaptation Indicators',
      'climate finance data',
      'DELTA Resilience',
      'climate finance MRV',
      'anticipatory finance',
    ],
    intro: [
      'Antalya is shaping up to be the COP where climate finance has to grow up. Pledges are no longer the headline. Disbursement is. And disbursement, increasingly, runs on data: which countries can prove a loss happened, who was affected, what it cost, and what the funded intervention actually changed.',
      'This topic gathers the essays I have been writing on that shift. They cover the New Collective Quantified Goal, the Loss and Damage Fund moving from pledge to payout, the Belém Adaptation Indicators about to meet their first reporting test, and the case for anticipatory finance arriving at COP31 with infrastructure of its own.',
      'Most of these arguments come from the same place: a decade of building the underlying disaster data systems in countries that are about to be measured by them.',
    ],
    postSlugs: [
      'road-to-antalya-ncqg',
      'loss-and-damage-fund-make-or-break-year',
      'delta-grade-data-currency-of-climate-finance',
      'from-early-warning-to-early-money',
      'belem-adaptation-indicators-data-test',
      'cop31-data-making-the-case',
      'invisible-disasters-invisible-funding',
      'disaster-loss-data-climate-adaptation',
    ],
    faqs: [
      {
        question: 'What is COP31 expected to focus on in 2026?',
        answer:
          'COP31 in Antalya is expected to focus on operationalising the New Collective Quantified Goal on climate finance, advancing the Loss and Damage Fund from pledges to actual disbursement, finalising the Belém Adaptation Indicators reporting architecture, and embedding anticipatory finance into mainstream climate funding flows.',
      },
      {
        question: 'What is the New Collective Quantified Goal (NCQG)?',
        answer:
          'The NCQG is the post-2025 climate finance goal agreed at COP29, replacing the USD 100 billion target. It commits developed countries to mobilising at least USD 300 billion a year by 2035 for developing countries, with a broader USD 1.3 trillion aspirational figure across all sources. Its credibility hinges on how the underlying flows are measured and reported.',
      },
      {
        question: 'Why does data matter so much for the Loss and Damage Fund?',
        answer:
          'The Fund disburses against evidence. Countries that can produce documented, verifiable disaster loss and impact data are positioned to access funding quickly; countries whose loss data is fragmented, undocumented, or politically contested face structural barriers to claiming it. Data sovereignty is becoming climate finance sovereignty.',
      },
      {
        question: 'What are the Belém Adaptation Indicators?',
        answer:
          'Agreed at COP30 in Belém, the indicators are the first global framework for measuring progress on the UAE Framework for Global Climate Resilience. They define what the world will count as adaptation, but most countries do not yet have the statistical infrastructure to report against them. COP31 has to address that gap.',
      },
      {
        question: 'What is anticipatory climate finance?',
        answer:
          'Anticipatory finance is funding that is pre-positioned and released against a forecast trigger before a hazard materialises, rather than after. It is one of the few mechanisms that has been shown to deliver dollar-for-dollar better outcomes than post-event response, and its placement at COP31 reflects growing recognition that the global system has to fund prevention, not only recovery.',
      },
    ],
  },
  {
    slug: 'disaster-risk-data',
    title: 'Disaster Risk Data: Sendai, G-DRSF, DELTA Resilience and the Architecture Underneath',
    shortLabel: 'Disaster Risk Data',
    tagline:
      'Field essays on disaster loss accounting, national DRR data systems, the G-DRSF, and the move from DesInventar to sovereign, interoperable, AI-ready architectures like DELTA Resilience.',
    metaDescription:
      'How national disaster loss data systems actually get built, owned and used: DELTA Resilience, the Global Disaster-Related Statistics Framework, Sendai monitoring, and the DEMA maturity model.',
    keywords: [
      'disaster risk reduction',
      'disaster loss data',
      'DELTA Resilience',
      'Sendai Framework',
      'Sendai Framework monitoring',
      'DesInventar',
      'G-DRSF',
      'Global Disaster-Related Statistics Framework',
      'national disaster data systems',
      'data ecosystem maturity assessment',
      'DEMA',
      'disaster statistics',
    ],
    intro: [
      'Disaster risk reduction has spent the last decade arguing for better data. The next decade is about whether the systems we are now building can actually be owned by the countries they were built for, and whether the standards we have agreed on (Sendai, G-DRSF, DELTA) can be operationalised at the scale the climate crisis requires.',
      'The posts in this topic come out of building those systems in practice: in Afghanistan, Bangladesh, Ethiopia, and Nigeria, and in the international architecture that connects them. They are about what disaster data is for, how it gets corrupted, and what governs whether it survives the agency that funded it.',
    ],
    postSlugs: [
      'desinventar-to-delta-resilience',
      'g-drsf-statisticians-disaster-managers',
      'delta-resilience-early-warning-anticipatory-action',
      'data-ecosystem-maturity-assessment-guide',
      'building-systems-governments-can-own',
      'disaster-loss-data-climate-adaptation',
      'invisible-disasters-invisible-funding',
      'lessons-six-countries',
      'politics-of-humanitarian-data-infrastructure',
    ],
    faqs: [
      {
        question: 'What is DELTA Resilience?',
        answer:
          'DELTA Resilience is the next-generation national disaster loss and damage data system being adopted by countries to replace DesInventar. It is designed for sovereignty (the data is owned by national governments), interoperability (it speaks to Sendai, G-DRSF, NDCs and climate finance reporting), and AI-readiness (loss records are structured to feed risk models, anticipatory action triggers, and adaptation planning).',
      },
      {
        question: 'What is the G-DRSF?',
        answer:
          'The Global Disaster-Related Statistics Framework, endorsed by the UN Statistical Commission in 2026, is the first formal standard giving national statistical offices and disaster management agencies a shared vocabulary for counting hazards, exposure, and loss. It is the bridge between the SDG framework, the Sendai Framework, and the climate reporting architecture.',
      },
      {
        question: 'How does Sendai Framework monitoring work in practice?',
        answer:
          'Sendai monitoring rests on seven global targets and 38 indicators that countries report annually through the Sendai Framework Monitor. The bottleneck is rarely the indicators themselves; it is the underlying national disaster loss accounting system. Without a DELTA-grade source dataset, Sendai reporting becomes a periodic estimate exercise rather than a continuous evidence stream.',
      },
      {
        question: 'What is a Data Ecosystem Maturity Assessment (DEMA)?',
        answer:
          'A DEMA is a structured diagnostic that scores a country\'s disaster data ecosystem across governance, data sources, technical capacity, interoperability, and use. It is the step that decides whether a new platform is going to outlive the project that built it. Skipping it is the single most reliable way to ship a system the host government cannot maintain.',
      },
    ],
  },
  {
    slug: 'early-warning',
    title: 'Early Warning and Anticipatory Action: Turning Forecasts into Money in Motion',
    shortLabel: 'Early Warning',
    tagline:
      'Essays on Early Warnings for All, anticipatory action, impact-based forecasting, the 72-hour problem, and the data backbone that has to exist for a trigger to actually fire.',
    metaDescription:
      'How early warning systems become early action: anticipatory finance, impact-based forecasting, DELTA Resilience triggers, and the 72-hour post-disaster information gap.',
    keywords: [
      'early warning systems',
      'Early Warnings for All',
      'anticipatory action',
      'anticipatory finance',
      'impact-based forecasting',
      'anticipatory cash',
      'forecast-based financing',
      '72-hour rule',
      'DELTA Resilience',
      'humanitarian forecasting',
    ],
    intro: [
      'A forecast is only an investment when the money attached to it can move before the hazard arrives. That is the gap the Early Warnings for All initiative is trying to close, and it is where most of the operational work I have done over the last few years sits: building the impact data behind triggers, the disbursement protocols behind anticipatory cash, and the post-event information systems that try to make the first 72 hours less of a black hole.',
      'These posts gather what I have learned about why early warning so often fails to become early action, and what the next generation of systems has to look like to change that.',
    ],
    postSlugs: [
      'delta-resilience-early-warning-anticipatory-action',
      'from-early-warning-to-early-money',
      'the-case-for-anticipatory-cash',
      'the-72-hour-problem',
      'invisible-disasters-invisible-funding',
    ],
    faqs: [
      {
        question: 'What is anticipatory action?',
        answer:
          'Anticipatory action is humanitarian or social-protection assistance released before a forecasted hazard, triggered by pre-agreed thresholds in weather, hydrological, or impact-based models. The intent is to reduce loss, protect livelihoods, and lower the cost of response by acting in the lead time between forecast and event.',
      },
      {
        question: 'What is the Early Warnings for All initiative?',
        answer:
          'Launched by the UN Secretary-General in 2022 and accelerated under WMO and UNDRR leadership, Early Warnings for All aims to ensure every person on Earth is covered by a multi-hazard early warning system by 2027. It is structured around four pillars: risk knowledge, observation and forecasting, warning dissemination, and preparedness and response capability.',
      },
      {
        question: 'Why is the first 72 hours after a disaster so critical for information?',
        answer:
          'The first 72 hours is when affected populations are most exposed and assistance decisions carry the highest stakes, but it is also when formal data systems are weakest: assessments have not yet been run, registers are stale, communications may be down. Information management in this window is less about precision and more about being structurally useful under conditions of high uncertainty.',
      },
      {
        question: 'How does anticipatory cash work?',
        answer:
          'Anticipatory cash transfers households (or small businesses) a cash amount before a forecasted hazard, against a pre-agreed trigger. Evidence from FAO, WFP, and START Network pilots suggests dollar-for-dollar returns of three to five times compared with post-event cash. The constraint is not appetite; it is the trigger-grade data and pre-positioned finance.',
      },
    ],
  },
  {
    slug: 'humanitarian-data',
    title: 'Humanitarian Data: The Voices the Systems Miss and the Equity We Have Not Built Yet',
    shortLabel: 'Humanitarian Data',
    tagline:
      'Essays on data responsibility, accountability to affected populations, voice-native evidence systems, the data poverty trap in fragile contexts, and what data equity actually requires.',
    metaDescription:
      'Why humanitarian data systems systematically miss the people they were built to help, and what data equity, voice-native evidence, and AAP-grounded design actually require.',
    keywords: [
      'humanitarian data',
      'data responsibility',
      'accountability to affected populations',
      'AAP',
      'data equity',
      'data poverty',
      'CARE Principles',
      'Inclusive Data Charter',
      'voice AI humanitarian',
      'humanitarian information management',
      'IASC operational guidance on data responsibility',
    ],
    intro: [
      'The hardest problem in humanitarian data is not technical. It is that the people the system most wants to reach are the people the system is least good at seeing, and that some of that invisibility is the unintended cost of protective choices we made for very good reasons.',
      'This topic gathers the essays I have written about that gap and about the path out of it: data equity rather than data minimisation, voice-native evidence rather than form-extracted observation, accountability infrastructure rather than accountability rhetoric, and the diplomacy work that has to happen before any of it can be operationalised in a fragile context.',
    ],
    postSlugs: [
      'protected-into-invisibility-part-1',
      'data-poverty-fragility-data-equity-part-2',
      'disaster-data-diplomacy',
      'disaster-data-diplomacy-in-fragility',
      'the-voices-our-data-systems-silence',
      'voice-infrastructure-inequality',
      'voice-is-the-future-of-humanitarian-data',
      'the-form-is-already-dead',
      'building-voice-native-evidence-systems',
      'voice-powered-decision-intelligence',
    ],
    faqs: [
      {
        question: 'What is data equity in humanitarian work?',
        answer:
          'Data equity treats representation in the data as a right, not a risk to be managed downward. It pairs the technical discipline of data responsibility with governance frameworks (like the CARE Principles for Indigenous Data Governance and the Inclusive Data Charter) that give the communities inside the data meaningful authority over how it is collected and used.',
      },
      {
        question: 'What is Accountability to Affected Populations (AAP)?',
        answer:
          'AAP is the IASC commitment that humanitarian assistance is delivered in ways that meaningfully involve affected communities in decisions, listens to their concerns, and is answerable to them. In practice, AAP is constrained by data collection tools (forms, fixed checkboxes) that were never designed to capture open-ended voice.',
      },
      {
        question: 'What are the CARE Principles for Indigenous Data Governance?',
        answer:
          'The CARE Principles (Collective benefit, Authority to control, Responsibility, Ethics), published by the Global Indigenous Data Alliance, articulate that communities should hold meaningful authority over how their data is collected, governed, and used. They are increasingly treated as the governance counterpart to the more technical FAIR data principles.',
      },
      {
        question: 'What is the IASC Operational Guidance on Data Responsibility?',
        answer:
          'It is the inter-agency reference standard for handling personal and community data in humanitarian operations, covering data minimisation, purpose limitation, retention, and harm assessment. It is foundational, but in fragile contexts it can be applied in ways that minimise data so aggressively that vulnerable populations vanish from the evidence base entirely. The data equity argument is partly about completing that ethic, not retreating from it.',
      },
    ],
  },
  {
    slug: 'information-management',
    title: 'Information Management: Coordination, Continuity, and the Politics Underneath',
    shortLabel: 'Information Management',
    tagline:
      'Essays on humanitarian IM as a coordination discipline: the agentic future, the coordination trap, the continuity problem, GeoAI, joint cash measurement, and the politics that decides who owns the platform.',
    metaDescription:
      'Humanitarian Information Management as a coordination discipline: agentic IM, IMWG dynamics, platform continuity, GeoAI, inter-agency PDM, and the politics of who owns the data infrastructure.',
    keywords: [
      'humanitarian information management',
      'IM coordination',
      'IMWG',
      'agentic IM',
      'AISA',
      'GeoAI for humanitarians',
      'inter-agency PDM',
      'cash transfer monitoring',
      'data sharing humanitarian',
      'humanitarian platform continuity',
      'OCHA information management',
    ],
    intro: [
      'Most of the hard problems in humanitarian information management are not technical. They are about who owns the platform when the donor moves on, who is allowed to combine which datasets, and what happens to a coordination system the day the agency running it leaves the country.',
      'These essays come out of the IM Working Groups I have sat in, the platforms I have built and then watched survive (or not), and the slow shift toward agentic AI that is starting to change what an IM officer is actually for.',
    ],
    postSlugs: [
      'the-im-coordination-trap',
      'future-of-humanitarian-im-is-agentic',
      'politics-of-humanitarian-data-infrastructure',
      'building-systems-governments-can-own',
      'the-72-hour-problem',
      'measuring-joint-response-for-cash-transfer',
      'geoai-for-humanitarians',
      'data-ecosystem-maturity-assessment-guide',
      'lessons-six-countries',
    ],
    faqs: [
      {
        question: 'What does a humanitarian information management officer do?',
        answer:
          'An IM officer turns the operational reality of a crisis response into shared, decision-grade information: assessments, beneficiary registers, 4Ws (who, what, where, when), service maps, situational dashboards, and the inter-agency feeds that make coordination possible. The role sits at the intersection of GIS, data engineering, coordination, and diplomacy.',
      },
      {
        question: 'What is agentic information management (AISA)?',
        answer:
          'Agentic IM is the next generation of humanitarian information systems, in which AI agents (not just AI tools) carry out chained analytical work: ingesting raw assessments, normalising them against shared standards, producing situational reports, and updating coordination products without an IM officer doing every step by hand. AISA is the architecture pattern that supports it.',
      },
      {
        question: 'Why do humanitarian platforms keep dying when the funder leaves?',
        answer:
          'Because most platforms are built around the agency that funds them, not around the host government or coordination mechanism that has to live with them. When the funding cycle ends, hosting, licences, and updates die with it. Building "systems governments can own" is a design discipline, not a tagline.',
      },
      {
        question: 'What is inter-agency PDM and why does it matter?',
        answer:
          'Post-Distribution Monitoring (PDM) is the standard practice for measuring cash transfer programme outcomes. When five organisations each run separate PDMs with separate tools, the system-level question (is our collective cash response working?) becomes structurally unanswerable. Inter-agency PDM meta-analysis is the method for reconstructing that picture from the metadata up.',
      },
    ],
  },
]

/** Lookup a topic by slug. */
export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

/** All topic slugs (for generateStaticParams and sitemap). */
export function getAllTopicSlugs(): string[] {
  return TOPICS.map((t) => t.slug)
}

/** Return every topic a given post slug belongs to. */
export function getTopicsForPost(slug: string): Topic[] {
  return TOPICS.filter((t) => t.postSlugs.includes(slug))
}
