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
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  const searchByPin = request.nextUrl.searchParams.get('field') === 'pin_code';
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
      .map((office) => ({
        location: office.Division || office.Block || office.Name || '',
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
      .slice(0, 8);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { error: 'Postal suggestions are unavailable right now.' },
      { status: 503 }
    );
  }
}