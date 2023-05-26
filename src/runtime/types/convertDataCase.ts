export type ConvertDataCase<T> =
T extends [infer First, ...infer Values]
  ? [ConvertDataCase<First>, ...ConvertDataCase<Values>]
  : T extends Record<string, infer Value>
    ? Record<string, ConvertDataCase<Value>>
    : T
export {}
