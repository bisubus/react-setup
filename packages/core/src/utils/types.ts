import type { EffectCallback, RefObject } from 'react';

export type TPlainObj = Record<string, unknown>;

export type TFn<T = unknown> = (...args: unknown[]) => T;

export type TMaybePromise<T> = T | PromiseLike<T>;

export type TRef<T = unknown> = RefObject<T>;

export type TMaybeRef<T = unknown> = T extends RefObject<T> ? RefObject<T> : T;

export interface TReadonlyRef<T> {
  readonly current: T;
}

export type TAsyncEffectCallback = EffectCallback | (() => PromiseLike<void>);

export type TGetter<T = unknown> = TRef<T> | (() => T);

export type TUnwrapGetter<T> =
  T extends TRef<infer U> ? U
  : T extends () => infer U ? U
  : never;
