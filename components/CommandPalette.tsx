'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Layers,
  Milestone,
  Target,
  Copy,
  Check,
  Kanban,
  Video,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import { EnrichedFeature, FeatureModule } from '@/lib/feature-utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  features: EnrichedFeature[];
  onSelectFeature: (feature: EnrichedFeature) => void;
  onOpenNewFeature: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onViewChange: (v: 'features' | 'milestones' | 'focus') => void;
  onModuleFilterChange: (module: string) => void;
  onCopyStandup: () => void;
  isCopiedStandup: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = (props) => {
  if (!props.isOpen) return null;
  return <CommandPaletteModal {...props} />;
};

const CommandPaletteModal: React.FC<CommandPaletteProps> = ({
  onClose,
  features,
  onSelectFeature,
  onOpenNewFeature,
  onToggleTheme,
  theme,
  onViewChange,
  onModuleFilterChange,
  onCopyStandup,
  isCopiedStandup,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Build searchable items
  interface CommandItem {
    id: string;
    category: 'Actions' | 'Navigation' | 'Filters' | 'Features';
    label: string;
    sublabel?: string;
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
  }

  const allItems: CommandItem[] = [];

  // Actions
  allItems.push({
    id: 'act-new',
    category: 'Actions',
    label: 'Create New Feature',
    sublabel: 'Add a specification or feature to active roadmap',
    icon: <Plus className="h-4 w-4 text-blue-500" />,
    shortcut: 'C',
    action: () => {
      onClose();
      onOpenNewFeature();
    },
  });

  allItems.push({
    id: 'act-copy',
    category: 'Actions',
    label: isCopiedStandup ? 'Report Copied to Clipboard!' : 'Copy Standup & Release Report',
    sublabel: 'Formatted markdown update for Slack or Linear',
    icon: isCopiedStandup ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />,
    action: () => {
      onCopyStandup();
      setTimeout(onClose, 800);
    },
  });

  allItems.push({
    id: 'act-theme',
    category: 'Actions',
    label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
    sublabel: 'Toggle workspace theme appearance',
    icon: theme === 'light' ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-400" />,
    action: () => {
      onToggleTheme();
      onClose();
    },
  });

  // Navigation
  allItems.push({
    id: 'nav-features',
    category: 'Navigation',
    label: 'Go to Feature Tracker',
    sublabel: 'Linear-style table with status and checklists',
    icon: <Layers className="h-4 w-4 text-blue-500" />,
    shortcut: '1',
    action: () => {
      onViewChange('features');
      onClose();
    },
  });

  allItems.push({
    id: 'nav-milestones',
    category: 'Navigation',
    label: 'Go to Release Milestones',
    sublabel: 'Sprint timeline and module execution targets',
    icon: <Milestone className="h-4 w-4 text-indigo-500" />,
    shortcut: '2',
    action: () => {
      onViewChange('milestones');
      onClose();
    },
  });

  allItems.push({
    id: 'nav-focus',
    category: 'Navigation',
    label: "Go to Today's Focus Deck",
    sublabel: 'High-leverage targets and priority review',
    icon: <Target className="h-4 w-4 text-emerald-500" />,
    shortcut: '3',
    action: () => {
      onViewChange('focus');
      onClose();
    },
  });

  // Filter Modules
  const moduleFilters: { id: string; label: string; key: FeatureModule | 'all' }[] = [
    { id: 'mod-all', label: 'All Modules', key: 'all' },
    { id: 'mod-auto', label: 'Automation & Social Module', key: 'automation' },
    { id: 'mod-auth', label: 'Auth & Identity Module', key: 'auth' },
    { id: 'mod-core', label: 'Core Infrastructure Module', key: 'core' },
    { id: 'mod-studio', label: 'Content Studio Module', key: 'studio' },
    { id: 'mod-guides', label: 'Onboarding & Ops Module', key: 'guides' },
  ];

  moduleFilters.forEach((m) => {
    allItems.push({
      id: m.id,
      category: 'Filters',
      label: `Filter by: ${m.label}`,
      sublabel: 'Filter active workspace view',
      icon: <Filter className="h-4 w-4 text-slate-400" />,
      action: () => {
        onViewChange('features');
        onModuleFilterChange(m.key);
        onClose();
      },
    });
  });

  // Features matching query
  features.forEach((f) => {
    const isDone = f.status === 'done' || f.dueComplete;
    const statusIcon = isDone ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    ) : f.status === 'in_progress' ? (
      <Circle className="h-4 w-4 text-blue-500 fill-blue-500/30" />
    ) : f.status === 'review' ? (
      <Clock className="h-4 w-4 text-amber-500" />
    ) : (
      <Circle className="h-4 w-4 text-slate-400" />
    );

    allItems.push({
      id: `feat-${f.id}`,
      category: 'Features',
      label: f.cleanName || f.name,
      sublabel: `${f.identifier} · ${f.moduleLabel} · ${f.priority.toUpperCase()}`,
      icon: f.videoUrl ? <Video className="h-4 w-4 text-purple-500" /> : statusIcon,
      action: () => {
        onSelectFeature(f);
        onClose();
      },
    });
  });

  // Filter items by query
  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return item.category !== 'Features';
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      (item.sublabel && item.sublabel.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Clamp selection index
  const safeSelectedIndex = Math.min(
    Math.max(0, selectedIndex),
    Math.max(0, filteredItems.length - 1)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[safeSelectedIndex]) {
        filteredItems[safeSelectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-card)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search features, specs, modules..."
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="h-6 w-6 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                No matching commands or features found
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching for &quot;Auth&quot;, &quot;Automation&quot;, or press C to add a feature.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === safeSelectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-100'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{item.label}</div>
                      {item.sublabel && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command palette footer */}
        <div
          className="flex items-center justify-between px-4 py-2 text-[11px] text-slate-400 border-t font-medium"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">
                ↑
              </kbd>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">
                ↓
              </kbd>
              navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">
                ↵
              </kbd>
              select
            </span>
          </div>
          <span>BrandToPost Command Center</span>
        </div>
      </div>
    </div>
  );
};
