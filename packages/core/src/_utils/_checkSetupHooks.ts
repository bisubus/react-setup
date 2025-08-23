import type { TFn, TRef } from './types';

export function checkSetupHooks<T extends TFn[] | null>(
  queue: TRef<T>,
): asserts queue is TRef<NonNullable<T>> {
  if (!queue.current) {
    throw new Error(
      'Setup hook can only be used in component setup, must be called before the first await in async setup',
    );
  }
}
