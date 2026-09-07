'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div
      id="app-error-boundary"
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: 'var(--bg-app, #090D16)', color: 'var(--text-primary, #F8FAFC)' }}
    >
      <div className="max-w-md w-full rounded-2xl border p-8 shadow-xl" style={{ backgroundColor: 'var(--bg-surface, #0F172A)', borderColor: 'var(--border-subtle, #1E293B)' }}>
        <span className="inline-block px-3 py-1 text-xs font-mono font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
          Application Error
        </span>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {error.message || 'An unexpected error occurred while loading this view.'}
        </p>
        <button
          id="error-reset-btn"
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
