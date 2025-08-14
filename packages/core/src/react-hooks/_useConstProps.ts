import { createObjProxy } from '../utils/createObjProxy';
import { useConst } from './_useConst';
import { useSyncRef } from './_useSyncRef';

export function useConstProps<PProps extends object>(props: PProps): Readonly<PProps> {
  const propsRef = useSyncRef(props);

  const constProps = useConst(() =>
    createObjProxy(propsRef, { strict: true, readonly: true, unref: true }),
  );

  return constProps;
}
