import clsx from 'clsx'

const Card = ({ children, className, hover = false, padding = true, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-100',
        padding && 'p-4 sm:p-6',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
