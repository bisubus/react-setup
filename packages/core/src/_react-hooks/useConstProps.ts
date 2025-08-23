import { createObjProxy } from '../_utils/createObjProxy';
import { useConst } from './useConst';
import { useSyncRef } from './useSyncRef';

export function useConstProps<PProps extends object>(props: PProps): Readonly<PProps> {
  const propsRef = useSyncRef(props);

  const constProps = useConst(() =>
    createObjProxy(propsRef, { strict: true, readonly: true, unref: true }),
  );

  return constProps;
}
