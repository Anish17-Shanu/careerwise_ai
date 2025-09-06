# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY careerwise-frontend/package*.json ./
RUN npm install
COPY careerwise-frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# Copy frontend build
COPY --from=frontend-build /app/build ./careerwise-frontend/build

EXPOSE 10000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
