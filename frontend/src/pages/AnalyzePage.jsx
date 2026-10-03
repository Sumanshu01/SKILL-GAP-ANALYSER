import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  UploadCloud,
  Cpu,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  BarChart3,
  Calendar,
  RotateCcw,
} from 'lucide-react'
import { useAnalysis } from '../hooks/useAnalysis'
import FileDropzone from '../components/FileDropzone'
import ModelSelector from '../components/ModelSelector'
import SkillPill from '../components/SkillPill'
import MetricCard from '../components/MetricCard'
import ProgressRing from '../components/ProgressRing'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { formatPct, formatScore, getPriorityColor } from '../utils/formatters'
import { downloadCSV, downloadPDF } from '../api/client'
import toast from 'react-hot-toast'

const SAMPLE_RESUME = `Alex Mercer
Senior Software & Backend Engineer | alex.mercer@example.com

SUMMARY
Passionate software engineer with 5+ years of experience building reliable backend systems, APIs, and microservices in Python. Experienced in container deployment with Docker, database schema design with PostgreSQL, and automated CI/CD pipelines.

TECHNICAL SKILLS
Languages: Python, JavaScript, SQL, Bash
Frameworks: FastAPI, Flask, Django, Node.js
Databases: PostgreSQL, Redis, SQLite
DevOps & Cloud: Docker, Git, GitHub Actions, AWS ECS, Linux
Methodologies: Agile, Scrum, RESTful API Design, Unit Testing (pytest)
Machine Learning: Basic scikit-learn, Pandas, NumPy data analysis

EXPERIENCE
Senior Backend Engineer — TechCorp (2021 – Present)
- Architected RESTful microservices handling 10M+ daily requests using Python and FastAPI.
- Containerized legacy services with Docker and managed deployment pipelines using GitHub Actions.
- Optimized slow SQL queries in PostgreSQL, improving response time by 42%.
- Integrated Redis for distributed session caching and rate-limiting.

Software Engineer — CloudData Solutions (2019 – 2021)
- Developed data ingestion scripts in Python and automated ETL workflows.
- Collaborated in cross-functional agile sprints with frontend engineers.`

const SAMPLE_JD = `Senior MLOps & Machine Learning Platform Engineer

ROLE SUMMARY
We are seeking an experienced Senior MLOps Engineer to design, deploy, and scale our next-generation machine learning training and inference infrastructure. You will collaborate closely with Data Science teams to transition deep learning models into resilient production systems.

TECHNICAL REQUIREMENTS
- Extensive programming experience in Python with strong software engineering fundamentals.
- Deep Learning & ML: Hands-on experience with PyTorch or TensorFlow for computer vision / NLP models.
- MLOps & Pipelines: Proven expertise with Kubeflow, MLflow, or Apache Airflow for model tracking.
- Orchestration: Strong knowledge of Kubernetes (K8s) cluster management, Helm charts, and container orchestration.
- Cloud & Infrastructure: AWS or GCP production deployment experience, Terraform infrastructure-as-code.
- Containerization: Advanced Docker and Linux system administration.
- Databases: PostgreSQL and distributed key-value stores.
- Version Control & CI/CD: Git, automated CI/CD pipelines for model retraining.`

