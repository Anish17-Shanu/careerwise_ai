import random

CAREER_PATHS = ["Software Engineer", "Data Scientist", "Web Developer", "AI Engineer", "Business Analyst"]

def recommend_career(parsed_resume):
    skills = parsed_resume.get("skills", [])
    recommendations = []
    for career in CAREER_PATHS:
        score = random.uniform(0.6, 0.95) if skills else random.uniform(0.3, 0.6)
        recommendations.append({"career_path": career, "score": round(score, 2)})
    return recommendations
