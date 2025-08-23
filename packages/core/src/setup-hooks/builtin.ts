import {
  type ActionDispatch,
  type AnyActionArg,
  type Context,
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  useActionState,
  useDebugValue,
  useDeferredValue,
  useId,
  useImperativeHandle,
  useMemo,
  useOptimistic,
  useReducer,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';
import { useFormStatus } from 'react-dom';

import { useContext } from '../_react-hooks/_useContext';
import { useAsyncEffect } from '../_react-hooks/useAsyncEffect';
import { useAsyncInsertionEffect } from '../_react-hooks/useAsyncInsertionEffect';
import { useAsyncLayoutEffect } from '../_react-hooks/useAsyncLayoutEffect';
import { useSyncRef } from '../_react-hooks/useSyncRef';
import { unwrapSetupDeps } from '../_utils/_unwrapSetupDeps';
import { isRef } from '../_utils/isRef';
import type {
  TAsyncEffectCallback,
  TFn,
  TGetter,
  TMaybeRef,
  TReadonlyRef,
  TRef,
} from '../_utils/types';
import { unref } from '../_utils/unref';
import { setupHook } from './setupHook';
import { setupRefHook } from './setupRefHook';

// Same multiple signatures as useActionState, returns refs instead of values
export function setupActionState<PState>(
  action: (state: Awaited<PState>) => PState | Promise<PState>,
  initialState: Awaited<PState>,
  permalink?: string,
): [state: TReadonlyRef<Awaited<PState>>, dispatch: () => void, isPending: TReadonlyRef<boolean>];
export function setupActionState<PState, PPayload>(
  action: (state: Awaited<PState>, payload: PPayload) => PState | Promise<PState>,
  initialState: Awaited<PState>,
  permalink?: string,
): [
  state: TReadonlyRef<Awaited<PState>>,
  dispatch: (payload: PPayload) => void,
  isPending: TReadonlyRef<boolean>,
];
export function setupActionState<PState, PPayload>(
  action: (state: Awaited<PState>, payload: PPayload) => PState | Promise<PState>,
  initialState: Awaited<PState>,
  permalink?: string,
) {
  const result = setupHook(() => {
    const [state, dispatch, isPending] = useActionState(action, initialState, permalink);
    const stateRef = useSyncRef(state);
    const isPendingRef = useSyncRef<boolean>(isPending);

    return [stateRef, dispatch, isPendingRef];
  });

  return result;
}

export function setupContext<T>(context: Context<T>): TReadonlyRef<T> {
  const ref = setupRefHook(() => {
    // eslint-disable-next-line react-x/no-use-context
    const value = useContext(context);
    return value;
  });

  return ref;
}

export function setupDebugValue<T>(valueRef: TMaybeRef<T>, format?: TFn): void {
  setupHook(() => {
    const value = unref(valueRef) as T;
    useDebugValue(value, format);
  });
}

export function setupDeferredValue<T>(
  valueRef: TRef<T>,
  initialValueRef?: TMaybeRef<T>,
): TReadonlyRef<T> {
  const ref = setupRefHook(() => {
    const value = valueRef.current;
    const initialValue = unref(initialValueRef) as T | undefined;

    const deferredValue = useDeferredValue(value, initialValue);
    return deferredValue;
  });

  return ref;
}

export function setupEffect(callback: TAsyncEffectCallback, deps?: TGetter[]) {
  setupHook(() => {
    const unwrappedDeps = deps ? unwrapSetupDeps(...deps) : undefined;

    useAsyncEffect(
      (() => {
        return callback();
      }) as TAsyncEffectCallback,
      unwrappedDeps,
    );
  });
}

interface IFormStatusNotPending {
  pending: TReadonlyRef<false>;
  data: TReadonlyRef<null>;
  method: TReadonlyRef<null>;
  action: TReadonlyRef<null>;
}

interface IFormStatusPending {
  pending: TReadonlyRef<true>;
  data: TReadonlyRef<FormData>;
  method: TReadonlyRef<string>;
  action: TReadonlyRef<string | ((formData: FormData) => void | Promise<void>)>;
}

type TFormStatus = IFormStatusNotPending | IFormStatusPending;

export function setupFormStatus(): TFormStatus {
  const result = setupHook(() => {
    const { pending, data, method, action } = useFormStatus();

    const pendingRef = useSyncRef<boolean>(pending);
    const dataRef = useSyncRef<typeof data>(data);
    const methodRef = useSyncRef<string | null>(method);
    const actionRef = useSyncRef<typeof action>(action);

    return { pending: pendingRef, data: dataRef, method: methodRef, action: actionRef };
  });

  return result as TFormStatus;
}

export function setupId(): string {
  const value = setupHook(() => {
    const value = useId();
    return value;
  });

  return value;
}

export function setupImperativeHandle<PInstance, PHandle extends PInstance>(
  instanceRef: TRef<PInstance>,
  handleRef: TRef<PHandle>,
): void;
export function setupImperativeHandle<PInstance, PHandle extends PInstance>(
  instanceRef: TRef<PInstance>,
  getHandle: () => PHandle,
  deps?: TGetter[],
): void;
export function setupImperativeHandle<PInstance, PHandle extends PInstance>(
  instanceRef: TRef<PInstance>,
  handleGetter: TGetter<PHandle>,
  deps?: TGetter[],
) {
  setupHook(() => {
    let unwrappedDeps: unknown[] | undefined;
    let callback: () => PHandle;

    if (isRef(handleGetter)) {
      callback = () => handleGetter.current;
      unwrappedDeps = [handleGetter.current];
    } else {
      callback = handleGetter;
      unwrappedDeps = deps ? unwrapSetupDeps(...deps) : undefined;
    }

    useImperativeHandle(instanceRef, callback, unwrappedDeps);
  });
}

export function setupInsertionEffect(callback: TAsyncEffectCallback, deps?: TGetter[]) {
  setupHook(() => {
    const unwrappedDeps = deps ? unwrapSetupDeps(...deps) : undefined;

    useAsyncInsertionEffect(
      (() => {
        return callback();
      }) as TAsyncEffectCallback,
      unwrappedDeps,
    );
  });
}

export function setupLayoutEffect(callback: TAsyncEffectCallback, deps?: TGetter[]) {
  setupHook(() => {
    const unwrappedDeps = deps ? unwrapSetupDeps(...deps) : undefined;

    useAsyncLayoutEffect(
      (() => {
        return callback();
      }) as TAsyncEffectCallback,
      unwrappedDeps,
    );
  });
}

export function setupMemo<T>(callback: () => T, deps: TGetter[] = []): TReadonlyRef<T> {
  const ref = setupRefHook(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const unwrappedDeps = deps ? unwrapSetupDeps(...deps) : undefined;
    const value = useMemo(callback, unwrappedDeps!);
    return value;
  });

  return ref;
}

