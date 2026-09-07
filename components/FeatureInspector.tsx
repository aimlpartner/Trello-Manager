'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  ExternalLink,
  Calendar,
  AlertCircle,
  Tag,
  CheckSquare,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import { EnrichedFeature, FeaturePriority, FeatureStatus } from '@/lib/feature-utils';
import { TrelloCard } from '@/types/trello';

interface FeatureInspectorProps {
  feature: EnrichedFeature;
  onClose: () => void;
  onUpdateFeature: (updated: TrelloCard) => void;
  onToggleComplete: (id: string) => void;
  onDeleteFeature: (id: string) => void;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({
  feature,
  onClose,
  onUpdateFeature,
  onToggleComplete,
  onDeleteFeature,
}) => {
  const [name, setName] = useState(feature.name);
  const [desc, setDesc] = useState(feature.desc || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newCheckItemText, setNewCheckItemText] = useState('');

  const isDone = feature.status === 'done' || feature.dueComplete;

  const handleSaveName = () => {
    if (!name.trim()) return;
    onUpdateFeature({ ...feature, name: name.trim() });
    setIsEditingName(false);
  };

  const handleSaveDesc = () => {
    onUpdateFeature({ ...feature, desc: desc.trim() });
  };

  const handleStatusChange = (newStatus: FeatureStatus) => {
    const isCompleted = newStatus === 'done';
    onUpdateFeature({
      ...feature,
      dueComplete: isCompleted,
    });
  };

  const handleCheckItemToggle = (checklistId: string, itemId: string) => {
    if (!feature.checklists) return;
    const updatedChecklists = feature.checklists.map((cl) => {
      if (cl.id !== checklistId) return cl;
      return {
        ...cl,
        checkItems: cl.checkItems.map((it) => {
          if (it.id !== itemId) return it;
          return {
            ...it,
            state: (it.state === 'complete' ? 'incomplete' : 'complete') as 'complete' | 'incomplete',
          };
        }),
      };
    });
    onUpdateFeature({ ...feature, checklists: updatedChecklists });
  };

  const handleAddCheckItem = (checklistId: string) => {
    if (!newCheckItemText.trim() || !feature.checklists) return;
    const updatedChecklists = feature.checklists.map((cl) => {
      if (cl.id !== checklistId) return cl;
      return {
        ...cl,
        checkItems: [
          ...cl.checkItems,
          {
            id: `chk-${Date.now()}`,
            name: newCheckItemText.trim(),
            state: 'incomplete' as const,
          },
        ],
      };
    });
    onUpdateFeature({ ...feature, checklists: updatedChecklists });
    setNewCheckItemText('');
  };

  // Close inspector on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Responsive mobile/tablet backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 lg:static lg:z-auto flex flex-col h-full border-l overflow-y-auto w-full sm:w-[440px] xl:w-[480px] shrink-0 shadow-2xl lg:shadow-none animate-in slide-in-from-right duration-200"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Top action bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
              {feature.identifier}
            </span>

            <button
              type="button"
              onClick={() => onToggleComplete(feature.id)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition-all shrink-0 ${
                isDone
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-slate-400" />
              )}
              <span>{isDone ? 'Shipped' : 'Mark Shipped'}</span>
            </button>

            {feature.url && (
              <a
                href={feature.url}
                target="_blank"
                rel="noreferrer"
                title="View on Trello"
                className="flex h-7 w-7 items-center justify-center rounded-lg border text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            title="Close Inspector (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 flex-1">
        {/* Module Badge & Priority */}
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent-text)',
            }}
          >
            {feature.moduleLabel}
          </span>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              feature.priority === 'urgent'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                : feature.priority === 'high'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {feature.priority.toUpperCase()} PRIORITY
          </span>
        </div>

        {/* Feature Title */}
        <div>
          {isEditingName ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-main)',
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h2
                onClick={() => setIsEditingName(true)}
                className="text-lg font-bold leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                title="Click to edit feature name"
              >
                {feature.cleanName || feature.name}
              </h2>

              {feature.videoUrl && (
                <a
                  href={feature.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-500" />
                    <span>Watch Video Walkthrough / Demo</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Status selection strip */}
        <div
          className="rounded-2xl border p-3"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Release Stage
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => handleStatusChange('backlog')}
              className={`rounded-lg py-1.5 transition-all ${
                feature.status === 'backlog' && !feature.dueComplete
                  ? 'bg-white text-slate-900 shadow-xs font-semibold dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Backlog
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('in_progress')}
              className={`rounded-lg py-1.5 transition-all ${
                feature.status === 'in_progress' && !feature.dueComplete
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Sprint
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('done')}
              className={`rounded-lg py-1.5 transition-all ${
                isDone
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Shipped
            </button>
          </div>
        </div>

        {/* Specifications & Notes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Feature Specs & Logic
            </label>
          </div>
          <textarea
            rows={5}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={handleSaveDesc}
            placeholder="Add engineering specifications, API endpoints, or implementation notes..."
            className="w-full rounded-2xl border p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y"
            style={{
              backgroundColor: 'var(--bg-app)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Checklists / Acceptance Criteria */}
        {feature.checklists && feature.checklists.length > 0 && (
          <div className="space-y-3">
            {feature.checklists.map((cl) => {
              const completedCount = cl.checkItems.filter((i) => i.state === 'complete').length;
              const totalCount = cl.checkItems.length;
              const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div key={cl.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                      <span>{cl.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {completedCount}/{totalCount} ({progressPct}%)
                    </span>
                  </div>

                  {/* Micro progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {cl.checkItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCheckItemToggle(cl.id, item.id)}
                        className="flex items-center gap-2 rounded-xl p-2 text-xs border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            item.state === 'complete'
                              ? 'bg-emerald-500 border-emerald-500 text-white text-[10px]'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {item.state === 'complete' && '✓'}
                        </span>
                        <span
                          className={`flex-1 ${
                            item.state === 'complete'
                              ? 'line-through text-slate-400'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add item */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newCheckItemText}
                      onChange={(e) => setNewCheckItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCheckItem(cl.id);
                      }}
                      placeholder="Add sub-task..."
                      className="flex-1 rounded-xl border px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        borderColor: 'var(--border-card)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCheckItem(cl.id)}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Danger zone: delete */}
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => onDeleteFeature(feature.id)}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove from Roadmap</span>
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};
