export { cn } from "cn";

/** Returns `value` when it matches one of `options`, otherwise `fallback`. */
export const pickOption = <T extends string>(
  options: readonly T[],
  value: string,
  fallback: T,
): T => (options.includes(value as T) ? (value as T) : fallback);
