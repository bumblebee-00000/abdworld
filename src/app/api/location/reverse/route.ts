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
    residential?: string;
    subdistrict?: string;
    state_district?: string;
    district?: string;
    state?: string;
    postcode?: string;
  };
}

interface PostalLookupResult {
  PostOffice?: Array<{
    Name?: string | null;
    Block?: string | null;
    Division?: string | null;
    District?: string | null;
    State?: string | null;
    Pincode?: string | null;
  }> | null;
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
    let location = address?.city || address?.town || address?.village || address?.municipality || address?.county || '';
    let area = address?.suburb || address?.neighbourhood || address?.quarter || address?.hamlet || address?.residential || address?.road || address?.village || location;
    let district = address?.state_district || address?.district || address?.subdistrict || address?.county || '';
    let state = address?.state || '';
    const rawPinCode = address?.postcode?.replace(/\D/g, '') || '';
    const pinCode = /^\d{6}$/.test(rawPinCode) ? rawPinCode : '';

    if (pinCode && (!district || !state)) {
      try {
        const postalResponse = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });
        if (postalResponse.ok) {
          const postalResults: PostalLookupResult[] = await postalResponse.json();
          const offices = postalResults
            .flatMap((postalResult) => postalResult.PostOffice ?? [])
            .filter((office) => office.Pincode === pinCode);
          const matchingOffice = offices.find((office) => {
            const placeNames = [office.Name, office.Block, office.Division]
              .filter(Boolean)
              .map((place) => place!.toLowerCase());
            return [location, area].filter(Boolean).some((place) =>
              placeNames.some((name) => name.includes(place!.toLowerCase()) || place!.toLowerCase().includes(name))
            );
          }) ?? offices[0];

          district ||= matchingOffice?.District || '';
          state ||= matchingOffice?.State || '';
        }
      } catch {}
    }

    location ||= area || district;
    area ||= location;

    if (!location && !district && !state && !pinCode) {
      return NextResponse.json(
        { error: 'Could not determine your address. Please enter it manually.' },
        { status: 404 }
      );
    }

    const missingFields = [
      !location && 'location',
      !area && 'area',
      !district && 'district',
      !state && 'state',
      !pinCode && 'PIN code',
    ].filter(Boolean);

    return NextResponse.json({
      location: location || undefined,
      area: area || undefined,
      district: district || undefined,
      state: state || undefined,
      pin_code: pinCode,
      notice: missingFields.length
        ? `We filled the detected details. Please complete: ${missingFields.join(', ')}.`
        : 'Address filled from your current location. Please confirm it before submitting.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not look up your current location. Please enter it manually.' },
      { status: 503 }
    );
  }
}