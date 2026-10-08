import clsx from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className,
  fullWidth = true,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-colors',
          error ? 'border-berry-500' : 'border-gray-300',
          disabled && 'bg-gray-100 cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-berry-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
