import { setupHook } from '@react-setup/core';

import { useStateRef } from '../react-hooks/useStateRef';

export const setupStateRef: typeof useStateRef = function setupStateRef(initialValue?, options?) {
  return setupHook(() => useStateRef(initialValue, options));
};
