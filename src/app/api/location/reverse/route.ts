import { NextRequest, NextResponse } from 'next/server';
import { checkSubmissionRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface ReverseGeocodeResult {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    hamlet?: string;
    road?: string;
    state_district?: string;
    district?: string;
    state?: string;
    postcode?: string;
  };
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkSubmissionRateLimit(`location:${ip}`, 10)) {
    return NextResponse.json(
      { error: 'Too many location lookups. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body: { latitude?: unknown; longitude?: unknown } = await request.json();
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return NextResponse.json({ error: 'Invalid location coordinates.' }, { status: 400 });
    }

    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));
    url.searchParams.set('zoom', '18');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ABDWorldQuoteForm/1.0 (mailto:abdworldinfo@gmail.com)',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not look up your current location. Please enter it manually.' },
        { status: 503 }
      );
    }

    const result: ReverseGeocodeResult = await response.json();
    const address = result.address;
    const location = address?.city || address?.town || address?.village || address?.municipality || '';
    const area = address?.suburb || address?.neighbourhood || address?.quarter || address?.hamlet || address?.road || location;
    const district = address?.state_district || address?.district || address?.county || '';
    const state = address?.state || '';
    const pinCode = address?.postcode?.replace(/\D/g, '').slice(0, 6) || '';

    if (!location || !district || !state) {
      return NextResponse.json(
        { error: 'Could not determine your full address. Please enter it manually.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      location,
      area,
      district,
      state,
      pin_code: pinCode,
      notice: pinCode ? '' : 'Your PIN could not be detected. Please enter it manually.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not look up your current location. Please enter it manually.' },
      { status: 503 }
    );
  }
}