import type { Metadata } from 'next'

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
    degree: 'BSc Geography & Meteorology',
    institution: 'Imo State University, Nigeria',
    period: '2012',
    note: 'First Class Honours. Research on urban flood risk assessment.',
  },
]

const memberships = [
  { title: 'Fellow', org: 'Royal Geographical Society (FRGS)', since: '2016' },
  { title: 'Member', org: 'American Association of Geographers (AAG)', since: '2015' },
  { title: 'Member', org: 'Humanitarian OpenStreetMap Team (HOT)', since: '2017' },
]

const certifications = [
  'Google Data Analytics Professional Certificate',
  'Google Project Management Professional Certificate',
  'IBM Data Science Professional Certificate',
  'ESRI ArcGIS Spatial Analysis',
  'Tableau Desktop Specialist',
  'Power BI Data Analyst Associate',
]

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
      <section className="max-w-4xl mx-auto px-6 mb-20 bg-beige-200/50 -mx-6 px-6 py-16 md:-mx-0 md:px-6 rounded-2xl">
        <h2 className="font-serif text-2xl text-coffee mb-8">Certifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div key={cert} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-beige-300">
              <span className="text-dusty-orange mt-0.5">&#10003;</span>
              <span className="text-sm text-coffee-light">{cert}</span>
            </div>
          ))}
        </div>
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
