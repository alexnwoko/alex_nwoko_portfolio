'use client'

import { useState } from 'react'
import Link from 'next/link'

const projects = [
  {
    title: 'ReportHub',
    pillar: 'Data Analytics & IM',
    pillarColor: '#009EDB',
    period: '2022–2025',
    location: 'Afghanistan',
    org: 'iMMAP',
    summary:
      'Multi-cluster humanitarian reporting platform used by 75+ organizations across Afghanistan to coordinate HRP reporting, monitor response progress, and identify gaps across sectors.',
    challenge:
      "Afghanistan's humanitarian response involved 75+ organizations reporting to six clusters with inconsistent definitions, fragmented Excel-based workflows, and no unified view of response progress.",
    solution:
      'Designed a complete reporting ecosystem: harmonized data standards across clusters, built automated data collection and validation pipelines, created role-based dashboards for different user types (cluster coordinators, OCHA, donors), and established feedback loops that improved data quality over time.',
    impact: [
      '75+ organizations using the platform',
      '6 clusters harmonized',
      'Real-time HRP monitoring',
      'Replaced fragmented Excel reporting',
    ],
    tags: ['Platform Design', 'Data Architecture', 'Partner Coordination', 'Power BI', 'KoboToolbox'],
    type: 'Platform',
  },
  {
    title: 'Humanitarian Spatial Data Center (HSDC)',
    pillar: 'GIS & Remote Sensing',
    pillarColor: '#7B4B94',
    period: '2022–2025',
    location: 'Afghanistan',
    org: 'iMMAP',
    summary:
      'Multi-hazard geospatial analysis and forecasting system integrating earthquake, flood, drought, and conflict data into a single spatial intelligence platform.',
    challenge:
      'Humanitarian actors in Afghanistan lacked a centralized geospatial platform that combined multiple hazard layers with population data, accessibility information, and response capacity.',
    solution:
      'Built an integrated geospatial platform combining satellite imagery, climate data, seismic sensors, and ground-verified information. Developed exposure estimation models, automated alert systems, and web-based mapping interfaces accessible to non-GIS specialists.',
    impact: [
      'First integrated multi-hazard platform for Afghanistan',
      'Automated exposure estimation',
      'Climate trigger development',
      'Served as national geospatial reference',
    ],
    tags: ['GeoAI', 'Remote Sensing', 'Risk Analysis', 'Python', 'Google Earth Engine', 'Leaflet.js'],
    type: 'Platform',
  },
  {
    title: 'PDM Meta-Analysis Framework',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    period: '2021–2022',
    location: 'Ethiopia',
    org: 'UNICEF / Ethiopia Cash Working Group',
    summary:
      'First-ever inter-agency cash impact assessment — a 9-pillar analytical system that unified 1,559 household surveys from five organizations into a single analytical framework.',
    challenge:
      'Five humanitarian organizations were conducting post-distribution monitoring independently, each with different tools, questions, and definitions of "success." The Ethiopia Cash Working Group couldn\'t answer: "Is our cash programming working?"',
    solution:
      'Designed a 9-pillar analytical framework covering expenditure patterns, food security impact, market access, protection, coping strategies, and beneficiary satisfaction. Built Python harmonization pipelines and a Power BI ecosystem with 50+ DAX measures.',
    impact: [
      '1,559 households analyzed',
      '5 organizations unified',
      '9 analytical pillars',
      'First inter-agency cash impact assessment',
    ],
    tags: ['Cash Programming', 'Power BI', 'Python', 'KoboToolbox', 'DAX'],
    type: 'Dashboard',
  },
  {
    title: 'CBIIMS — Cash-Based Intervention IM System',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    period: '2019–2020',
    location: 'Bangladesh',
    org: 'IOM',
    summary:
      'End-to-end information management system for cash-based interventions: 5-stage workflow from beneficiary profiling through payment automation with risk assessment and accountability layers.',
    challenge:
      'IOM Bangladesh needed a structured IM system to support process-based CBI delivery ensuring timeliness, accountability, and fraud prevention across Cash-for-Work and MPCG programmes in the Cox\'s Bazar refugee response.',
    solution:
      'Designed the CBIIMS — a 5-stage workflow (Profiling → Targeting → Attendance → Payment Automation → Beneficiary Payment) with governance layers for risk assessment and M&E/AAP.',
    impact: [
      '5-stage CBI workflow designed',
      'Automated payment sheet preparation',
      'Fraud prevention systems',
      '3-step authorization process',
    ],
    tags: ['System Design', 'KoboToolbox', 'Cash Programming', 'Process Automation'],
    type: 'Report',
  },
  {
    title: 'AISA — Agentic Intersectoral Situational Analysis',
    pillar: 'Data Analytics & IM',
    pillarColor: '#009EDB',
    period: '2024–Present',
    location: 'Global',
    org: 'Independent',
    summary:
      'Next-generation AI-powered platform concept that uses autonomous agents to ingest, classify, and synthesize unstructured humanitarian data into analytical products.',
    challenge:
      'Humanitarian situation analysis is slow, labor-intensive, and often outdated by the time it reaches decision-makers.',
    solution:
      'Designing an agentic AI architecture where specialized agents handle data ingestion, classification, cross-source synthesis, and automated report generation — producing near-real-time analytical outputs.',
    impact: [
      'AI agent architecture designed',
      'Multi-framework classification',
      'Real-time synthesis capability',
      'Humanitarian-specific NLP pipeline',
    ],
    tags: ['AI/ML', 'NLP', 'Agent Architecture', 'Python', 'LLM Integration'],
    type: 'Code',
  },
  {
    title: 'Climate Anticipation Centre',
    pillar: 'Climate & DRR',
    pillarColor: '#C4703F',
    period: '2023–2025',
    location: 'Afghanistan',
    org: 'iMMAP',
    summary:
      'Framework for operationalizing early warning into anticipatory action — developing climate trigger thresholds and pre-positioning data systems for forecast-based response.',
    challenge:
      "Despite advances in climate forecasting, most humanitarian response in Afghanistan remained reactive. Early warnings weren't linked to pre-agreed response protocols.",
    solution:
      "Developed climate trigger thresholds calibrated to Afghanistan's hazard profile, integrating drought indices, flood forecasting, and seismic data. Created decision frameworks linking forecast levels to specific response actions.",
    impact: [
      'Climate trigger thresholds developed',
      'Early warning integration',
      'Anticipatory action protocols',
      'Multi-hazard risk framework',
    ],
    tags: ['Climate Analytics', 'DRR', 'Anticipatory Action', 'Google Earth Engine', 'Python'],
    type: 'Map',
  },
  {
    title: 'COVID-19 Situation Analysis Series',
    pillar: 'Data Analytics & IM',
    pillarColor: '#009EDB',
    period: '2020',
    location: 'Bangladesh',
    org: 'iMMAP',
    summary:
      "Seven comprehensive analysis reports tracking the pandemic's cascading impacts on health, livelihoods, and food security in Bangladesh, using AI-enabled secondary data analysis.",
    challenge:
      "COVID-19's impact on Bangladesh's vulnerable populations was rapidly evolving, with information scattered across hundreds of sources in multiple languages and formats.",
    solution:
      'Led a team using the DEEP platform to systematically code and classify thousands of unstructured humanitarian documents. Produced seven thematic reports.',
    impact: [
      '7 analytical reports produced',
      'AI-enabled data classification',
      'Cross-sectoral synthesis',
      'Used by humanitarian country team',
    ],
    tags: ['DEEP Platform', 'Secondary Data Analysis', 'AI Classification', 'Report Writing'],
    type: 'Report',
  },
  {
    title: 'Afghanistan IM Capacity Assessment',
    pillar: 'Data Analytics & IM',
    pillarColor: '#009EDB',
    period: '2022–2023',
    location: 'Afghanistan',
    org: 'iMMAP',
    summary:
      'Comprehensive capacity building gap analysis across 10 humanitarian clusters/sectors in Afghanistan using HDL survey methodology.',
    challenge:
      'No systematic assessment existed of IM capacity gaps across humanitarian clusters, making it impossible to target capacity building efforts effectively.',
    solution:
      'Designed and deployed a multi-cluster IM capacity assessment using structured HDL surveys, producing Power BI dashboards with cluster-specific gap analysis and training recommendations.',
    impact: [
      '10 clusters assessed',
      'Capacity gaps quantified',
      'Training priorities identified',
      'Power BI analytical dashboard',
    ],
    tags: ['Capacity Building', 'Power BI', 'Survey Design', 'KoboToolbox'],
    type: 'Dashboard',
  },
  {
    title: 'Flood Vulnerability Mapping — NE Nigeria',
    pillar: 'GIS & Remote Sensing',
    pillarColor: '#7B4B94',
    period: '2018',
    location: 'Nigeria',
    org: 'IOM / FAO',
    summary:
      'High-resolution vulnerability and flood risk mapping for rainy season contingency planning in northeast Nigeria.',
    challenge:
      'Contingency planning for rainy season flooding required spatial risk analysis combining hazard, exposure, and vulnerability data that did not exist in a unified format.',
    solution:
      'Created multi-layer vulnerability maps integrating flood hazard zones, settlement data, displacement sites, and infrastructure locations. Delivered as both interactive web maps and high-resolution print products.',
    impact: [
      'Risk zones mapped',
      'Contingency planning supported',
      'Multi-hazard overlay analysis',
      'Print and digital products',
    ],
    tags: ['ArcGIS', 'Flood Analysis', 'Vulnerability Mapping', 'Cartography'],
    type: 'Map',
  },
  {
    title: 'CWG 5W Programmatic Snapshots',
    pillar: 'Cash Programming',
    pillarColor: '#8B3A2F',
    period: '2022–2023',
    location: 'Ethiopia',
    org: 'UNICEF / CWG',
    summary:
      'Quarterly operational dashboards tracking CERF-funded MPC allocations ($3.20M across 185K beneficiaries) for the Ethiopia Cash Working Group.',
    challenge:
      'The CWG needed visibility into CERF-funded cash programme progress across multiple partners but had no standardized tracking mechanism.',
    solution:
      'Designed Power BI dashboards with automated data pipelines tracking who, what, where, when, and for whom across all CERF-funded MPC activities.',
    impact: [
      '$3.20M allocations tracked',
      '185K beneficiaries monitored',
      'Quarterly snapshots produced',
      'Partner performance visibility',
    ],
    tags: ['Power BI', 'CERF', 'Cash Coordination', '5W Reporting'],
    type: 'Dashboard',
  },
]

