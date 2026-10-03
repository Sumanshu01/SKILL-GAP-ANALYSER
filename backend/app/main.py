"""
FastAPI Application Entry Point
AI Resume Skill Gap Analyzer — Backend API
"""

import os
import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.analysis import router as analysis_router
from app.nlp_models import model_registry
from app.esco_taxonomy import esco_engine
from app.schemas import HealthResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")
logger = logging.getLogger(__name__)


# ── Lifespan: load models on startup ──────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting AI Resume Skill Gap Analyzer API...")
    logger.info(f"   ESCO Taxonomy: {len(esco_engine.skills)} canonical skills loaded.")

    # Load heavy NLP models in a thread to avoid blocking the event loop
    loop = asyncio.get_event_loop()
    try:
        logger.info("   Loading NLP models (this may take 1–3 minutes on first run)...")
        await loop.run_in_executor(None, model_registry.load_models, esco_engine)
        logger.info("✅ All models loaded and calibrated.")
    except Exception as e:
        logger.error(f"❌ Model loading failed: {e}")

    yield

    logger.info("🛑 Shutting down AI Analyzer API.")


# ── App Factory ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Resume Skill Gap Analyzer",
    description=(
        "Production API for the research-grade AI Resume Skill Gap Analyzer. "
        "Benchmarks Sentence-BERT, BERT, RoBERTa, DistilBERT, MPNet, and the "
        "Proposed Hybrid model (CASD + Weighted Ensemble) against the ESCO ICT taxonomy."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(analysis_router)


# ── Health Endpoints ──────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health_check():
    """Returns API health status and model loading state."""
    try:
        import torch
        device = "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        device = "cpu"
    return HealthResponse(
        status="ok" if model_registry.is_loaded() else "initializing",
        models_loaded=model_registry.is_loaded(),
        device=device,
        esco_skills_count=len(esco_engine.skills),
        version="1.0.0",
    )


@app.get("/", tags=["system"])
async def root():
    return {
        "service": "AI Resume Skill Gap Analyzer",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "status": "ok" if model_registry.is_loaded() else "initializing",
    }
