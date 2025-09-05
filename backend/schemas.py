from pydantic import BaseModel
from typing import List

class RecommendationOut(BaseModel):
    career_path: str
    score: float

class ResumeResponse(BaseModel):
    recommendations: List[str]
    readiness_score: float
    readiness_feedback: str

class UserCreate(BaseModel):
    name: str
    email: str
    resume_text: str

class RecommendationOut(BaseModel):
    career_path: str
    score: float