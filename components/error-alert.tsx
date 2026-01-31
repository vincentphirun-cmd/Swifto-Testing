'use client'

type Props = {
  message: string
  onRetry?: () => void
  className?: string
  variant?: 'default' | 'dark'
}

export function ErrorAlert({ message, onRetry, className = '', variant = 'default' }: Props) {
  if (variant === 'dark') {
    return (
      <div
        className={`rounded-xl border border-red-400/50 bg-red-900/20 p-6 ${className}`}
        role="alert"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-red-100 font-medium">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 h-10 px-5 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors border border-white/30"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50 p-6 ${className}`}
      role="alert"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-red-800 font-medium">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 h-10 px-5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
