# CareerWise.AI

CareerWise.AI is an AI-powered career intelligence platform that analyzes resumes and returns structured, actionable guidance: readiness scores, career-path recommendations, skill gaps, project ideas, and resume improvements.

Creator: Anish Kumar

## Key Features

- Resume upload (`.pdf` / `.txt`) with robust text extraction fallback.
- AI-generated career path recommendations with readiness breakdowns.
- Skills, courses, and projects tailored to suggested career tracks.
- ATS scoring, missing keywords, industry trends, and resume suggestions.
- React dashboard with charts and recommendation cards.

## Tech Stack

- Backend: FastAPI, Python, Google Gemini API, PyPDF2, pdfplumber
- Frontend: React (CRA), Axios, Recharts, Tailwind CSS
- Containerization: Docker, Docker Compose

## Project Structure

```text
careerwise_ai/
  backend/
  careerwise-frontend/
  docker-compose.yml
  docker-compose.override.yml
  .env.example
```

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Set your Google Gemini API key:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
REACT_APP_BACKEND_URL=http://localhost:10000
```

For backend-only local workflows, you can also copy `backend/.env.example` to `backend/.env`.

## Run Locally (Without Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 10000
```

### Frontend

```bash
cd careerwise-frontend
npm install
npm start
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:10000`
Health check: `http://localhost:10000/api/ping`

## Run With Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:10000`

## API

### `GET /api/ping`
Returns backend status.

### `POST /api/upload_resume/`
Multipart form-data:

- `name` (string)
- `email` (string)
- `file` (`.pdf` or `.txt`)
- `preferences` (JSON string)

## Security and Repository Hygiene

- Real `.env` files are ignored and should never be committed.
- Local DB and upload artifacts are ignored (`*.db`, `backend/uploads/`).
- If any key was ever committed in the past, rotate it immediately.

## Contribution Notes

1. Create a feature branch.
2. Make focused changes with clear commits.
3. Open a PR with testing notes.

Built and maintained by Anish Kumar.
