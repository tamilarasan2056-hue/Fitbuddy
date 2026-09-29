# FitBuddy — AI Fitness Plan Generator

> **Train Smarter. Eat Better. Powered by AI.**

FitBuddy is a full-stack AI-driven fitness platform that generates personalized 7-day workout plans, sports nutrition protocols, and recovery strategies using **Google Gemini models**. Designed with a premium "Strava + modern AI SaaS" aesthetic, it features real-time client-side validation, feedback-based plan adaptation with side-by-side comparison, SQLAlchemy persistence, and a protected coach/admin dashboard.

---

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [Environment Variables](#environment-variables)
7. [Google Gemini Setup](#google-gemini-setup)
8. [Database Configuration (SQLite & PostgreSQL)](#database-configuration)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [Admin & Coach Portal](#admin--coach-portal)
12. [Automated Testing](#automated-testing)
13. [Vercel Deployment Guide](#vercel-deployment-guide)
14. [Health & Safety Disclaimer](#health--safety-disclaimer)

---

## Features

- **Personalized 7-Day Split Generation**: Calculates custom workout splits based on age, weight, target goal, intensity, experience level, session duration, and equipment availability.
- **Detailed Daily Protocol**: Every day features specific target focuses, 5–10 minute warm-ups, exercise routines with sets, reps, duration, and rest intervals, cooldown stretching, recovery hydration, and trainer safety notes.
- **Dedicated Sports Nutrition & Recovery**: Specialized Gemini Flash generation delivering exact daily protein targets (based on body weight), hydration volume, peri-workout nutrient timing, and slow-wave sleep hygiene.
- **Adaptive AI Feedback & Regeneration**: Users can request modifications (e.g. "Add more cardio", "I only have 30 mins", "Focus on legs", "Add yoga") to regenerate a revised plan while keeping the original baseline intact in the database.
- **Side-by-Side Plan Comparison**: Interactive diff viewer comparing the original baseline plan against the updated AI revision with rationale summaries.
- **Workout Progress Tracking**: Interactive day completion checkboxes and weekly adherence progress bars.
- **Protected Admin & Coach Dashboard**: Secure login for coaches to monitor registered athletes, review generated and updated plans, inspect metrics, and manage user records.
- **Dual AI Engine & Fallback Resilience**: Seamlessly integrates Google Gemini 2.5 Flash and includes a built-in certified sports science fallback engine in case of quota limits or network downtime.
- **Vercel & Cloud Ready**: Fully compatible with Vercel Serverless Functions (`api/index.py`) and hosted PostgreSQL (Supabase, Neon, Render).

---

## Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom Dark Mode & Glassmorphism Design System
- **Icons**: Lucide React
- **Design Aesthetic**: Premium Dark Charcoal (`#07090e`), Electric Lime (`#22c55e`), Emerald & Cyan Accents, Google Fonts Outfit & Inter

### Backend
- **Framework**: Python 3.10+ / 3.14, FastAPI
- **Validation**: Pydantic v2
- **ORM & Database**: SQLAlchemy 2.0 (SQLite for local dev, PostgreSQL for production)
- **AI Models**: Google Gemini 2.5 Flash / 1.5 Flash (`google-genai` & `google-generativeai`)
- **Server**: Uvicorn (ASGI)
- **Testing**: Pytest + FastAPI TestClient (HTTPX)

---

## System Architecture

```
User Input (Form)
      │
      ▼
React Frontend (Vite + Tailwind CSS)
      │
      ▼ HTTP POST /api/generate-workout
FastAPI Backend (app/main.py & app/routes.py)
      │
      ├───────────────────────┬────────────────────────┐
      ▼                       ▼                        ▼
User Record          Gemini AI Model         Gemini Flash Model
(SQLAlchemy)     (7-Day Workout Split)    (Nutrition & Recovery)
      │                       │                        │
      └───────────────────────┼────────────────────────┘
                              ▼
                   Persist in SQLite/Postgres
                              │
                              ▼
             Return Structured Plan to Client
                              │
                    User Submits Feedback
                              ▼
            Gemini Adaptive Feedback Generator
                              ▼
        Store Updated Plan (Original Preserved)
                              ▼
              Side-by-Side Plan Comparison
```

---

## Project Structure

```
FitBuddy/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app entrypoint, CORS, exception handlers
│   │   ├── routes.py                  # API endpoints (generation, feedback, users, admin)
│   │   ├── database.py                # SQLAlchemy engine, session maker, get_db dependency
│   │   ├── models.py                  # User and WorkoutPlan ORM models
│   │   ├── schemas.py                 # Pydantic v2 request/response schemas
│   │   ├── gemini_generator.py        # Gemini 7-day workout generator + certified fallback
│   │   ├── gemini_flash_generator.py  # Gemini Flash sports nutrition & recovery generator
│   │   ├── updated_plan.py            # Feedback-based plan updater
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── user_service.py        # User database CRUD operations
│   │   │   └── plan_service.py        # WorkoutPlan database operations & JSON serialization
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── auth.py                # Admin authentication & token verification
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py                # Automated Pytest suite
│   ├── requirements.txt               # Backend dependencies
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Responsive header with branding & status
│   │   │   ├── HeroSection.tsx        # Hero banner with CTA & trust badges
│   │   │   ├── FitnessForm.tsx        # Biometrics & goal form with validation
│   │   │   ├── LoadingScreen.tsx      # Multi-stage animated loading screen
│   │   │   ├── ProfileSummary.tsx     # Athlete profile card
│   │   │   ├── WeeklyProgress.tsx     # Adherence & caloric metrics
│   │   │   ├── NutritionTipCard.tsx   # Sports nutrition & hydration protocol
│   │   │   ├── WorkoutDayCard.tsx     # Expandable day card with exercises & safety notes
│   │   │   ├── ExerciseCard.tsx       # Exercise card with sets, reps, rest & cues
│   │   │   ├── WeeklyPlan.tsx         # Day switcher & weekly list
│   │   │   ├── FeedbackPanel.tsx      # "Improve My Plan with AI" feedback panel
│   │   │   ├── PlanComparison.tsx     # Side-by-side original vs updated diff
│   │   │   ├── AdminDashboard.tsx     # Coach & Admin portal
│   │   │   ├── HowItWorksModal.tsx    # Educational pipeline modal
│   │   │   ├── MedicalDisclaimer.tsx  # Safety & medical guidance banner
│   │   │   ├── Toast.tsx              # Alert notification system
│   │   │   └── Footer.tsx             # Footer links & copyright
│   │   ├── services/
│   │   │   └── api.ts                 # Typed API client with error handling
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   ├── App.tsx                    # Main state machine & view router
│   │   ├── index.css                  # Tailwind styles & tokens
│   │   └── main.tsx                   # React root entry
│   ├── public/
│   │   └── favicon.svg                # FitBuddy logo icon
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── api/
│   └── index.py                       # Vercel Serverless Function entrypoint
├── .env.example                       # Master environment configuration
├── .gitignore
├── vercel.json                        # Vercel deployment routes and rewrites
└── README.md
```

---

## Local Development Setup

### Prerequisites
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18 or higher (Node v20+ recommended)
- **Git**

### 1. Clone Repository & Setup Backend
```bash
# Navigate to project directory
cd "FitBuddy"

# Enter backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Backend Environment
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `backend/.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./fitbuddy.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=fitbuddy_admin_2026
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
```

### 3. Setup Frontend
Open a new terminal window:
```bash
cd "FitBuddy/frontend"

# Install packages
npm install

# Start Vite dev server
npm run dev
```
The frontend will start at **http://127.0.0.1:5173/**.

---

## Google Gemini Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and click **"Create API Key"**.
3. Copy your key and paste it into `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
4. FitBuddy will automatically use `gemini-2.5-flash` or `gemini-1.5-flash` for blazing fast generation.

> **Note**: If no Gemini API key is provided, FitBuddy seamlessly activates its certified sports science fallback engine, so you can test all features and demonstrations without interruption!

---

## Database Configuration

FitBuddy uses SQLAlchemy ORM with automatic schema initialization on startup.

### Local Development (SQLite)
By default, the database is stored locally in `backend/fitbuddy.db`:
```env
DATABASE_URL=sqlite:///./fitbuddy.db
```

### Production (PostgreSQL)
FitBuddy is completely decoupled from SQLite. To connect to any hosted PostgreSQL database (such as Supabase, Neon, Railway, or AWS RDS):
1. Obtain your PostgreSQL connection string.
2. Update `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.supabase.co:5432/postgres
   ```
All tables (`users`, `workout_plans`) will be created automatically on application launch.

---

## Running the Application

### Start the Backend Server:
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
- API Base: `http://127.0.0.1:8000`
- Swagger Interactive Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/health`

### Start the Frontend Dev Server:
```bash
cd frontend
npm run dev
```
- App UI: `http://127.0.0.1:5173`

---

## API Documentation

Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### Key Endpoints:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | API metadata and status | None |
| `GET` | `/health` | Health check & database connection probe | None |
| `POST` | `/api/generate-workout` | Generates 7-day plan & nutrition tip, persists user & plan | None |
| `POST` | `/api/submit-feedback` | Regenerates plan with feedback, archives original plan | None |
| `GET` | `/api/plans/{user_id}` | Retrieves latest workout plan and nutrition guidance | None |
| `GET` | `/api/users/{user_id}` | Retrieves user profile details | None |
| `POST` | `/api/admin/login` | Admin login and bearer token generation | None |
| `GET` | `/api/admin/stats` | Admin metrics (total users, plans, updates, active) | Admin Token |
| `GET` | `/api/users` | List all registered athletes with search filter | Admin Token |
| `DELETE`| `/api/users/{user_id}` | Delete athlete record and associated plans | Admin Token |

---

## Admin & Coach Portal

FitBuddy includes a coach and administrator dashboard accessible from the top navbar:
- **Default Username**: `admin`
- **Default Password**: `fitbuddy_admin_2026`
- **Features**:
  - Real-time athlete counters (Total Athletes, Plans Created, Plans Regenerated, Active Athletes).
  - Search and filter registered profiles by Name, User ID, or Goal.
  - View full athlete plans with original vs updated comparisons.
  - Delete records with confirmation.

---

## Automated Testing

FitBuddy includes an automated test suite verifying endpoints, validation, database operations, feedback preservation, and admin security.

To execute tests:
```bash
cd backend
.\venv\Scripts\activate
python -m pytest -v
```

All 5 core test suites run in under 2 seconds:
- `test_root_endpoint`: Verifies API online status.
- `test_health_endpoint`: Probes database and service health.
- `test_generate_workout_validation`: Enforces age, weight, and required fields.
- `test_generate_and_retrieve_workout`: Validates end-to-end plan generation, retrieval, feedback adaptation, and original plan preservation.
- `test_admin_auth_and_management`: Verifies unauthorized blocking, credential authentication, metrics, and user listing.

---

## Vercel Deployment Guide

FitBuddy is pre-configured for Vercel deployment with `vercel.json` and `api/index.py`.

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: FitBuddy AI Fitness Platform"
git remote add origin https://github.com/your-username/fitbuddy.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Import the repository into your [Vercel Dashboard](https://vercel.com).
2. Configure **Environment Variables** in Vercel project settings:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `DATABASE_URL`: Hosted PostgreSQL connection URL (e.g. from Supabase or Neon).
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Your secure admin password.
   - `ALLOWED_ORIGINS`: `*` (or your custom domain).
3. Click **Deploy**. Vercel will build the React frontend and deploy the FastAPI backend as serverless functions.

---

## Health & Safety Disclaimer

> **FitBuddy provides AI-generated fitness and nutrition guidance for informational and educational purposes only. It is not a substitute for professional medical advice, clinical diagnosis, or individualized therapy. Always consult a physician or certified healthcare provider before beginning any strenuous physical exercise or restrictive diet program, especially if you have pre-existing cardiovascular, musculoskeletal, or metabolic conditions.**

---

## License

MIT License. Designed and engineered for academic and production portfolio presentation.
#   F i t b u d d y  
 