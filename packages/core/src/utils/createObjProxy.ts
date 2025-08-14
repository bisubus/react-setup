import type { TPlainObj, TRef } from './types';

export interface ICreateObjProxyOptions {
  readonly?: boolean;
  strict?: boolean;
  unref?: boolean;
}

export function createObjProxy<PValue extends object, POptions extends ICreateObjProxyOptions>(
  objOrRef: TRef<PValue>,
  options: POptions & { unref: true },
): PValue;
export function createObjProxy<PValue extends object, POptions extends ICreateObjProxyOptions>(
  objOrRef: TRef<PValue> | PValue,
  options?: POptions,
): TRef<PValue>;
export function createObjProxy<PValue extends object, POptions extends ICreateObjProxyOptions>(
  objOrRef: TRef<PValue> | PValue,
  options: POptions = {} as POptions,
): TRef<PValue> | PValue {
  const isStrict = options.strict;
  const isReadonly = options.readonly;

  const getObjValue = options.unref ? () => (objOrRef as TRef<PValue>).current : () => objOrRef;
  const objValue = getObjValue();
  const target = objValue && Array.isArray(objValue) ? [] : {};

  const proxyOptions: ProxyHandler<PValue> = {
    get(_target: unknown, key: string) {
      if (isStrict && getObjValue() == null) {
        throw new Error(`Cannot get "${String(key)}" of non-object`);
      }

      return (getObjValue() as TPlainObj)?.[key];
    },
    ownKeys() {
      if (isStrict && getObjValue() == null) {
        throw new Error(`Cannot get keys of non-object`);
      }

      return Reflect.ownKeys(getObjValue() as TPlainObj);
    },
    getOwnPropertyDescriptor(_, key) {
      if (isStrict && getObjValue() == null) {
        throw new Error(`Cannot get "${String(key)}" descriptor of non-object`);
      }

      return Reflect.getOwnPropertyDescriptor(getObjValue() as TPlainObj, key);
    },
  };

  if (isReadonly) {
    Object.assign(proxyOptions, {
      set(_target: unknown, key: string, _value: unknown) {
        throw new Error(`Cannot modify readonly "${String(key)}"`);
      },
      defineProperty(_target: unknown, key: string, _descriptor: PropertyDescriptor) {
        throw new Error(`Cannot redefine "${String(key)}"`);
      },
      deleteProperty(_target: unknown, key: string) {
        throw new Error(`Cannot delete "${String(key)}"`);
      },
    });
  } else {
    Object.assign(proxyOptions, {
      set(_target: unknown, key: string, value: unknown) {
        if (getObjValue() == null) {
          if (isStrict) {
            throw new Error(`Cannot set "${String(key)}" of non-object`);
          } else {
            return false;
          }
        }

        (getObjValue() as TPlainObj)[key] = value;
        return true;
      },
      defineProperty(_target: unknown, key: string, descriptor: PropertyDescriptor) {
        if (getObjValue() == null) {
          if (isStrict) {
            throw new Error(`Cannot define "${String(key)}" of non-object`);
          } else {
            return false;
          }
        }

        Object.defineProperty(getObjValue(), key, descriptor);
        return true;
      },
      deleteProperty(_target: unknown, key: string) {
        if (getObjValue() == null) {
          if (isStrict) {
            throw new Error(`Cannot delete "${String(key)}" of non-object`);
          } else {
            return false;
          }
        }

        delete (getObjValue() as TPlainObj)[key];
        return true;
      },
    });
  }

  return new Proxy(target, proxyOptions) as PValue;
}
