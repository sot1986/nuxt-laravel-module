import type { ComputedRef, Ref } from 'vue-demi'
import type { PagePagination } from '../types/api'
import { computed } from '#imports'

export interface UsePagePaginationPayload {
  pagination: Ref<PagePagination | null | undefined> | ComputedRef<PagePagination | null | undefined>
  page: Ref<number>
}

export default function ({ pagination, page }: UsePagePaginationPayload): {
  pageIsFirstPage: ComputedRef<boolean>
  isCurrentPage: ComputedRef<(value: number | string) => boolean>
  pageIsLastPage: ComputedRef<boolean>
  setPage: (value: number | string) => void
  moveNext: () => void
  movePrev: () => void
} {
  const pageIsFirstPage = computed(() => page.value === 1)
  const pageIsLastPage = computed(() => page.value === pagination.value?.lastPage)
  const isCurrentPage = computed(() => (value: number | string) =>
    typeof value === 'number'
      ? page.value === value
      : value.match(/^\d+$/)
        ? `${page.value}` === value
        : false,
  )

  function inLimits(value: number) {
    return (pagination.value && value >= 1 && value <= pagination.value.lastPage)
      ? value
      : undefined
  }

  function setPage(value: number | string) {
    if (!pagination.value) {
      page.value = 1
      return
    }

    if (typeof value === 'number') {
      page.value = inLimits(value) ?? page.value
      return
    }

    if (value.match(/^\d+$/)) {
      page.value = inLimits(parseInt(value, 10)) ?? page.value
      return
    }

    if (value.match(/Prev/))
      return movePrev()

    if (value.match(/Next/))
      moveNext()
  }

  function moveNext() {
    if (pageIsLastPage.value)
      return

    page.value += 1
  }

  function movePrev() {
    if (pageIsFirstPage.value)
      return

    page.value -= 1
  }

  return {
    pageIsFirstPage,
    isCurrentPage,
    pageIsLastPage,
    setPage,
    moveNext,
    movePrev,
  }
}
