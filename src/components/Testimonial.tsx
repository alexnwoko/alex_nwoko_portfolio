interface TestimonialProps {
  quote: string
  name: string
  title: string
  org: string
  pillarColor?: string
  variant?: 'default' | 'compact' | 'accent'
}

export default function Testimonial({
  quote,
  name,
  title,
  org,
  pillarColor = '#C4703F',
  variant = 'default',
}: TestimonialProps) {
  if (variant === 'accent') {
    return (
      <div className="bg-coffee py-14 my-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="font-serif text-xl md:text-2xl text-white leading-relaxed mb-6">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div>
            <p className="text-sm text-beige-300 font-medium">{name}</p>
            <p className="text-xs text-beige-400">
              {title}, {org}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className="bg-white rounded-2xl p-6 md:p-8 border border-beige-300 relative"
        style={{ borderLeftColor: pillarColor, borderLeftWidth: '4px' }}
      >
        <svg
          className="absolute top-4 right-4 w-8 h-8 opacity-[0.08]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
        </svg>
        <blockquote className="text-sm text-coffee-light leading-relaxed mb-4 italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div>
          <p className="text-sm text-coffee font-semibold">{name}</p>
          <p className="text-xs text-coffee-muted">
            {title}, {org}
          </p>
        </div>
      </div>
    )
  }

  // default variant
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div
        className="bg-white rounded-2xl p-8 md:p-10 border border-beige-300 relative overflow-hidden"
        style={{ borderTopColor: pillarColor, borderTopWidth: '3px' }}
      >
        <svg
          className="absolute top-6 right-6 w-12 h-12 opacity-[0.06]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
        </svg>
        <blockquote className="font-reading text-lg md:text-xl text-coffee-light leading-relaxed mb-6 relative z-10">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="relative z-10">
          <p className="text-sm text-coffee font-semibold">{name}</p>
          <p className="text-xs text-coffee-muted">
            {title}, {org}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialRow({ testimonials }: { testimonials: TestimonialProps[] }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className={`grid grid-cols-1 ${testimonials.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {testimonials.map((t, i) => (
          <Testimonial key={i} {...t} variant="compact" />
        ))}
      </div>
    </div>
  )
}
