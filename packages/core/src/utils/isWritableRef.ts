import { isObject } from './_isObject';
import { writableRefSymbol } from './createWritableRef';
import type { TRef } from './types';

type TIsWritableRef<T> = T extends TRef<unknown> ? T : never;

export function isWritableRef<T>(value: T): value is TIsWritableRef<T> {
  return (
    isObject(value) &&
    (value as Record<string | symbol, unknown>)[writableRefSymbol] === true &&
    'current' in value
  );
}
