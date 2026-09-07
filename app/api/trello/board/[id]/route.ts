import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_BOARDS,
  MOCK_LISTS,
  MOCK_CARDS,
  computeDeveloperGlance,
} from '@/lib/mock-trello';
import { TrelloBoard, TrelloList, TrelloCard } from '@/types/trello';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  // Read key/token from env or optional request headers / query params
  const urlObj = new URL(request.url);
  const paramKey = urlObj.searchParams.get('key');
  const paramToken = urlObj.searchParams.get('token');

  const apiKey = paramKey || process.env.TRELLO_API_KEY;
  const apiToken = paramToken || process.env.TRELLO_API_TOKEN;

  // Clean the ID in case a full URL was passed
  let cleanId = id.trim();
  const match = cleanId.match(/trello\.com\/b\/([a-zA-Z0-9]+)/);
  if (match) {
    cleanId = match[1];
  }

  const isMockId = cleanId.startsWith('board-');

  // If mock ID explicitly requested, return sample board
  if (isMockId) {
    const matchedBoard =
      MOCK_BOARDS.find((b) => b.id === cleanId) || MOCK_BOARDS[0];
    const lists = MOCK_LISTS[matchedBoard.id] || MOCK_LISTS['board-core-api'];
    const cards = MOCK_CARDS[matchedBoard.id] || MOCK_CARDS['board-core-api'];
    const summary = computeDeveloperGlance(matchedBoard, lists, cards);

    return NextResponse.json({
      board: {
        ...matchedBoard,
        cardsCount: cards.length,
        listsCount: lists.length,
      },
      lists,
      cards,
      summary,
      isLiveTrello: false,
    });
  }

  // Attempt live Trello fetch (works with auth or for public boards without auth)
  try {
    const authQuery = apiKey && apiToken
      ? `key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(apiToken)}`
      : (apiKey ? `key=${encodeURIComponent(apiKey)}` : '');

    const boardUrl = `https://api.trello.com/1/boards/${cleanId}?fields=id,name,desc,closed,url,shortUrl,prefs,dateLastActivity${authQuery ? `&${authQuery}` : ''}`;
    const listsUrl = `https://api.trello.com/1/boards/${cleanId}/lists?filter=open&fields=id,name,idBoard,closed,pos${authQuery ? `&${authQuery}` : ''}`;
    const cardsUrl = `https://api.trello.com/1/boards/${cleanId}/cards?filter=visible&checklists=all&members=true&fields=id,idList,name,desc,due,dueComplete,url,pos,labels,dateLastActivity${authQuery ? `&${authQuery}` : ''}`;

    const [boardRes, listsRes, cardsRes] = await Promise.all([
      fetch(boardUrl, { next: { revalidate: 15 }, headers: { Accept: 'application/json' } }),
      fetch(listsUrl, { next: { revalidate: 15 }, headers: { Accept: 'application/json' } }),
      fetch(cardsUrl, { next: { revalidate: 15 }, headers: { Accept: 'application/json' } }),
    ]);

    if (!boardRes.ok || !listsRes.ok || !cardsRes.ok) {
      // If live fetch fails and there's no auth, return error or fallback
      throw new Error(
        `Trello API returned HTTP ${boardRes.status}. Ensure board is public or provide API Key and Token.`
      );
    }

    const [boardData, listsData, cardsData] = await Promise.all([
      boardRes.json(),
      listsRes.json(),
      cardsRes.json(),
    ]);

    const board: TrelloBoard = {
      id: boardData.id,
      name: boardData.name,
      desc: boardData.desc || '',
      closed: Boolean(boardData.closed),
      url: boardData.url,
      shortUrl: boardData.shortUrl,
      prefs: {
        backgroundColor: boardData.prefs?.backgroundColor || '#0F172A',
        backgroundImage: boardData.prefs?.backgroundImage,
        backgroundBrightness: boardData.prefs?.backgroundBrightness || 'dark',
      },
      dateLastActivity: boardData.dateLastActivity,
      listsCount: Array.isArray(listsData) ? listsData.length : 0,
      cardsCount: Array.isArray(cardsData) ? cardsData.length : 0,
    };

    const lists: TrelloList[] = (Array.isArray(listsData) ? listsData : []).map((l: any) => ({
      id: l.id,
      name: l.name,
      idBoard: l.idBoard,
      closed: Boolean(l.closed),
      pos: l.pos,
    }));

    const cards: TrelloCard[] = (Array.isArray(cardsData) ? cardsData : []).map((c: any) => ({
      id: c.id,
      idBoard: c.idBoard,
      idList: c.idList,
      name: c.name,
      desc: c.desc || '',
      due: c.due,
      dueComplete: Boolean(c.dueComplete),
      url: c.url,
      pos: c.pos,
      dateLastActivity: c.dateLastActivity,
      labels: (c.labels || []).map((lbl: any) => ({
        id: lbl.id,
        name: lbl.name || lbl.color || 'Label',
        color: lbl.color || 'blue',
      })),
      members: (c.members || []).map((m: any) => ({
        id: m.id,
        fullName: m.fullName,
        username: m.username,
        avatarUrl: m.avatarUrl ? `${m.avatarUrl}/50.png` : undefined,
        initials: m.initials,
      })),
      checklists: (c.checklists || []).map((ck: any) => ({
        id: ck.id,
        name: ck.name,
        checkItems: (ck.checkItems || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          state: item.state,
        })),
      })),
    }));

    const summary = computeDeveloperGlance(board, lists, cards);

    return NextResponse.json({
      board,
      lists,
      cards,
      summary,
      isLiveTrello: true,
    });
  } catch (err: any) {
    console.error('Trello fetch error:', err);
    // Fallback to first sample board
    const matchedBoard = MOCK_BOARDS[0];
    const lists = MOCK_LISTS[matchedBoard.id];
    const cards = MOCK_CARDS[matchedBoard.id];
    const summary = computeDeveloperGlance(matchedBoard, lists, cards);

    return NextResponse.json({
      board: matchedBoard,
      lists,
      cards,
      summary,
      isLiveTrello: false,
      error: err?.message || 'Failed to fetch Trello board data',
    });
  }
}
