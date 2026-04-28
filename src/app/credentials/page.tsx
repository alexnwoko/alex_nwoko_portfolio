import type { Metadata } from 'next'
import Testimonial, { TestimonialRow } from '@/components/Testimonial'

export const metadata: Metadata = {
  title: 'Credentials — Alex Nwoko',
  description: 'Education, professional memberships, certifications, and technical skills.',
}

const education = [
  {
    degree: 'MSc Information Systems Management',
    institution: 'University of Salford, Manchester',
    period: 'In progress',
    note: 'Focus on enterprise data architecture and digital transformation',
  },
  {
    degree: 'Business Analytics Certificate',
    institution: 'Harvard Business School Online',
    period: '2023',
    note: 'Statistical analysis, regression modeling, and data-driven decision-making',
  },
  {
    degree: 'MSc Risk and Environmental Hazards',
    institution: 'Durham University, UK',
    period: '2015',
    note: 'Commonwealth Scholar. Research on social vulnerability indices in partnership with Newcastle City Council Emergency Planning Unit.',
  },
  {
    degree: 'BSc Geography and Planning',
    institution: 'Abia State University · Faculty of Environmental Studies, Abia State, Nigeria',
    period: 'Oct 2008 – Sept 2012',
    note: 'Majors: Geographic Information Systems (GIS), Remote Sensing, Environmental Risk, Land Use Planning, Health Geography. Dissertation research on urban flood risk assessment.',
  },
]

const memberships = [
  { title: 'Fellow', org: 'Royal Geographical Society (FRGS)', since: '2016' },
  { title: 'Member', org: 'American Association of Geographers (AAG)', since: '2015' },
  { title: 'Member', org: 'Humanitarian OpenStreetMap Team (HOT)', since: '2017' },
]

const certifications: Record<string, { certs: string[]; color: string }> = {
  'Data Analytics, IM & Cluster Coordination': {
    color: '#009EDB',
    certs: [
      'Data Management & Analysis for Cluster Information Management — UNICEF (2022)',
      'Response Monitoring and Reporting for a Cluster — UNICEF (2022)',
      'Humanitarian Needs Assessments for Clusters — UNICEF (2022)',
      'Global Nutrition Cluster Information Management Level 2 — UNICEF (2022)',
      'Global Nutrition Cluster Coordination Level 2 — UNICEF (2022)',
      'Basic Training on Nutrition in Emergencies — UNICEF (2022)',
      'Health Cluster Coordination — Global Health Cluster (2020)',
      'Child Protection Information Management System (CPIMS+) — UNICEF Afghanistan (2024)',
      'IPC Acute Food Insecurity — IPC Global Partners (2025)',
      'IPC Acute Malnutrition — IPC Global Partners (2025)',
    ],
  },
  'GIS, Remote Sensing & Spatial Data Science': {
    color: '#7B4B94',
    certs: [
      'Spatial Data Science: The New Frontier in Analytics — ESRI (2020)',
      'Geospatial Information Technology (GIT) in Fragile Contexts — University of Twente / ITC (2020)',
    ],
  },
  'Climate, DRR & Emergency Coordination': {
    color: '#C4703F',
    certs: [
      'Anticipatory Action Simulation Exercise — RedR UK (2024)',
      'Understanding Risk — GFDRR / World Bank (2023)',
      'Disaster Displacement — NRC / Platform on Disaster Displacement / UNDRR (2024)',
      'WASH in Emergencies — DisasterReady (2023)',
      'Shelter in Emergencies — DisasterReady (2023)',
      'Cash in Emergencies — DisasterReady (2023)',
    ],
  },
  'Cash & Voucher Assistance': {
    color: '#8B3A2F',
    certs: [
      'Cash and Voucher Assistance — The Fundamentals — CaLP (2019)',
      'CVA and Social Protection: Linking Humanitarian Cash & Social Protection — CaLP (2019)',
      'Monitoring and Adapting Cash and Voucher Assistance — CaLP (2019)',
      'The Remote Cash Course — CaLP Network',
      'Introduction to Market Analysis — CaLP / IRC (2019)',
      'A Practical Guide to Market Analysis — CaLP / IRC (2019)',
      'MEB, Gap Analysis and Calculating the Transfer Value — CALP / Oxfam (2023)',
    ],
  },
  'Project Management': {
    color: '#3D2B1F',
    certs: [
      'Results-Based Project Management (Excellence Award) — PM4DEV (2022)',
      'Effective Project Management (Excellence Award) — PM4DEV (2022)',
    ],
  },
}

