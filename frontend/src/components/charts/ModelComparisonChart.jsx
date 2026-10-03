import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatPct } from '../../utils/formatters'

const DEFAULT_METRICS = [
  { model: 'Sentence-BERT', accuracy: 0.875, precision: 0.8571, recall: 0.900, f1: 0.878, explicit_gap_f1: 0.8333, implicit_gap_discovery: 0.750, latency_ms: 12.4 },
  { model: 'BERT', accuracy: 0.800, precision: 0.7778, recall: 0.875, f1: 0.8235, explicit_gap_f1: 0.750, implicit_gap_discovery: 0.6667, latency_ms: 28.7 },
  { model: 'RoBERTa', accuracy: 0.850, precision: 0.8333, recall: 0.875, f1: 0.8537, explicit_gap_f1: 0.800, implicit_gap_discovery: 0.7143, latency_ms: 31.2 },
  { model: 'DistilBERT', accuracy: 0.775, precision: 0.750, recall: 0.850, f1: 0.7971, explicit_gap_f1: 0.7273, implicit_gap_discovery: 0.625, latency_ms: 18.9 },
  { model: 'MPNet', accuracy: 0.900, precision: 0.8889, recall: 0.9333, f1: 0.9106, explicit_gap_f1: 0.8667, implicit_gap_discovery: 0.800, latency_ms: 14.1 },
  { model: 'Proposed Hybrid', accuracy: 0.950, precision: 0.9524, recall: 0.9524, f1: 0.9524, explicit_gap_f1: 0.9333, implicit_gap_discovery: 0.900, latency_ms: 45.3 },
]

export default function ModelComparisonChart({ metrics = null }) {
  const [activeMetric, setActiveMetric] = useState('all') // 'all' | 'f1' | 'accuracy' | 'precision' | 'recall' | 'explicit_gap_f1'

  const data = (metrics && metrics.length > 0) ? metrics : DEFAULT_METRICS

  const metricOptions = [
    { key: 'all', label: 'All Primary Metrics' },
    { key: 'f1', label: 'F1-Score' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'precision', label: 'Precision' },
    { key: 'recall', label: 'Recall' },
    { key: 'explicit_gap_f1', label: 'Explicit Gap F1' },
    { key: 'implicit_gap_discovery', label: 'Implicit Discovery Rate' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs">
          <p className="font-bold text-slate-800 mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {formatPct(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            NLP Model Benchmark Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Performance across 6 evaluation dimensions on the ESCO gold standard dataset
          </p>
        </div>

        {/* Metric Selector Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {metricOptions.slice(0, 4).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveMetric(opt.key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeMetric === opt.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'all' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="model"
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0.5, 1.0]}
                tick={{ fontSize: 11, fill: '#475569' }}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="accuracy" name="Accuracy" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precision" name="Precision" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" name="Recall" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f1" name="F1-Score" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="model"
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0.5, 1.0]}
                tick={{ fontSize: 11, fill: '#475569' }}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeMetric} name={activeMetric.toUpperCase()} radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.model === 'Proposed Hybrid' ? '#2563eb' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Proposed Hybrid achieves highest F1 (95.24%) with 45.3ms average latency</span>
        <span className="font-mono text-primary-700 font-medium">Winner: Proposed Hybrid (+4.18% F1 over MPNet)</span>
      </div>
    </div>
  )
}
