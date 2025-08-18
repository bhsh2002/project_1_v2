# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libgomp1 \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy project and dev-kit
COPY ./flask-backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy source
COPY ./flask-backend/src /app/src
ENV PYTHONPATH=/app/src

# Create instance folder for temp uploads
RUN mkdir -p /app/instance/temp

# Default command overridden by docker-compose
CMD ["/app/src/entrypoint.sh"]
