import { setupHooksQueue } from '../_setupHooksQueue';
import { checkSetupHooks } from '../utils/_checkSetupHooks';
import type { TFn } from '../utils/types';

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
