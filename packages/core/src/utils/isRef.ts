import { isObject } from './_isObject';
import type { TRef } from './types';

export type TIsRef<T> = T extends TRef<unknown> ? T : never;

export function isRef<T>(value: T): value is TIsRef<T> {
  return isObject(value) && 'current' in value;
}
