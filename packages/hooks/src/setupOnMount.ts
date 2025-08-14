import { setupHook } from '@react-setup/core';

import { useOnMount } from './useOnMount';
import type { useOnMounted } from './useOnMounted';

export const setupOnMount: typeof useOnMounted = function setupOnMount(callback) {
  setupHook(() => useOnMount(callback));
};
