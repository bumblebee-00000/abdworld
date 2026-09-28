import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { wholesaleSchema } from '@/lib/validation';
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
    const parsed = wholesaleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: enquiry, error } = await supabase.from('wholesale_enquiries').insert({
      name: parsed.data.name,
      business_name: parsed.data.business_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      location: parsed.data.location,
      rice_requirement: parsed.data.rice_requirement,
      approximate_quantity: parsed.data.approximate_quantity,
      message: parsed.data.message || null,
      status: 'new',
    }).select('id').single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit your enquiry. Please try again.' },
        { status: 500 }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
        <h2 style="margin-bottom: 12px;">New Wholesale Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
        <p><strong>Business:</strong> ${escapeHtml(parsed.data.business_name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(parsed.data.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(parsed.data.email || 'Not provided')}</p>
        <p><strong>Location:</strong> ${escapeHtml(parsed.data.location)}</p>
        <p><strong>Rice Requirement:</strong> ${escapeHtml(parsed.data.rice_requirement)}</p>
        <p><strong>Approximate Quantity:</strong> ${escapeHtml(parsed.data.approximate_quantity)}</p>
        <p><strong>Message:</strong> ${escapeHtml(parsed.data.message || 'No message provided')}</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: gmailUser,
        to: gmailUser,
        replyTo: parsed.data.email || parsed.data.phone,
        subject: `Wholesale Enquiry from ${parsed.data.business_name}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Wholesale enquiry notification email failed:', emailError);
    }

    if (parsed.data.email) {
      try {
        await transporter.sendMail({
          from: gmailUser,
          to: parsed.data.email,
          subject: `We received your ABD WORLD quote request (${enquiry.id.slice(0, 8).toUpperCase()})`,
          html: `<p>Hello ${escapeHtml(parsed.data.name)},</p><p>We received your wholesale quote request for ${escapeHtml(parsed.data.business_name)}.</p><p>Reference: <strong>${enquiry.id.slice(0, 8).toUpperCase()}</strong></p><p>This is an enquiry, not a confirmed order. We will check availability and contact you with pricing and delivery details.</p>`,
        });
      } catch (emailError) {
        console.error('Wholesale enquiry receipt email failed:', emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        reference: enquiry.id.slice(0, 8).toUpperCase(),
        message: 'Enquiry submitted successfully.',
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