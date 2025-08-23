import { useEffect, useRef } from 'react';

import type { TAsyncLifecycleCallback } from '../utils/_types';

export function useOnMounted(callback: TAsyncLifecycleCallback) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      return;
    } else {
      isMountedRef.current = true;
      callback();
    }
  }, []);
}
