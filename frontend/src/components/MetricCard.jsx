import React from 'react'

export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'blue', // 'blue' | 'green' | 'red' | 'amber' | 'slate'
  className = '',
}) {
  const variantMap = {
    blue: {
      bg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      border: 'border-slate-200',
      badgeBg: 'bg-primary-100 text-primary-700',
    },
    green: {
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      border: 'border-slate-200',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
    red: {
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      border: 'border-slate-200',
      badgeBg: 'bg-rose-100 text-rose-700',
    },
    amber: {
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      border: 'border-slate-200',
      badgeBg: 'bg-amber-100 text-amber-700',
    },
    slate: {
      bg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      border: 'border-slate-200',
      badgeBg: 'bg-slate-200 text-slate-700',
    },
  }

  const v = variantMap[variant] || variantMap.blue

  return (
    <div
      className={`card p-5 border ${v.border} hover:border-slate-300 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
            {value}
          </div>
          {subtext && (
            <p className="text-xs text-slate-500 mt-1 leading-snug">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${v.bg} shrink-0 ml-3`}>
            <Icon className={`w-5 h-5 ${v.iconColor}`} />
          </div>
        )}
      </div>
    </div>
  )
}
