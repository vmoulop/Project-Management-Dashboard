# Project-Management-Dashboard
Project management dashboard full-stack application implemented in Django
# Project Management Dashboard

A full-stack web application for managing projects, milestones, team members, and activity events. This repository includes a React frontend, Django backend, PostgreSQL database, and Docker-based deployment. It also contains reusable packaged components for NPM and PyPI.

---

## Table of Contents

- [Features](#features)  
- [Architecture & Models](#architecture--models)  
- [Tech Stack](#tech-stack)  
- [Setup & Deployment](#setup--deployment)  
- [CI/CD Pipeline](#cicd-pipeline)  
- [Reusable Components](#reusable-components)  
- [License](#license)  

---

## Features

- **Project CRUD & Listing**  
  - Paginated, sortable, and filtered by status, owner, tag, health  
  - Soft delete with recover functionality  
- **Project Detail View**  
  - Summary, milestones progress (derived %), team roster (role + capacity), recent activity events  
- **Real-Time Updates**  
  - SSE (Server-Sent Events) for project progress and activity events  
- **Search**  
  - Free-text search across project titles, descriptions, and tags  
- **Bulk Operations**  
  - Update status or tags across multiple projects atomically with optimistic concurrency safeguards  
- **Frontend & Backend Deployment**  
  - Dockerized frontend served by Nginx  
  - Django backend served by Gunicorn  
  - PostgreSQL database  

---

## Architecture & Models

### Project Data Models (Backend)

- **Project** – Core entity with metadata, progress, tags, status, and health  
- **Milestone** – Component of a project contributing to overall progress via weighted calculation  
- **TeamRoster** – Individual team members assigned to multiple projects with roles and capacity  
- **RecentActivityEvent** – Log of events and updates associated with projects  

**Relationships:**  
- Project → Milestones (1:N)  
- Project → TeamRoster (M:N)  
- Project → RecentActivityEvent (1:N)  

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, Material-UI, Axios  
- **Backend:** Django, Django REST Framework, PostgreSQL  
- **Real-Time Updates:** SSE (django-eventstream)  
- **Deployment:** Docker, Nginx, Gunicorn  
- **CI/CD:** GitHub Actions, Docker Compose  

---

## Docker Deployment

The entire system is deployed via Docker Compose.

### 1️⃣ Prerequisites
- Docker and Docker Compose installed on your system
- Download the docker-compose.yml file and place it to a folder on your system

Note:
The docker-compose.yml file is available in the root of this repository:
https://github.com/vmoulop/Project-Management-Dashboard

### 2️⃣ Build and Run
From the folder you placed the docker-compose.yml (see previous step) run the command below:
```bash
docker compose up --build
```

### 3️⃣ Access the Application

- Frontend UI → http://localhost:3000

- Backend API → http://localhost:8000/api/projects/

### 4️⃣ Included Docker Services

- db → PostgreSQL database

- backend → Django backend served by Gunicorn

- frontend → React build served by Nginx

### 5️⃣ Docker Images

The project images were built and published to Docker Hub for external use:

- Backend: vasmoul/project-dashboard-backend:latest

- Frontend: vasmoul/project-dashboard-frontend:latest

---

### CI/CD Pipeline

GitHub Actions automate the build, test, and deploy processes.

- Continuous Integration (CI)

    -  Runs on every push and pull_request to the main branch

    - Spins up a PostgreSQL service for backend tests

    - Installs dependencies for both frontend and backend

    - Runs backend migrations and tests

    - Builds the frontend for production

- Continuous Deployment (CD)

    - Builds Docker images using docker compose build

    - Starts containers with docker compose up -d

    - Verifies container logs and running state

    - Stops containers automatically after testing

---

### Reusable Components

Backend – PyPI Package: models_package_vasmoul

A reusable Django models package containing the core entities:

- Project

- Milestone

- TeamRoster

- RecentActivityEvent

---

Frontend – NPM Package: project-card

A reusable React component for displaying project summary cards in a dashboard or project list view.

---

### License

MIT License © 2025 Vasilis Moulopoulos