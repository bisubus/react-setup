import { useRef } from 'react';

import { setupHooksQueue } from '../_setupHooksQueue';
import { checkSetupHooks } from '../utils/_checkSetupHooks';
import type { TRef } from '../utils/types';

export function setupRef<T>(initialValue?: T): TRef<T> {
  checkSetupHooks(setupHooksQueue);

  let ref!: TRef<T>;

  function runHook() {
    ref = useRef(initialValue!);
  }

  runHook();
  setupHooksQueue.current.push(runHook);

  return ref;
}
