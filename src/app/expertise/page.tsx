import type { Metadata } from 'next'
import Testimonial, { TestimonialRow } from '@/components/Testimonial'

export const metadata: Metadata = {
  title: 'Expertise — Alex Nwoko',
  description: 'Four pillars of humanitarian practice: Data Analytics, GIS, Climate Analytics & DRR, and Cash Transfer Programming.',
}

const pillars = [
  {
    id: 'data-analytics',
    icon: '📊',
    color: '#009EDB',
    title: 'Data Analytics & Information Management',
    subtitle: 'The backbone of every humanitarian response',
    overview: 'I design and build the information management systems that humanitarian organizations depend on to coordinate their response. This isn\'t about dashboards — it\'s about complete data ecosystems that transform raw partner reporting into actionable intelligence for decision-makers at every level.',
    capabilities: [
      'Humanitarian reporting platforms (ReportHub)',
      'Multi-cluster data architecture and pipeline design',
      'Power BI & Tableau analytical dashboards with advanced DAX',
      'KoboToolbox form design and data collection systems',
      'Partner coordination and data sharing frameworks',
      'AI-enabled secondary data analysis (deployed DEEP platform)',
      'Situation analysis and needs assessment coordination',
    ],
    tools: ['Power BI', 'Python', 'KoboToolbox', 'DEEP', 'Tableau', 'Excel/VBA', 'SQL'],
    impact: 'Supported 200+ organizations across six countries with reporting platforms, analytical frameworks, and coordination mechanisms.',
  },
  {
    id: 'gis',
    icon: '🗺️',
    color: '#7B4B94',
    title: 'GIS & Remote Sensing',
    subtitle: 'Mapping risk, tracking change, guiding response',
    overview: 'Geospatial analysis is the connective tissue of humanitarian operations — it turns abstract data into spatial intelligence that shows where people are, where risks are concentrated, and where resources need to go. I build platforms that make this intelligence accessible to non-technical decision-makers.',
    capabilities: [
      'Multi-hazard geospatial platforms (HSDC)',
      'Satellite imagery analysis and change detection',
      'Flood exposure and displacement estimation',
      'Settlement mapping and population analysis',
      'Accessibility and logistics mapping',
      'GeoAI applications for humanitarian contexts',
      'Web-based interactive mapping platforms',
    ],
    tools: ['ArcGIS Pro', 'QGIS', 'Google Earth Engine', 'Python/GeoPandas', 'Leaflet.js', 'Mapbox GL JS', 'PostGIS'],
    impact: 'Led the development and deployment of HSDC — Afghanistan\'s first integrated multi-hazard geospatial analysis and forecasting system.',
  },
  {
    id: 'climate',
    icon: '🌍',
    color: '#C4703F',
    title: 'Climate Analytics & DRR / Anticipatory Action',
    subtitle: 'Shifting from reactive response to predictive action',
    overview: 'The humanitarian sector spends billions responding to disasters after they strike. I\'m focused on building the systems that enable anticipatory action — using climate data, early warning indicators, and pre-agreed triggers to initiate response before crises escalate.',
    capabilities: [
      'Climate trigger threshold development',
      'Early warning system integration',
      'Drought, flood, and earthquake risk modeling',
      'Anticipatory action framework design',
      'IPC/food security trend analysis',
      'Multi-hazard risk assessment platforms',
      'Climate vulnerability mapping',
    ],
    tools: ['Python', 'Google Earth Engine', 'Climate Data Store', 'IPC Tools', 'CHIRPS/FEWS NET', 'HDX'],
    impact: 'Developed climate trigger thresholds for anticipatory action and multi-hazard risk assessment frameworks in Afghanistan.',
  },
  {
    id: 'cash',
    icon: '💰',
    color: '#8B3A2F',
    title: 'Humanitarian Cash Transfer Programming',
    subtitle: 'Measuring what matters in cash-based response',
    overview: 'Cash is the fastest-growing modality in humanitarian response, but measuring its impact remains a challenge. I build the data systems — post-distribution monitoring frameworks, delivery tracking dashboards, and inter-agency analytical tools — that ensure cash programs reach the most vulnerable and achieve their intended outcomes.',
    capabilities: [
      'Post-distribution monitoring framework design',
      'Inter-agency cash impact meta-analysis',
      'Cash delivery and payment tracking dashboards',
      'Market monitoring and price analysis',
      'Beneficiary data management systems',
      'Cash Working Group coordination and reporting',
      'Multi-purpose cash assessment tools',
    ],
    tools: ['Power BI', 'Python', 'KoboToolbox', 'Excel/VBA', 'ODK', 'SCOPE', 'RedRose'],
    impact: 'Designed the first inter-agency PDM meta-analysis framework, unifying 1,559 household surveys from five organizations in Ethiopia.',
  },
]

