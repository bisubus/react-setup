import { _writableRefSymbol as writableRefSymbol } from '@react-setup/core';

import { isObject } from '@core/_utils/_isObject';
import type { TRef } from '@core/_utils/types';

type TIsWritableRef<T> = T extends TRef<unknown> ? T : never;

export function isWritableRef<T>(value: T): value is TIsWritableRef<T> {
  return (
    isObject(value) &&
    (value as Record<string | symbol, unknown>)[writableRefSymbol] === true &&
    'current' in value
  );
}
