import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import { z } from 'zod'
import useModelStore from '../../src/runtime/composables/useModelStore'

describe('test useModelStore composable', () => {
  beforeEach(() => {
    vi.mock('#imports', () => ({
      computed, createError: (message: string) => new Error(message), ref,
    }))
  })

  const userSchema = z.object({
    id: z.coerce.bigint().positive(),
    name: z.string(),
    email: z.string().email(),
  })

  it('can make all CRUD operations', async () => {
    const model = useModelStore({
      modelName: 'user',
      modelSchema: userSchema,
      primaryKeyName: 'id',
    })

    expect(model.users.value).toEqual([])
    expect(model.selectedUser.value).toBeNull()
    expect(model.selectedId.value).toBeNull()

    const newUser: z.infer<typeof userSchema> = {
      id: 1n,
      name: 'Matteo',
      email: 'matteo@email.it',
    }
    await model.saveAndSelectUser(newUser)

    expect(model.users.value).toEqual([newUser])
    expect(model.selectedId.value).toBe(1n)

    model.selectUser()
    expect(model.selectedUser.value).toBeNull()
    expect(model.selectedId.value).toBeNull()

    await model.updateUser('1', { name: 'Matteo Presot' })
    expect(model.users.value).toEqual([{
      ...newUser, name: 'Matteo Presot',
    }])

    expect(model.selectedUser.value).toBeNull()
    expect(model.selectedId.value).toBeNull()

    await model.destroyUser('1')
    expect(model.selectedUser.value).toBeNull()
    expect(model.users.value).toEqual([])
  })

  it('rejects if some data are not valid', async () => {
    const model = useModelStore({
      modelName: 'user',
      modelSchema: userSchema,
      primaryKeyName: 'id',
    })

    expect(model.users.value).toEqual([])
    expect(model.selectedUser.value).toBeNull()
    expect(model.selectedId.value).toBeNull()

    const newUser: z.infer<typeof userSchema> = {
      id: 1n,
      name: 'Matteo',
      email: 'matteo@email',
    }
    await expect(async () => {
      await model.saveAndSelectUser(newUser)
    }).rejects.toThrowError()

    newUser.email = 'matteo@email.it'
    await model.saveAndSelectUser(newUser)

    await expect(() => model.updateAndSelectUser('1', { id: -1n })).rejects.toThrowError()
  })

  it('can find model by id', async () => {
    const model = useModelStore({
      modelName: 'user',
      modelSchema: userSchema,
      primaryKeyName: 'id',
    })

    await model.pushUsers([
      { id: 1n, name: 'Matteo', email: 'matteo@email.it' },
      { id: 2n, name: 'Luigi', email: 'luigi@email.it' },
      { id: 3n, name: 'Fabio', email: 'fabio@email.it' },
    ])

    const model3 = model.findUserById.value(3n)
    expect(model3?.email).toBe('fabio@email.it')

    const model2 = model.findUserById.value('2')
    expect(model2?.email).toBe('luigi@email.it')
  })

  it('can replace many models at once', async () => {
    const model = useModelStore({
      modelName: 'user',
      modelSchema: userSchema,
      primaryKeyName: 'id',
    })

    await model.pushUsers([
      { id: 1n, name: 'Matteo', email: 'matteo@email.it' },
      { id: 2n, name: 'Luigi', email: 'luigi@email.it' },
      { id: 3n, name: 'Fabio', email: 'fabio@email.it' },
    ])

    expect(model.users.value).toEqual([
      { id: 1n, name: 'Matteo', email: 'matteo@email.it' },
      { id: 2n, name: 'Luigi', email: 'luigi@email.it' },
      { id: 3n, name: 'Fabio', email: 'fabio@email.it' },
    ])

    await model.replaceUsers([
      { id: 4n, name: 'Matteo1', email: 'matteo1@email.it' },
      { id: 5n, name: 'Luigi1', email: 'luigi1@email.it' },
      { id: 6n, name: 'Fabio1', email: 'fabio1@email.it' },
    ])

    expect(model.users.value).toEqual([
      { id: 4n, name: 'Matteo1', email: 'matteo1@email.it' },
      { id: 5n, name: 'Luigi1', email: 'luigi1@email.it' },
      { id: 6n, name: 'Fabio1', email: 'fabio1@email.it' },
    ])

    model.clean()
    expect(model.users.value).toEqual([])
  })
})
