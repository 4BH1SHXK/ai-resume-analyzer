import re
from io import BytesIO

import pdfplumber


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\x00", "")
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[^\w\s@.,\-+()/#:&%|\"'/\n]", "", text)
    return text.strip()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    pages_text: list[str] = []

    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        if not pdf.pages:
            raise ValueError("PDF has no pages.")

        for page in pdf.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                pages_text.append(page_text)

    if not pages_text:
        raise ValueError(
            "Could not extract text from PDF. The file may be scanned or image-only."
        )

    combined = "\n\n".join(pages_text)
    cleaned = clean_text(combined)

    if len(cleaned) < 50:
        raise ValueError(
            "Extracted resume text is too short. Please upload a text-based PDF."
        )

    return cleaned
