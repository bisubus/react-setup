import type { TRef } from './types';

export const refLikeSymbol = Symbol('REF_LIKE');

// Ref-like object to be used in place of useRef and createRef in non-component contexts
export const createRefLike = <T = unknown>(initialValue?: T) => {
  return {
    [refLikeSymbol]: true,
    current: initialValue!,
  } as TRef<T>;
};
