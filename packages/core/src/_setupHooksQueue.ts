import { createRefLike } from './_utils/createRefLike';
import type { TFn } from './_utils/types';

export const setupHooksQueue = createRefLike<TFn[] | null>(null);
