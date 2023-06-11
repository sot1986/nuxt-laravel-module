<script setup lang="ts">
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import type { Notification } from 'sot-helpers'
import { useNotificationStore } from '~/stores/notifications'
import { computed } from '#imports'

defineOptions({
  name: 'NotificationsContainer',
  inheritAttrs: false,
})

const { notifications, closeNotification } = useNotificationStore()

const notificationCssClass = computed(() => (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'success-notification'
    case 'warning':
      return 'warning-notification'
    case 'error':
      return 'error-notification'
    case 'notification':
      return ''
    default:
      throwIfNotificationTypeIsNotEvaluated(type)
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function throwIfNotificationTypeIsNotEvaluated(_type: never) {
  throw createError('Notification type not evaluated')
}
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition-group
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
        >
          <div :class="`p-4 ${notificationCssClass(notification.type)}`">
            <div class="flex items-start">
              <div class="shrink-0">
                <component
                  :is="notification.type === 'success'
                    ? CheckCircleIcon
                    : notification.type === 'warning'
                      ? ExclamationCircleIcon
                      : notification.type === 'error'
                        ? ExclamationTriangleIcon
                        : InformationCircleIcon
                  "
                  class="h-6 w-6 stroke-2 text-skin-base-notification"
                  aria-hidden="true"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p
                  v-if="notification.title"
                  class="text-sm font-medium text-skin-base-notification"
                >
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex shrink-0">
                <button
                  type="button"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="closeNotification(notification.id)"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