const pillarFilters = [
  { label: 'All', value: 'all' },
  { label: 'Data Analytics & IM', value: 'Data Analytics & IM', color: '#009EDB' },
  { label: 'GIS & Remote Sensing', value: 'GIS & Remote Sensing', color: '#7B4B94' },
  { label: 'Climate & DRR', value: 'Climate & DRR', color: '#C4703F' },
  { label: 'Cash Programming', value: 'Cash Programming', color: '#8B3A2F' },
]

const typeFilters = ['All', 'Platform', 'Dashboard', 'Map', 'Report', 'Code']

export default function ProjectsPage() {
  const [activePillar, setActivePillar] = useState('all')
  const [activeType, setActiveType] = useState('All')

  const filtered = projects.filter((p) => {
    const pillarMatch = activePillar === 'all' || p.pillar === activePillar
    const typeMatch = activeType === 'All' || p.type === activeType
    return pillarMatch && typeMatch
  })

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">
          Projects
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Systems Built for Impact
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Every project here was built in an active humanitarian response — designed under
          pressure, tested by real users, and measured by whether it actually changed how
          organizations make decisions.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex flex-col gap-4">
          {/* Pillar Filter */}
          <div>
            <span className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mr-3">
              Pillar:
            </span>
            <div className="inline-flex flex-wrap gap-2 mt-1">
              {pillarFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActivePillar(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    activePillar === f.value
                      ? 'text-white border-transparent'
                      : 'text-coffee-muted border-beige-300 hover:border-coffee-muted'
                  }`}
                  style={
                    activePillar === f.value
                      ? { backgroundColor: f.color || '#3D2B1F' }
                      : undefined
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <span className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mr-3">
              Type:
            </span>
            <div className="inline-flex flex-wrap gap-2 mt-1">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    activeType === t
                      ? 'bg-coffee text-white border-coffee'
                      : 'text-coffee-muted border-beige-300 hover:border-coffee-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-coffee-muted mt-4">
          Showing {filtered.length} of {projects.length} projects
        </p>
      </section>

      {/* Project Cards */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="space-y-12">
          {filtered.map((project, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl border border-beige-300 overflow-hidden card-hover"
            >
              {/* Color bar */}
              <div className="h-1" style={{ backgroundColor: project.pillarColor }} />

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-[10px] uppercase tracking-widest font-semibold"
                        style={{ color: project.pillarColor }}
                      >
                        {project.pillar}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-coffee-muted bg-beige-200 px-2 py-0.5 rounded">
                        {project.type}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-coffee mt-1">
                      {project.title}
                    </h2>
                    <p className="text-sm text-coffee-muted mt-1">
                      {project.org} &middot; {project.location} &middot; {project.period}
                    </p>
                  </div>
                </div>

                <p className="text-coffee-light/80 leading-relaxed mb-8">
                  {project.summary}
                </p>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-2">
                      Challenge
                    </h4>
                    <p className="text-sm text-coffee-light leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-2">
                      Solution
                    </h4>
                    <p className="text-sm text-coffee-light leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-coffee-muted font-semibold mb-2">
                      Impact
                    </h4>
                    <ul className="space-y-1">
                      {project.impact.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-coffee-light flex items-start gap-2"
                        >
                          <span style={{ color: project.pillarColor }}>&#9656;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-3 py-1 rounded-full border border-beige-300 text-coffee-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-coffee-muted">
              <p className="font-serif text-xl mb-2">No projects match these filters</p>
              <p className="text-sm">Try adjusting your filter selection.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-20">
        <p className="text-coffee-muted mb-6">
          Want to discuss a project or collaboration?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  )
}
