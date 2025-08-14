import type { Context } from 'react';
import * as React from 'react';

type TUseContext = <T>(context: Context<T>) => T;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const useContext: TUseContext = React.use ?? React.useContext;
