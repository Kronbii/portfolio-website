import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate input lengths to prevent abuse
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (maximum 100 characters)' },
        { status: 400 }
      )
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email is too long (maximum 255 characters)' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 5000 characters)' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the site administrator.' },
        { status: 500 }
      )
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Sanitize user input to prevent XSS attacks
    const escapeHtml = (text: string): string => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }
      return text.replace(/[&<>"']/g, (m) => map[m])
    }

    const sanitizedName = escapeHtml(name.trim())
    const sanitizedEmail = escapeHtml(email.trim())
    const sanitizedMessage = escapeHtml(message.trim())

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@ramikronbi.com>', // Update with your verified domain if you have one
      to: ['ramykronby@gmail.com'],
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #0a0a0a;">Name:</strong> <span style="color: #374151;">${sanitizedName}</span></p>
            <p style="margin: 10px 0;"><strong style="color: #0a0a0a;">Email:</strong> <span style="color: #374151;">${sanitizedEmail}</span></p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 10px 0 5px 0;"><strong style="color: #0a0a0a;">Message:</strong></p>
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            You can reply directly to this email to respond to ${sanitizedName}.
          </p>
        </div>
      `,
      replyTo: sanitizedEmail,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

