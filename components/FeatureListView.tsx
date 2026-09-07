'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  CheckSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Tag,
  ArrowUpDown,
  Copy,
  Check,
  Video,
  Flame,
  LayoutList,
  Kanban,
  ArrowRight,
  MoreHorizontal,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { EnrichedFeature, FeatureModule, FeaturePriority, FeatureStatus } from '@/lib/feature-utils';

interface FeatureListViewProps {
  features: EnrichedFeature[];
  selectedFeatureId?: string;
  onSelectFeature: (feature: EnrichedFeature) => void;
  onToggleComplete: (id: string) => void;
  onQuickStatusChange: (id: string, newStatus: FeatureStatus) => void;
  activeModuleFilter: string;
  onModuleFilterChange: (mod: string) => void;
}

export const FeatureListView: React.FC<FeatureListViewProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  onToggleComplete,
  onQuickStatusChange,
  activeModuleFilter,
  onModuleFilterChange,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [groupBy, setGroupBy] = useState<'module' | 'status' | 'none'>('module');
  const [showSprintDetails, setShowSprintDetails] = useState<boolean>(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState<boolean>(false);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close module dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moduleDropdownRef.current &&
        !moduleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModuleDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsModuleDropdownOpen(false);
      }
    }
    if (isModuleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModuleDropdownOpen]);

  // Stats calculation
  const totalCount = features.length;
  const shippedCount = features.filter((f) => f.status === 'done' || f.dueComplete).length;
  const activeCount = features.filter((f) => f.status === 'in_progress' && !f.dueComplete).length;
  const reviewCount = features.filter((f) => f.status === 'review' && !f.dueComplete).length;
  const backlogCount = features.filter((f) => f.status === 'backlog' && !f.dueComplete).length;
  const velocityPct = totalCount > 0 ? Math.round((shippedCount / totalCount) * 100) : 0;

  const handleCopySummary = () => {
    const shippedItems = features.filter((f) => f.status === 'done' || f.dueComplete);
    const inProgressItems = features.filter((f) => f.status === 'in_progress' && !f.dueComplete);
    const reviewItems = features.filter((f) => f.status === 'review' && !f.dueComplete);

    const markdown = [
      `# 🚀 BrandToPost Product Execution Update`,
      `**Sprint Velocity**: ${velocityPct}% (${shippedCount}/${totalCount} features completed)`,
      '',
      `### ✅ Shipped & Complete (${shippedItems.length})`,
      ...(shippedItems.length > 0
        ? shippedItems.map((f) => `- [x] **${f.identifier}** ${f.cleanName || f.name} — *${f.moduleLabel}*`)
        : ['- None yet']),
      '',
      `### ⚡ Active in Flight (${inProgressItems.length})`,
      ...(inProgressItems.length > 0
        ? inProgressItems.map(
            (f) =>
              `- [ ] **${f.identifier}** ${f.cleanName || f.name} [${f.priority.toUpperCase()}] — *${f.moduleLabel}*`
          )
        : ['- All clear']),
      '',
      `### 🧪 Ready for QA / Review (${reviewItems.length})`,
      ...(reviewItems.length > 0
        ? reviewItems.map((f) => `- [ ] **${f.identifier}** ${f.cleanName || f.name} — *${f.moduleLabel}*`)
        : ['- None in review']),
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdown).then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      });
    }
  };

  const handleCopyFeatureId = (e: React.MouseEvent, idText: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idText);
      setCopiedId(idText);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // Filter features
  const filtered = features.filter((f) => {
    if (activeModuleFilter === 'all') return true;
    if (activeModuleFilter === 'shipped') return f.status === 'done' || f.dueComplete;
    if (activeModuleFilter === 'active') return f.status === 'in_progress' && !f.dueComplete;
    if (activeModuleFilter === 'review') return f.status === 'review' && !f.dueComplete;
    return f.module === activeModuleFilter;
  });

  // Unique module list for filter tabs
  const modules: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All Features', count: features.length },
    {
      key: 'automation',
      label: 'Automation & Social',
      count: features.filter((f) => f.module === 'automation').length,
    },
    {
      key: 'auth',
      label: 'Auth & Identity',
      count: features.filter((f) => f.module === 'auth').length,
    },
    {
      key: 'core',
      label: 'Core Infrastructure',
      count: features.filter((f) => f.module === 'core').length,
    },
    {
      key: 'studio',
      label: 'Content Studio',
      count: features.filter((f) => f.module === 'studio').length,
    },
    {
      key: 'guides',
      label: 'Onboarding & Ops',
      count: features.filter((f) => f.module === 'guides').length,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      count: shippedCount,
    },
    ...(activeModuleFilter === 'active' ? [{ key: 'active', label: 'Active Sprint', count: activeCount }] : []),
    ...(activeModuleFilter === 'review' ? [{ key: 'review', label: 'QA / Review', count: reviewCount }] : []),
  ];

  const currentModule = modules.find((m) => m.key === activeModuleFilter) || modules[0];

  const getModuleDotColor = (key: string, isSelected = false) => {
    if (isSelected) {
      return 'bg-white dark:bg-slate-900';
    }
    switch (key) {
      case 'automation':
        return 'bg-blue-500';
      case 'auth':
        return 'bg-purple-500';
      case 'core':
        return 'bg-slate-500';
      case 'studio':
        return 'bg-amber-500';
      case 'guides':
        return 'bg-teal-500';
      case 'shipped':
        return 'bg-emerald-500';
      case 'active':
        return 'bg-blue-500';
      case 'review':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  // Grouping logic for List view
  const groupedData: { title: string; count: number; items: EnrichedFeature[] }[] = [];

  if (groupBy === 'module') {
    const map = new Map<string, { title: string; items: EnrichedFeature[] }>();
    filtered.forEach((f) => {
      const key = f.module;
      if (!map.has(key)) {
        map.set(key, { title: f.moduleLabel, items: [] });
      }
      map.get(key)!.items.push(f);
    });
    map.forEach((val) => {
      groupedData.push({ title: val.title, count: val.items.length, items: val.items });
    });
  } else if (groupBy === 'status') {
    const statuses: { key: FeatureStatus; title: string }[] = [
      { key: 'in_progress', title: 'Active Sprint / In Progress' },
      { key: 'backlog', title: 'Backlog / Next Up' },
      { key: 'review', title: 'Ready for Testing / Review' },
      { key: 'done', title: 'Shipped & Complete' },
    ];
    statuses.forEach((s) => {
      const items = filtered.filter((f) => {
        if (s.key === 'done') return f.status === 'done' || f.dueComplete;
        return f.status === s.key && !f.dueComplete;
      });
      if (items.length > 0) {
        groupedData.push({ title: s.title, count: items.length, items });
      }
    });
  } else {
    groupedData.push({ title: 'All Items', count: filtered.length, items: filtered });
  }

  // Kanban Columns definition
  const kanbanColumns: { key: FeatureStatus; title: string; desc: string; color: string }[] = [
    { key: 'backlog', title: 'Backlog', desc: 'Planned specifications', color: 'border-slate-500' },
    { key: 'in_progress', title: 'In Progress', desc: 'Active development', color: 'border-blue-500' },
    { key: 'review', title: 'In Review', desc: 'Testing & QA verification', color: 'border-amber-500' },
    { key: 'done', title: 'Shipped', desc: 'Production ready', color: 'border-emerald-500' },
  ];

  const getStatusIcon = (status: FeatureStatus, isDone?: boolean) => {
    if (isDone || status === 'done') {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
    }
    if (status === 'in_progress') {
      return <Circle className="h-4 w-4 text-blue-500 fill-blue-500/30 shrink-0" />;
    }
    if (status === 'review') {
      return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
    }
    return <Circle className="h-4 w-4 text-slate-400 shrink-0" />;
  };

  const getPriorityBadge = (priority: FeaturePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
            <Flame className="h-3 w-3" />
            <span>Urgent</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <span>Medium</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span>Low</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto w-full">
      {/* Precision Streamline Header with generous breathing room */}
      <div
        className="px-4 sm:px-6 xl:px-8 py-3.5 sm:py-4 border-b shrink-0 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Top row: Title + Sprint Pill + View Mode Toggle + Export strictly on a single aligned row */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
            {/* Left: Features Title & Sprint Status Pill */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 shrink-0 leading-none">
                Features
              </h2>

              <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

              <button
                type="button"
                onClick={() => setShowSprintDetails(!showSprintDetails)}
                className="inline-flex items-center gap-1.5 h-8 rounded-full border px-2 sm:px-2.5 text-xs font-medium transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/80 shrink-0 shadow-2xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-subtle)',
                }}
                title="Toggle sprint target details"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  {shippedCount}/{totalCount}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full text-[11px] leading-none">
                  {velocityPct}%
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    showSprintDetails ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                />
              </button>
            </div>

            {/* Right Controls: List/Board toggle + Export Standup */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* List vs Board Mode Toggle */}
              <div
                className="inline-flex items-center h-8 rounded-xl border p-0.5 text-xs font-semibold shadow-2xs"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`h-full flex items-center gap-1.5 rounded-lg px-2 sm:px-2.5 text-xs transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="List view"
                >
                  <LayoutList className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline leading-none">List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className={`h-full flex items-center gap-1.5 rounded-lg px-2 sm:px-2.5 text-xs transition-all cursor-pointer ${
                    viewMode === 'board'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Kanban Board view"
                >
                  <Kanban className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline leading-none">Board</span>
                </button>
              </div>

              {/* Standup Export Button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-1.5 h-8 rounded-xl border px-2 sm:px-2.5 text-xs font-semibold shadow-2xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
                title="Copy formatted markdown report for Slack, Discord, or Linear"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold leading-none hidden xs:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="hidden sm:inline leading-none">Export</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Sprint Progress Breakdown */}
          {showSprintDetails && (
            <div
              className="p-3.5 sm:p-4 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                backgroundColor: 'var(--bg-app)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
                  Sprint Execution Breakdown
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {velocityPct}% Velocity
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex"
                title={`Shipped: ${shippedCount} | QA: ${reviewCount} | Active: ${activeCount} | Backlog: ${backlogCount}`}
              >
                {shippedCount > 0 && (
                  <div
                    style={{ width: `${(shippedCount / totalCount) * 100}%` }}
                    className="bg-emerald-500 transition-all hover:opacity-90"
                  />
                )}
                {reviewCount > 0 && (
                  <div
                    style={{ width: `${(reviewCount / totalCount) * 100}%` }}
                    className="bg-amber-500 transition-all hover:opacity-90"
                  />
                )}
                {activeCount > 0 && (
                  <div
                    style={{ width: `${(activeCount / totalCount) * 100}%` }}
                    className="bg-blue-500 transition-all hover:opacity-90"
                  />
                )}
                {backlogCount > 0 && (
                  <div
                    style={{ width: `${(backlogCount / totalCount) * 100}%` }}
                    className="bg-slate-400 dark:bg-slate-600 transition-all hover:opacity-90"
                  />
                )}
              </div>

              {/* Micro legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-0.5">
                <span
                  onClick={() => onModuleFilterChange('shipped')}
                  className="cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{shippedCount} Shipped</span>
                </span>
                <span
                  onClick={() => onModuleFilterChange('review')}
                  className="cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{reviewCount} QA</span>
                </span>
                <span
                  onClick={() => onModuleFilterChange('active')}
                  className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{activeCount} Active</span>
                </span>
                <span
                  onClick={() => onModuleFilterChange('all')}
                  className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{backlogCount} Backlog</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter strip & group switch with clean unified breathing room */}
      <div
        className="sticky top-0 z-10 px-3 sm:px-6 xl:px-8 py-2.5 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-app)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Mobile Filter & Group Controls (Custom dropdown, zero scrollbars, zero native OS styling) */}
        <div className="flex sm:hidden items-center justify-between gap-2.5 w-full">
          {/* Custom Module Dropdown */}
          <div ref={moduleDropdownRef} className="relative flex-1 min-w-0">
            <button
              type="button"
              id="mobile-module-dropdown-trigger"
              onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
              className="w-full h-8 flex items-center justify-between gap-2 rounded-xl border px-2.5 text-xs font-semibold transition-all hover:bg-slate-100/70 dark:hover:bg-slate-800/70 shadow-2xs cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: isModuleDropdownOpen ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: 'var(--text-main)',
              }}
              aria-haspopup="listbox"
              aria-expanded={isModuleDropdownOpen}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2 w-2 rounded-full shrink-0 ${getModuleDotColor(currentModule.key)}`} />
                <span className="truncate leading-none">{currentModule.label}</span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 text-[10px] font-mono shrink-0 leading-none">
                  {currentModule.count}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isModuleDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu with theme matching and smooth animation */}
            {isModuleDropdownOpen && (
              <div
                id="mobile-module-dropdown-menu"
                role="listbox"
                className="absolute left-0 top-full mt-1.5 z-40 w-full min-w-[220px] rounded-2xl border p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 py-1">
                  Filter by Module
                </div>
                <div className="space-y-0.5 max-h-64 overflow-y-auto no-scrollbar">
                  {modules.map((m) => {
                    const isSelected = activeModuleFilter === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onModuleFilterChange(m.key);
                          setIsModuleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${getModuleDotColor(m.key, isSelected)}`}
                          />
                          <span className="truncate">{m.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none ${
                              isSelected
                                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {m.count}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {viewMode === 'list' && (
            <div
              className="inline-flex items-center h-8 rounded-xl border p-0.5 text-[11px] font-medium shrink-0 shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setGroupBy('module')}
                className={`h-full flex items-center rounded-lg px-2 text-[11px] transition-all cursor-pointer ${
                  groupBy === 'module'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Module
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('status')}
                className={`h-full flex items-center rounded-lg px-2 text-[11px] transition-all cursor-pointer ${
                  groupBy === 'status'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Status
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('none')}
                className={`h-full flex items-center rounded-lg px-2 text-[11px] transition-all cursor-pointer ${
                  groupBy === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Flat
              </button>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Filter Strip (Clean pills with zero scrollbars, generous room) */}
        <div className="hidden sm:flex items-center justify-between gap-3 w-full">
          {/* Module filter chips */}
          <div
            className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar max-w-full py-0.5 min-w-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {modules.map((m) => {
              const isActive = activeModuleFilter === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onModuleFilterChange(m.key)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{m.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-900'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {m.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group by toggle (only in List view) */}
          {viewMode === 'list' && (
            <div
              className="flex items-center gap-1 rounded-xl border p-0.5 text-xs shrink-0"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-slate-400 pl-2 text-[11px] font-medium hidden md:inline">
                Group:
              </span>
              <button
                type="button"
                onClick={() => setGroupBy('module')}
                className={`rounded-lg px-2 sm:px-2.5 py-1 font-medium transition-all ${
                  groupBy === 'module'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Module
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('status')}
                className={`rounded-lg px-2 sm:px-2.5 py-1 font-medium transition-all ${
                  groupBy === 'status'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Status
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('none')}
                className={`rounded-lg px-2 sm:px-2.5 py-1 font-medium transition-all ${
                  groupBy === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Flat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Stage: List or Kanban Board */}
      <div className="flex-1 px-3 sm:px-6 xl:px-8 py-4 sm:py-5 w-full">
        {viewMode === 'list' ? (
          /* =================== LINEAR LIST VIEW =================== */
          <div className="space-y-6 max-w-7xl mx-auto w-full">
            {groupedData.length === 0 || filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Sparkles className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No features match this filter
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try switching module filters or create a new feature specification.
                </p>
              </div>
            ) : (
              groupedData.map((group) => (
                <div key={group.title} className="space-y-2">
                  {/* Group Header */}
                  <div className="flex items-center justify-between pb-1 px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {group.title}
                      </h3>
                      <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-2 py-0.2 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                        {group.count}
                      </span>
                    </div>
                  </div>

                  {/* Table Header Bar */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div
                      className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Key</div>
                      <div className="col-span-5">Feature & Specification</div>
                      <div className="col-span-2">Module</div>
                      <div className="col-span-1 text-center">Tasks</div>
                      <div className="col-span-2 text-right">Priority</div>
                    </div>

                    {/* Feature Rows */}
                    <div
                      className="divide-y divide-slate-100 dark:divide-slate-800/80"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      {group.items.map((feature) => {
                        const isSelected = selectedFeatureId === feature.id;
                        const isDone = feature.status === 'done' || feature.dueComplete;
                        const totalChecks =
                          feature.checklists?.reduce(
                            (acc, cl) => acc + cl.checkItems.length,
                            0
                          ) || 0;
                        const completedChecks =
                          feature.checklists?.reduce(
                            (acc, cl) =>
                              acc + cl.checkItems.filter((i) => i.state === 'complete').length,
                            0
                          ) || 0;

                        return (
                          <div
                            key={feature.id}
                            onClick={() => onSelectFeature(feature)}
                            className={`group flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-950/50'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            {/* Left: Status glyph + Key + Title */}
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              {/* Quick completion trigger */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(feature.id);
                                }}
                                className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                                title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                              >
                                {getStatusIcon(feature.status, isDone)}
                              </button>

                              {/* Monospace Identifier (Linear-style BTP-01) */}
                              <span
                                onClick={(e) => handleCopyFeatureId(e, feature.identifier)}
                                className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 cursor-pointer"
                                title="Click to copy ID"
                              >
                                {copiedId === feature.identifier ? (
                                  <span className="text-emerald-500">COPIED</span>
                                ) : (
                                  feature.identifier
                                )}
                              </span>

                              {/* Loom Video tag if video demo attached */}
                              {feature.videoUrl && (
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shrink-0"
                                  title="Video Walkthrough / Demo available"
                                >
                                  <Video className="h-3 w-3 text-purple-500" />
                                  <span className="hidden sm:inline">DEMO</span>
                                </span>
                              )}

                              {/* Title & Preview */}
                              <div className="min-w-0 flex-1 flex items-baseline gap-2">
                                <span
                                  className={`text-sm font-semibold tracking-tight truncate ${
                                    isDone
                                      ? 'line-through text-slate-400 dark:text-slate-500'
                                      : 'text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  {feature.cleanName || feature.name}
                                </span>

                                {feature.desc && (
                                  <span className="hidden xl:inline text-xs text-slate-400 truncate max-w-sm">
                                    — {feature.desc}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: Module Pill, Checklist count, Priority */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              {/* Module badge */}
                              <span
                                className="hidden md:inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
                                style={{
                                  backgroundColor: 'var(--accent-soft)',
                                  color: 'var(--accent-text)',
                                }}
                              >
                                {feature.moduleLabel}
                              </span>

                              {/* Checklist counter if any */}
                              {totalChecks > 0 ? (
                                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                  <CheckSquare className="h-3 w-3 text-blue-500" />
                                  <span>
                                    {completedChecks}/{totalChecks}
                                  </span>
                                </div>
                              ) : (
                                <span className="hidden sm:inline text-[11px] font-mono text-slate-300 dark:text-slate-700">
                                  —
                                </span>
                              )}

                              {/* Priority badge */}
                              {getPriorityBadge(feature.priority)}

                              {/* Row hover action chevron */}
                              <ChevronRight className="hidden xs:block h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* =================== KANBAN BOARD VIEW =================== */
          <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-7xl mx-auto items-start overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
            {kanbanColumns.map((col) => {
              const colFeatures = filtered.filter((f) => {
                if (col.key === 'done') return f.status === 'done' || f.dueComplete;
                return f.status === col.key && !f.dueComplete;
              });

              return (
                <div
                  key={col.key}
                  className="rounded-2xl border flex flex-col min-h-[420px] w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-center md:shrink"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  {/* Column Header */}
                  <div
                    className="flex items-center justify-between p-3.5 border-b"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {col.title}
                      </span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.2 text-[10px] font-mono font-bold text-slate-500">
                        {colFeatures.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {colFeatures.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        No features in this column
                      </div>
                    ) : (
                      colFeatures.map((feature) => {
                        const totalChecks =
                          feature.checklists?.reduce(
                            (acc, cl) => acc + cl.checkItems.length,
                            0
                          ) || 0;
                        const completedChecks =
                          feature.checklists?.reduce(
                            (acc, cl) =>
                              acc + cl.checkItems.filter((i) => i.state === 'complete').length,
                            0
                          ) || 0;

                        return (
                          <div
                            key={feature.id}
                            onClick={() => onSelectFeature(feature)}
                            className="group rounded-xl border p-3 cursor-pointer shadow-xs transition-all hover:scale-[1.01] hover:shadow-md"
                            style={{
                              backgroundColor: 'var(--bg-app)',
                              borderColor:
                                selectedFeatureId === feature.id
                                  ? 'var(--accent-text)'
                                  : 'var(--border-card)',
                            }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                {feature.identifier}
                              </span>
                              {getPriorityBadge(feature.priority)}
                            </div>

                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                              {feature.cleanName || feature.name}
                            </h4>

                            {feature.videoUrl && (
                              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                                <Video className="h-3 w-3 text-purple-500" />
                                <span>Demo Video</span>
                              </div>
                            )}

                            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="truncate max-w-[120px] font-medium">
                                {feature.moduleLabel}
                              </span>
                              {totalChecks > 0 && (
                                <span className="font-mono text-[10px]">
                                  {completedChecks}/{totalChecks}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
