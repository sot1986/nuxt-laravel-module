import type { ComputedRef, Ref } from 'vue-demi'
import type { CursorPagination } from '../types/api'
import { computed } from '#imports'

export interface UsePagePaginationPayload {
  pagination:
  | Ref<CursorPagination | null | undefined>
  | ComputedRef<CursorPagination | null | undefined>
  cursor: Ref<string | null>
}

export default function ({ pagination, cursor }: UsePagePaginationPayload): {
  cursorIsFirst: ComputedRef<boolean>
  cursorIsLast: ComputedRef<boolean>
  moveNext: () => void
  movePrev: () => void
} {
  const cursorIsFirst = computed(() => !!pagination.value && !pagination.value.prevCursor)
  const cursorIsLast = computed(() => !!pagination.value && !pagination.value.nextCursor)

  function moveNext() {
    if (!pagination.value || cursorIsLast.value)
      return

    cursor.value = pagination.value?.nextCursor
  }

  function movePrev() {
    if (!pagination.value || cursorIsFirst.value)
      return

    cursor.value = pagination.value?.prevCursor
  }

  return {
    cursorIsFirst,
    cursorIsLast,
    moveNext,
    movePrev,
  }
}
