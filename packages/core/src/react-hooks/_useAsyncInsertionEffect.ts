import { type DependencyList, useInsertionEffect } from 'react';

import { isThenable } from '../utils/_isThenable';
import type { TAsyncEffectCallback } from '../utils/types';

export function useAsyncInsertionEffect(callback: TAsyncEffectCallback, deps?: DependencyList) {
  useInsertionEffect(() => {
    const result = callback();

    if (!isThenable(result)) {
      return result;
    }
  }, deps);
}
