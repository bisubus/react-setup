import type { TFn } from './types';

type TIsObject<T> =
  T extends object ?
    T extends TFn ?
      never
    : T
  : never;

export function isObject<T>(value: T): value is TIsObject<T> {
  return value && typeof value === 'object';
}
