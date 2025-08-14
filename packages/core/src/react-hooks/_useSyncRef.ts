import { useRef } from 'react';

import type { TRef } from '../utils/types';

// A ref that keeps the reference to the latest value
export function useSyncRef<T>(value: T): TRef<T> {
  const ref = useRef<T>(undefined!);
  ref.current = value;

  return ref;
}
