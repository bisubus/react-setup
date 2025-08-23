import { _createRefLike as createRefLike } from '@react-setup/core';

import type { TRef } from '@core/_utils/types';

export function cloneRef<T>(ref: TRef<T>): TRef<T> {
  const clonedRef = createRefLike<T>(ref.current);
  return clonedRef;
}
