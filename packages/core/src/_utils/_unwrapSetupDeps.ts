import { isRef } from './isRef';
import type { TGetter, TUnwrapGetter } from './types';

type TUnwrapSetupHookDeps<P extends TGetter[]> = {
  [K in keyof P]: TUnwrapGetter<P[K]>;
};

export function unwrapSetupDeps<
  PDeps extends TGetter[],
  PUnwrappedDeps = TUnwrapSetupHookDeps<PDeps>,
>(...deps: PDeps): PUnwrappedDeps {
  return deps.map((dep) => {
    if (isRef(dep)) {
      return dep.current;
    } else if (typeof dep === 'function') {
      return dep();
    } else {
      // Undocumented fallback
      return dep;
    }
  }) as PUnwrappedDeps;
}
