import type { MetadataRoute } from 'next'

/**
 * Robots policy.
 *
 * Generative engines (ChatGPT, Claude, Perplexity, Google AI Overviews,
 * etc.) only index sites whose robots.txt explicitly permits their crawler
 * user-agents. We opt in to the major reputable ones so the blog corpus
 * shows up in answer-engine results, and keep the catch-all permissive
 * for traditional search.
 */
export default function robots(): MetadataRoute.Robots {
  const blockedPaths = ['/api/', '/_next/']

  // Reputable AI / answer-engine crawlers we explicitly opt in to.
  // Listing them by name (rather than relying on the wildcard) is the
  // signal these companies look for when deciding whether a site has
  // opted in to generative-engine indexing.
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'Bytespider',
    'cohere-ai',
    'Meta-ExternalAgent',
    'DuckAssistBot',
    'YouBot',
    'Diffbot',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: blockedPaths,
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: blockedPaths,
      })),
    ],
    sitemap: 'https://alexnwoko.com/sitemap.xml',
    host: 'https://alexnwoko.com',
  }
}
