import { usePromise } from '../_react-hooks/usePromise';
import { setupHooksQueue } from '../_setupHooksQueue';
import { checkSetupHooks } from '../_utils/_checkSetupHooks';

export const setupPromise = function setupPromise<T>(promise: PromiseLike<T>) {
  checkSetupHooks(setupHooksQueue);

  return usePromise(promise);
};
