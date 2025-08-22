import {
  createElement as h,
  type FunctionComponent,
  memo,
  type NamedExoticComponent,
  type ReactNode,
  Suspense,
  useRef,
} from 'react';

import { setupHooksQueue } from './_setupHooksQueue';
import { useConst } from './react-hooks/_useConst';
import { useConstProps } from './react-hooks/_useConstProps';
import { usePromise } from './react-hooks/_usePromise';
import { useSyncRef } from './react-hooks/_useSyncRef';
import { isThenable } from './utils/_isThenable';
import type { TFn, TMaybePromise, TReadonlyRef } from './utils/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TSetupComponentRenderFn<PProps> = <PProps>(props?: PProps) => ReactNode;

type TSetupComponent<PProps = object> = ((
  props: PProps,
) => TMaybePromise<TSetupComponentRenderFn<PProps>>) & {
  displayName?: string | undefined;
};

type TMemoCompareFn = <TProps>(prevProps: Readonly<TProps>, nextProps: Readonly<TProps>) => boolean;

interface ISetupComponentOptions {
  name?: string;
  async?: boolean;
  memo?: boolean | TMemoCompareFn;
  propsRef?: boolean;
}

export function setupComponent<
  PProps extends object,
  POptions extends ISetupComponentOptions = ISetupComponentOptions,
>(
  setupFn: TSetupComponent<TReadonlyRef<PProps>>,
  options: POptions & { propsRef: true; memo: true | TMemoCompareFn },
): NamedExoticComponent<PProps>;
export function setupComponent<
  PProps extends object,
  POptions extends ISetupComponentOptions = ISetupComponentOptions,
>(
  setupFn: TSetupComponent<TReadonlyRef<PProps>>,
  options: POptions & { propsRef: true },
): FunctionComponent<PProps>;
export function setupComponent<
  PProps extends object,
  POptions extends ISetupComponentOptions = ISetupComponentOptions,
>(
  setupFn: TSetupComponent<Readonly<PProps>>,
  options: POptions & { memo: true | TMemoCompareFn },
): NamedExoticComponent<PProps>;
export function setupComponent<
  PProps extends object,
  POptions extends ISetupComponentOptions = ISetupComponentOptions,
>(setupFn: TSetupComponent<Readonly<PProps>>, options?: POptions): FunctionComponent<PProps>;
export function setupComponent<
  PProps extends object,
  POptions extends ISetupComponentOptions,
  PReadonlyProps extends Readonly<PProps> | TReadonlyRef<PProps>,
>(
  setupFn: TSetupComponent<PReadonlyProps>,
  options: POptions = {} as POptions,
): FunctionComponent<PProps> | NamedExoticComponent<PProps> {
  // Ensure the options aren't changed throughout the component lifecycle
  const isPropsRef = options.propsRef;
  const isAsync = options.async;
  const componentName = options.name || setupFn.displayName || setupFn.name;

  function SetupComponent(props: PProps) {
    let constProps!: Readonly<PProps> | TReadonlyRef<PProps>;

    if (isPropsRef) {
      constProps = useSyncRef(props);
    } else {
      constProps = useConstProps(props);
    }

    const hooksQueueRef = useRef<TFn[] | null>(null);

    let isSetupPhase = false;

    const renderFn = useConst(() => {
      let result;

      isSetupPhase = true;

      try {
        setupHooksQueue.current = [];
        result = setupFn(constProps as PReadonlyProps);
        hooksQueueRef.current = setupHooksQueue.current;
      } finally {
        setupHooksQueue.current = null;
      }

      let renderFn!: TSetupComponentRenderFn<PProps>;
      const isRenderComponent = isAsync || isThenable(result);

      if (isRenderComponent) {
        const renderFnPromise = Promise.resolve(result);

        const RenderComponent: FunctionComponent<PProps> = function RenderComponent(props: PProps) {
          const awaitedRenderFn = usePromise(renderFnPromise);

          return awaitedRenderFn(props);
        };

        if (componentName) {
          RenderComponent.displayName = `${componentName}Render`;
        }

        renderFn = ((props: PProps) => {
          /*
          return (
            <Suspense>
              <RenderComponent {...props} />
            </Suspense>
          );
*/
          return h(Suspense, null, h(RenderComponent, props));
        }) as TSetupComponentRenderFn<PProps>;
      } else {
        renderFn = result as TSetupComponentRenderFn<PProps>;
      }

      return renderFn;
    });

    // Skip first render
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!isSetupPhase && hooksQueueRef.current) {
      for (const hook of hooksQueueRef.current) {
        hook();
      }
    }

    return renderFn(props);
  }

  if (componentName) {
    SetupComponent.displayName = componentName;
  }

  if (options.memo) {
    // Display name of a memoized component is shown by default in React devtools with "memo" label
    let MemoComponent: NamedExoticComponent<PProps>;

    if (typeof options.memo === 'function') {
      MemoComponent = memo(SetupComponent, options.memo);
    } else {
      MemoComponent = memo(SetupComponent);
    }

    return MemoComponent;
  } else {
    return SetupComponent;
  }
}
