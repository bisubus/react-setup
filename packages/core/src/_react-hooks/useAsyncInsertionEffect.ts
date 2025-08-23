import { type DependencyList, useInsertionEffect } from 'react';

import { isThenable } from '../_utils/_isThenable';
import type { TAsyncEffectCallback } from '../_utils/types';

export function useAsyncInsertionEffect(callback: TAsyncEffectCallback, deps?: DependencyList) {
  useInsertionEffect(() => {
    const result = callback();

    if (!isThenable(result)) {
      return result;
    }
  }, deps);
}
