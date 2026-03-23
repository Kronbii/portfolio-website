import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

import { siteConfig } from '@/lib/site'

function escapeHtml(text: string) {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (match) => map[match])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return NextResponse.json(
        { error: 'One or more fields exceed the maximum allowed length.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const sanitizedName = escapeHtml(name)
    const sanitizedEmail = escapeHtml(email)
    const sanitizedMessage = escapeHtml(message)

    const { error } = await resend.emails.send({
      from: `Portfolio Contact <contact@${new URL(siteConfig.url).hostname}>`,
      to: [siteConfig.email],
      replyTo: sanitizedEmail,
      subject: `New portfolio inquiry from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
          <h2 style="margin-bottom: 24px; color: #0f172a;">New portfolio inquiry</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <div style="margin-top: 24px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <p style="margin: 0 0 12px;"><strong>Message</strong></p>
            <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Message sent successfully.' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to process the request.' },
      { status: 500 }
    )
  }
}
