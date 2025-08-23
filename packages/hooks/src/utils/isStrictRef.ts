import { isObject } from '@core/_utils/_isObject';
import type { TIsRef } from '@core/_utils/isRef';

export function isStrictRef<T>(value: T): value is TIsRef<T> {
  return isObject(value) && 'current' in value && Object.keys(value).length === 1;
}
