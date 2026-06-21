import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

/**
 * Server-component wrapper so we can export metadata + canonical for
 * /projects. The interactive page lives in ProjectsClient.tsx.
 */
export const metadata: Metadata = {
  title: 'Projects, Alex Nwoko',
  description:
    'Selected projects: ReportHub, HSDC, ReliefCash, DELTA Resilience contributions, and other data systems built across six countries of humanitarian operation.',
  alternates: { canonical: 'https://alexnwoko.com/projects' },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
