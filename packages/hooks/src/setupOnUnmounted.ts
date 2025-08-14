import { setupHook } from '@react-setup/core';

import { useOnUnmounted } from './useOnUnmounted';

export const setupOnUnmounted: typeof useOnUnmounted = function setupOnUnmounted(callback) {
  setupHook(() => useOnUnmounted(callback));
};
