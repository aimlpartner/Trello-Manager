'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Plus,
  Moon,
  Sun,
  Layers,
  Search,
  RefreshCw,
  X,
  Target,
  Zap,
  ListTodo,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { TrelloBoard } from '@/types/trello';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { useMounted } from '@/hooks/useMounted';

interface ProductNavbarProps {
  boards: TrelloBoard[];
  currentBoard?: TrelloBoard;
  onSelectBoard: (id: string) => void;
  activeView: 'features' | 'milestones' | 'focus';
  onViewChange: (v: 'features' | 'milestones' | 'focus') => void;
  onOpenNewFeature: () => void;
  onOpenCommandPalette?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isLiveTrello: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  completedCount: number;
  totalCount: number;
}

export const ProductNavbar: React.FC<ProductNavbarProps> = ({
  boards,
  currentBoard,
  onSelectBoard,
  activeView,
  onViewChange,
  onOpenNewFeature,
  onOpenCommandPalette,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  isLiveTrello,
  isLoading,
  onRefresh,
  completedCount,
  totalCount,
}) => {
  const isMounted = useMounted();
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex h-16 w-full items-center justify-between px-3 sm:px-6 xl:px-10 gap-2 sm:gap-4">
        {/* Left: Project Branding & Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div className="relative">
            <button
              type="button"
              id="project-switcher-button"
              onClick={() => setIsBoardMenuOpen(!isBoardMenuOpen)}
              className="flex items-center gap-2 sm:gap-2.5 rounded-xl px-1.5 sm:px-2.5 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xs shrink-0">
                {currentBoard?.name ? currentBoard.name.slice(0, 2).toUpperCase() : 'BP'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 max-w-[100px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-[300px] truncate">
                    {currentBoard?.name || 'BrandToPost'}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">{percentComplete}% shipped ({completedCount}/{totalCount} tasks)</span>
                  <span className="sm:hidden">{percentComplete}% shipped</span>
                </div>
              </div>
            </button>

            {/* Switcher Dropdown */}
            {isBoardMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsBoardMenuOpen(false)}
                />
                <div
                  className="absolute left-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-24px)] rounded-2xl border p-2 shadow-xl animate-in fade-in zoom-in-95"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                  }}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Connected Board
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 my-1">
                    {boards.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          onSelectBoard(b.id);
                          setIsBoardMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                          b.id === currentBoard?.id
                            ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/50 dark:text-blue-300'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate pr-2">{b.name}</span>
                        {b.cardsCount !== undefined && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {b.cardsCount} items
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {currentBoard?.url && (
                    <div
                      className="mt-1 pt-1.5 border-t"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <a
                        href={currentBoard.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open in Trello</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Linear-style View Switcher */}
        <div
          className="hidden md:flex rounded-xl p-1 border items-center"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <button
            type="button"
            id="view-features-tab"
            onClick={() => onViewChange('features')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'features'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>Feature Tracker</span>
          </button>

          <button
            type="button"
            id="view-milestones-tab"
            onClick={() => onViewChange('milestones')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'milestones'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-blue-500" />
            <span>Release Sprints</span>
          </button>

          <button
            type="button"
            id="view-focus-tab"
            onClick={() => onViewChange('focus')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'focus'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Today&apos;s Targets</span>
          </button>
        </div>

        {/* Right: Search, Add Feature, Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Quick Search Button */}
          <button
            type="button"
            onClick={() => onOpenCommandPalette && onOpenCommandPalette()}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-xl border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
            title="Search & Commands (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Quick Search with Command Palette trigger (Desktop/Tablet) */}
          <div className="hidden sm:block relative w-32 md:w-44 lg:w-56 xl:w-72 group">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search specs or ⌘K..."
              className="w-full rounded-xl border pl-8 pr-11 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              style={{
                backgroundColor: 'var(--bg-app)',
                borderColor: 'var(--border-card)',
              }}
            />
            <button
              type="button"
              onClick={() => onOpenCommandPalette && onOpenCommandPalette()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              title="Open Command Palette (⌘K)"
            >
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* PWA Install Action */}
          <PWAInstallButton />

          {/* Quick Add Button with C shortcut */}
          <button
            type="button"
            id="new-feature-btn"
            onClick={onOpenNewFeature}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors shrink-0"
            title="Create New Feature (C)"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Feature</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-white/20 dark:bg-slate-300 text-white dark:text-slate-900">
              C
            </kbd>
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 shrink-0"
            style={{ borderColor: 'var(--border-subtle)' }}
            title="Refresh Trello sync"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            style={{ borderColor: 'var(--border-subtle)' }}
            title="Toggle color theme"
            aria-label="Toggle color theme"
            suppressHydrationWarning
          >
            {isMounted && theme === 'light' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile subnav for view tabs with breathing space and calm segmented styling */}
      <div
        className="flex md:hidden px-3 sm:px-4 py-2 border-t"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-app)' }}
      >
        <div
          className="flex w-full items-center justify-between rounded-xl p-1 border gap-1 shadow-2xs"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => onViewChange('features')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeView === 'features'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>Tracker</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange('milestones')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeView === 'milestones'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-blue-500" />
            <span>Sprints</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange('focus')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeView === 'focus'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Today</span>
          </button>
        </div>
      </div>
    </header>
  );
};
