import {
  _useConst as useConst,
  _useSyncRef as useSyncRef,
  _writableRefSymbol as writableRefSymbol,
  type TWritableRef,
} from '@react-setup/core';
import { type Dispatch, type SetStateAction, useState } from 'react';

import type { TRef } from '@core/utils/types';

interface IUseStateRefOptions {
  unsync?: boolean;
}

function useRefFromState<T>(
  [state, setState]: [T, Dispatch<SetStateAction<T>>],
  options?: IUseStateRefOptions,
): TRef<T> {
  const isUnsync = options?.unsync;
  const stateRef = useSyncRef(state);

  const stateWritableRef = useConst(() => {
    const ref = {
      get current(): T {
        return stateRef.current;
      },
      set current(valueOrFn: SetStateAction<T>) {
        if (isUnsync) {
          setState(valueOrFn);
        } else {
          let nextState!: T;

          if (typeof valueOrFn === 'function') {
            const prevState = stateRef.current;
            nextState = (valueOrFn as (prevState: T) => T)(prevState);
          } else {
            nextState = valueOrFn;
          }

          stateRef.current = nextState;
          setState(nextState);
        }
      },
    } as TWritableRef<T> as TRef<T>;

    Object.defineProperty(ref, writableRefSymbol, { value: true, configurable: true });

    return ref;
  });

  return stateWritableRef;
}

export function useStateRef<T>(
  initialValue?: T | (() => T),
  options?: IUseStateRefOptions,
): TRef<T> {
  const stateResult = useState<T>(initialValue!);

  return useRefFromState(stateResult, options);
}
