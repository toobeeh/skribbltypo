// https://stackoverflow.com/a/60689307

export function promiseAllObject<T extends Record<keyof T, unknown>>(obj: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ).then(Object.fromEntries);
}