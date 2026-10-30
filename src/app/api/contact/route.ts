import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const CONTACT_TO = 'alex.u.nwoko@gmail.com'
const CONTACT_FROM = 'alexnwoko.com contact <onboarding@resend.dev>'

const MAX_FIELD = {
  name: 200,
  email: 320,
  subject: 200,
  message: 10_000,
}

function clean(input: unknown, limit: number): string {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, limit)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[api/contact] RESEND_API_KEY not set')
    return NextResponse.json(
      { error: 'Email service not configured.' },
      { status: 503 }
    )
  }

  let payload: Record<string, unknown> = {}
  const ct = req.headers.get('content-type') || ''
  try {
    if (ct.includes('application/json')) {
      payload = (await req.json()) as Record<string, unknown>
    } else {
      const form = await req.formData()
      form.forEach((v, k) => {
        payload[k] = typeof v === 'string' ? v : ''
      })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = clean(payload.name, MAX_FIELD.name)
  const email = clean(payload.email, MAX_FIELD.email)
  const subject = clean(payload.subject, MAX_FIELD.subject) || 'General Inquiry'
  const message = clean(payload.message, MAX_FIELD.message)
  const honey = clean(payload.company, 100)

  if (honey) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email and message are required.' },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #1F140A; max-width: 560px; margin: 0 auto;">
      <h2 style="font-size: 18px; margin: 0 0 16px;">New message from alexnwoko.com</h2>
      <table style="border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 4px 12px 4px 0; color: #7A5C44;">Name</td><td style="padding: 4px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #7A5C44;">Email</td><td style="padding: 4px 0;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #7A5C44;">Subject</td><td style="padding: 4px 0;">${escapeHtml(subject)}</td></tr>
      </table>
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5d6c3; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${escapeHtml(message)}</div>
    </div>
  `.trim()

  const text = `New message from alexnwoko.com\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}\n`

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject: `[alexnwoko.com] ${subject} — ${name}`,
      html,
      text,
      replyTo: email,
    })

    if (error) {
      console.error('[api/contact] Resend error:', error)
      return NextResponse.json({ error: 'Could not send message.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 })
  } catch (err) {
    console.error('[api/contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })
  }
}
