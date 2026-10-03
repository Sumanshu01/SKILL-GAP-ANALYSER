"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


# ── Analysis Request/Response ─────────────────────────────────────────────────
class SkillMentionOut(BaseModel):
    canonical_skill: str
    raw_mention: str
    context_window: str
    section_source: str


class SkillGapDetail(BaseModel):
    skill: str
    category: str
    description: str
    priority: str  # "critical" | "high" | "medium"
    triggered_by: Optional[List[str]] = None  # For implicit gaps


class SimilarityScore(BaseModel):
    candidate_skill: str
    jd_skill: str
    score: float
    model: str


class ModelMetrics(BaseModel):
    model: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    explicit_gap_f1: float
    implicit_gap_discovery: float
    latency_ms: float
    optimal_threshold: float


class ConfusionMatrixData(BaseModel):
    model: str
    tn: int
    fp: int
    fn: int
    tp: int


class UpskillingStep(BaseModel):
    phase: int
    skill: str
    skill_type: str  # "explicit" or "implicit"
    estimated_weeks: str
    description: str
    triggered_by: Optional[List[str]] = None


class AnalysisResult(BaseModel):
    # Input metadata
    resume_text_preview: str
    jd_text_preview: str
    model_used: str

    # Extracted skills
    candidate_skills: List[SkillMentionOut]
    jd_explicit_skills: List[str]
    jd_implicit_skills: List[str]

    # Core results
    matched_skills: List[str]
    explicit_gaps: List[SkillGapDetail]
    implicit_gaps: List[SkillGapDetail]

    # Metrics
    skill_coverage_pct: float
    overall_similarity_score: float
    similarity_scores: List[SimilarityScore]

    # Model comparison
    all_model_metrics: List[ModelMetrics]

    # Upskilling roadmap
    upskilling_roadmap: List[UpskillingStep]

    # Report ID for download
    report_id: str


# ── Health / Status ───────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    device: str
    esco_skills_count: int
    version: str = "1.0.0"


class ModelStatusResponse(BaseModel):
    models: Dict[str, bool]
    thresholds: Dict[str, float]
    total_loaded: int


# ── Report ─────────────────────────────────────────────────────────────────────
class ReportRequest(BaseModel):
    report_id: str
    format: str = "pdf"  # "pdf" | "csv"
