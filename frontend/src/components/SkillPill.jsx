import React from 'react'
import { CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react'
import { getPriorityColor } from '../utils/formatters'

export default function SkillPill({
  name,
  type = 'neutral', // 'matched' | 'gap' | 'implicit' | 'neutral'
  score = null,
  priority = null,
  triggers = [],
  onClick = null,
}) {
  const getStyles = () => {
    switch (type) {
      case 'matched':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
        }
      case 'gap':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
        }
      case 'implicit':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
        }
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
          icon: null,
        }
    }
  }

  const { bg, icon } = getStyles()
  const priorityStyle = priority ? getPriorityColor(priority) : null

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${bg} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      title={triggers && triggers.length > 0 ? `Triggered by: ${triggers.join(', ')}` : name}
    >
      {icon}
      <span>{name}</span>

      {score !== null && score !== undefined && (
        <span className="font-mono text-[10px] opacity-75 ml-0.5 px-1 py-0.2 rounded bg-black/5">
          {(score * 100).toFixed(0)}%
        </span>
      )}

      {priority && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border ${priorityStyle?.bg} ${priorityStyle?.text} ${priorityStyle?.border}`}
        >
          {priority}
        </span>
      )}
    </span>
  )
}
