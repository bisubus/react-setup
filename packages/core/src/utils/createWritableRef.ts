import { isObject } from './_isObject';
import type { TRef } from './types';

export const writableRefSymbol = Symbol('WRITABLE_REF');

export type TWritableRef<T = unknown> = TRef<T> & { [writableRefSymbol]: true };

export function createWritableRef<PValue, PSetValue = PValue>(
  get: () => PValue,
  set?: (value: PSetValue) => void,
) {
  const ref = {
    get current(): PValue {
      return get();
    },
    set current(value: PSetValue) {
      set?.(value);
    },
  };

  Object.defineProperty(ref, writableRefSymbol, { value: true, configurable: true });

  return ref as TWritableRef<PValue>;
}

type TIsWritableRef<T> = T extends TRef<unknown> ? T : never;

export function isWritableRef<T>(value: T): value is TIsWritableRef<T> {
  return (
    isObject(value) &&
    (value as Record<string | symbol, unknown>)[writableRefSymbol] === true &&
    'current' in value
  );
}
