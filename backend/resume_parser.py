import spacy

nlp = spacy.load("en_core_web_sm")

def parse_resume(resume_text: str):
    doc = nlp(resume_text)
    skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT", "SKILL"]]
    education = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    experience = [sent.text for sent in doc.sents if "experience" in sent.text.lower()]
    return {
        "skills": skills,
        "education": education,
        "experience": experience
    }
