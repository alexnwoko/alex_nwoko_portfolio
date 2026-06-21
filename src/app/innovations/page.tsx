import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Innovative Projects, Alex Nwoko',
  description:
    'Systems and platforms I am actively designing to advance humanitarian data, coordination, and efficiency, AISA, Climate Anticipation Centre, ReportCentre, ReliefCash.',
  alternates: { canonical: 'https://alexnwoko.com/innovations' },
}

const innovations = [
  {
    id: 'aisa',
    title: 'AISA, Agentic Intersectoral Situational Analysis',
    status: 'Architecture & Prototyping',
    statusColor: '#009EDB',
    tagline:
      'AI-powered humanitarian intelligence that operationalises intersectoral analysis across 14 UN agencies and 22 sectors.',
    problem:
      'The humanitarian system processes over 100,000 field reports annually, yet only 5–10% receive structured analysis due to manual bottlenecks. Each agency operates siloed analytical workflows with no platform performing intersectoral analysis at the speed and scale required.',
    vision:
      'An AI-powered platform using agentic workflows (15+ specialised agents) combined with ML, NLP, and large language models to automate the collection, harmonisation, analysis, and communication of humanitarian data, transforming months of manual analysis into hours.',
    pillars: [
      'Multi-Agent AI Architecture, 15+ specialised agents orchestrated by LangGraph for document ingestion, classification, analysis, and report generation',
      'Dual-Filter UX, Simultaneous agency-lens (14 UN agencies) and cluster-lens (22 sectors) enabling 308 view combinations',
      'Analytical Confidence Engine, Cross-cutting quality scoring with confidence-weighted consensus metrics and information gap detection',
      'Automated Document Generation, SitReps, country profiles, and briefing notes auto-generated in <15 minutes',
    ],
    tech: [
      'LangGraph + Claude API',
      'Python FastAPI',
      'React + TypeScript',
      'PostgreSQL + Qdrant + Neo4j',
      'spaCy + Hugging Face',
      'Mapbox GL JS',
    ],
    metrics: [
      '90% reduction in qualitative analysis time',
      '>85% thematic classification accuracy',
      '5-page SitRep draft in <15 minutes',
      '308 agency×sector view combinations',
    ],
    pillarColor: '#009EDB',
  },
  {
    id: 'climate-anticipation',
    title: 'Climate Anticipation Centre',
    status: 'Concept & Architecture',
    statusColor: '#C4703F',
    tagline:
      'GeoAI-powered multi-hazard monitoring and anticipatory analytics, from passive spatial data to active climate intelligence.',
    problem:
      'Climate disasters caused $4.3 trillion in losses (1970–2021), yet only 55% of WMO member states have functioning Multi-Hazard Early Warning Systems. Existing platforms are passive data repositories locked behind a technical gate.',
    vision:
      'A next-generation GeoAI platform fusing autonomous GIS agents, AI-powered weather models, and multi-hazard analytics to autonomously monitor hazards, generate risk analytics, and communicate warnings in natural language.',
    pillars: [
      'Autonomous GIS Agents, Specialised agents (Hazard Monitoring, Exposure Analysis, Climate Forecast, Risk Communication) using LLMs as reasoning cores',
      'GeoAI Multi-Hazard Engine, AI weather foundation models (GraphCast, FourCastNet) for rapid 10-day forecasts in seconds',
      'Anticipatory Action Packs, Auto-generated, hazard-specific response packages with action checklists, communication templates, and resource calculators',
      'Natural Language Risk Querying: "Show me all districts at high flood risk in the next 72 hours"',
    ],
    tech: [
      'LangGraph + Claude API',
      'GeoServer + PostGIS',
      'GraphCast + FourCastNet',
      'React/Next.js + Mapbox GL JS',
      'TensorFlow + PyTorch',
      'Apache Kafka',
    ],
    metrics: [
      '8+ hazard types monitored',
      '≥24-hour early warning lead time',
      'AA-Packs generated in <15 minutes',
      '>80% adoption by non-GIS staff',
    ],
    pillarColor: '#C4703F',
  },
  {
    id: 'reportcentre',
    title: 'ReportCentre',
    status: 'Concept & Design',
    statusColor: '#7B4B94',
    tagline:
      'Next-generation humanitarian reporting platform, evolving from data collection to evidence-based decision intelligence.',
    problem:
      'Despite the success of platforms like ReportHub, significant gaps remain in how humanitarian data is collected, analysed, and communicated. Current systems operate in silos, lack advanced analytical capabilities, and struggle to translate raw 5W data into actionable strategic intelligence.',
    vision:
      'An evolution of humanitarian reporting platforms that enhances how data is collected, analysed, and communicated, integrating modern data engineering, AI-powered analytics, and intuitive communication layers.',
    pillars: [
      'Enhanced Data Collection, No-code relational database builder, offline-first data entry, multi-modal data ingestion',
      'Advanced Analytics Engine, AI-powered pattern detection, predictive modelling, automated gap-overlap analysis',
      'Intelligent Communication Layer, Automated insight generation, drag-and-drop report designer, role-based dashboards',
      'Interoperability, Power BI, Python, R, ArcGIS integration pipelines with IATI and HDX compatibility',
    ],
    tech: [
      'React / Next.js',
      'Node.js / FastAPI',
      'PostgreSQL + PostGIS + TimescaleDB',
      'Python (pandas, scikit-learn)',
      'Power BI Embedded',
      'Docker + Cloud-native',
    ],
    metrics: [
      'Built on ReportHub lessons (120+ partners)',
      'Real-time data updates',
      'AI-powered pattern detection',
      'Cross-platform interoperability',
    ],
    pillarColor: '#7B4B94',
  },
  {
    id: 'reliefcash',
    title: 'ReliefCash',
    status: 'Concept & Design',
    statusColor: '#8B3A2F',
    tagline:
      'Intelligent cash transfer coordination, joint targeting, automated deduplication, and collective impact analytics.',
    problem:
      'Multiple agencies deliver cash assistance to overlapping populations without real-time visibility into each other\'s activities, leading to duplication, coverage gaps, inconsistent transfer values, and inability to demonstrate collective impact.',
    vision:
      'An intelligent cash transfer coordination system enabling humanitarian partners to work together through a joint targeting platform with automated deduplication, shared beneficiary registries, and evidence-based transfer value harmonisation.',
    pillars: [
      'Joint Targeting System, Shared beneficiary registry with privacy-preserving deduplication and vulnerability-based prioritisation',
      'Intelligent Cash Coordination, Real-time multi-agency dashboard, automated MEB calculation, FSP capacity mapping',
      'Accountability & Fraud Prevention, Biometric verification, automated anomaly detection, end-to-end audit trail',
      'Impact Analytics, Collective outcome measurement, PDM aggregation, cost-efficiency analysis, donor reporting automation',
    ],
    tech: [
      'PostgreSQL + privacy-preserving hashing',
      'Python (scikit-learn, pandas)',
      'React + Mapbox',
      'Power BI Embedded',
      'React Native (mobile)',
      'FastAPI + OAuth2',
    ],
    metrics: [
      'Built on CBIIMS foundation',
      'Privacy-preserving deduplication',
      'Real-time coordination dashboard',
      'Automated donor reporting',
    ],
    pillarColor: '#8B3A2F',
  },
  {
    id: 'pdm-framework',
    title: 'PDM Meta-Analysis Framework',
    status: 'Completed & Adopted',
    statusColor: '#2D8B4E',
    tagline:
      'The first inter-agency PDM meta-analysis methodology, a 9-pillar framework unifying fragmented cash impact data.',
    problem:
      'Cash Working Groups worldwide lack a standardised, reproducible method to measure collective impact across partners. Each partner uses different instruments, sampling approaches, and reporting formats.',
    vision:
      'A replicable 9-pillar analytical methodology that transforms fragmented partner PDM data into unified inter-agency evidence, enabling cross-partner comparison, trend analysis, and aggregate impact measurement.',
    pillars: [
      'Sample Profile & Demographics, Representation and geographic coverage analysis',
      'Transfer Adequacy, Purchasing power against MEB benchmarks (39.1% fully met)',
      'Experienced Outcomes, Satisfaction rates (93.8%), food security, coping strategies',
      'Exclusion Signals, Protection risks (10.4% extortion rate), access barriers, coverage gaps',
    ],
    tech: [
      'Python (pandas, numpy, scipy)',
      'KoboCollect (152-question tool)',
      'Power BI (50+ DAX measures)',
      'statsmodels',
      'GitHub (open-source pipeline)',
    ],
    metrics: [
      '1,559 households analysed',
      '5 organisations unified',
      'Adopted by Ethiopia CWG',
      'Open-source replicable pipeline',
    ],
    pillarColor: '#2D8B4E',
  },
]

