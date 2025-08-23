import { useEffect, useRef } from 'react';

import type { TAsyncLifecycleCallback } from '../utils/_types';

export function useOnUnmounted(callback: TAsyncLifecycleCallback) {
  const pendingCleanupCount = useRef(0);

  useEffect(() => {
    pendingCleanupCount.current++;

    return () => {
      // Skip the first synchronous cleanup in strict mode
      queueMicrotask(() => {
        pendingCleanupCount.current--;

        if (pendingCleanupCount.current === 0) {
          callback();
        }
      });
    };
  }, []);
}
