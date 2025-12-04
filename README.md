# 🧘 Posture Guardian

AI-powered desktop agent for posture monitoring and ergonomic health.

## Architecture

- **Desktop Agent** (C++): Lightweight system tray app
- **ML Engine** (Python/FastAPI): Posture classification
- **Backend** (Java/Spring Boot): User data & analytics API
- **Frontend** (React/TypeScript): Dashboard & insights

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Java 17+
- Node.js 18+
- CMake 3.20+ (for C++)

### Run All Services
```bash
docker-compose up -d
```

### Individual Setup
See README in each folder:
- [ml-engine/README.md](ml-engine/README.md)
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
- [desktop-agent/README.md](desktop-agent/README.md)

## Development

```bash
# Start databases
docker-compose up postgres redis -d

# Run services locally (each in separate terminal)
cd ml-engine && poetry run uvicorn main:app --reload
cd backend && mvn spring-boot:run
cd frontend && npm run dev
```

## Tech Stack

- **ML**: MediaPipe, FastAPI, Redis
- **Backend**: Spring Boot 3, PostgreSQL, WebSocket
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Desktop**: C++, Qt, OpenCV
- **DevOps**: GitHub Actions, Docker

