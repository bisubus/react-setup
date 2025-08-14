export function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}
