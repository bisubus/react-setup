import type { TWritableRef } from './types';

export const writableRefSymbol = Symbol('WRITABLE_REF');

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
