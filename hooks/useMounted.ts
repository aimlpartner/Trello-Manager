'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns true once the component has mounted on the client.
 * Uses useSyncExternalStore to ensure exact server/client HTML match during hydration,
 * avoiding hydration mismatch errors.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
