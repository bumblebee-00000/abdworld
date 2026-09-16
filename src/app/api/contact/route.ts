import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validation';

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
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      status: 'new',
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send your message. Please try again.' },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      replyTo: parsed.data.email || undefined,
      subject: `Contact Message: ${parsed.data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
          <h2 style="margin-bottom: 12px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Phone:</strong> ${parsed.data.phone}</p>
          <p><strong>Email:</strong> ${parsed.data.email || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${parsed.data.subject}</p>
          <p><strong>Message:</strong> ${parsed.data.message}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}