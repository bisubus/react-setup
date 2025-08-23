import { isObject } from './_isObject';
import type { TRef } from './types';

export type TUnref<T> = T extends TRef<infer U> ? U : T;

export function unref<T>(value: T): TUnref<T> {
  if (isObject(value) && 'current' in value) {
    return value.current as TUnref<T>;
  } else {
    return value as TUnref<T>;
  }
}
