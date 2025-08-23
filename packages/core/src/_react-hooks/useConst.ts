import { useRef } from 'react';

export function useConst<T>(fn: () => T): T {
  const ref = useRef<{ value: T }>(undefined);

  if (!ref.current) {
    ref.current = {
      value: fn(),
    };
  }

  return ref.current.value;
}
