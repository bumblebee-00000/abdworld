import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface PostalOfficeRecord {
  Name?: string | null;
  Block?: string | null;
  Division?: string | null;
  District?: string | null;
  State?: string | null;
  Pincode?: string | null;
}

interface PostalLookupResult {
  PostOffice?: PostalOfficeRecord[] | null;
}

function normalizePlace(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const aliases: Record<string, string> = {
    north24pgs: 'north24parganas',
    north24pg: 'north24parganas',
    south24pgs: 'south24parganas',
    south24pg: 'south24parganas',
  };
  return aliases[normalized] ?? normalized;
}

function matchesPlaceFilter(value: string | null, postalValue?: string | null) {
  if (!value) return true;
  if (!postalValue) return false;

  const normalizedValue = normalizePlace(value);
  const normalizedPostalValue = normalizePlace(postalValue);
  return normalizedValue === normalizedPostalValue || (
    normalizedValue.length >= 4 && normalizedPostalValue.includes(normalizedValue)
  );
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  const searchByPin = request.nextUrl.searchParams.get('field') === 'pin_code';
  const selectedState = request.nextUrl.searchParams.get('state')?.trim() ?? '';
  const selectedDistrict = request.nextUrl.searchParams.get('district')?.trim() ?? '';
  if (searchByPin && !/^\d{6}$/.test(query)) {
    return NextResponse.json({ suggestions: [] });
  }
  if (!searchByPin && query.length < 3) return NextResponse.json({ suggestions: [] });
  if (query.length > 60) {
    return NextResponse.json({ error: 'Search text is too long.' }, { status: 400 });
  }

  try {
    const normalizedQuery = normalizePlace(query);
    const postalQuery = normalizedQuery === 'north24pgs' || normalizedQuery === 'north24pg'
      ? 'North 24 Parganas'
      : normalizedQuery === 'south24pgs' || normalizedQuery === 'south24pg'
        ? 'South 24 Parganas'
        : query;
    const response = await fetch(
      `https://api.postalpincode.in/${searchByPin ? 'pincode' : 'postoffice'}/${encodeURIComponent(postalQuery)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Postal suggestions are unavailable right now.' },
        { status: 503 }
      );
    }

    const results: PostalLookupResult[] = await response.json();
    const seen = new Set<string>();
    const suggestions = results
      .flatMap((result) => result.PostOffice ?? [])
      .filter((office) => office.Name && office.Pincode && office.District && office.State)
      .filter((office) => !searchByPin || office.Pincode === query)
      .filter((office) => matchesPlaceFilter(selectedState, office.State))
      .filter((office) => matchesPlaceFilter(selectedDistrict, office.District))
      .map((office) => ({
        location: office.Block || office.Division || office.Name || '',
        block: office.Block || '',
        area: office.Name || '',
        district: office.District || '',
        state: office.State || '',
        pin_code: office.Pincode || '',
      }))
      .filter((suggestion) => {
        const key = `${suggestion.area}|${suggestion.pin_code}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, searchByPin ? 50 : 8);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { error: 'Postal suggestions are unavailable right now.' },
      { status: 503 }
    );
  }
}