import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

/**
 * Server-component wrapper so we can export metadata + canonical for
 * /projects. The interactive page lives in ProjectsClient.tsx.
 */
export const metadata: Metadata = {
  title: { absolute: 'Projects · DRR Data Systems & Multi-Hazard Platforms — Alex Nwoko' },
  description:
    'Selected projects: ReportHub, HSDC, ReliefCash, DELTA Resilience, disaster data systems and multi-hazard platforms built across six countries.',
  alternates: { canonical: 'https://alexnwoko.com/projects' },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
