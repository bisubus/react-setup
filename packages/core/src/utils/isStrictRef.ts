import { isObject } from './_isObject';
import type { TIsRef } from './isRef';

export function isStrictRef<T>(value: T): value is TIsRef<T> {
  return isObject(value) && 'current' in value && Object.keys(value).length === 1;
}
