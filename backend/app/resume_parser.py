"""
Resume PDF Parser & Skill Extractor
Ported from: FINAL AI SKILL ANALYZER.ipynb — Steps 5, 6
"""

import re
from typing import List, Dict, Optional
from dataclasses import dataclass
from pypdf import PdfReader


# ── Resume PDF Parser ─────────────────────────────────────────────────────────
class ResumePDFParser:
    """
    Robust PDF text extraction using PyPDF with regex-based section boundary segmentation.
    """

    SECTION_HEADERS = {
        "summary": re.compile(
            r'(professional\s+summary|summary|profile|about\s+me)', re.I
        ),
        "skills": re.compile(
            r'(technical\s+skills?|skills?|competencies|technologies|tech\s+stack)', re.I
        ),
        "experience": re.compile(
            r'(work\s+experience|professional\s+experience|employment|experience)', re.I
        ),
        "education": re.compile(
            r'(education|academic|qualifications?|degrees?|certifications?)', re.I
        ),
        "projects": re.compile(
            r'(projects?|portfolio|open\s+source)', re.I
        ),
    }

    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """Extracts all text from a PDF file using PyPDF."""
        try:
            reader = PdfReader(pdf_path)
            pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
            return "\n".join(pages)
        except Exception as e:
            raise ValueError(f"PDF extraction failed: {str(e)}")

    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> str:
        """Extracts all text from PDF bytes."""
        import io
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
            return "\n".join(pages)
        except Exception as e:
            raise ValueError(f"PDF extraction failed: {str(e)}")

    @staticmethod
    def segment_sections(full_text: str) -> Dict[str, str]:
        """
        Segments resume text into labeled sections using regex boundary detection.
        Falls back to full text under 'header' if no sections found.
        """
        lines = full_text.splitlines()
        sections: Dict[str, List[str]] = {"header": []}
        current_section = "header"

        for line in lines:
            stripped = line.strip()
            if not stripped:
                sections.setdefault(current_section, []).append(line)
                continue
            matched_section = None
            for section_name, pattern in ResumePDFParser.SECTION_HEADERS.items():
                if pattern.fullmatch(stripped) or (len(stripped) < 40 and pattern.search(stripped)):
                    matched_section = section_name
                    break
            if matched_section:
                current_section = matched_section
                sections.setdefault(current_section, [])
            else:
                sections.setdefault(current_section, []).append(line)

        return {k: "\n".join(v) for k, v in sections.items() if v}

    @staticmethod
    def clean_text(text: str) -> str:
        """Cleans extracted text by removing noise."""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\x20-\x7E\n]', ' ', text)
        return text.strip()


# ── Extracted Skill Mention ───────────────────────────────────────────────────
@dataclass
class ExtractedSkillMention:
    canonical_skill: str
    raw_mention: str
    context_window: str   # Surrounding ±15 tokens for CASD
    section_source: str   # e.g. 'skills', 'experience', 'summary'


# ── Skill Extractor ───────────────────────────────────────────────────────────
class SkillExtractor:
    """
    High-precision skill extractor with local context window capture.
    Uses multi-gram sliding window over tokenized text to match ESCO alias dictionary.
    """

    def __init__(self, esco_engine):
        self.esco = esco_engine
        # Build alias lookup: sorted by length (longest first) for greedy matching
        self._sorted_aliases = sorted(
            self.esco.alias_to_canonical.keys(),
            key=lambda x: len(x.split()),
            reverse=True
        )

    def extract_from_text(self, text: str, section_name: str = "unknown") -> List[ExtractedSkillMention]:
        """
        Performs multi-gram sliding window extraction across tokenized text.
        Captures context window of ±15 tokens around each match.
        """
        mentions: List[ExtractedSkillMention] = []
        found_canonical: set = set()
        text_clean = re.sub(r'\s+', ' ', text.lower().strip())
        tokens = text_clean.split()
        n_tokens = len(tokens)

        for alias in self._sorted_aliases:
            alias_tokens = alias.split()
            n = len(alias_tokens)
            canonical = self.esco.alias_to_canonical.get(alias)
            if not canonical or canonical.lower() in found_canonical:
                continue

            for i in range(n_tokens - n + 1):
                candidate_phrase = " ".join(tokens[i:i + n])
                if candidate_phrase == alias:
                    start_idx = max(0, i - 15)
                    end_idx = min(n_tokens, i + n + 15)
                    context_window = " ".join(tokens[start_idx:end_idx])
                    mentions.append(ExtractedSkillMention(
                        canonical_skill=canonical,
                        raw_mention=candidate_phrase,
                        context_window=context_window,
                        section_source=section_name
                    ))
                    found_canonical.add(canonical.lower())
                    break

        return mentions

    def extract_from_resume_sections(self, sections: Dict[str, str]) -> List[ExtractedSkillMention]:
        """Performs section-aware multi-pass extraction across resume segments."""
        all_mentions: List[ExtractedSkillMention] = []
        seen: set = set()
        priority_order = ["skills", "experience", "summary", "header", "education", "projects"]

        for sec in priority_order:
            sec_text = sections.get(sec, "")
            if sec_text:
                sec_mentions = self.extract_from_text(sec_text, section_name=sec)
                for m in sec_mentions:
                    if m.canonical_skill.lower() not in seen:
                        seen.add(m.canonical_skill.lower())
                        all_mentions.append(m)
        return all_mentions

    def extract_jd_skills(self, jd_text: str) -> List[str]:
        """Extracts canonical skill names from a job description text."""
        mentions = self.extract_from_text(jd_text, section_name="job_description")
        # Deduplicate
        seen: set = set()
        skills: List[str] = []
        for m in mentions:
            if m.canonical_skill.lower() not in seen:
                seen.add(m.canonical_skill.lower())
                skills.append(m.canonical_skill)
        return skills
