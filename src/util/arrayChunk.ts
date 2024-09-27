export function arrayChunk<T>(array: T[], size: number): T[][] {
  return array.reduce((acc, _, i) => i % size ? acc : [...acc, array.slice(i, i + size)], [] as T[][]);
}