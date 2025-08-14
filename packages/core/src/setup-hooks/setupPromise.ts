import { setupHooksQueue } from '../_setupHooksQueue';
import { usePromise } from '../react-hooks/_usePromise';
import { checkSetupHooks } from '../utils/_checkSetupHooks';

export const setupPromise = function setupPromise<T>(promise: PromiseLike<T>) {
  checkSetupHooks(setupHooksQueue);

  return usePromise(promise);
};
