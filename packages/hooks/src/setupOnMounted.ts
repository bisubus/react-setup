import { setupHook } from '@react-setup/core';

import { useOnMounted } from './useOnMounted';

export const setupOnMounted: typeof useOnMounted = function setupOnMounted(callback) {
  setupHook(() => useOnMounted(callback));
};
