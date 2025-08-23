import { setupHook } from '@react-setup/core';

import { useOnMounted } from '../react-hooks/useOnMounted';

export const setupOnMounted: typeof useOnMounted = function setupOnMounted(callback) {
  setupHook(() => useOnMounted(callback));
};
