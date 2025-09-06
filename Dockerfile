# -------------------------------
# Stage 1: Build React frontend
# -------------------------------
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files and install dependencies
COPY careerwise-frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY careerwise-frontend/ ./
RUN npm run build

# -------------------------------
# Stage 2: Build Python backend
# -------------------------------
FROM python:3.12-slim AS backend-build

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend

# Copy frontend build into backend container
COPY --from=frontend-build /app/build ./careerwise-frontend/build

# Set uploads directory
RUN mkdir -p /tmp/uploads

# Set environment variable for FastAPI
ENV UPLOAD_DIR=/tmp/uploads

# Expose port
EXPOSE 10000

# Run backend
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
