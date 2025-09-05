# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY careerwise-frontend/package*.json ./

# Install dependencies in /app
RUN npm install

# Copy full frontend code
COPY careerwise-frontend/ ./

# Build React app
RUN npm run build

# Stage 2: Python FastAPI backend
FROM python:3.12-slim
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy React build from frontend stage
COPY --from=frontend-build /app/build ./backend/static

# Expose port Render uses
ENV PORT 10000
EXPOSE 10000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
