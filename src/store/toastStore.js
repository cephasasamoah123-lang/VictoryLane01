import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, type = 'success') => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    return id
  },
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),
}))

export default useToastStore
