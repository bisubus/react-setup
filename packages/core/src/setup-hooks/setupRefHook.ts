import { setupHooksQueue } from '../_setupHooksQueue';
import { useSyncRef } from '../react-hooks/_useSyncRef';
import { checkSetupHooks } from '../utils/_checkSetupHooks';
import { isObject } from '../utils/_isObject';
import { createObjProxy, type ICreateObjProxyOptions } from '../utils/createObjProxy';
import type { TFn, TRef } from '../utils/types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ISetupHookOptions extends ICreateObjProxyOptions {}

export function setupRefHook<
  PHook extends TFn<object>,
  POptions extends ISetupHookOptions,
  PResult extends ReturnType<PHook>,
>(fn: PHook, options: POptions & { unref: true }): PResult;
export function setupRefHook<
  PHook extends TFn,
  POptions extends ISetupHookOptions,
  PResult extends ReturnType<PHook>,
>(fn: PHook, options?: POptions): TRef<PResult>;
export function setupRefHook<
  PHook extends TFn,
  POptions extends ISetupHookOptions,
  PResult extends ReturnType<PHook>,
>(fn: PHook, options: POptions = {} as POptions): PResult | TRef<PResult> {
  checkSetupHooks(setupHooksQueue);

  let resultRef!: TRef<PResult>;

  function runHook() {
    resultRef = useSyncRef(fn() as PResult);
  }

  runHook();
  setupHooksQueue.current.push(runHook);

  if (options.unref) {
    if (!isObject(resultRef.current)) {
      throw new Error(`Option 'unref' requires a hook to return an object`);
    }

    return createObjProxy(resultRef, options) as PResult;
  } else {
    return resultRef;
  }
}
