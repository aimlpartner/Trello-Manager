'use client';

import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useMounted } from '@/hooks/useMounted';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isMounted = useMounted();
  const isOnline = useOnlineStatus();

  if (!isMounted || isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-200">
      <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
      <span>Offline Mode — Cached roadmap and local changes active.</span>
    </div>
  );
};
