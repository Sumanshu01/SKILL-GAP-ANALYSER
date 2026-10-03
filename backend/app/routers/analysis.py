"""
FastAPI router — analysis endpoints.
"""

import os
import shutil
import tempfile
from typing import Optional

from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse

from app.schemas import AnalysisResult
from app.services.analyzer import analyze_resume, generate_csv_report, generate_pdf_report
from app.nlp_models import model_registry

router = APIRouter(prefix="/api", tags=["analysis"])

ALLOWED_MODELS = [
    "Proposed Hybrid", "Sentence-BERT", "BERT",
    "RoBERTa", "DistilBERT", "MPNet"
]


@router.post("/analyze", response_model=AnalysisResult)
async def analyze(
    background_tasks: BackgroundTasks,
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: Optional[str] = Form(None),
    jd_file: Optional[UploadFile] = File(None),
    model_name: str = Form("Proposed Hybrid"),
):
    """
    Full end-to-end skill gap analysis.

    - **resume_file**: PDF resume upload (mutually exclusive with resume_text)
    - **resume_text**: Plain text resume (mutually exclusive with resume_file)
    - **jd_text**: Job description text (mutually exclusive with jd_file)
    - **jd_file**: Job description as PDF (mutually exclusive with jd_text)
    - **model_name**: NLP model to use for semantic matching
    """
    if not model_registry.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="NLP models are still loading. Please retry in a moment."
        )

    if model_name not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model '{model_name}'. Choose from: {ALLOWED_MODELS}"
        )

    # ── Resolve Resume Text ──────────────────────────────────────────────────
    final_resume_text: str = ""
    tmp_resume = None

    if resume_file and resume_file.filename:
        if not resume_file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Resume must be a PDF file.")
        content = await resume_file.read()
        if len(content) > 10 * 1024 * 1024:  # 10 MB
            raise HTTPException(status_code=400, detail="Resume PDF exceeds 10 MB limit.")
        # Write to temp file for pypdf
        from pypdf import PdfReader
        import io
        try:
            reader = PdfReader(io.BytesIO(content))
            pages = [p.extract_text() or "" for p in reader.pages]
            final_resume_text = "\n".join(pages)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to parse resume PDF: {e}")
    elif resume_text and resume_text.strip():
        final_resume_text = resume_text.strip()
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a PDF resume file (resume_file) or plain text (resume_text)."
        )

    if len(final_resume_text) < 30:
        raise HTTPException(status_code=422, detail="Resume text is too short to analyze.")

    # ── Resolve JD Text ──────────────────────────────────────────────────────
    final_jd_text: str = ""

    if jd_file and jd_file.filename:
        if not jd_file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Job description file must be a PDF.")
        jd_content = await jd_file.read()
        from pypdf import PdfReader
        import io
        try:
            reader = PdfReader(io.BytesIO(jd_content))
            final_jd_text = "\n".join(p.extract_text() or "" for p in reader.pages)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Failed to parse JD PDF: {e}")
    elif jd_text and jd_text.strip():
        final_jd_text = jd_text.strip()
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a PDF job description (jd_file) or plain text (jd_text)."
        )

    if len(final_jd_text) < 20:
        raise HTTPException(status_code=422, detail="Job description text is too short to analyze.")

    # ── Run Analysis ─────────────────────────────────────────────────────────
    try:
        result = await analyze_resume(
            resume_text=final_resume_text,
            jd_text=final_jd_text,
            model_name=model_name,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    return result


@router.get("/report/{report_id}/csv")
async def download_csv(report_id: str):
    """Download analysis report as CSV."""
    # Basic UUID validation
    import re
    if not re.match(r'^[0-9a-f\-]{36}$', report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID.")
    try:
        csv_path = generate_csv_report(report_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Report not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV generation failed: {e}")

    return FileResponse(
        csv_path,
        media_type="text/csv",
        filename=f"skill_gap_report_{report_id[:8]}.csv"
    )


@router.get("/report/{report_id}/pdf")
async def download_pdf(report_id: str):
    """Download analysis report as PDF."""
    import re
    if not re.match(r'^[0-9a-f\-]{36}$', report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID.")
    try:
        pdf_path = generate_pdf_report(report_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Report not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"skill_gap_report_{report_id[:8]}.pdf"
    )


@router.get("/models")
async def list_models():
    """List available NLP models and their calibration thresholds."""
    thresholds = model_registry.get_all_thresholds()
    return {
        "models": ALLOWED_MODELS,
        "thresholds": thresholds,
        "loaded": model_registry.is_loaded(),
        "benchmark_metrics": model_registry.get_benchmark_metrics(),
    }


@router.get("/esco/skills")
async def list_esco_skills():
    """Return the full ESCO skill taxonomy."""
    from app.esco_taxonomy import esco_engine
    categories = esco_engine.get_skill_categories()
    return {
        "total_skills": len(esco_engine.get_all_skills()),
        "categories": {
            cat: [
                {
                    "name": s,
                    "description": esco_engine.get_skill(s).description if esco_engine.get_skill(s) else "",
                    "prerequisites": esco_engine.get_skill(s).implicit_prerequisites if esco_engine.get_skill(s) else [],
                }
                for s in skills
            ]
            for cat, skills in categories.items()
        }
    }
