import { setupHook } from '@react-setup/core';

import { useOnMount } from '../react-hooks/useOnMount';
import type { useOnMounted } from '../react-hooks/useOnMounted';

export const setupOnMount: typeof useOnMounted = function setupOnMount(callback) {
  setupHook(() => useOnMount(callback));
};
