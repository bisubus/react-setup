import { createRefLike } from './utils/createRefLike';
import type { TFn } from './utils/types';

export const setupHooksQueue = createRefLike<TFn[] | null>(null);
