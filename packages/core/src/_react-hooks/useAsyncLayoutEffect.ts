import { type DependencyList, useLayoutEffect } from 'react';

import { isThenable } from '../_utils/_isThenable';
import type { TAsyncEffectCallback } from '../_utils/types';

export function useAsyncLayoutEffect(callback: TAsyncEffectCallback, deps?: DependencyList) {
  useLayoutEffect(() => {
    const result = callback();

    if (!isThenable(result)) {
      return result;
    }
  }, deps);
}
