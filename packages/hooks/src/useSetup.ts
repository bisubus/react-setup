import { useDebugValue, useRef } from 'react';

import { setupHooksQueue } from '@core/_setupHooksQueue';
import { useConst } from '@core/react-hooks/_useConst';
import { isThenable } from '@core/utils/_isThenable';
import type { TFn } from '@core/utils/types';

export function useSetup<PInstance extends object>(setupFn: TFn<PInstance>): PInstance {
  const hooksQueueRef = useRef<TFn[] | null>(null);

  let isSetupPhase = false;

  const instance = useConst(() => {
    let instance: PInstance;

    isSetupPhase = true;

    try {
      setupHooksQueue.current = [];
      instance = setupFn();

      if (isThenable(instance)) {
        throw new Error('Async setup not supported');
      }

      hooksQueueRef.current = setupHooksQueue.current;
    } finally {
      setupHooksQueue.current = null;
    }

    return instance;
  });

  // Skip first render
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!isSetupPhase && hooksQueueRef.current) {
    for (const hook of hooksQueueRef.current) {
      hook();
    }
  }

  useDebugValue(instance);

  return instance;
}
