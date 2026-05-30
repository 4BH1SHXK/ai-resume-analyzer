import json
import os
import re

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) and resume coach.
Analyze the resume against the job description below.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "ats_score": <integer 0-100>,
  "score_reason": "<one sentence explanation>",
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "weak_bullets": ["original bullet 1"],
  "improved_bullets": ["improved version 1"],
  "top_feedback": ["tip 1", "tip 2", "tip 3"]
}}

Rules:
- matched_keywords: skills/terms from the JD that clearly appear in the resume (max 15)
- missing_keywords: important JD keywords absent or weak in the resume (max 15)
- weak_bullets: 2-4 weak resume bullets copied or paraphrased from the resume
- improved_bullets: same count as weak_bullets, each rewritten with metrics and JD keywords
- top_feedback: exactly 3 actionable tips for this candidate

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""


def _get_model() -> genai.GenerativeModel:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and add your key."
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.5-flash")


def _parse_json_response(raw: str) -> dict:
    text = raw.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"AI returned invalid JSON: {exc}") from exc

    required = [
        "ats_score",
        "score_reason",
        "matched_keywords",
        "missing_keywords",
        "weak_bullets",
        "improved_bullets",
        "top_feedback",
    ]
    for key in required:
        if key not in data:
            raise ValueError(f"AI response missing required field: {key}")

    data["ats_score"] = max(0, min(100, int(data["ats_score"])))
    return data


def analyze_resume(resume_text: str, job_description: str) -> dict:
    if not job_description.strip():
        raise ValueError("Job description cannot be empty.")

    model = _get_model()
    prompt = ANALYSIS_PROMPT.format(
        resume_text=resume_text[:12000],
        job_description=job_description[:8000],
    )

    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.3,
            response_mime_type="application/json",
        ),
    )

    if not response.text:
        raise ValueError("Empty response from Gemini API.")

    return _parse_json_response(response.text)
