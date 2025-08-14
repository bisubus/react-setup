import { type DependencyList, useEffect } from 'react';

import { isThenable } from '../utils/_isThenable';
import type { TAsyncEffectCallback } from '../utils/types';

export function useAsyncEffect(callback: TAsyncEffectCallback, deps?: DependencyList) {
  useEffect(() => {
    const result = callback();

    if (!isThenable(result)) {
      return result;
    }
  }, deps);
}
