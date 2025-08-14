import type { TRef } from './types';

// Ref-like object to be used in place of useRef and createRef in non-component contexts
export const createRefLike = <T = unknown>(initialValue?: T): TRef<T> => {
  return { current: initialValue! };
};
