import os
import shutil
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, sessionmaker, relationship, declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os


static_path = os.path.join(os.getcwd(), "static")



# --- Configuration ---
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
genai.configure(api_key=API_KEY)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()
app.mount("/", StaticFiles(directory=static_path, html=True), name="frontend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database ---
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    resume_text = Column(Text)
    recommendations = relationship("Recommendation", back_populates="user")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    career_path = Column(String)
    score = Column(Integer)
    user = relationship("User", back_populates="recommendations")

engine = create_engine("sqlite:///./sql_app.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Helpers ---
def save_file(file: UploadFile):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_location
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

def extract_text_from_file(file_path: str):
    try:
        if file_path.lower().endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        elif file_path.lower().endswith(".pdf"):
            reader = PyPDF2.PdfReader(file_path)
            return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload .txt or .pdf.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from file: {e}")

def get_ai_recommendation(resume_text: str, preferences: dict = None):
    """
    Generates detailed career insights including:
    - Skills gap analysis
    - Weighted scoring for career readiness
    - Industry trends
    - Resume suggestions & ATS score
    - Personalized learning paths
    """
    prompt = f"""
    Analyze the following resume and generate a JSON object with:

    - "career_paths": array of top career paths
    - "readiness_score": overall readiness score 0-100
    - "readiness_breakdown": per career, include:
        - "Skills": {{"points": int, "advice": str}}
        - "Education": {{"points": int, "advice": str}}
        - "Experience": {{"points": int, "advice": str}}
        - "Weighted_score": weighted average of Skills, Education, Experience
        - "Skills_gap": list of skills missing or weak
    - "industry_trends": top trending roles or skills in the industry
    - "custom_matching": list of careers matched to user preferences (remote, salary, location)
    - "resume_suggestions": AI-generated bullet points to improve resume
    - "ATS_score": integer 0-100
    - "missing_keywords": list of keywords missing for target roles
    - "feedback": general constructive feedback
    - "recommended_skills": list of skills per career
    - "recommended_courses": list of courses per career
    - "recommended_projects": list of projects per career

    User preferences (if any): {preferences}

    Resume:
    {resume_text}
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    ai_output = response.text.strip()

    try:
        json_start = ai_output.find("{")
        json_end = ai_output.rfind("}") + 1
        json_str = ai_output[json_start:json_end]
        ai_data = json.loads(json_str)
        return ai_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {e}")

# --- API Endpoint ---
@app.post("/api/upload_resume/")
async def upload_resume(
    name: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(...),
    preferences: str = Form("{}"),
    db: Session = Depends(get_db)
):
    file_path = save_file(file)
    resume_text = extract_text_from_file(file_path)
    user_prefs = json.loads(preferences)
    ai_result = get_ai_recommendation(resume_text, user_prefs)

    career_paths = ai_result.get("career_paths", [])
    breakdown = ai_result.get("readiness_breakdown", {})
    overall_score = ai_result.get("readiness_score", 0)

    # Store/update user
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        db_user.name = name
        db_user.resume_text = resume_text
        db.query(Recommendation).filter(Recommendation.user_id == db_user.id).delete()
        db.commit()
        db.refresh(db_user)
    else:
        db_user = User(name=name, email=email, resume_text=resume_text)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Save AI recommendations
    for career in career_paths:
        weighted_score = breakdown.get(career, {}).get("Weighted_score", 0)
        db_rec = Recommendation(user_id=db_user.id, career_path=career, score=weighted_score)
        db.add(db_rec)
    db.commit()

    try:
        os.remove(file_path)
    except OSError:
        pass

    return {
        "name": name,
        "email": email,
        "resume_file": file.filename,
        "readiness_score": overall_score,
        "readiness_feedback": ai_result.get("feedback"),
        "recommendations": [
            {
                "career_path": career,
                "score": breakdown.get(career, {}).get("Weighted_score"),
                "details": breakdown.get(career),
                "recommended_skills": ai_result.get("recommended_skills", {}).get(career),
                "recommended_courses": ai_result.get("recommended_courses", {}).get(career),
                "recommended_projects": ai_result.get("recommended_projects", {}).get(career),
            }
            for career in career_paths
        ],
        "skills_gap": {career: breakdown.get(career, {}).get("Skills_gap") for career in career_paths},
        "industry_trends": ai_result.get("industry_trends"),
        "resume_suggestions": ai_result.get("resume_suggestions"),
        "ATS_score": ai_result.get("ATS_score"),
        "missing_keywords": ai_result.get("missing_keywords"),
        "custom_matching": ai_result.get("custom_matching")
    }

@app.get("/api/ping")
def root():
    return {"message": "CareerWise.AI Backend running 🚀"}
