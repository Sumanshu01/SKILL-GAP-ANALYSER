import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cpu, FileSearch, BarChart3, Award, Sparkles, Activity } from 'lucide-react'
import { useApiStatus } from '../hooks/useApiStatus'

export default function Navbar() {
  const location = useLocation()
  const { status, modelsLoaded, device } = useApiStatus()

  const navLinks = [
    { to: '/', label: 'Research Overview', icon: Sparkles },
    { to: '/analyze', label: 'Analyze Resume', icon: FileSearch },
    { to: '/dashboard', label: 'Results Dashboard', icon: BarChart3 },
    { to: '/benchmark', label: 'Model Benchmarks', icon: Award },
  ]

  const getStatusBadge = () => {
    if (modelsLoaded && status === 'ok') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>API Ready</span>
          <span className="text-[10px] text-emerald-600/80 font-mono uppercase">
            ({device})
          </span>
        </div>
      )
    }

    if (status === 'initializing') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Loading Models...</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
        <span>Backend Offline</span>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-sm group-hover:shadow transition-all">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                AI Skill Gap Analyzer
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                ESCO v1.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Context-Aware Disambiguation & Semantic Hybrid Matching
            </p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right status badge */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}
        </div>
      </div>
    </header>
  )
}
