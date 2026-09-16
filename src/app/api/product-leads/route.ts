import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { productLeadSchema } from '@/lib/validation';

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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = productLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide valid customer details.' },
        { status: 400 }
      );
    }

    const lead = parsed.data;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
        <h2 style="margin-bottom: 12px;">New Product Interest</h2>
        <p><strong>Product:</strong> ${escapeHtml(lead.product_name)}</p>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email || 'Not provided')}</p>
        <p><strong>City:</strong> ${escapeHtml(lead.city || 'Not provided')}</p>
      </div>
    `;

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      replyTo: lead.email || lead.phone,
      subject: `Product Interest: ${lead.product_name}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'We could not send your details. Please try again.' },
      { status: 500 }
    );
  }
}