import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Founder Journey — Alex Nwoko',
  description: 'From humanitarian systems architect to tech founder building platforms that digitize Africa\'s informal economies. The story of Vendoh and MAKKET.',
}

export default function FounderJourneyPage() {
  return (
    <div className="pt-24 pb-16">
      {/* ═══ HERO ═══ */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Founder Journey</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-8 leading-tight">
          From Crisis Data to African Commerce
        </h1>
        <div className="prose prose-lg max-w-none text-coffee-light/80 leading-relaxed space-y-6">
          <p>
            A decade of building humanitarian data systems across six countries taught me something I couldn't have learned in Silicon Valley. I watched teams use geospatial intelligence to predict crises, trust infrastructure to move cash through markets that didn't exist on formal networks, and real-time data systems coordinate responses across 200+ organizations in the world's most fragmented operating environments.
          </p>
          <p>
            And then I noticed something: the problems we solved in crisis response—fragmented information, broken trust, invisible supply chains—are the exact same problems that define Africa's massive informal economies. That pattern shift sparked a new chapter. I started asking different questions: <em>What if we applied humanitarian systems architecture to African commerce?</em> What if founders who understood the constraints of operating in these environments built the infrastructure layer?
          </p>
          <p>
            That insight became Vendoh and MAKKET—two ventures built on the principle that Africa's informal economies don't need to be disrupted. They need to be digitized by people who understand them.
          </p>
        </div>
      </section>

      {/* ═══ THE THESIS ═══ */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">The Thesis</p>
        <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-12">Why Africa's Informal Economies Need Tech-Native Founders</h2>

        <div className="prose prose-lg max-w-none text-coffee-light/80 leading-relaxed space-y-8">
          <p>
            Africa's informal commerce is a $2.3 trillion economy operating almost entirely offline. Street traders, market vendors, service professionals, and micro-entrepreneurs move more capital through person-to-person transactions than most formal financial institutions touch. Yet this entire ecosystem remains invisible to formal data systems, inaccessible to digital platforms, and unprotected by the infrastructure that digitized commerce in other regions.
          </p>
          <p>
            The irony: the skills that humanitarian data architects use—geospatial intelligence, trust infrastructure, real-time data systems, designing for low-connectivity and low-literacy populations—are exactly what's needed to unlock this market. I built those systems for environments where infrastructure is unreliable, trust is earned not assumed, data is fragmented, and users are offline-first. Those same design principles apply directly to African informal markets.
          </p>
          <p>
            But here's the deeper truth: the problem isn't that technology doesn't exist. The problem is that most tech solutions are designed by people who've never been inside an African market. They import Western marketplace models wholesale—models that assume formal addresses, stable internet, digital payment accounts, and standardized pricing. None of that exists in the contexts where 90% of African economic activity happens. When solutions fail in these markets, it's not because Africans don't want to digitize. It's because the products were built for different constraints.
          </p>
          <p>
            A founder with a decade of field experience—someone who's built systems for environments where infrastructure is a variable you have to design around, not a given you can assume—has an unfair advantage. Not because we're smarter. But because we've learned something that theory alone can't teach: how to build for the world as it actually is, not as we wish it were.
          </p>
        </div>
      </section>

      {/* ═══ THE VENTURES ═══ */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">The Ventures</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VENDOH CARD */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8 flex flex-col h-full" style={{ borderTopWidth: '4px', borderTopColor: '#FF6B00' }}>
            <div className="mb-6">
              <span className="text-3xl">🎙️</span>
            </div>
            <h3 className="font-serif text-2xl text-coffee mb-1">Vendoh</h3>
            <p className="text-sm text-dusty-orange font-medium mb-6">Voice-First Service Marketplace</p>
            <p className="text-base text-coffee-light/90 leading-relaxed mb-6">
              Africa's first voice-first, AI-native service marketplace. Starting with Nigeria's $2.3B urban service economy where less than 5% of transactions happen on formal platforms. Voice-enabled discovery in Nigerian English and Pidgin, intelligent proximity matching, dual-role flexibility (anyone can be both client and vendor), and escrow-protected payments.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-beige-300">
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">$2.3B</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Market Opportunity</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">150+</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Pre-Launch Vendors</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">&lt;5%</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Digital Penetration</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">78%</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Using Voice Messages</div>
              </div>
            </div>

            <div className="mb-6">
              <span className="inline-block px-3 py-1.5 rounded-full bg-orange-50 text-dusty-orange text-xs font-semibold uppercase tracking-wider">
                Active Build — Launching Q2 2026
              </span>
            </div>

            <div className="mt-auto">
              <p className="text-xs text-coffee-muted mb-3 font-semibold uppercase tracking-wider">Stack</p>
              <p className="text-sm text-coffee-light">React Native + Expo, Supabase, Voice AI (Whisper + GPT-4o), Paystack</p>
            </div>
          </div>

          {/* MAKKET CARD */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8 flex flex-col h-full" style={{ borderTopWidth: '4px', borderTopColor: '#4B6CFF' }}>
            <div className="mb-6">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="font-serif text-2xl text-coffee mb-1">MAKKET</h3>
            <p className="text-sm text-dusty-orange font-medium mb-6">Digitising Nigeria's Physical Markets</p>
            <p className="text-base text-coffee-light/90 leading-relaxed mb-6">
              A mobile-first market-enablement platform connecting buyers with traders across Nigeria's 600+ physical markets. Unlike e-commerce platforms that try to replace markets, MAKKET digitizes discovery, trust, and trade for existing traders—making the invisible geography of African commerce visible and accessible.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-beige-300">
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">$200B+</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">TAM</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">600+</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Markets Mapped</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">500</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Pioneer Sellers</div>
              </div>
              <div>
                <div className="font-serif text-lg text-dusty-orange mb-1">3</div>
                <div className="text-xs text-coffee-muted uppercase tracking-wider">Launch Cities</div>
              </div>
            </div>

            <div className="mb-6">
              <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                Pre-MVP — Active Development
              </span>
            </div>

            <div className="mt-auto">
              <p className="text-xs text-coffee-muted mb-3 font-semibold uppercase tracking-wider">Stack</p>
              <p className="text-sm text-coffee-light">React Native + Expo, Supabase, Mapbox, Voice AI (Phase 2)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HUMANITARIAN INSIGHTS ═══ */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Field Lessons</p>
        <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-12">What Humanitarian Tech Taught Me About Building for Africa</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Insight 1: Trust */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">🔐</span>
              <div>
                <h3 className="font-serif text-xl text-coffee">Trust is Infrastructure</h3>
              </div>
            </div>
            <p className="text-coffee-light/90 leading-relaxed">
              In humanitarian response, we built verification systems, community feedback loops, and accountability mechanisms—not because we wanted to, but because trust was what determined whether beneficiaries would engage. In African commerce, trust IS the product. MAKKET's seller verification and Vendoh's escrow system come directly from that humanitarian foundation. When markets work, it's because traders trust the system and other traders. We're building that trust infrastructure from day one.
            </p>
          </div>

          {/* Insight 2: Voice */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">🎙️</span>
              <div>
                <h3 className="font-serif text-xl text-coffee">Voice Before Text</h3>
              </div>
            </div>
            <p className="text-coffee-light/90 leading-relaxed">
              Humanitarian operations in Nigeria taught me that voice is the dominant communication mode. 78% of Nigerians send voice messages daily. Literacy rates don't reflect actual platform adoption—voice does. Vendoh's voice-first interface isn't a feature we added for accessibility. It's the primary input method because that's how people actually communicate. Every interface decision flows from that reality.
            </p>
          </div>

          {/* Insight 3: Density */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-serif text-xl text-coffee">Density Before Breadth</h3>
              </div>
            </div>
            <p className="text-coffee-light/90 leading-relaxed">
              In crisis response, you don't try to cover an entire country on day one. You prove your model in one operational area, measure the impact, then scale. Both Vendoh and MAKKET follow this principle—starting with Lagos, proving unit economics and product-market fit, then expanding to Abuja and Port Harcourt. Deep market knowledge in one location beats shallow presence everywhere.
            </p>
          </div>

          {/* Insight 4: Constraints */}
          <div className="bg-white rounded-2xl border border-beige-300 p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="font-serif text-xl text-coffee">Design for the Constraint</h3>
              </div>
            </div>
            <p className="text-coffee-light/90 leading-relaxed">
              Humanitarian systems must work on 2G networks, basic phones, and unreliable power. African marketplace platforms face identical constraints. Every UX decision—offline-first architecture, minimal data usage, low-dependency interfaces—is shaped by these realities. When you design for constraint, you design for resilience.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ VISION — Dark Section ═══ */}
      <section className="bg-coffee text-white py-20 mb-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-dusty-orange font-semibold mb-3">The Vision</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">Building the Infrastructure Layer for African Commerce</h2>

          <div className="prose prose-lg max-w-none text-beige-400 leading-relaxed space-y-6">
            <p>
              MAKKET and Vendoh are not just startups. They represent a thesis: Africa's informal economies can be digitized by founders who understand the operational terrain. The analytical frameworks that predict humanitarian crises can model market dynamics. The geospatial tools that map disaster risk can map commercial opportunity. The voice interfaces that serve crisis-affected populations can serve market traders. The trust infrastructure built for cash transfers can secure payment flows between strangers in markets.
            </p>
            <p>
              My goal is to build the infrastructure layer that makes African commerce visible, trustworthy, and efficient—starting with Nigeria, expanding across the continent. Not by replacing informal systems, but by digitizing them in ways that respect how people actually operate. Because the traders on Lagos' streets and the market sellers across Nigeria aren't waiting for disruption. They're ready to grow, once the right tools exist.
            </p>
            <p>
              That's what I'm building.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/blog"
            className="px-8 py-3.5 bg-white text-coffee rounded-lg font-medium text-sm hover:bg-beige-100 hover:-translate-y-0.5 transition-all border border-beige-300"
          >
            Read My Blog
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
