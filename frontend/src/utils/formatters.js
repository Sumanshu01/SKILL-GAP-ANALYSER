/**
 * Utility formatters for metric numbers, labels, and display styles.
 */

export function formatPct(val, digits = 1) {
  if (val === null || val === undefined || isNaN(val)) return '0.0%'
  // If val is decimal (<= 1.0), multiply by 100, else already percentage
  const num = val <= 1.0 && val > 0 ? val * 100 : val
  return `${Number(num).toFixed(digits)}%`
}

export function formatScore(val, digits = 3) {
  if (val === null || val === undefined || isNaN(val)) return '0.000'
  return Number(val).toFixed(digits)
}

export function formatMs(val) {
  if (val === null || val === undefined || isNaN(val)) return '0 ms'
  return `${Number(val).toFixed(1)} ms`
}

export function truncateText(text, maxLen = 120) {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen).trim() + '...'
}

export function getPriorityColor(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'badge-red',
        dot: 'bg-red-500',
      }
    case 'high':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'badge-yellow',
        dot: 'bg-amber-500',
      }
    case 'medium':
    default:
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'badge-blue',
        dot: 'bg-blue-500',
      }
  }
}

export const MODEL_COLORS = {
  'Proposed Hybrid': '#2563eb', // Blue-600 (Hero model)
  'Sentence-BERT': '#0d9488',   // Teal-600
  'BERT': '#64748b',            // Slate-500
  'RoBERTa': '#8b5cf6',         // Violet-500
  'DistilBERT': '#f59e0b',      // Amber-500
  'MPNet': '#06b6d4',           // Cyan-500
}

export function getModelColor(name) {
  return MODEL_COLORS[name] || '#64748b'
}