export default function AnalyzePage() {
  const navigate = useNavigate()
  const { result, loading, loadingStep, error, analyze, clear, hasResult } = useAnalysis()

  // Form states
  const [resumeMode, setResumeMode] = useState('upload') // 'upload' | 'paste'
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')

  const [jdMode, setJdMode] = useState('paste') // 'paste' | 'upload'
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')

  const [selectedModel, setSelectedModel] = useState('Proposed Hybrid')

  // Sample loaders
  const handleLoadSampleResume = () => {
    setResumeMode('paste')
    setResumeFile(null)
    setResumeText(SAMPLE_RESUME)
    toast.success('Sample Software Engineer resume loaded!')
  }

  const handleLoadSampleJD = () => {
    setJdMode('paste')
    setJdFile(null)
    setJdText(SAMPLE_JD)
    toast.success('Sample Senior MLOps Engineer JD loaded!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const hasResume = (resumeMode === 'upload' && resumeFile) || (resumeMode === 'paste' && resumeText.trim().length >= 30)
    const hasJD = (jdMode === 'upload' && jdFile) || (jdMode === 'paste' && jdText.trim().length >= 20)

    if (!hasResume) {
      toast.error('Please upload a PDF resume or paste resume text (min 30 chars).')
      return
    }
    if (!hasJD) {
      toast.error('Please enter or upload a job description (min 20 chars).')
      return
    }

    try {
      await analyze({
        resumeFile: resumeMode === 'upload' ? resumeFile : null,
        resumeText: resumeMode === 'paste' ? resumeText : null,
        jdFile: jdMode === 'upload' ? jdFile : null,
        jdText: jdMode === 'paste' ? jdText : null,
        modelName: selectedModel,
      })
    } catch {
      // Error handled in hook
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div>
        <span className="section-label">Analysis Console</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Skill Gap Analysis & Roadmap Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Evaluate candidate qualifications against real job requirements with the ESCO taxonomy and
          context-aware disambiguation.
        </p>
      </div>

      {/* ── INPUT FORM ──────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RESUME INPUT CARD */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-800">1. Candidate Resume</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                >
                  Load Sample
                </button>
                <div className="h-3 w-px bg-slate-200"></div>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setResumeMode('upload')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      resumeMode === 'upload' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode('paste')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      resumeMode === 'paste' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>
            </div>

            {resumeMode === 'upload' ? (
              <FileDropzone
                file={resumeFile}
                onFileSelect={(f) => setResumeFile(f)}
                onFileRemove={() => setResumeFile(null)}
                label="Upload Resume (PDF format)"
                hint="Extracts skills, context windows, and sections automatically"
              />
            ) : (
              <div>
                <textarea
                  rows={9}
                  className="textarea font-mono text-xs leading-relaxed"
                  placeholder="Paste complete candidate resume text here (Summary, Skills, Work Experience, Education)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <span className="text-[11px] text-slate-400 mt-1 block text-right">
                  {resumeText.length} characters
                </span>
              </div>
            )}
          </div>

          {/* JOB DESCRIPTION INPUT CARD */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">2. Target Job Description</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleJD}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Load Sample
                </button>
                <div className="h-3 w-px bg-slate-200"></div>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setJdMode('paste')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      jdMode === 'paste' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdMode('upload')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      jdMode === 'upload' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    Upload PDF
                  </button>
                </div>
              </div>
            </div>

            {jdMode === 'paste' ? (
              <div>
                <textarea
                  rows={9}
                  className="textarea font-mono text-xs leading-relaxed"
                  placeholder="Paste IT / Engineering job description requirements, qualifications, and role responsibilities..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <span className="text-[11px] text-slate-400 mt-1 block text-right">
                  {jdText.length} characters
                </span>
              </div>
            ) : (
              <FileDropzone
                file={jdFile}
                onFileSelect={(f) => setJdFile(f)}
                onFileRemove={() => setJdFile(null)}
                label="Upload Job Description (PDF format)"
                hint="Parses explicit requirements and maps prerequisite graph"
              />
            )}
          </div>
        </div>

        {/* ── MODEL SELECTION CARD ────────────────────────────────────────────── */}
        <div className="card p-5">
          <ModelSelector
            selectedModel={selectedModel}
            onChange={(m) => setSelectedModel(m)}
            disabled={loading}
          />
        </div>

        {/* ── ACTION BAR ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>
              Runs ESCO alias normalization, CASD context weighting, and prerequisite expansion.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasResult && (
              <button
                type="button"
                onClick={clear}
                className="btn-secondary text-xs"
                disabled={loading}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto px-7 py-3 text-sm font-bold shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin mr-2" />
                  Running Neural Analysis...
                </>
              ) : (
                <>
                  Run Skill Gap Analysis
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── LOADING STATE ────────────────────────────────────────────────────── */}
      {loading && (
        <div className="card p-8 border-primary-200">
          <LoadingSpinner
            label={loadingStep || 'Evaluating Skill Alignment...'}
            subtext={`Using ${selectedModel} with ESCO prerequisite graph traversal`}
          />
        </div>
      )}

      {/* ── ERROR STATE ──────────────────────────────────────────────────────── */}
      {error && !loading && (
        <ErrorBanner
          message="Analysis Could Not Be Completed"
          detail={error}
          onRetry={handleSubmit}
        />
      )}

      {/* ── ANALYSIS RESULTS DISPLAY ─────────────────────────────────────────── */}
      {hasResult && !loading && (
        <div className="space-y-8 animate-slide-up">
          {/* RESULTS TOP BANNER */}
          <div className="card p-6 border-primary-200 bg-gradient-to-r from-primary-50/40 via-white to-slate-50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-blue">Analysis Complete</span>
                  <span className="text-xs text-slate-500 font-mono">
                    Model: <strong>{result.model_used}</strong>
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Skill Evaluation & Gap Report
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Report ID: <span className="font-mono">{result.report_id}</span>
                </p>
              </div>

              {/* Action Buttons: Download PDF & CSV, Go to Dashboard */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => downloadCSV(result.report_id)}
                  className="btn-secondary text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={() => downloadPDF(result.report_id)}
                  className="btn-secondary text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-primary-600" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary text-xs"
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1" />
                  Full Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* KPI CARDS + PROGRESS RING */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-3 card p-5 flex items-center justify-center">
              <ProgressRing
                percentage={result.skill_coverage_pct}
                size={140}
                label="Target Skill Coverage"
              />
            </div>

            <div className="md:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Overall Similarity"
                value={formatScore(result.overall_similarity_score)}
                subtext="Semantic vector cosine mean"
                icon={Cpu}
                variant="blue"
              />
              <MetricCard
                title="Matched Skills"
                value={result.matched_skills?.length || 0}
                subtext="Aligned with requirements"
                icon={CheckCircle2}
                variant="green"
              />
              <MetricCard
                title="Explicit Gaps"
                value={result.explicit_gaps?.length || 0}
                subtext="Missing stated requirements"
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

          {/* SKILL COMPARISON BREAKDOWN: MATCHED, EXPLICIT, IMPLICIT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Matched Skills ({result.matched_skills?.length || 0})
                  </h3>
                </div>
                <span className="badge-green text-[10px]">Verified Match</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[140px] content-start">
                {result.matched_skills && result.matched_skills.length > 0 ? (
                  result.matched_skills.map((skill, i) => (
                    <SkillPill key={i} name={skill} type="matched" />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills matched directly.</p>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Candidate possesses these competencies matching job description terms.
              </p>
            </div>

            {/* Explicit Gaps */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Explicit Gaps ({result.explicit_gaps?.length || 0})
                  </h3>
                </div>
                <span className="badge-red text-[10px]">Missing Stated</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[140px] content-start">
                {result.explicit_gaps && result.explicit_gaps.length > 0 ? (
                  result.explicit_gaps.map((gap, i) => (
                    <SkillPill
                      key={i}
                      name={gap.skill}
                      type="gap"
                      priority={gap.priority}
                    />
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-medium">
                    No explicit gaps! Candidate fulfills all stated requirements.
                  </p>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Skills explicitly demanded by JD but absent from candidate resume.
              </p>
            </div>

            {/* Implicit Prerequisite Gaps */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Implicit Gaps ({result.implicit_gaps?.length || 0})
                  </h3>
                </div>
                <span className="badge-yellow text-[10px]">Prerequisites</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[140px] content-start">
                {result.implicit_gaps && result.implicit_gaps.length > 0 ? (
                  result.implicit_gaps.map((gap, i) => (
                    <SkillPill
                      key={i}
                      name={gap.skill}
                      type="implicit"
                      priority={gap.priority}
                      triggers={gap.triggered_by}
                    />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No implicit gaps identified.</p>
                )}
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Inferred via ESCO dependency graph based on candidate missing foundations.
              </p>
            </div>
          </div>

          {/* ── PERSONALIZED UPSKILLING ROADMAP ─────────────────────────────────── */}
          {result.upskilling_roadmap && result.upskilling_roadmap.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <span className="section-label">Action Plan</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Personalized Upskilling Roadmap
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phased step-by-step curriculum to close explicit & implicit skill gaps
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Total: {result.upskilling_roadmap.length} Milestones
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {result.upskilling_roadmap.map((step, idx) => {
                  const isExplicit = step.skill_type === 'explicit'
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          P{step.phase}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm">{step.skill}</h4>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                isExplicit
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {isExplicit ? 'Explicit Requirement' : 'Implicit Prerequisite'}
                            </span>
                            {step.triggered_by && step.triggered_by.length > 0 && (
                              <span className="text-[10px] text-slate-500">
                                Required for: {step.triggered_by.join(', ')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 md:text-right">
                        <div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{step.estimated_weeks}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BOTTOM QUICK LINK TO DASHBOARD */}
          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2 shadow"
            >
              <span>Explore Interactive Benchmark Charts & Confusion Matrices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
