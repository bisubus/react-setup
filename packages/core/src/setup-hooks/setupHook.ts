import { setupHooksQueue } from '../_setupHooksQueue';
import { checkSetupHooks } from '../_utils/_checkSetupHooks';
import type { TFn } from '../_utils/types';

export function setupHook<PHook extends TFn, PResult extends ReturnType<PHook>>(
  fn: PHook,
): PResult {
  checkSetupHooks(setupHooksQueue);

  let result!: PResult;

  function runHook() {
    result = fn() as PResult;
  }

  runHook();
  setupHooksQueue.current.push(runHook);

  return result;
}
