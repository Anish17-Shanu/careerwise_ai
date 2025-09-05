def readiness_score(parsed_resume):
    skills = len(parsed_resume.get("skills", []))
    education = len(parsed_resume.get("education", []))
    experience = len(parsed_resume.get("experience", []))

    score = (skills * 0.5 + education * 0.3 + experience * 0.2) * 10
    return round(min(score, 100), 2)
