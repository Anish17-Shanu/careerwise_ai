import os
import shutil
import json
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import PyPDF2
import pdfplumber
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY not set.")
genai.configure(api_key=API_KEY)

UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --- FastAPI app ---
app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helpers ---
async def save_file(file: UploadFile):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return path

def extract_text(file_path: str):
    ext = file_path.lower().split('.')[-1]
    if ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    elif ext == "pdf":
        try:
            reader = PyPDF2.PdfReader(file_path)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            if not text.strip():
                raise ValueError("Empty PDF, fallback to pdfplumber")
        except Exception:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
            if not text.strip():
                raise HTTPException(status_code=400, detail="Unable to extract text from PDF")
        return text
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

def parse_ai_json(ai_output: str):
    import re
    try:
        json_strs = re.findall(r"\{.*\}", ai_output, re.DOTALL)
        if not json_strs:
            raise ValueError("No JSON found in AI output")
        return json.loads(json_strs[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI JSON parsing failed: {e}")


def get_ai_recommendation(resume_text: str, preferences: dict = None):
    """
    Call Google Gemini AI to get career recommendations.
    Ensures all numeric fields are 0–100 and missing lists are empty.
    """
    prompt = f"""
    Analyze this resume and return strictly valid JSON only.
    Include 5–8 relevant career paths: Software Engineer, Data Scientist,
    Machine Learning Engineer, Full Stack Developer, AI Engineer, DevOps Engineer, Data Analyst.

    For each career path, include:
    - readiness_breakdown:
        - Skills: points (0-100), advice (string)
        - Education: points (0-100), advice (string)
        - Experience: points (0-100), advice (string)
        - Weighted_score (0-100)
        - Skills_gap (list, empty if none)
    - recommended_skills (list)
    - recommended_courses (list)
    - recommended_projects (list)
    - feedback (string)
    - ATS_score (0-100)
    - missing_keywords (list)
    - resume_suggestions (list)
    - industry_trends (list)
    - custom_matching (list)

    Numeric fields must be numbers 0–100.
    Lists must be empty if no data.
    User preferences: {preferences or {}}

    Return JSON in the following structure:

    {{
        "readiness_score": 0-100,
        "feedback": "...",
        "career_paths": ["Software Engineer", ...],
        "readiness_breakdown": {{
            "Software Engineer": {{
                "Skills": {{"points": 0, "advice": ""}},
                "Education": {{"points": 0, "advice": ""}},
                "Experience": {{"points": 0, "advice": ""}},
                "Weighted_score": 0,
                "Skills_gap": []
            }},
            ...
        }},
        "recommended_skills": {{"Software Engineer": [], ...}},
        "recommended_courses": {{"Software Engineer": [], ...}},
        "recommended_projects": {{"Software Engineer": [], ...}},
        "industry_trends": [],
        "resume_suggestions": [],
        "ATS_score": 0,
        "missing_keywords": [],
        "custom_matching": []
    }}

    Resume text:
    {resume_text}
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()


# --- API Routes ---
@app.get("/api/ping")
def ping():
    return {"message": "CareerWise.AI Backend running 🚀"}

@app.post("/api/upload_resume/")
async def upload_resume(
    name: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(...),
    preferences: str = Form("{}")
):
    file_path = await save_file(file)

    try:
        resume_text = extract_text(file_path)
        user_prefs = json.loads(preferences or "{}")
        ai_output = get_ai_recommendation(resume_text, user_prefs)
        ai_data = parse_ai_json(ai_output)

        # --- Transform AI JSON to frontend-ready format ---
        recommendations = []
        readiness_breakdown = {}

        for career in ai_data.get("career_paths", []):
            breakdown = ai_data.get("readiness_breakdown", {}).get(career, {})
            rec = {
                "career_path": career,
                "score": breakdown.get("Weighted_score", 0),
                "details": breakdown,
                "recommended_skills": ai_data.get("recommended_skills", {}).get(career, []),
                "recommended_courses": ai_data.get("recommended_courses", {}).get(career, []),
                "recommended_projects": ai_data.get("recommended_projects", {}).get(career, []),
            }
            recommendations.append(rec)
            readiness_breakdown[career] = breakdown

        response = {
            "name": name,
            "email": email,
            "resume_file": file.filename,
            "readiness_score": ai_data.get("readiness_score", 0),
            "readiness_feedback": ai_data.get("feedback", ""),
            "recommendations": recommendations,
            "readiness_breakdown": readiness_breakdown,
            "industry_trends": ai_data.get("industry_trends", []),
            "resume_suggestions": ai_data.get("resume_suggestions", []),
            "ATS_score": ai_data.get("ATS_score", 0),
            "missing_keywords": ai_data.get("missing_keywords", []),
            "custom_matching": ai_data.get("custom_matching", []),
        }

        return response

    finally:
        try:
            os.remove(file_path)
        except OSError:
            pass

# frontend_build_path = os.path.join(os.path.dirname(__file__), "careerwise-frontend", "build")
# app.mount("/", StaticFiles(directory=frontend_build_path, html=True), name="frontend")

