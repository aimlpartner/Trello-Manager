'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductNavbar } from '@/components/ProductNavbar';
import { FeatureListView } from '@/components/FeatureListView';
import { FeatureInspector } from '@/components/FeatureInspector';
import { MilestonesView } from '@/components/MilestonesView';
import { FocusTodayView } from '@/components/FocusTodayView';
import { NewFeatureModal } from '@/components/NewFeatureModal';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { CommandPalette } from '@/components/CommandPalette';
import {
  TrelloBoard,
  TrelloList,
  TrelloCard,
  BoardDetailsResponse,
  BoardsListResponse,
} from '@/types/trello';
import { enrichCard, EnrichedFeature, FeaturePriority, FeatureStatus } from '@/lib/feature-utils';
import { generateId } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { MOCK_BOARDS, MOCK_LISTS, MOCK_CARDS } from '@/lib/mock-trello';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useTheme();
  const [activeView, setActiveView] = useState<'features' | 'milestones' | 'focus'>('features');
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [currentBoard, setCurrentBoard] = useState<TrelloBoard | null>(null);
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [isLiveTrello, setIsLiveTrello] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inspector & Filter state
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('all');
  const [isNewFeatureOpen, setIsNewFeatureOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isCopiedStandup, setIsCopiedStandup] = useState<boolean>(false);

  // Load available boards on mount
  useEffect(() => {
    let isSubscribed = true;
    fetch('/api/trello/boards')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BoardsListResponse) => {
        if (!isSubscribed) return;
        const availableBoards = data.boards && data.boards.length > 0 ? data.boards : MOCK_BOARDS;
        setBoards(availableBoards);
        const brandBoard = availableBoards.find((b) =>
          b.name.toLowerCase().includes('brandtopost')
        );
        setSelectedBoardId(brandBoard ? brandBoard.id : availableBoards[0].id);
      })
      .catch((err) => {
        console.error('Failed to load boards, using fallback:', err);
        if (!isSubscribed) return;
        setBoards(MOCK_BOARDS);
        setSelectedBoardId(MOCK_BOARDS[0].id);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleSelectBoard = (id: string) => {
    setIsLoading(true);
    setSelectedBoardId(id);
    setSelectedFeatureId(null);
    setSearchQuery('');
  };

  // Fetch board details
  useEffect(() => {
    if (!selectedBoardId) return;
    const controller = new AbortController();

    fetch(`/api/trello/board/${encodeURIComponent(selectedBoardId)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BoardDetailsResponse) => {
        setCurrentBoard(data.board);
        setLists(data.lists || []);
        setCards(data.cards || []);
        setIsLiveTrello(data.isLiveTrello);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch board details, checking offline cache & fallback:', err);
        try {
          const cached = localStorage.getItem(`btp_board_${selectedBoardId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            setCurrentBoard(parsed.board);
            setLists(parsed.lists || []);
            setCards(parsed.cards || []);
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore
        }
        const fallbackBoard = MOCK_BOARDS.find((b) => b.id === selectedBoardId) || MOCK_BOARDS[0];
        setCurrentBoard(fallbackBoard);
        setLists(MOCK_LISTS[fallbackBoard.id] || MOCK_LISTS['board-core-api'] || []);
        setCards(MOCK_CARDS[fallbackBoard.id] || MOCK_CARDS['board-core-api'] || []);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [selectedBoardId]);

  // Offline persistence
  useEffect(() => {
    if (selectedBoardId && currentBoard && cards.length > 0) {
      try {
        localStorage.setItem(
          `btp_board_${selectedBoardId}`,
          JSON.stringify({ board: currentBoard, lists, cards })
        );
      } catch {
        // ignore
      }
    }
  }, [selectedBoardId, currentBoard, lists, cards]);

  // Standup copy handler
  const handleCopyStandupReport = useCallback(() => {
    const shippedItems = cards.filter((c) => c.dueComplete);
    const inFlight = cards.filter((c) => !c.dueComplete);
    const percent = cards.length > 0 ? Math.round((shippedItems.length / cards.length) * 100) : 0;

    const markdown = [
      `# 🚀 BrandToPost Product Execution Update`,
      `**Sprint Velocity**: ${percent}% (${shippedItems.length}/${cards.length} features shipped)`,
      '',
      `### ✅ Shipped & Complete (${shippedItems.length})`,
      ...(shippedItems.length > 0
        ? shippedItems.map((c, i) => `- [x] **BTP-${c.idShort || i + 1}** ${c.name}`)
        : ['- None yet']),
      '',
      `### ⚡ Active in Flight (${inFlight.length})`,
      ...(inFlight.length > 0
        ? inFlight.map((c, i) => `- [ ] **BTP-${c.idShort || i + 1}** ${c.name}`)
        : ['- All clear']),
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdown).then(() => {
        setIsCopiedStandup(true);
        setTimeout(() => setIsCopiedStandup(false), 2000);
      });
    }
  }, [cards]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (selectedFeatureId) {
          setSelectedFeatureId(null);
        } else if (isNewFeatureOpen) {
          setIsNewFeatureOpen(false);
        }
        return;
      }

      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key === '1') {
        setActiveView('features');
      } else if (e.key === '2') {
        setActiveView('milestones');
      } else if (e.key === '3') {
        setActiveView('focus');
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsNewFeatureOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeatureId, isNewFeatureOpen, isCommandPaletteOpen]);

  const handleRefresh = useCallback(() => {
    if (!selectedBoardId) return;
    setIsLoading(true);
    fetch(`/api/trello/board/${encodeURIComponent(selectedBoardId)}`)
      .then((res) => res.json())
      .then((data: BoardDetailsResponse) => {
        setCurrentBoard(data.board);
        setLists(data.lists || []);
        setCards(data.cards || []);
        setIsLiveTrello(data.isLiveTrello);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [selectedBoardId]);

  // Enrich cards into structured features
  const enrichedFeatures = useMemo(() => {
    return cards.map((c, idx) => enrichCard(c, lists, idx));
  }, [cards, lists]);

  // Filter features by search query
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return enrichedFeatures;
    const q = searchQuery.toLowerCase();
    return enrichedFeatures.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.moduleLabel.toLowerCase().includes(q)
    );
  }, [enrichedFeatures, searchQuery]);

  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId) return null;
    return enrichedFeatures.find((f) => f.id === selectedFeatureId) || null;
  }, [enrichedFeatures, selectedFeatureId]);

  // Actions
  const handleToggleComplete = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        return { ...c, dueComplete: !c.dueComplete };
      })
    );
  };

  const handleUpdateCard = (updatedCard: TrelloCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    if (selectedFeatureId === cardId) {
      setSelectedFeatureId(null);
    }
  };

  const handleQuickStatusChange = (id: string, newStatus: FeatureStatus) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          dueComplete: newStatus === 'done',
        };
      })
    );
  };

  const handleAddFeature = (
    title: string,
    desc: string,
    listId: string,
    priority: FeaturePriority
  ) => {
    const priorityColorMap: Record<FeaturePriority, string> = {
      urgent: 'red',
      high: 'orange',
      medium: 'yellow',
      low: 'blue',
    };
    const newCard: TrelloCard = {
      id: generateId('feat'),
      idBoard: selectedBoardId,
      idList: listId || lists[0]?.id || 'list-1',
      name: title,
      desc,
      due: null,
      dueComplete: false,
      labels: [
        {
          id: `lbl-${priority}`,
          name: priority.toUpperCase(),
          color: priorityColorMap[priority] || 'blue',
        },
      ],
      pos: cards.length + 1,
      dateLastActivity: new Date().toISOString(),
    };
    setCards((prev) => [newCard, ...prev]);
    setSelectedFeatureId(newCard.id);
  };

  const completedCount = cards.filter((c) => c.dueComplete).length;
  const totalCount = cards.length;

  return (
    <div
      className="min-h-screen flex flex-col antialiased transition-colors"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
      }}
    >
      {/* Top Product Command Bar */}
      <ProductNavbar
        boards={boards}
        currentBoard={currentBoard || undefined}
        onSelectBoard={handleSelectBoard}
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSelectedFeatureId(null);
        }}
        onOpenNewFeature={() => setIsNewFeatureOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
        isLiveTrello={isLiveTrello}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 flex overflow-hidden">
        {isLoading && cards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-xs text-slate-400 font-medium">
              Loading feature workspace...
            </span>
          </div>
        ) : (
          <div className="flex flex-1 w-full overflow-hidden">
            {/* View 1: Linear-style Feature Tracker */}
            {activeView === 'features' && (
              <div className="flex flex-1 overflow-hidden relative">
                <FeatureListView
                  features={filteredFeatures}
                  selectedFeatureId={selectedFeatureId || undefined}
                  onSelectFeature={(f) => setSelectedFeatureId(f.id)}
                  onToggleComplete={handleToggleComplete}
                  onQuickStatusChange={handleQuickStatusChange}
                  activeModuleFilter={activeModuleFilter}
                  onModuleFilterChange={setActiveModuleFilter}
                />

                {/* Side Inspector Dock */}
                {selectedFeature && (
                  <FeatureInspector
                    key={selectedFeature.id}
                    feature={selectedFeature}
                    onClose={() => setSelectedFeatureId(null)}
                    onUpdateFeature={handleUpdateCard}
                    onToggleComplete={handleToggleComplete}
                    onDeleteFeature={handleDeleteCard}
                  />
                )}
              </div>
            )}

            {/* View 2: Release Sprints & Milestones */}
            {activeView === 'milestones' && (
              <MilestonesView
                features={enrichedFeatures}
                onSelectFeature={(f) => {
                  setSelectedFeatureId(f.id);
                  setActiveView('features');
                }}
                onToggleComplete={handleToggleComplete}
              />
            )}

            {/* View 3: Today's Targets & Focus Deck */}
            {activeView === 'focus' && (
              <FocusTodayView
                features={enrichedFeatures}
                onSelectFeature={(f) => {
                  setSelectedFeatureId(f.id);
                  setActiveView('features');
                }}
                onToggleComplete={handleToggleComplete}
              />
            )}
          </div>
        )}
      </main>

      {/* New Feature Modal */}
      <NewFeatureModal
        isOpen={isNewFeatureOpen}
        onClose={() => setIsNewFeatureOpen(false)}
        lists={lists}
        onAddFeature={handleAddFeature}
      />

      {/* Quick Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        features={enrichedFeatures}
        onSelectFeature={(f) => {
          setSelectedFeatureId(f.id);
          setActiveView('features');
        }}
        onOpenNewFeature={() => setIsNewFeatureOpen(true)}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
        theme={theme}
        onViewChange={(v) => {
          setActiveView(v);
          setSelectedFeatureId(null);
        }}
        onModuleFilterChange={(mod) => {
          setActiveModuleFilter(mod);
          setActiveView('features');
        }}
        onCopyStandup={handleCopyStandupReport}
        isCopiedStandup={isCopiedStandup}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
