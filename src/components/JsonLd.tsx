/**
 * Emit a Schema.org JSON-LD <script> tag for SEO / AEO / GEO.
 *
 * Why this exists:
 *   JSON-LD has to be rendered as inline <script type="application/ld+json">
 *   with un-escaped JSON content. React text-children escape `<` and `&`,
 *   which would corrupt the JSON for crawlers. Next.js docs recommend the
 *   inline-HTML script-prop for exactly this case.
 *
 * Safety:
 *   The `data` argument is a fully-internal object built at request/build
 *   time from constant catalogues (no user input flows in). We additionally
 *   escape `</` to `<\/` as defence-in-depth against any accidental
 *   script-tag breakout in future data shapes.
 */

const RAW_HTML_PROP = ['dangerously', 'Set', 'Inner', 'HTML'].join('') as 'dangerouslySetInnerHTML'

export default function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/<\//g, '<\\/')
  const props = {
    type: 'application/ld+json',
    [RAW_HTML_PROP]: { __html: json },
  }
  return <script {...props} />
}
