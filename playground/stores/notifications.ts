import { defineStore } from 'pinia'
import { useNotifications } from '#imports'

export const useNotificationStore = defineStore('notifications', () => {
  const { notifications, lastIndex, addNotification, closeNotification } = useNotifications()

  return {
    notifications,
    lastIndex,
    addNotification,
    closeNotification,
  }
})
