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

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (query.length < 3) return NextResponse.json({ suggestions: [] });
  if (query.length > 60) {
    return NextResponse.json({ error: 'Search text is too long.' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`,
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