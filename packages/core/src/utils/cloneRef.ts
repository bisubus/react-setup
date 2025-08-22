import { createRefLike } from './createRefLike';
import type { TRef } from './types';

export function cloneRef<T>(ref: TRef<T>): TRef<T> {
  const clonedRef = createRefLike<T>(ref.current);
  return clonedRef;
}