// Same multiple signatures as useOptimistic, returns a ref instead of value
export function setupOptimistic<PState>(
  state: PState,
): [TReadonlyRef<PState>, (action: PState | ((pendingState: PState) => PState)) => void];
export function setupOptimistic<PState, PAction>(
  state: PState,
  reducer: (currentState: PState, action: PAction) => PState,
): [TReadonlyRef<PState>, (action: PAction) => void];
export function setupOptimistic<PState, PAction>(
  state: PState,
  reducer?: (currentState: PState, action: PAction) => PState,
) {
  const result = setupHook(() => {
    const [optimisticState, updateOptimistic] = useOptimistic(state, reducer!);
    const optimisticStateRef = useSyncRef(optimisticState);

    return [optimisticStateRef, updateOptimistic];
  });

  return result;
}

// Same multiple signatures as useReducer, returns a ref instead of value
export function setupReducer<PState, PActions extends AnyActionArg>(
  reducer: (prevState: PState, ...args: PActions) => PState,
  initialState: PState,
): [TReadonlyRef<PState>, ActionDispatch<PActions>];
export function setupReducer<PState, PInitValue, PActions extends AnyActionArg>(
  reducer: (prevState: PState, ...args: PActions) => PState,
  initialValue: PInitValue,
  init: (initialValue: PInitValue) => PState,
): [TReadonlyRef<PState>, ActionDispatch<PActions>];
export function setupReducer<PState, PInitValue, PActions extends AnyActionArg>(
  reducer: (prevState: PState, ...args: PActions) => PState,
  initialValue: PInitValue,
  init?: (initialValue: PInitValue) => PState,
): [TReadonlyRef<PState>, ActionDispatch<PActions>] {
  const result = setupHook(() => {
    const [state, dispatch] = useReducer(reducer, initialValue, init!);
    const stateRef = useSyncRef(state);

    return [stateRef, dispatch] as [TReadonlyRef<PState>, ActionDispatch<PActions>];
  });

  return result;
}

// Same multiple signatures as useState, returns a ref instead of value
export function setupState<T = undefined>(): [
  TReadonlyRef<T | undefined>,
  Dispatch<SetStateAction<T | undefined>>,
];
export function setupState<T>(
  initialState: T | (() => T),
): [TReadonlyRef<T>, Dispatch<SetStateAction<T>>];
export function setupState<T>(
  initialState?: T | (() => T),
): [TReadonlyRef<T>, Dispatch<SetStateAction<T>>] {
  const result = setupHook(() => {
    const [state, setState] = useState(initialState!);
    const stateRef = useSyncRef(state);

    return [stateRef, setState] as [TReadonlyRef<T>, Dispatch<SetStateAction<T>>];
  });

  return result;
}

export function setupSyncExternalStore<T>(
  subscribe: (onChange: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): TReadonlyRef<T> {
  const ref = setupRefHook(() => {
    const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return value;
  });

  return ref;
}

export function setupTransition(): [TReadonlyRef<boolean>, TransitionStartFunction] {
  const result = setupHook(() => {
    const [isPending, startTransition] = useTransition();
    const isPendingRef = useSyncRef<boolean>(isPending);

    return [isPendingRef, startTransition] as [TReadonlyRef<boolean>, TransitionStartFunction];
  });

  return result;
}
