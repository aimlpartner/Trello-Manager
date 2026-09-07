import { NextResponse } from 'next/server';
import { MOCK_BOARDS } from '@/lib/mock-trello';
import { TrelloBoard } from '@/types/trello';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.TRELLO_API_KEY;
  const apiToken = process.env.TRELLO_API_TOKEN;

  if (!apiKey || !apiToken) {
    return NextResponse.json({
      boards: MOCK_BOARDS,
      isLiveTrello: false,
      message:
        'Using high-fidelity developer sample projects. Add TRELLO_API_KEY and TRELLO_API_TOKEN in environment secrets to sync your live Trello workspace.',
    });
  }

  try {
    const url = `https://api.trello.com/1/members/me/boards?fields=id,name,desc,closed,url,shortUrl,prefs,dateLastActivity&filter=open&key=${encodeURIComponent(
      apiKey
    )}&token=${encodeURIComponent(apiToken)}`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn('Trello API responded with error status:', res.status);
      return NextResponse.json({
        boards: MOCK_BOARDS,
        isLiveTrello: false,
        warning: `Trello API returned HTTP ${res.status}. Falling back to sample boards.`,
      });
    }

    const liveBoardsRaw = await res.json();
    if (!Array.isArray(liveBoardsRaw)) {
      throw new Error('Unexpected response format from Trello');
    }

    const boards: TrelloBoard[] = liveBoardsRaw.map((b: any) => ({
      id: b.id,
      name: b.name,
      desc: b.desc || 'Trello Project Board',
      closed: Boolean(b.closed),
      url: b.url,
      shortUrl: b.shortUrl,
      prefs: {
        backgroundColor: b.prefs?.backgroundColor || '#1e293b',
        backgroundImage: b.prefs?.backgroundImage,
        backgroundBrightness: b.prefs?.backgroundBrightness || 'dark',
        backgroundTopColor: b.prefs?.backgroundTopColor,
        backgroundBottomColor: b.prefs?.backgroundBottomColor,
      },
      dateLastActivity: b.dateLastActivity,
      pinned: Boolean(b.pinned),
      category: 'platform',
    }));

    return NextResponse.json({
      boards: boards.length > 0 ? boards : MOCK_BOARDS,
      isLiveTrello: boards.length > 0,
    });
  } catch (error: any) {
    console.error('Error fetching Trello boards:', error);
    return NextResponse.json({
      boards: MOCK_BOARDS,
      isLiveTrello: false,
      error: error?.message || 'Failed to connect to Trello API',
    });
  }
}
