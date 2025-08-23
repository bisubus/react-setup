import { type DependencyList, useEffect } from 'react';

import { isThenable } from '../_utils/_isThenable';
import type { TAsyncEffectCallback } from '../_utils/types';

export function useAsyncEffect(callback: TAsyncEffectCallback, deps?: DependencyList) {
  useEffect(() => {
    const result = callback();

    if (!isThenable(result)) {
      return result;
    }
  }, deps);
}
