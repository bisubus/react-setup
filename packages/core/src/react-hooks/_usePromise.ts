import * as React from 'react';

type TUsePromise = <T>(promise: PromiseLike<T>) => T;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const usePromise: TUsePromise = React.use ?? usePromisePolyfill;

// Extracted from https://github.com/nak2k/node-react-use-polyfill/
const PROMISE_STATUS = Symbol('PROMISE_STATUS');
const PROMISE_VALUE = Symbol('PROMISE_VALUE');
const PROMISE_REASON = Symbol('PROMISE_REASON');

function usePromisePolyfill<T>(promise: PromiseLike<T>): T {
  const modified = promise as unknown as PromiseLike<T> & {
    [PROMISE_STATUS]: 'pending' | 'fulfilled' | 'rejected';
    [PROMISE_VALUE]: T;
    [PROMISE_REASON]: unknown;
  };

  switch (modified[PROMISE_STATUS]) {
    case 'fulfilled':
      return modified[PROMISE_VALUE];
    case 'rejected':
      throw modified[PROMISE_REASON];
    case 'pending':
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw modified;
    default: {
      modified[PROMISE_STATUS] = 'pending';

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw modified.then(
        (value) => {
          modified[PROMISE_STATUS] = 'fulfilled';
          modified[PROMISE_VALUE] = value;
        },
        (reason) => {
          modified[PROMISE_STATUS] = 'rejected';
          modified[PROMISE_REASON] = reason;
        },
      );
    }
  }
}
