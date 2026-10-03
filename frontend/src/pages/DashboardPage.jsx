import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Download,
  Sparkles,
  ArrowRight,
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Layers,
  Search,
  Filter,
} from 'lucide-react'
import { useAnalysis } from '../hooks/useAnalysis'
import ModelComparisonChart from '../components/charts/ModelComparisonChart'
import RadarPerformanceChart from '../components/charts/RadarPerformanceChart'
import ExplicitImplicitChart from '../components/charts/ExplicitImplicitChart'
import SimilarityDistChart from '../components/charts/SimilarityDistChart'
import ConfusionMatrixGrid from '../components/charts/ConfusionMatrixGrid'
import MetricCard from '../components/MetricCard'
import ProgressRing from '../components/ProgressRing'
import SkillPill from '../components/SkillPill'
import { formatPct, formatScore } from '../utils/formatters'
import { downloadCSV, downloadPDF } from '../api/client'

export default function DashboardPage() {
  const { result, hasResult } = useAnalysis()
  const [skillSearch, setSkillSearch] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'matched' | 'explicit' | 'implicit'

  // Model metrics: use result metrics if available, otherwise default
  const modelMetrics = result?.all_model_metrics || null

  // All skills list for the table if analysis is present
  const getAllSkills = () => {
    if (!result) return []
    const list = []

    result.matched_skills?.forEach((s) => {
      list.push({ name: s, type: 'matched', category: 'Verified Match', priority: 'low' })
    })

    result.explicit_gaps?.forEach((g) => {
      list.push({
        name: g.skill,
        type: 'explicit',
        category: g.category || 'Explicit Gap',
        priority: g.priority || 'high',
        desc: g.description,
      })
    })

    result.implicit_gaps?.forEach((g) => {
      list.push({
        name: g.skill,
        type: 'implicit',
        category: g.category || 'Implicit Prerequisite',
        priority: g.priority || 'medium',
        desc: g.description,
        triggers: g.triggered_by,
      })
    })

    return list
  }

  const allSkills = getAllSkills()
  const filteredSkills = allSkills.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(skillSearch.toLowerCase()))
    if (!matchesQuery) return false
    if (filterType === 'matched') return s.type === 'matched'
    if (filterType === 'explicit') return s.type === 'explicit'
    if (filterType === 'implicit') return s.type === 'implicit'
    return true
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Research & Performance Analytics</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Skill Analytics & Model Benchmark Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {hasResult
              ? `Displaying customized skill evaluation report for: ${result.report_id.substring(0, 8)}`
              : 'Displaying published baseline performance metrics across 6 transformer models'}
          </p>
        </div>

        {hasResult ? (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => downloadCSV(result.report_id)}
              className="btn-secondary text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download CSV
            </button>
            <button
              onClick={() => downloadPDF(result.report_id)}
              className="btn-secondary text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-primary-600" />
              Download PDF
            </button>
            <Link to="/analyze" className="btn-primary text-xs">
              <FileSearch className="w-3.5 h-3.5 mr-1" />
              New Analysis
            </Link>
          </div>
        ) : (
          <Link to="/analyze" className="btn-primary text-xs">
            <FileSearch className="w-3.5 h-3.5 mr-1" />
            Analyze Your Resume
          </Link>
        )}
      </div>

      {/* ── NOTICE BANNER IF VIEWING BENCHMARK MODE ──────────────────────────── */}
      {!hasResult && (
        <div className="card p-4 bg-primary-50/50 border-primary-200 text-xs text-primary-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-primary-600 shrink-0" />
            <span>
              You are currently viewing <strong>Gold-Standard Baseline Benchmarks</strong>. Run an analysis on your resume to populate personalized candidate gap distributions.
            </span>
          </div>
          <Link
            to="/analyze"
            className="text-xs font-bold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1 shrink-0"
          >
            Launch Analysis
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── KPI METRICS CARDS ────────────────────────────────────────────────── */}
      {hasResult && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-3 card p-5 flex items-center justify-center">
            <ProgressRing
              percentage={result.skill_coverage_pct}
              size={140}
              label="Skill Coverage"
            />
          </div>

          <div className="md:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Overall Match"
              value={formatScore(result.overall_similarity_score)}
              subtext={`Evaluated via ${result.model_used}`}
              icon={Cpu}
              variant="blue"
            />
            <MetricCard
              title="Matched Skills"
              value={result.matched_skills?.length || 0}
              subtext="Requirements fulfilled"
              icon={CheckCircle2}
              variant="green"
            />
            <MetricCard
              title="Explicit Gaps"
              value={result.explicit_gaps?.length || 0}
              subtext="Missing stated skills"
              icon={XCircle}
              variant="red"
            />
            <MetricCard
              title="Implicit Gaps"
              value={result.implicit_gaps?.length || 0}
              subtext="Prerequisites needed"
              icon={AlertTriangle}
              variant="amber"
            />
          </div>
        </div>
      )}

      {/* ── ROW 1: MODEL COMPARISON & RADAR PERFORMANCE ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ModelComparisonChart metrics={modelMetrics} />
        </div>
        <div className="lg:col-span-5">
          <RadarPerformanceChart />
        </div>
      </div>

      {/* ── ROW 2: EXPLICIT VS IMPLICIT GAPS & SIMILARITY DISTRIBUTION ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ExplicitImplicitChart
            explicitGaps={result?.explicit_gaps || []}
            implicitGaps={result?.implicit_gaps || []}
            matchedSkills={result?.matched_skills || []}
          />
        </div>
        <div className="lg:col-span-6">
          <SimilarityDistChart
            similarityScores={result?.similarity_scores || []}
            threshold={0.66}
            modelName={result?.model_used || 'Proposed Hybrid'}
          />
        </div>
      </div>

      {/* ── ROW 3: CONFUSION MATRIX EVALUATION GRID ──────────────────────────── */}
      <div>
        <ConfusionMatrixGrid defaultModel={result?.model_used || 'Proposed Hybrid'} />
      </div>

      {/* ── ROW 4: DETAILED SKILL INVENTORY TABLE (IF ANALYSIS ACTIVE) ────────── */}
      {hasResult && allSkills.length > 0 && (
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="section-label">Inventory</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Evaluated Skill Breakdown & Taxonomy Mapping
              </h3>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="input pl-8 py-1.5 text-xs"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold shrink-0">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterType === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'
                  }`}
                >
                  All ({allSkills.length})
                </button>
                <button
                  onClick={() => setFilterType('matched')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterType === 'matched' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  Matched
                </button>
                <button
                  onClick={() => setFilterType('explicit')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterType === 'explicit' ? 'bg-white shadow-sm text-rose-700' : 'text-slate-500'
                  }`}
                >
                  Explicit
                </button>
                <button
                  onClick={() => setFilterType('implicit')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterType === 'implicit' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'
                  }`}
                >
                  Implicit
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                  <th className="py-2.5 px-4 font-semibold">Canonical Skill Name</th>
                  <th className="py-2.5 px-4 font-semibold">Classification Type</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Priority</th>
                  <th className="py-2.5 px-4 font-semibold">Context / Prerequisite Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {s.name}
                    </td>
                    <td className="py-3 px-4">
                      {s.type === 'matched' && <span className="badge-green">Matched</span>}
                      {s.type === 'explicit' && <span className="badge-red">Explicit Gap</span>}
                      {s.type === 'implicit' && <span className="badge-yellow">Implicit Prerequisite</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.category}</td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-semibold text-slate-500">
                        {s.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {s.desc || (s.triggers ? `Prerequisite for: ${s.triggers.join(', ')}` : 'Directly possessed')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
