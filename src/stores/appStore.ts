import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark' | 'united'
  notifications: { id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }[]
  isLoading: boolean
  sidebarOpen: boolean

  setTheme: (theme: 'light' | 'dark' | 'united') => void
  addNotification: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  notifications: [],
  isLoading: false,
  sidebarOpen: false,

  setTheme: (theme) => set({ theme }),

  addNotification: (message, type) => {
    const id = `${Date.now()}-${Math.random()}`
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }))
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, 5000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  closeSidebar: () => set({ sidebarOpen: false }),
}))
