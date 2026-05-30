const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload.detail === "string"
        ? payload.detail
        : payload.detail?.[0]?.msg || "Analysis failed. Please try again.";
    throw new Error(message);
  }

  return payload;
}
