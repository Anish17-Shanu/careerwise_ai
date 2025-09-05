# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY careerwise-frontend/package*.json ./careerwise-frontend/
RUN npm install
COPY careerwise-frontend/ ./careerwise-frontend/
RUN npm run build

# Stage 2: Setup Python FastAPI backend
FROM python:3.12-slim
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy React build into backend static folder
COPY --from=frontend-build /app/careerwise-frontend/build ./backend/static

# Expose port Render uses
ENV PORT 10000
EXPOSE 10000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
