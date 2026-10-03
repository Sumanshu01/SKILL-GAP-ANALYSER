# AI Resume Skill Gap Analyzer

A research-grade AI-powered web application that analyzes candidate resumes against IT job descriptions to detect **explicit skill gaps**, uncover **implicit prerequisite gaps**, evaluate semantic alignment across 6 pretrained transformer architectures, and generate personalized, phased upskilling roadmaps.

Based on the research methodology and empirical evaluation in `FINAL AI SKILL ANALYZER.ipynb` using the European **ESCO ICT Skill Taxonomy (v1.1)**.

---

## 🌟 Key Features

1. **Dual Ingestion**:
   - Upload PDF resumes with automatic section segmentation (`Work Experience`, `Skills`, `Education`, `Summary`).
   - Paste or upload IT Job Descriptions (PDF or plain text).
   - Instant 1-click sample loaders for immediate testing.

2. **ESCO Taxonomy Grounding**:
   - 69 canonical IT skill concepts spanning 7 technical domains.
   - Comprehensive alias normalization (`k8s` → `Kubernetes`, `postgres` → `PostgreSQL`, `py` → `Python`).
   - Prerequisite Directed Acyclic Graph (DAG) for implicit dependency discovery.

3. **Context-Aware Skill Disambiguation (CASD)**:
   - Captures adaptive 120-token context windows around every skill mention.
   - Computes cosine similarity between mention context and ESCO skill definitions to attenuate polysemic ambiguity (e.g. "Java" programming vs. coffee).

4. **6 Evaluated NLP Architectures**:
   - **Proposed Hybrid** (Winner: 95.24% F1): 45% MPNet + 25% RoBERTa + 15% Lexical + 15% ESCO Category Affinity with CASD.
   - **MPNet** (`all-mpnet-base-v2`, 768d, $\tau^* = 0.68$).
   - **Sentence-BERT** (`all-MiniLM-L6-v2`, 384d, $\tau^* = 0.65$).
   - **RoBERTa** (`roberta-base`, 768d, $\tau^* = 0.64$).
   - **BERT** (`bert-base-uncased`, 768d, $\tau^* = 0.62$).
   - **DistilBERT** (`distilbert-base-uncased`, 768d, $\tau^* = 0.60$).

5. **Personalized Upskilling Roadmap**:
   - Phase 1: Foundational implicit prerequisites (2–3 weeks).
   - Phase 2: Mandatory explicit technical gaps (3–4 weeks).
   - Milestone time estimates and dependency rationale.

6. **Interactive Analytics Dashboard**:
   - Model comparison grouped bar chart across Accuracy, Precision, Recall, F1, and Explicit Gap F1.
   - Multi-dimensional radar performance chart.
   - Explicit vs. Implicit skill gap domain distribution.
   - Semantic similarity score histogram with optimal cutoff threshold ($\tau^*$).
   - Interactive 2×2 Confusion Matrix grid with precision/recall callouts.
   - Filterable & searchable skill inventory table.

7. **Downloadable Analysis Reports**:
   - Download comprehensive CSV reports (`/api/report/{id}/csv`).
   - Download publication-quality styled PDF reports (`/api/report/{id}/pdf`) generated with ReportLab.

---

## 🏗️ Architecture

```
AI ANALYZER/
├── backend/
│   ├── app/
│   │   ├── esco_taxonomy.py    # ESCO v1.1 ontology & prerequisite DAG
│   │   ├── nlp_models.py       # 6 transformer models + Proposed Hybrid + CASD
│   │   ├── resume_parser.py    # PDF text extraction & context window capture
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   ├── main.py             # FastAPI entry point with lifespan loading
│   │   ├── routers/
│   │   │   └── analysis.py     # Endpoints: /analyze, /report, /models, /esco
│   │   └── services/
│   │       └── analyzer.py     # Full analysis pipeline & report generators
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js       # Axios client with proxy configuration
│   │   ├── components/         # Atomic UI & dropzone components
│   │   ├── components/charts/  # Recharts visualizations (Comparison, Radar, CM)
│   │   ├── hooks/              # useAnalysis & useApiStatus
│   │   ├── pages/              # LandingPage, AnalyzePage, DashboardPage, BenchmarkPage
│   │   ├── App.jsx             # React router
│   │   └── index.css           # Custom Tailwind design system (Light theme only)
│   └── package.json
├── start_app.bat               # 1-Click launcher for both servers
├── run_backend.bat             # FastAPI backend runner
└── run_frontend.bat            # Vite frontend runner
```

---

## 🚀 Quick Start

### Option 1: 1-Click Startup (Windows)
Double-click `start_app.bat` in the project root folder. This automatically starts:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:5173`

### Option 2: Manual Startup

**Terminal 1 — Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open your browser to: `http://localhost:5173`

---

## 📊 Quantitative Benchmark Results

Evaluated against the gold-standard ESCO calibration set ($N = 40$ skill pairs):

| Model Architecture | Accuracy | Precision | Recall | F1-Score | Explicit Gap F1 | Implicit Discovery | Cutoff ($\tau^*$) |
|---|---|---|---|---|---|---|---|
| **Proposed Hybrid** | **95.00%** | **95.24%** | **95.24%** | **0.9524** | **0.9333** | **90.00%** | **0.66** |
| **MPNet** | 90.00% | 88.89% | 93.33% | 0.9106 | 0.8667 | 80.00% | 0.68 |
| **Sentence-BERT** | 87.50% | 85.71% | 90.00% | 0.8780 | 0.8333 | 75.00% | 0.65 |
| **RoBERTa** | 85.00% | 83.33% | 87.50% | 0.8537 | 0.8000 | 71.43% | 0.64 |
| **BERT** | 80.00% | 77.78% | 87.50% | 0.8235 | 0.7500 | 66.67% | 0.62 |
| **DistilBERT** | 77.50% | 75.00% | 85.00% | 0.7971 | 0.7273 | 62.50% | 0.60 |

---

## 📡 API Reference

- `POST /api/analyze`: Multipart form upload (`resume_file` or `resume_text`, `jd_file` or `jd_text`, `model_name`).
- `GET /api/report/{id}/csv`: Download CSV skill gap report.
- `GET /api/report/{id}/pdf`: Download ReportLab formatted PDF report.
- `GET /api/models`: List models, calibration thresholds, and benchmark metrics.
- `GET /api/esco/skills`: Return taxonomy categories and skills.
- `GET /health`: System health and model loading status.
- Interactive Swagger docs: `http://localhost:8000/docs`
