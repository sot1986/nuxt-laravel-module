import type { ComputedRef, Ref } from 'vue-demi'

export type ModelStore<
Tmodel extends object,
TidName extends keyof Tmodel & string,
TmodelName extends string,
TdataName extends string = `${TmodelName}s`,
TidValue extends Tmodel[TidName] & (string | number | bigint) = Tmodel[TidName] & (string | number | bigint),
> = {
  [key in `${TdataName}`]: Ref<Tmodel[]>
} & {
  [key in `selected${Capitalize<TidName>}`]: Ref<TidValue | null>
} & {
  [key in `selected${Capitalize<TmodelName>}`]: ComputedRef<Tmodel | null>
} & {
  [key in `find${Capitalize<TmodelName>}By${Capitalize<TidName>}`]: ComputedRef<(key: TidValue | string) => Tmodel | null>
} & {
  [key in `save${Capitalize<TmodelName>}`]: (payload: Tmodel) => Promise<void>
} & {
  [key in `select${Capitalize<TmodelName>}`]: (key?: TidValue | string) => void
} & {
  [key in `saveAndSelect${Capitalize<TmodelName>}`]: (payload: Tmodel) => Promise<void>
} & {
  [key in `destroy${Capitalize<TmodelName>}`]: (key?: TidValue | string) => Promise<void>
} & {
  [key in `update${Capitalize<TmodelName>}`]: (key: TidValue | string, payload: Partial<Tmodel>) => Promise<void>
} & {
  [key in `updateAndSelect${Capitalize<TmodelName>}`]: (key: TidValue | string, payload: Partial<Tmodel>) => Promise<void>
} & {
  [key in `replace${Capitalize<TdataName>}`]: (models: Tmodel[]) => Promise<void>
} & {
  [key in `push${Capitalize<TdataName>}`]: (models: Tmodel[]) => Promise<void>
} & {
  clean: () => void
}
export {}
