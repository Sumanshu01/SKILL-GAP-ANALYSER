import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Network,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart2,
  GitBranch,
  BookOpen,
} from 'lucide-react'

export default function LandingPage() {
  const models = [
    {
      name: 'Proposed Hybrid',
      tag: 'Best Overall',
      f1: '95.24%',
      acc: '95.00%',
      tau: '0.66',
      desc: 'CASD + Weighted Ensemble (45% MPNet, 25% RoBERTa, 15% Lexical, 15% ESCO Category Affinity). Attenuates false positives on ambiguous acronyms.',
      highlight: true,
    },
    {
      name: 'MPNet Base',
      tag: 'Dense 768d',
      f1: '91.06%',
      acc: '90.00%',
      tau: '0.68',
      desc: 'Masked and permuted language modeling yields rich contextual vectors, but lacks domain taxonomy grounding.',
      highlight: false,
    },
    {
      name: 'Sentence-BERT',
      tag: 'Fast Inference',
      f1: '87.80%',
      acc: '87.50%',
      tau: '0.65',
      desc: 'Siamese MiniLM-L6-v2 network with cosine distance. Fast 12.4ms latency but prone to synonym polysemy.',
      highlight: false,
    },
    {
      name: 'RoBERTa',
      tag: 'Robust Pretrained',
      f1: '85.37%',
      acc: '85.00%',
      tau: '0.64',
      desc: 'Dynamically masked BERT architecture with mean pooling across contextual token states.',
      highlight: false,
    },
  ]

  const comparisons = [
    {
      feature: 'Keyword ATS Matching',
      traditional: 'Regex & Exact String Match',
      ourApp: 'Deep Semantic Embeddings + ESCO v1.1 Taxonomy',
      advantage: 'Matches "K8s" to "Kubernetes", "PyTorch" to "Deep Learning"',
    },
    {
      feature: 'Skill Ambiguity (Polysemy)',
      traditional: 'Zero context awareness ("Java" = coffee or code?)',
      ourApp: 'Context-Aware Skill Disambiguation (CASD)',
      advantage: '120-token window captures domain context & discounts false positives',
    },
    {
      feature: 'Unstated / Implicit Skills',
      traditional: 'Completely missed if not verbatim in text',
      ourApp: 'Prerequisite Directed Acyclic Graph (DAG)',
      advantage: 'Infers "Docker" implies "Linux", "MLOps" implies "Git & CI/CD"',
    },
    {
      feature: 'Calibration & Optimal Cutoff',
      traditional: 'Arbitrary score or 50% fixed threshold',
      ourApp: 'Grid-search calibrated threshold (τ* = 0.66)',
      advantage: 'Scientifically validated against gold-standard evaluation set',
    },
  ]

  return (
    <div className="space-y-16 animate-fade-in">
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="text-center py-10 md:py-16 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>Research Implementation • Google DeepMind & European ESCO v1.1</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          AI Resume Skill Gap Analyzer with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Context-Aware Disambiguation
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bridge the gap between candidate resumes and IT job descriptions. Powered by a
          calibrated hybrid ensemble of 6 pretrained NLP transformer models and the ESCO
          skill ontology to uncover both <strong>explicit</strong> and <strong>implicit prerequisite gaps</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            to="/analyze"
            className="btn-primary w-full sm:w-auto px-7 py-3 text-sm shadow-md hover:shadow-lg transition-all"
          >
            Start Skill Gap Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/benchmark"
            className="btn-secondary w-full sm:w-auto px-7 py-3 text-sm"
          >
            View Model Benchmarks
          </Link>
        </div>

        {/* Quick Trust badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>69 Canonical Skills + 25 Prerequisite Concepts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>95.24% F1-Score on Gold Standard Set</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Downloadable CSV & PDF Reports</span>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY MATHEMATICS & ARCHITECTURE ────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-label">Research Methodology</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            How The Proposed Hybrid Architecture Works
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered to overcome ATS blindness through 3 core algorithmic pillars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="card p-6 border-slate-200 hover:border-primary-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. Context-Aware Disambiguation (CASD)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extracts mentions with an adaptive 120-token context window. Analyzes section
              semantic weights (e.g., Work Experience vs. Interests) and adjusts confidence
              weights to prevent misleading abbreviation matches.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
              Confidence = Base × (1 + 0.15 · ContextOverlap)
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="card p-6 border-slate-200 hover:border-primary-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. 4-Component Weighted Semantic Ensemble
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combines deep 768d MPNet embeddings, RoBERTa contextual representations,
              token-level lexical Jaccard similarity, and ESCO category hierarchy affinity.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
              S = 0.45·MPNet + 0.25·RoBERTa + 0.15·Lex + 0.15·ESCO
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="card p-6 border-slate-200 hover:border-primary-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. Implicit Prerequisite Graph (DAG)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a job mentions advanced frameworks (e.g., Kubernetes, PyTorch, React),
              the ESCO prerequisite graph traverses upstream dependencies to identify
              implicit foundational skill requirements candidate must prove.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
              Prerequisites = BFS(G, Skill, max_depth=2)
            </div>
          </div>
        </div>
      </section>

      {/* ── ATS VS PROPOSED SYSTEM COMPARISON TABLE ───────────────────────────── */}
      <section className="card p-6 md:p-8">
        <div className="mb-6">
          <span className="section-label">Comparative Analysis</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Traditional Keyword ATS vs. Proposed Semantic Hybrid
          </h2>
          <p className="text-xs text-slate-500">
            Why traditional applicant tracking systems reject qualified candidates and how semantic reasoning fixes it
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="py-3 px-4 font-semibold text-slate-700">Evaluation Dimension</th>
                <th className="py-3 px-4 font-semibold text-rose-700">Traditional Keyword ATS</th>
                <th className="py-3 px-4 font-semibold text-primary-700">Proposed Hybrid Engine</th>
                <th className="py-3 px-4 font-semibold text-slate-700">Real-World Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{c.feature}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-rose-600">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{c.traditional}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    <div className="flex items-center gap-1.5 text-primary-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-primary-600" />
                      <span>{c.ourApp}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── MODEL CARDS OVERVIEW ──────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="section-label">Benchmarked Architectures</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Pretrained Models & Optimal Thresholds (τ*)
            </h2>
          </div>
          <Link
            to="/benchmark"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            Explore Full Benchmarks & Radar Chart
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((m) => (
            <div
              key={m.name}
              className={`card p-5 transition-all ${
                m.highlight
                  ? 'border-primary-400 bg-primary-50/20 shadow-md ring-1 ring-primary-500/20'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.highlight ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m.tag}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 py-2 my-2 border-y border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">F1-Score</span>
                  <p className="text-xs font-bold text-slate-800">{m.f1}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</span>
                  <p className="text-xs font-bold text-slate-800">{m.acc}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Threshold</span>
                  <p className="text-xs font-bold font-mono text-primary-700">τ*={m.tau}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────────────── */}
      <section className="card p-8 md:p-12 text-center bg-gradient-to-b from-primary-50/50 to-white border-primary-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Ready to evaluate candidate resumes with research-grade rigor?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 mb-6">
          Upload a resume PDF, match against any tech job description, and receive an instant
          gap breakdown with multi-phase upskilling roadmap.
        </p>
        <Link
          to="/analyze"
          className="btn-primary px-8 py-3 text-sm shadow-md hover:shadow-lg inline-flex"
        >
          Launch Analysis Console
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </section>
    </div>
  )
}
