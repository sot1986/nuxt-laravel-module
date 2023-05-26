import type { Ref } from 'vue-demi'
import { defu } from 'defu'
import { type ZodSchema, z } from 'zod'
import type { ModelStore } from '../types/modelStore'
import capitalizeString from '../utils/capitalizeString'
import { computed, createError, ref } from '#imports'

export default function<
Tmodel extends object,
TidName extends keyof Tmodel & string,
TmodelName extends string,
TdataName extends string = `${TmodelName}s`,
TidValue extends Tmodel[TidName] & (string | number | bigint) = Tmodel[TidName] & (string | number | bigint),
>(config: { modelName: TmodelName; dataName?: TdataName; primaryKeyName: TidName; modelSchema: ZodSchema<Tmodel> }): ModelStore<Tmodel, TidName, TmodelName, TdataName, TidValue> {
  const modelName = capitalizeString(config.modelName)
  const dataName = capitalizeString(config.dataName ?? (`${config.modelName}s` as TdataName))
  const primaryKeyName = capitalizeString(config.primaryKeyName)

  const data = ref([]) as Ref<Tmodel[]>

  const selectedId = ref(null) as Ref<null | TidValue>

  const selectedModel = computed(() => data.value.find(d => d[config.primaryKeyName] === selectedId.value) ?? null)

  const findModelById = computed(() =>
    (key: TidValue | string) => data.value.find(d =>
      String(d[config.primaryKeyName]) === String(key),
    ) ?? null,
  )

  const findIndexInData = computed(() => (key: TidValue | string) =>
    data.value.findIndex((d) => {
      const id = d[config.primaryKeyName]

      if (typeof id === 'number' || typeof id === 'string' || typeof id === 'bigint')
        return String(id) === String(key)

      return null
    }))

  function clean() {
    data.value = []
    selectedId.value = null
  }

  function saveModel(model: Tmodel) {
    const value = config.modelSchema.parse(model)
    return new Promise<void>((resolve, reject) => {
      const key = model[config.primaryKeyName] as TidValue

      if (typeof key !== 'string' && typeof key !== 'bigint' && typeof key !== 'number')
        return reject(createError('Payload not contain correct type.'))

      const index = findIndexInData.value(key)

      if (index < 0)
        data.value.push({ ...value })
      else
        data.value[index] = defu({ ...value }, data.value[index])

      resolve()
    })
  }

  function replaceModels(models: Tmodel[]) {
    return new Promise<void>((resolve) => {
      data.value = [...z.array(config.modelSchema).parse(models)]
      resolve()
    })
  }

  async function pushModels(models: Tmodel[]) {
    await Promise.all([...models.map(m => saveModel(m))])
  }

  function selectModel(key?: TidValue | string) {
    if (typeof key === 'undefined') {
      selectedId.value = null
      return
    }

    const index = findIndexInData.value(key)

    if (index < 0)
      selectedId.value = null
    else
      selectedId.value = data.value[index][config.primaryKeyName] as TidValue
  }

  async function saveAndSelectModel(model: Tmodel) {
    await saveModel(model)

    return selectModel(String(model[config.primaryKeyName]))
  }

  function updateModel(key: TidValue | string, payload: Partial<Tmodel>) {
    if ('partial' in config.modelSchema && typeof config.modelSchema.partial === 'function')
      (config.modelSchema as unknown as ReturnType<typeof z['object']>).partial().parse(payload)

    return new Promise<void>((resolve, reject) => {
      const index = findIndexInData.value(key)

      if (index < 0)
        return reject(createError('No model to update finded.'))

      data.value[index] = defu(payload, data.value[index]) as Tmodel

      resolve()
    })
  }

  async function updateAndSelectModel(key: TidValue | string, payload: Partial<Tmodel>) {
    await updateModel(key, payload)

    selectModel(key)
  }

  function destroyModel(key?: TidValue | string) {
    return new Promise<void>((resolve) => {
      if (String(selectedId.value) === String(key))
        selectedId.value = null

      if (typeof key === 'undefined') {
        data.value = []
        return resolve()
      }

      const index = findIndexInData.value(key)

      if (index < 0)
        return resolve()

      data.value.splice(index, 1)

      resolve()
    })
  }

  return {
    [`${config.dataName ?? config.modelName}s`]: data,
    [`selected${primaryKeyName}`]: selectedId,
    [`selected${modelName}`]: selectedModel,
    [`find${modelName}By${primaryKeyName}`]: findModelById,
    [`save${modelName}`]: saveModel,
    [`saveAndSelect${modelName}`]: saveAndSelectModel,
    [`select${modelName}`]: selectModel,
    [`destroy${modelName}`]: destroyModel,
    [`update${modelName}`]: updateModel,
    [`updateAndSelect${modelName}`]: updateAndSelectModel,
    [`replace${dataName}`]: replaceModels,
    [`push${dataName}`]: pushModels,
    clean,
  } as ModelStore<Tmodel, TidName, TmodelName, TdataName, TidValue>
}
