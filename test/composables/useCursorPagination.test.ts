import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import useCursorPagination from '../../src/runtime/composables/useCursorPagination'
import type { CursorPagination } from '~/../src/runtime/types/api'

describe('test useCursorPagination composable', () => {
  beforeEach(() => {
    vi.mock('#imports', () => ({ computed }))
  })

  it('can move cursor', () => {
    const pagination = ref<CursorPagination>({
      nextCursor: 'nextCursor-1',
      prevCursor: null,
      perPage: 10,
      path: '/test?cursor=',
    })
    const cursor = ref<string | null>(null)

    const { cursorIsFirst, cursorIsLast, moveNext, movePrev } = useCursorPagination({ pagination, cursor })

    expect(cursorIsFirst.value).toBe(true)
    expect(cursorIsLast.value).toBe(false)

    moveNext()
    pagination.value = {
      nextCursor: 'nextCursor-2',
      prevCursor: 'prevCursor-1',
      perPage: 10,
      path: '/test?cursor=nextCursor-1',
    }

    expect(cursor.value).toBe('nextCursor-1')
    expect(cursorIsFirst.value).toBe(false)
    expect(cursorIsLast.value).toBe(false)

    movePrev()
    pagination.value = {
      nextCursor: 'nextCursor-1',
      prevCursor: null,
      perPage: 10,
      path: '/test?cursor=prevCursor-1',
    }

    expect(cursor.value).toBe('prevCursor-1')
    expect(cursorIsFirst.value).toBe(true)
    expect(cursorIsLast.value).toBe(false)
  })
})
