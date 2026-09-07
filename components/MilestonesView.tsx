'use client';

import React from 'react';
import {
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Rocket,
  Shield,
  Sparkles,
  ChevronRight,
  Compass,
  Layers,
} from 'lucide-react';
import { EnrichedFeature } from '@/lib/feature-utils';

interface MilestonesViewProps {
  features: EnrichedFeature[];
  onSelectFeature: (feature: EnrichedFeature) => void;
  onToggleComplete: (id: string) => void;
}

interface MilestoneDef {
  id: string;
  title: string;
  tagline: string;
  version: string;
  moduleKey: string;
  icon: React.ReactNode;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  features,
  onSelectFeature,
  onToggleComplete,
}) => {
  const milestones: MilestoneDef[] = [
    {
      id: 'm-core',
      title: 'Infrastructure: Core Engine & Data Plane',
      tagline: 'High-throughput caching, rate limiters, webhooks, and tracing',
      version: 'Sprint 0',
      moduleKey: 'core',
      icon: <Layers className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: 'm-auth',
      title: 'Foundation: Authentication & Access Control',
      tagline: 'Secure multi-provider onboarding, role management & session safety',
      version: 'Sprint 1',
      moduleKey: 'auth',
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
    },
    {
      id: 'm-social',
      title: 'Growth Engine: Multi-Network Social Automation',
      tagline: 'Scheduled dispatch to Instagram, TikTok, X, and Facebook with cron triggers',
      version: 'Sprint 2',
      moduleKey: 'automation',
      icon: <Rocket className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'm-studio',
      title: 'Content Studio: Visual Editor & Creative Engine',
      tagline: 'Brand visuals configuration, asset composer & multi-format export',
      version: 'Sprint 3',
      moduleKey: 'studio',
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 'm-guides',
      title: 'Operations: Workspace Tour & Team Onboarding',
      tagline: 'In-app walk-throughs, email/Slack connectors & mobile companion setup',
      version: 'Sprint 4',
      moduleKey: 'guides',
      icon: <Compass className="h-5 w-5 text-amber-500" />,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 xl:p-8 w-full space-y-4 sm:space-y-6">
      <div className="border-b pb-3 sm:pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Release Sprints & Milestones
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Strategic product delivery roadmap structured into verified release phases across the entire system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {milestones.map((m) => {
          const matchingFeatures = features.filter((f) => f.module === m.moduleKey);
          const completed = matchingFeatures.filter((f) => f.status === 'done' || f.dueComplete);
          const pct =
            matchingFeatures.length > 0
              ? Math.round((completed.length / matchingFeatures.length) * 100)
              : 0;

          return (
            <div
              key={m.id}
              className="rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all hover:border-slate-400 dark:hover:border-slate-600"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div>
                {/* Header: Sprint pill & Icon */}
                <div className="flex items-center justify-between pb-3">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {m.version}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border" style={{ borderColor: 'var(--border-subtle)' }}>
                    {m.icon}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  {m.tagline}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t space-y-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Sprint Completion</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{pct}% ({completed.length}/{matchingFeatures.length})</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Feature items */}
                <div className="mt-4 space-y-1.5">
                  {matchingFeatures.slice(0, 5).map((f) => {
                    const isDone = f.status === 'done' || f.dueComplete;
                    return (
                      <div
                        key={f.id}
                        onClick={() => onSelectFeature(f)}
                        className="flex items-center justify-between gap-2 rounded-xl p-2 text-xs border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(f.id);
                            }}
                            className="text-slate-400 hover:text-emerald-600 shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                            {f.identifier}
                          </span>
                          <span
                            className={`truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {f.cleanName || f.name}
                          </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      </div>
                    );
                  })}
                  {matchingFeatures.length > 5 && (
                    <div className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                      + {matchingFeatures.length - 5} more features in this sprint
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
