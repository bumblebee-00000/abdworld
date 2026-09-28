import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validation';
import { checkSubmissionRateLimit } from '@/lib/rate-limit';
import { escapeHtml } from '@/lib/utils';

export const runtime = 'nodejs';

const gmailUser = process.env.GMAIL_USER || 'abdworldinfo@gmail.com';
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPassword || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkSubmissionRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: contactMessage, error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      status: 'new',
    }).select('id').single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send your message. Please try again.' },
        { status: 500 }
      );
    }

    try {
      await transporter.sendMail({
        from: gmailUser,
        to: gmailUser,
        replyTo: parsed.data.email || undefined,
        subject: `Contact Message: ${parsed.data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
            <h2 style="margin-bottom: 12px;">New Contact Message</h2>
            <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(parsed.data.phone)}</p>
            <p><strong>Email:</strong> ${escapeHtml(parsed.data.email || 'Not provided')}</p>
            <p><strong>Subject:</strong> ${escapeHtml(parsed.data.subject)}</p>
            <p><strong>Message:</strong> ${escapeHtml(parsed.data.message)}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Contact message notification email failed:', emailError);
    }

    if (parsed.data.email) {
      try {
        await transporter.sendMail({
          from: gmailUser,
          to: parsed.data.email,
          subject: `We received your message (${contactMessage.id.slice(0, 8).toUpperCase()})`,
          html: `<p>Hello ${escapeHtml(parsed.data.name)},</p><p>We received your message about ${escapeHtml(parsed.data.subject)}.</p><p>Reference: <strong>${contactMessage.id.slice(0, 8).toUpperCase()}</strong></p><p>We will reply within 24 hours. This message does not confirm an order.</p>`,
        });
      } catch (emailError) {
        console.error('Contact message receipt email failed:', emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        reference: contactMessage.id.slice(0, 8).toUpperCase(),
        message: 'Message sent successfully.',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}