export default function ExpertisePage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Expertise</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Four Pillars of Practice
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          A decade of humanitarian work distilled into four interconnected domains. Each pillar reinforces the others — data analytics powers GIS platforms, climate analysis drives anticipatory cash, and cash monitoring feeds back into data systems.
        </p>
      </section>

      {/* Testimonial — top */}
      <Testimonial
        quote="His ethical, risk-informed, and forward-thinking approach makes him an invaluable leader in humanitarian geospatial information technologies and emergency response coordination."
        name="Abdon Trowonou"
        title="Operations Director"
        org="iMMAP Inc. Headquarters"
        pillarColor="#C4703F"
        variant="accent"
      />

      {/* Pillar Deep Dives */}
      {pillars.map((pillar, i) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`py-20 ${i % 2 === 0 ? '' : 'bg-beige-200/50'}`}
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">{pillar.icon}</span>
              <div>
                <h2 className="font-serif text-3xl text-coffee">{pillar.title}</h2>
                <p className="text-dusty-orange font-medium">{pillar.subtitle}</p>
              </div>
            </div>

            <p className="text-coffee-light/80 leading-relaxed max-w-3xl mb-10">{pillar.overview}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Capabilities */}
              <div className="bg-white rounded-2xl p-8 border border-beige-300">
                <h3 className="font-serif text-lg text-coffee mb-4">Core Capabilities</h3>
                <ul className="space-y-2">
                  {pillar.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2 text-sm text-coffee-muted">
                      <span style={{ color: pillar.color }} className="mt-0.5">&#9656;</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools & Impact */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-beige-300">
                  <h3 className="font-serif text-lg text-coffee mb-4">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {pillar.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs px-3 py-1.5 rounded-full border text-coffee-muted"
                        style={{ borderColor: pillar.color + '40' }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-2xl p-8 text-white"
                  style={{ backgroundColor: pillar.color }}
                >
                  <h3 className="font-serif text-lg mb-2">Impact Highlight</h3>
                  <p className="text-sm leading-relaxed opacity-90">{pillar.impact}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* What Supervisors Say */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">What Supervisors Say</p>
        </div>
        <TestimonialRow
          testimonials={[
            {
              quote: 'Alex has exceeded expectations as far as CBI is concerned. He has worked tirelessly to ensure a functioning system and trained and supported field staff and finance staff on systems strengthening.',
              name: 'Lauren Pearson',
              title: 'Programme Manager',
              org: 'IOM Bangladesh',
              pillarColor: '#8B3A2F',
            },
            {
              quote: 'His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming. Alex\'s work reflects not just technical skill but strategic impact at the highest level.',
              name: 'Samson Muradzikwa',
              title: 'Regional Social Policy Advisor (MENA)',
              org: 'UNICEF',
              pillarColor: '#009EDB',
            },
            {
              quote: 'He has demonstrated the capacities required to take on international IM assignments. Alex has significant technical experience and related contribution to the improvement of IM tools and data collection.',
              name: 'Michelle Hsu',
              title: 'Food Security Sector Coordinator',
              org: 'FAO Nigeria',
              pillarColor: '#C4703F',
            },
          ]}
        />
      </section>

      {/* More Testimonials */}
      <section className="pb-16">
        <TestimonialRow
          testimonials={[
            {
              quote: 'Alex consistently operates at the intersection of data, digital innovation and humanitarian emergency operational impact. His work reflects not just technical mastery, but innovation with strategic foresight.',
              name: 'Leslie Parker Odongkara',
              title: 'Coordinator, Food Security & Agriculture Cluster',
              org: 'FAO Afghanistan',
              pillarColor: '#009EDB',
            },
            {
              quote: 'Alex is an invaluable asset to iMMAP Inc., not only in Afghanistan but on a global scale. His exceptional leadership and problem-solving skills have consistently contributed to the success of the organization\'s mission.',
              name: 'Belo Mohammed',
              title: 'Country Representative, Afghanistan',
              org: 'iMMAP Inc.',
              pillarColor: '#009EDB',
            },
            {
              quote: 'He proved to be an invaluable member of the team. Mr. Nwoko is able to work with a high degree of independence and in multicultural environment. He is conscientious and results-oriented.',
              name: 'Rafaelle Robelin',
              title: 'Shelter/NFI & CCCM Sector Coordinator',
              org: 'IOM Nigeria',
              pillarColor: '#7B4B94',
            },
          ]}
        />
      </section>
    </div>
  )
}
