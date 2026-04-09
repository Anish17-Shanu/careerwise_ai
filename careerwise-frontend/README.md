# CareerWise Frontend

This frontend powers the CareerWise.AI user workflow created by Anish Kumar.

## Responsibilities

- Collect user profile details and resume uploads.
- Submit resume analysis requests to the FastAPI backend.
- Visualize readiness score, breakdowns, and recommended career paths.

## Environment

Create `careerwise-frontend/.env` (local only):

```env
REACT_APP_BACKEND_URL=http://localhost:10000
```

## Available Scripts

```bash
npm install
npm start
npm run build
npm test
```

- App URL (dev): `http://localhost:3000`
- Backend expected at: `http://localhost:10000`

## Notes

- The app posts resume data to `/api/upload_resume/` on the configured backend URL.
- Do not commit real environment files.
