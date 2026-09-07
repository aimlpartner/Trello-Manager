'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { EnrichedFeature } from '@/lib/feature-utils';

interface FocusTodayViewProps {
  features: EnrichedFeature[];
  onSelectFeature: (feature: EnrichedFeature) => void;
  onToggleComplete: (id: string) => void;
}

export const FocusTodayView: React.FC<FocusTodayViewProps> = ({
  features,
  onSelectFeature,
  onToggleComplete,
}) => {
  // Pending high priority features
  const pendingTargets = features.filter((f) => !f.dueComplete && f.status !== 'done');
  const [targetIndex, setTargetIndex] = useState(0);

  // Focus timer state
  const [seconds, setSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let intv: NodeJS.Timeout;
    if (isTimerRunning && seconds > 0) {
      intv = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(intv);
  }, [isTimerRunning, seconds]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const current = pendingTargets[targetIndex] || pendingTargets[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 xl:p-8 w-full">
      <div className="border-b pb-4 mb-4 sm:mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Today&apos;s Execution Target
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Zero distraction deck to execute and ship the highest-priority product features one at a time.
            </p>
          </div>

          {/* Pomodoro Timer */}
          <div
            className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-slate-200 dark:border-slate-700 px-3.5 sm:px-4 py-1.5 text-xs font-mono font-semibold"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-900 dark:text-slate-100">{formatTimer(seconds)}</span>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setSeconds(25 * 60);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <RotateCcw className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>

      {current ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {/* Main Focus Card (2 Cols) */}
          <div
            className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6 transition-all"
            style={{
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            {/* Header row: Target X of Y + Module badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                  {targetIndex + 1}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  of {pendingTargets.length} active roadmap items
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {current.identifier}
                </span>
                <span
                  className="rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent-text)',
                  }}
                >
                  {current.moduleLabel}
                </span>
              </div>
            </div>

            {/* Title and specs */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {current.name}
              </h3>

              {current.desc ? (
                <div
                  className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                  style={{
                    backgroundColor: 'var(--bg-app)',
                  }}
                >
                  {current.desc}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  No description provided. Click &apos;Edit Specifications&apos; to add technical specs or acceptance criteria.
                </p>
              )}
            </div>

            {/* Checklists if any */}
            {current.checklists && current.checklists.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subtasks & Verification
                </div>
                {current.checklists.map((cl) => (
                  <div key={cl.id} className="space-y-1.5">
                    {cl.checkItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-xl p-2.5 text-xs border border-slate-200 dark:border-slate-800"
                        style={{
                          backgroundColor: 'var(--bg-app)',
                        }}
                      >
                        <span
                          className={`h-4 w-4 rounded border flex items-center justify-center ${
                            item.state === 'complete'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {item.state === 'complete' && '✓'}
                        </span>
                        <span className={item.state === 'complete' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={targetIndex === 0}
                  onClick={() => setTargetIndex((i) => Math.max(0, i - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
                  title="Previous item"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button
                  type="button"
                  disabled={targetIndex >= pendingTargets.length - 1}
                  onClick={() => setTargetIndex((i) => Math.min(pendingTargets.length - 1, i + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
                  title="Next item"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  Item {targetIndex + 1} of {pendingTargets.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectFeature(current)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Edit Specs
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onToggleComplete(current.id);
                    if (targetIndex >= pendingTargets.length - 1 && targetIndex > 0) {
                      setTargetIndex(targetIndex - 1);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Ship & Next Target</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Queue (1 Col) */}
          <div
            className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Next in Queue
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                {pendingTargets.length} remaining
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[500px]">
              {pendingTargets.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setTargetIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    idx === targetIndex
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider shrink-0 opacity-70 ml-2">
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border p-12 text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-card)' }}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold">All Roadmap Targets Shipped!</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            You’ve completed all pending items on BrandToPost Development. Everything is clean and green.
          </p>
        </div>
      )}
    </div>
  );
};
