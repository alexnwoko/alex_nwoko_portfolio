import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ProjectsClient from './ProjectsClient'

/**
 * Server-component wrapper so we can export metadata + canonical for
 * /projects. The interactive page lives in ProjectsClient.tsx.
 */
export const metadata: Metadata = {
  title: { absolute: 'Projects · DRR Data Systems & Multi-Hazard Platforms — Alex Nwoko' },
  description:
    'Selected projects: DELTA Resilience at UNDRR, ReportHub, HSDC, PDM Meta-Analysis, CBIIMS and ReliefCash, disaster data systems and multi-hazard platforms built across six countries.',
  alternates: { canonical: 'https://alexnwoko.com/projects' },
}

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://alexnwoko.com' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://alexnwoko.com/projects' },
  ],
}

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={BREADCRUMB_JSON_LD} />
      <ProjectsClient />
    </>
  )
}
