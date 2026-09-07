'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Layers, Shield, Rocket, Compass } from 'lucide-react';
import { TrelloList } from '@/types/trello';
import { FeaturePriority } from '@/lib/feature-utils';

interface NewFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: TrelloList[];
  onAddFeature: (
    title: string,
    desc: string,
    listId: string,
    priority: FeaturePriority
  ) => void;
}

export const NewFeatureModal: React.FC<NewFeatureModalProps> = ({
  isOpen,
  onClose,
  lists,
  onAddFeature,
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [priority, setPriority] = useState<FeaturePriority>('high');

  const effectiveListId =
    selectedListId && lists.some((l) => l.id === selectedListId)
      ? selectedListId
      : lists[0]?.id || '';

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddFeature(title.trim(), desc.trim(), effectiveListId, priority);
    setTitle('');
    setDesc('');
    onClose();
  };

  return (
    <div
      id="new-feature-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-card)',
          color: 'var(--text-main)',
        }}
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-sm sm:text-base font-bold">New Product Feature</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a feature specification or engineering task to the roadmap.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Feature Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Multi-account Instagram carousel dispatch"
              className="w-full rounded-xl border p-2.5 sm:p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                backgroundColor: 'var(--bg-app)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-main)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as FeaturePriority)}
                className="w-full rounded-xl border p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-main)',
                }}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Target Stage
              </label>
              <select
                value={effectiveListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full rounded-xl border p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-main)',
                }}
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Technical Description & Acceptance Criteria
            </label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe requirements, edge cases, or API constraints..."
              className="w-full rounded-xl border p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              style={{
                backgroundColor: 'var(--bg-app)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-main)',
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
            >
              Add to Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
