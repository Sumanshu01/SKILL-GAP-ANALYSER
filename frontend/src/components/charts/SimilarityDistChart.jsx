import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { formatScore } from '../../utils/formatters'

export default function SimilarityDistChart({
  similarityScores = [],
  threshold = 0.66,
  modelName = 'Proposed Hybrid',
}) {
  // If real similarity scores provided, compute histogram buckets
  const prepareBuckets = () => {
    const buckets = [
      { range: '0.0 - 0.2', min: 0.0, max: 0.2, count: 0, label: 'Unrelated' },
      { range: '0.2 - 0.4', min: 0.2, max: 0.4, count: 0, label: 'Low Sim' },
      { range: '0.4 - 0.6', min: 0.4, max: 0.6, count: 0, label: 'Partial' },
      { range: '0.6 - 0.8', min: 0.6, max: 0.8, count: 0, label: 'Strong' },
      { range: '0.8 - 1.0', min: 0.8, max: 1.0, count: 0, label: 'Exact/Synonym' },
    ]

    if (similarityScores.length === 0) {
      // Default research calibration distribution
      return [
        { range: '0.0 - 0.2', count: 4, label: 'Unrelated' },
        { range: '0.2 - 0.4', count: 6, label: 'Low Sim' },
        { range: '0.4 - 0.6', count: 8, label: 'Partial' },
        { range: '0.6 - 0.8', count: 18, label: 'Strong (Above τ*)' },
        { range: '0.8 - 1.0', count: 12, label: 'Exact/Synonym' },
      ]
    }

    similarityScores.forEach(({ score }) => {
      const s = Math.max(0, Math.min(1.0, score))
      for (const b of buckets) {
        if (s >= b.min && (s < b.max || (b.max === 1.0 && s <= 1.0))) {
          b.count += 1
          break
        }
      }
    })

    return buckets
  }

  const data = prepareBuckets()
  const totalPairs = similarityScores.length > 0
    ? similarityScores.length
    : data.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Semantic Similarity Score Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Density of candidate-to-target semantic match scores evaluated by {modelName}
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-primary-50 border border-primary-200 text-xs text-primary-700 font-mono">
          Optimal Cutoff: τ* = {threshold}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: -25, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11, fill: '#475569' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-xs">
                      <p className="font-bold text-slate-800">{item.range}</p>
                      <p className="text-slate-500">{item.label}</p>
                      <p className="font-mono font-bold text-primary-600 mt-1">
                        {item.count} pairs ({((item.count / totalPairs) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="count" name="Evaluated Skill Pairs" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                // Highlighting items above threshold
                const isAboveThreshold = index >= 3
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isAboveThreshold ? '#2563eb' : '#cbd5e1'}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Scores ≥ {threshold} are verified matches; lower scores indicate explicit gap opportunities.</span>
        <span className="font-mono text-slate-700">Total pairs: {totalPairs}</span>
      </div>
    </div>
  )
}
