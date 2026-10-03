import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ExplicitImplicitChart({
  explicitGaps = [],
  implicitGaps = [],
  matchedSkills = [],
}) {
  // Aggregate gaps by category if real data is provided
  const prepareData = () => {
    if (explicitGaps.length === 0 && implicitGaps.length === 0) {
      // Benchmark representative distribution
      return [
        { category: 'Machine Learning', Explicit: 3, Implicit: 2, Matched: 4 },
        { category: 'Cloud & DevOps', Explicit: 4, Implicit: 3, Matched: 2 },
        { category: 'Data Engineering', Explicit: 2, Implicit: 2, Matched: 3 },
        { category: 'Software Eng', Explicit: 1, Implicit: 2, Matched: 5 },
        { category: 'Databases', Explicit: 2, Implicit: 1, Matched: 3 },
      ]
    }

    const catMap = {}

    const addCount = (cat, type) => {
      const category = cat || 'General / Other'
      if (!catMap[category]) {
        catMap[category] = { category, Explicit: 0, Implicit: 0, Matched: 0 }
      }
      catMap[category][type] += 1
    }

    explicitGaps.forEach((g) => addCount(g.category, 'Explicit'))
    implicitGaps.forEach((g) => addCount(g.category, 'Implicit'))
    // matched skills count (categorized as matched)
    if (matchedSkills.length > 0) {
      matchedSkills.forEach((s) => addCount('Matched Total', 'Matched'))
    }

    const result = Object.values(catMap)
    return result.length > 0 ? result : [
      { category: 'Analyzed Skills', Explicit: explicitGaps.length, Implicit: implicitGaps.length, Matched: matchedSkills.length }
    ]
  }

  const data = prepareData()

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Explicit vs. Implicit Skill Gap Distribution
        </h3>
        <p className="text-xs text-slate-500">
          Implicit gaps uncover prerequisite dependencies missed by keyword ATS matchers
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: '#475569' }}
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
              contentStyle={{
                backgroundColor: '#fff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar dataKey="Explicit" name="Explicit Gaps (Missing from JD)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Implicit" name="Implicit Gaps (Prerequisites)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            {data.some((d) => d.Matched > 0) && (
              <Bar dataKey="Matched" name="Matched Skills" fill="#10b981" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Implicit gaps inferred via ESCO skill prerequisite graph
        </span>
        <span className="font-semibold text-slate-700">
          Total Gaps: {explicitGaps.length + implicitGaps.length}
        </span>
      </div>
    </div>
  )
}
