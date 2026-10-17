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

interface PostalOffice {
  Name?: string | null;
  Block?: string | null;
  Division?: string | null;
  District?: string | null;
  Region?: string | null;
  State?: string | null;
  Pincode?: string | null;
}

interface PostalLookupResult {
  Status?: string;
  PostOffice?: PostalOffice[] | null;
}

function normalizePlace(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesPostalPlace(value: string, knownPlaces: Array<string | null | undefined>) {
  const normalizedValue = normalizePlace(value);
  return knownPlaces.some((place) => {
    if (!place) return false;
    const normalizedPlace = normalizePlace(place);
    if (!normalizedPlace) return false;
    return normalizedPlace === normalizedValue || (
      normalizedValue.length >= 4 &&
      normalizedPlace.length >= 4 &&
      (normalizedPlace.includes(normalizedValue) || normalizedValue.includes(normalizedPlace))
    );
  });
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
    let postalResponse: Response;
    try {
      postalResponse = await fetch(`https://api.postalpincode.in/pincode/${lead.pin_code}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return NextResponse.json(
        { error: 'We could not verify this PIN code right now. Please try again.' },
        { status: 503 }
      );
    }

    if (!postalResponse.ok) {
      return NextResponse.json(
        { error: 'We could not verify this PIN code right now. Please try again.' },
        { status: 503 }
      );
    }

    let postalResults: PostalLookupResult[];
    try {
      postalResults = await postalResponse.json();
    } catch {
      return NextResponse.json(
        { error: 'We could not verify this PIN code right now. Please try again.' },
        { status: 503 }
      );
    }

    const postalOffices = postalResults
      .flatMap((result) => result.PostOffice ?? [])
      .filter((office) => office.Pincode === lead.pin_code);
    if (!postalOffices.length) {
      return NextResponse.json(
        { error: 'This PIN code was not found. Please check it and try again.' },
        { status: 400 }
      );
    }

    const locationMatches = matchesPostalPlace(lead.location, postalOffices.flatMap((office) => [
      office.Name,
      office.Block,
      office.Division,
      office.District,
      office.Region,
      office.State,
    ]));
    const areaMatches = matchesPostalPlace(lead.area, postalOffices.flatMap((office) => [
      office.Name,
      office.Block,
    ]));
    const districtMatches = matchesPostalPlace(
      lead.district,
      postalOffices.map((office) => office.District)
    );
    const stateMatches = matchesPostalPlace(
      lead.state,
      postalOffices.map((office) => office.State)
    );

    if (!locationMatches || !areaMatches || !districtMatches || !stateMatches) {
      return NextResponse.json(
        { error: 'The PIN code does not match the entered location details. Please select a suggestion or correct the address.' },
        { status: 400 }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
        <h2 style="margin-bottom: 12px;">New Wholesale Quote Request</h2>
        <p><strong>Product:</strong> ${escapeHtml(lead.product_name)}</p>
        ${lead.pack_size ? `<p><strong>Pack size:</strong> ${escapeHtml(lead.pack_size)}</p>` : ''}
        ${lead.quantity ? `<p><strong>Quantity:</strong> ${lead.quantity} packs</p>` : ''}
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email || 'Not provided')}</p>
        <p><strong>Location:</strong> ${escapeHtml(lead.location)}</p>
        <p><strong>Area:</strong> ${escapeHtml(lead.area)}</p>
        <p><strong>District:</strong> ${escapeHtml(lead.district)}</p>
        <p><strong>State:</strong> ${escapeHtml(lead.state)}</p>
        <p><strong>PIN code:</strong> ${escapeHtml(lead.pin_code)}</p>
        ${lead.message ? `<p><strong>Requirements:</strong> ${escapeHtml(lead.message)}</p>` : ''}
      </div>
    `;

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      replyTo: lead.email || lead.phone,
      subject: `Wholesale Quote Request: ${lead.product_name}`,
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