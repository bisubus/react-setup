import { useLayoutEffect, useRef } from 'react';

import type { TAsyncLifecycleCallback } from './_types';

export function useOnMount(callback: TAsyncLifecycleCallback) {
  const isMountedRef = useRef(false);

  useLayoutEffect(() => {
    if (isMountedRef.current) {
      return;
    } else {
      isMountedRef.current = true;
      callback();
    }
  }, []);
}
