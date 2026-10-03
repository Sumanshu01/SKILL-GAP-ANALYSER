import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { formatPct } from '../../utils/formatters'

const RADAR_DATA = [
  { metric: 'Accuracy', Hybrid: 0.950, MPNet: 0.900, SBERT: 0.875 },
  { metric: 'Precision', Hybrid: 0.952, MPNet: 0.889, SBERT: 0.857 },
  { metric: 'Recall', Hybrid: 0.952, MPNet: 0.933, SBERT: 0.900 },
  { metric: 'F1-Score', Hybrid: 0.952, MPNet: 0.911, SBERT: 0.878 },
  { metric: 'Explicit Gap F1', Hybrid: 0.933, MPNet: 0.867, SBERT: 0.833 },
  { metric: 'Implicit Discovery', Hybrid: 0.900, MPNet: 0.800, SBERT: 0.750 },
]

export default function RadarPerformanceChart({ customData = null }) {
  const data = customData || RADAR_DATA

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs">
          <p className="font-bold text-slate-800 mb-1">{payload[0]?.payload?.metric}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-mono font-bold text-slate-800">
                {formatPct(item.value)}
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
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Multi-Dimensional Performance Radar
        </h3>
        <p className="text-xs text-slate-500">
          Proposed Hybrid vs. Top Transformers across 6 skill discovery dimensions
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#475569', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0.5, 1.0]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Radar
              name="Proposed Hybrid"
              dataKey="Hybrid"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name="MPNet (Dense 768d)"
              dataKey="MPNet"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
            <Radar
              name="Sentence-BERT"
              dataKey="SBERT"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.1}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[11px] text-slate-500 text-center">
        The Proposed Hybrid envelopes baseline models uniformly, achieving +10% improvement in implicit discovery.
      </div>
    </div>
  )
}
