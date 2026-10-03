import React from 'react'
import { Loader2, Cpu, Sparkles } from 'lucide-react'

export default function LoadingSpinner({
  size = 'md',
  label = 'Processing...',
  subtext = 'Running deep semantic evaluation & ESCO taxonomy matching',
  fullscreen = false,
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center">
          <Cpu className="w-8 h-8 text-primary-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
          <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
        </div>
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-1">{label}</h4>
      {subtext && (
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{subtext}</p>
      )}

      {/* Subtle animated bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-5 overflow-hidden border border-slate-200">
        <div className="h-full bg-primary-600 rounded-full animate-pulse-soft w-3/4"></div>
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="card p-6 shadow-xl max-w-md w-full mx-4 border-slate-200">
          {content}
        </div>
      </div>
    )
  }

  return content
}
