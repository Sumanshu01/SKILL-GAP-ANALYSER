import React from 'react'
import { Sparkles, Cpu, Layers } from 'lucide-react'

const MODEL_INFO = {
  'Proposed Hybrid': {
    badge: 'Proposed Research Model',
    desc: 'Context-Aware Skill Disambiguation (CASD) + 4-Component Weighted Ensemble (MPNet, RoBERTa, Lexical, ESCO)',
    tau: '0.66',
    recommended: true,
  },
  'MPNet': {
    badge: 'High Accuracy Baseline',
    desc: 'sentence-transformers/all-mpnet-base-v2 (768d dense semantic embeddings)',
    tau: '0.68',
    recommended: false,
  },
  'Sentence-BERT': {
    badge: 'Fast Semantic Baseline',
    desc: 'sentence-transformers/all-MiniLM-L6-v2 (384d, low latency)',
    tau: '0.65',
    recommended: false,
  },
  'RoBERTa': {
    badge: 'Robust Pretrained',
    desc: 'roberta-base with mean-pooling over contextual representations',
    tau: '0.64',
    recommended: false,
  },
  'BERT': {
    badge: 'Standard Pretrained',
    desc: 'bert-base-uncased with attention-weighted contextual token pooling',
    tau: '0.62',
    recommended: false,
  },
  'DistilBERT': {
    badge: 'Lightweight Baseline',
    desc: 'distilbert-base-uncased (compact 6-layer architecture)',
    tau: '0.60',
    recommended: false,
  },
}

export default function ModelSelector({
  selectedModel,
  onChange,
  disabled = false,
}) {
  const models = Object.keys(MODEL_INFO)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          NLP Semantic Architecture
        </label>
        <span className="text-xs text-slate-400">
          Optimal Threshold: <span className="font-mono font-medium text-slate-700">τ* = {MODEL_INFO[selectedModel]?.tau || '0.65'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {models.map((modelName) => {
          const info = MODEL_INFO[modelName]
          const isSelected = selectedModel === modelName

          return (
            <button
              key={modelName}
              type="button"
              disabled={disabled}
              onClick={() => onChange(modelName)}
              className={`p-3 text-left rounded-xl border transition-all text-xs relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-primary-50/70 border-primary-500 ring-2 ring-primary-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    {modelName}
                    {info.recommended && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-600 text-white">
                        <Sparkles className="w-2.5 h-2.5" />
                        PROPOSED
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    τ*={info.tau}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {info.desc}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-600">{info.badge}</span>
                <span className={isSelected ? 'text-primary-600 font-semibold' : ''}>
                  {isSelected ? 'Active Model' : 'Select'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
