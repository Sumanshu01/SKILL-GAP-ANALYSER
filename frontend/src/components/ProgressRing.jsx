import React from 'react'

export default function ProgressRing({
  percentage = 0,
  size = 130,
  strokeWidth = 10,
  label = 'Skill Coverage',
  color = null,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const offset = circumference - (clamped / 100) * circumference

  // Dynamic color based on percentage if not explicitly passed
  const getColor = () => {
    if (color) return color
    if (clamped >= 75) return '#10b981' // emerald-500
    if (clamped >= 50) return '#3b82f6' // blue-500
    if (clamped >= 30) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const strokeColor = getColor()

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            {clamped.toFixed(1)}%
          </span>
          <span className="text-[11px] font-medium text-slate-500 tracking-tight">
            Coverage
          </span>
        </div>
      </div>
      {label && (
        <p className="mt-2 text-xs font-semibold text-slate-600 text-center">
          {label}
        </p>
      )}
    </div>
  )
}
