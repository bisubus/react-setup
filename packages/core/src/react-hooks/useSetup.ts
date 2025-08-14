import { useDebugValue, useRef } from 'react';

import { setupHooksQueue } from '../_setupHooksQueue';
import { isThenable } from '../utils/_isThenable';
import type { TFn, TMaybePromise } from '../utils/_types';
import { useConst } from './_useConst';
import { usePromise } from './usePromise';

export function useSetup<PInstance extends object>(
  setupFn: () => TMaybePromise<PInstance>,
): PInstance {
  const hooksQueueRef = useRef<TFn[] | null>(null);

  let isSetupPhase = false;

  const instance = useConst(() => {
    let instance: TMaybePromise<PInstance>;

    isSetupPhase = true;

    try {
      setupHooksQueue.current = [];
      instance = setupFn();
      hooksQueueRef.current = setupHooksQueue.current;
    } finally {
      setupHooksQueue.current = null;
    }

    if (isThenable(instance)) {
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      return usePromise(instance) as PInstance | never;
    } else {
      return instance;
    }
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
