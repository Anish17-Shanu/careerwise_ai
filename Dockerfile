# Stage 1: Build frontend
FROM node:18 as frontend-build
WORKDIR /app
COPY careerwise-frontend/package*.json ./
RUN npm install
COPY careerwise-frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM python:3.12-slim

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy frontend build into backend/static
COPY --from=frontend-build /app/build ./static

# Expose port
EXPOSE 10000

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