export default function InnovationsPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">
          Innovation
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Building the Future of Humanitarian Intelligence
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Systems and platforms I am actively designing to advance how humanitarian
          organisations collect, analyse, and act on data. Each project builds on a decade
          of operational experience to solve problems I&rsquo;ve encountered firsthand.
        </p>
      </section>

      {/* Innovation Cards */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="space-y-16">
          {innovations.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="bg-white rounded-2xl border border-beige-300 overflow-hidden"
            >
              {/* Color bar */}
              <div className="h-1.5" style={{ backgroundColor: project.pillarColor }} />

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-coffee">
                      {project.title}
                    </h2>
                  </div>
                  <span
                    className="text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full"
                    style={{
                      color: project.statusColor,
                      backgroundColor: project.statusColor + '15',
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-dusty-orange font-medium mb-6 font-reading italic">
                  {project.tagline}
                </p>

                {/* Problem & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-2">
                      The Problem
                    </h4>
                    <p className="text-sm text-coffee-light leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-2">
                      The Vision
                    </h4>
                    <p className="text-sm text-coffee-light leading-relaxed">
                      {project.vision}
                    </p>
                  </div>
                </div>

                {/* Innovation Pillars */}
                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-4">
                    Core Innovations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.pillars.map((pillar, i) => (
                      <div
                        key={i}
                        className="bg-beige-100 rounded-xl p-4 border border-beige-200"
                      >
                        <p className="text-sm text-coffee-light leading-relaxed">
                          <span
                            className="font-semibold"
                            style={{ color: project.pillarColor }}
                          >
                            {pillar.split(': ')[0]}
                          </span>
                          {pillar.includes(': ') && (
                            <span>, {pillar.split(': ').slice(1).join(': ')}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech & Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-3">
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1.5 rounded-full border text-coffee-muted"
                          style={{ borderColor: project.pillarColor + '40' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-3">
                      Target Metrics
                    </h4>
                    <ul className="space-y-1.5">
                      {project.metrics.map((m) => (
                        <li
                          key={m}
                          className="text-sm text-coffee-light flex items-start gap-2"
                        >
                          <span style={{ color: project.pillarColor }}>&#9656;</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-20">
        <p className="text-coffee-muted mb-6">
          Interested in collaborating on any of these initiatives?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Let&rsquo;s Talk
        </Link>
      </section>
    </div>
  )
}