const skills = {
  'Data & Analytics': ['Python', 'R', 'SQL', 'Power BI', 'Tableau', 'Excel/VBA', 'DAX', 'SPSS'],
  'GIS & Remote Sensing': ['ArcGIS Pro', 'QGIS', 'Google Earth Engine', 'Leaflet.js', 'Mapbox GL', 'PostGIS', 'GeoPandas'],
  'Humanitarian Tools': ['KoboToolbox', 'ODK', 'DEEP', 'ReportHub', 'HDX', 'OCHA tools'],
  'Development': ['JavaScript/TypeScript', 'React', 'Next.js', 'Node.js', 'Git', 'Docker'],
  'AI/ML': ['NLP', 'Classification', 'LLM Integration', 'Agent Architectures', 'TensorFlow'],
  'Languages': ['English (Native)', 'Igbo (Native)', 'French (Basic)'],
}

export default function CredentialsPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Credentials</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Education, Skills & Affiliations
        </h1>
      </section>

      {/* Education */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Education</h2>
        <div className="space-y-6">
          {education.map((edu, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-beige-300">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg text-coffee">{edu.degree}</h3>
                <span className="text-xs text-coffee-muted bg-beige-200 px-3 py-1 rounded-full">{edu.period}</span>
              </div>
              <p className="text-sm text-dusty-orange font-medium mb-2">{edu.institution}</p>
              <p className="text-sm text-coffee-muted">{edu.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Memberships */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Professional Memberships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memberships.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-beige-300 text-center">
              <p className="text-xs text-dusty-orange uppercase tracking-wider font-semibold mb-1">{m.title}</p>
              <h3 className="font-serif text-base text-coffee mb-1">{m.org}</h3>
              <p className="text-xs text-coffee-muted">Since {m.since}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Professional Certifications</h2>
        <div className="space-y-8">
          {Object.entries(certifications).map(([category, { certs, color }]) => (
            <div key={category}>
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color }}>
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certs.map((cert) => (
                  <div key={cert} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-beige-300">
                    <span className="mt-0.5" style={{ color }}>&#10003;</span>
                    <span className="text-sm text-coffee-light">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming. Alex's work reflects not just technical skill but strategic impact at the highest level."
        name="Samson Muradzikwa"
        title="Regional Social Policy Advisor (MENA)"
        org="UNICEF"
        pillarColor="#009EDB"
      />

      {/* More Testimonials */}
      <section className="mb-16">
        <TestimonialRow
          testimonials={[
            {
              quote: 'He proved to be an invaluable member of the team. He can deliver under tight deadlines and possesses a strong work ethic. I very much believe that Mr. Alex Nwoko will be an asset for any team.',
              name: 'Rafaelle Robelin',
              title: 'Shelter/NFI & CCCM Sector Coordinator',
              org: 'IOM Nigeria',
              pillarColor: '#7B4B94',
            },
            {
              quote: 'Alex is a hard working and reliable team member, he often goes above and beyond his ToR to meet mission requirements. He is a team player and pleasant to work with.',
              name: 'Lauren Pearson',
              title: 'Programme Manager',
              org: 'IOM Bangladesh',
              pillarColor: '#8B3A2F',
            },
            {
              quote: 'He has demonstrated the capacities required to take on international IM assignments. Alex has significant technical experience and related contribution to the improvement of IM tools.',
              name: 'Michelle Hsu',
              title: 'Food Security Sector Coordinator',
              org: 'FAO Nigeria',
              pillarColor: '#C4703F',
            },
          ]}
        />
      </section>

      {/* Technical Skills */}
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-2xl text-coffee mb-8">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-6 border border-beige-300">
              <h3 className="text-xs uppercase tracking-wider text-dusty-orange font-semibold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1.5 rounded-full border border-beige-300 text-coffee-muted">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
