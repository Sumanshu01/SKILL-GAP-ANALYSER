import asyncio
import sys
from app.esco_taxonomy import esco_engine
from app.nlp_models import model_registry
from app.services.analyzer import analyze_resume, generate_csv_report, generate_pdf_report

async def main():
    print("[1] Loading models...")
    model_registry.load_models(esco_engine)
    print(f"    Loaded: {model_registry.is_loaded()}")
    print(f"    Thresholds: {model_registry.get_all_thresholds()}")

    print("[2] Running analysis with Proposed Hybrid...")
    resume = """
    Alex Mercer
    Skills: Python, Django, Flask, PostgreSQL, Docker, Git, REST APIs, Redis, CI/CD with GitHub Actions.
    Experience: Built scalable microservices using Python and Flask. Designed database schemas in PostgreSQL.
    Containerized applications with Docker to AWS ECS.
    """
    jd = """
    Senior MLOps & Machine Learning Engineer
    Requirements:
    - Strong proficiency in Python and software engineering.
    - Deep expertise in PyTorch or TensorFlow for deep learning model training.
    - Hands-on experience with Kubernetes (K8s) cluster orchestration and Docker.
    - Experience with MLOps pipelines using Kubeflow, MLflow, or Airflow.
    - Database systems: PostgreSQL.
    - Solid understanding of Linux system administration and CI/CD.
    """
    result = await analyze_resume(resume, jd, model_name="Proposed Hybrid")
    print(f"    Skill Coverage: {result.skill_coverage_pct}%")
    print(f"    Overall Similarity: {result.overall_similarity_score}")
    print(f"    Matched Skills ({len(result.matched_skills)}): {result.matched_skills}")
    print(f"    Explicit Gaps ({len(result.explicit_gaps)}): {[g.skill for g in result.explicit_gaps]}")
    print(f"    Implicit Gaps ({len(result.implicit_gaps)}): {[g.skill for g in result.implicit_gaps]}")
    print(f"    Roadmap steps: {len(result.upskilling_roadmap)}")

    print("[3] Generating CSV and PDF reports...")
    csv_file = generate_csv_report(result.report_id)
    pdf_file = generate_pdf_report(result.report_id)
    print(f"    CSV generated: {csv_file}")
    print(f"    PDF generated: {pdf_file}")
    print("SUCCESS: End-to-end backend test passed!")

if __name__ == "__main__":
    asyncio.run(main())
