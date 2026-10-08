import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const toastStyles = {
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  error: { icon: AlertCircle, className: 'border-red-200 bg-red-50 text-red-900' },
  info: { icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-900' },
}

function Toast({ toast }) {
  const dismissToast = useToastStore((state) => state.dismissToast)
  const { icon: Icon, className } = toastStyles[toast.type] || toastStyles.info

  useEffect(() => {
    const timeout = setTimeout(() => dismissToast(toast.id), 5000)
    return () => clearTimeout(timeout)
  }, [dismissToast, toast.id])

  return (
    <div role="status" className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${className}`}>
      <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button type="button" onClick={() => dismissToast(toast.id)} className="rounded p-0.5 hover:bg-black/10" aria-label="Dismiss notification">
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite">
      {toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
    </div>
  )
}
