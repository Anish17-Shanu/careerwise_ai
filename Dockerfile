# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy package.json and install dependencies
COPY careerwise-frontend/package*.json ./
RUN npm install

# Copy frontend source code
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

# Copy React build from frontend stage to /app/static
COPY --from=frontend-build /app/build ./static

# Expose port Render expects
ENV PORT 10000
EXPOSE 10000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
