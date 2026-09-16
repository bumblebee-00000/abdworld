import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { wholesaleSchema } from '@/lib/validation';

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
    const parsed = wholesaleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('wholesale_enquiries').insert({
      name: parsed.data.name,
      business_name: parsed.data.business_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      location: parsed.data.location,
      rice_requirement: parsed.data.rice_requirement,
      approximate_quantity: parsed.data.approximate_quantity,
      message: parsed.data.message || null,
      status: 'new',
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit your enquiry. Please try again.' },
        { status: 500 }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
        <h2 style="margin-bottom: 12px;">New Wholesale Enquiry</h2>
        <p><strong>Name:</strong> ${parsed.data.name}</p>
        <p><strong>Business:</strong> ${parsed.data.business_name}</p>
        <p><strong>Phone:</strong> ${parsed.data.phone}</p>
        <p><strong>Email:</strong> ${parsed.data.email || 'Not provided'}</p>
        <p><strong>Location:</strong> ${parsed.data.location}</p>
        <p><strong>Rice Requirement:</strong> ${parsed.data.rice_requirement}</p>
        <p><strong>Approximate Quantity:</strong> ${parsed.data.approximate_quantity}</p>
        <p><strong>Message:</strong> ${parsed.data.message || 'No message provided'}</p>
      </div>
    `;

    await transporter.sendMail({
      from: 'abdworldinfo@gmail.com',
      to: 'abdworldinfo@gmail.com',
      replyTo: parsed.data.email || parsed.data.phone,
      subject: `Wholesale Enquiry from ${parsed.data.business_name}`,
      html: emailHtml,
    });

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully.' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}