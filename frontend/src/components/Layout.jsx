import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'
import { BookOpen, Github, Layers, ShieldCheck } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                AI Resume Skill Gap Analyzer
              </span>
              <span>•</span>
              <span>Research Implementation based on ESCO European Skill Taxonomy</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-primary-600 transition-colors">
                Methodology
              </Link>
              <Link to="/benchmark" className="hover:text-primary-600 transition-colors">
                Model Benchmarks
              </Link>
              <Link to="/analyze" className="hover:text-primary-600 transition-colors">
                Analyze
              </Link>
              <a
                href="/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-600 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                API Docs
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>
              Proposed Hybrid Matcher: Context-Aware Skill Disambiguation (CASD) + 4-Way Semantic Ensemble.
            </p>
            <p>
              All benchmark metrics cross-validated against 6 pretrained transformer architectures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
