import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import usePagePagination from '../../src/runtime/composables/usePagePagination'
import type { PagePagination } from '~/../src/runtime/types/api'

describe('test usePagePagination composable', () => {
  beforeEach(() => {
    vi.mock('#imports', () => ({ ref, computed }))
  })

  it('can change page based on limits', () => {
    const page = ref(1)

    const pagination = ref<PagePagination | null>(null)

    const {
      setPage, isCurrentPage, pageIsFirstPage, pageIsLastPage, moveNext, movePrev,
    } = usePagePagination({ pagination, page })

    expect(isCurrentPage.value(1)).toBe(true)
    expect(isCurrentPage.value('1')).toBe(true)
    expect(pageIsFirstPage.value).toBe(true)
    expect(pageIsLastPage.value).toBe(false)

    pagination.value = {
      currentPage: 1,
      from: 1,
      lastPage: 4,
      path: '/test?page=1',
      total: 4,
      perPage: 10,
      to: 48,
      links: [],
    }

    movePrev()
    expect(page.value).toBe(1)

    setPage(2)

    expect(page.value).toBe(2)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(false)

    pagination.value = {
      currentPage: 2,
      from: 1,
      lastPage: 4,
      path: '/test?page=2',
      total: 4,
      perPage: 10,
      to: 48,
      links: [],
    }

    moveNext()
    expect(page.value).toBe(3)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(false)

    pagination.value = {
      currentPage: 3,
      from: 1,
      lastPage: 4,
      path: '/test?page=2',
      total: 4,
      perPage: 10,
      to: 48,
      links: [],
    }

    moveNext()
    expect(page.value).toBe(4)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(true)

    pagination.value = {
      currentPage: 4,
      from: 1,
      lastPage: 4,
      path: '/test?page=2',
      total: 4,
      perPage: 10,
      to: 48,
      links: [],
    }

    moveNext()
    expect(page.value).toBe(4)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(true)

    setPage(5)
    expect(page.value).toBe(4)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(true)

    setPage('5')
    expect(page.value).toBe(4)
    expect(pageIsFirstPage.value).toBe(false)
    expect(pageIsLastPage.value).toBe(true)

    setPage('1')
    expect(page.value).toBe(1)
    expect(pageIsFirstPage.value).toBe(true)
  })
})
