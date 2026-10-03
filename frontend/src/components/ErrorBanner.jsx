import React from 'react'
import { AlertCircle, RefreshCw, X } from 'lucide-react'

export default function ErrorBanner({
  message,
  detail,
  onRetry,
  onDismiss,
  className = '',
}) {
  if (!message) return null

  return (
    <div
      className={`rounded-xl bg-danger-50 border border-danger-200 p-4 text-sm text-danger-800 flex items-start gap-3 animate-fade-in ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h5 className="font-semibold text-danger-900">{message}</h5>
        {detail && (
          <p className="mt-1 text-xs text-danger-700 leading-relaxed font-mono bg-white/60 p-2 rounded border border-danger-200/50 break-all">
            {detail}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white text-danger-700 rounded-md border border-danger-300 hover:bg-danger-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-danger-500 hover:text-danger-700 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
