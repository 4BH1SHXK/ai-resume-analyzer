import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from ai_service import analyze_resume
from pdf_extractor import extract_text_from_pdf

load_dotenv()

app = FastAPI(
    title="AI Resume Analyzer & ATS Score Checker",
    description="Analyze resumes against job descriptions using Gemini AI",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "resume-analyzer"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF resume.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    try:
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="PDF must be under 5 MB.")

        resume_text = extract_text_from_pdf(file_bytes)
        result = analyze_resume(resume_text, job_description)
        return {"success": True, "data": result, "resume_preview": resume_text[:500]}
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {exc}",
        ) from exc
