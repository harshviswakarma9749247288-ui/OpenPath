# OpenPath — Your Path. Your Opportunity.

<div align="center">

![OpenPath Banner](https://img.shields.io/badge/OpenPath-AI%20Career%20Platform-8B5CF6?style=for-the-badge&logo=rocket&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-Vite%208-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express%20API-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Brevo Email](https://img.shields.io/badge/Brevo-Live%20OTP%20API-0092FF?style=for-the-badge&logo=maildotru&logoColor=white)
![Render](https://img.shields.io/badge/Render-Cloud%20Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=black)

**The AI-Powered Opportunity Discovery, Explainable 5-Factor Skill Matching & Career Guidance Platform for Students, Freshers & Progressive Hiring Teams.**

[🌐 Live Web Application](https://openpath-1.onrender.com) • [📡 Live REST API](https://openpath-jkpo.onrender.com/api) • [📖 Documentation](#-table-of-contents)

</div>

---

## 📑 Table of Contents
- [✨ Problem & Solution](#-the-openpath-solution)
- [🌐 Live Deployments](#-live-deployments)
- [🧮 5-Factor Explainable Matching Algorithm](#-5-factor-explainable-matching-algorithm)
- [🚀 Key Capabilities & Innovation](#-key-capabilities--innovation)
- [🔑 1-Click Judge & Evaluator Demo Accounts](#-1-click-judge--evaluator-demo-accounts)
- [🏗️ Full-Stack System Architecture](#-full-stack-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📡 REST API Endpoints Specification](#-rest-api-endpoints-specification)
- [🛠️ Local Installation & Development](#-local-installation--development)
- [☁️ Cloud Deployment Configuration (Render)](#-cloud-deployment-configuration-render)
- [🛡️ Security & Privacy Hardening](#-security--privacy-hardening)

---

## ✨ The OpenPath Solution

### The Core Problem
Conventional job search portals and campus placement systems treat applicants like commodities filtered through **opaque black-box ATS algorithms**. Millions of deserving freshers and college students receive generic rejections with **zero feedback** on *why* they were disqualified or *what specific skills* they need to learn to bridge the gap.

### The OpenPath Breakthrough
OpenPath breaks the black box with **100% Explainable Matching**, **Personalized 5-Stage Skill Roadmaps**, and an **Autonomous AI Career Mentor**:

1. **Explainable Hiring:** Every candidate and hiring manager sees the exact mathematical breakdown across 5 weighted dimensions.
2. **Actionable Skill Gap Detection:** Instead of a rejection letter, candidates receive prioritized skill gap alerts paired with curated learning resources.
3. **AI Career Intelligence:** A real-time, context-aware AI mentor that analyzes candidate profiles against job requirements to build instant career roadmaps.
4. **Live Verification Ecosystem:** Passwordless and secure email OTP verification powered by Brevo HTTPS API ensures authentic student and employer identity.

---

## 🌐 Live Deployments

| Service | Environment | Status | URL |
|---|---|---|---|
| **OpenPath Frontend** | Cloud Static (Render) | 🟢 Live | [openpath-1.onrender.com](https://openpath-1.onrender.com) |
| **OpenPath REST API** | Node/Express Microservice | 🟢 Live | [openpath-jkpo.onrender.com/api](https://openpath-jkpo.onrender.com/api) |
| **API Health Check** | System Telemetry | 🟢 Healthy | [openpath-jkpo.onrender.com/api/health](https://openpath-jkpo.onrender.com/api/health) |
| **Database Cluster** | MongoDB Atlas Cloud | 🟢 Active | Sharded Multi-Region Replica Set |

---

## 🧮 5-Factor Explainable Matching Algorithm

Unlike opaque keyword-stuffing parsers, OpenPath evaluates candidate suitability using a transparent, deterministic mathematical model:

$$\text{Match Score} = (S \times 0.40) + (A \times 0.20) + (L \times 0.20) + (I \times 0.10) + (E \times 0.10)$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                      5-FACTOR SCORING WEIGHTS                          │
├────────────────────────┬────────┬──────────────────────────────────────┤
│ Factor Dimension       │ Weight │ Evaluation Logic                     │
├────────────────────────┼────────┼──────────────────────────────────────┤
│ 1. Technical Skills    │  40%   │ Jaccard & fuzzy taxonomy overlap     │
│ 2. Academic Alignment  │  20%   │ Degree tier, field of study & batch  │
│ 3. Location Match      │  20%   │ City alignment or remote preference  │
│ 4. Industry Interest   │  10%   │ Career domain interest alignment     │
│ 5. Experience Level    │  10%   │ Internships, projects, fresher tier  │
└────────────────────────┴────────┴──────────────────────────────────────┘
```

### Transparent Match Tiers
- 🟢 **High Match (`≥ 80%`)**: Strong qualification alignment; fast-tracked for employer review.
- 🟡 **Good Match (`50% - 79%`)**: Solid foundation with specific bridgeable skill gaps.
- 🔴 **Growth Opportunity (`< 50%`)**: Foundational learning recommended; guided roadmap provided.

---

## 🚀 Key Capabilities & Innovation

### 🤖 1. AI Career Mentor (Real-Time Context-Aware Streaming)
- Built-in **Domain Career Intelligence Engine** with local Ollama support and zero-latency cloud streaming fallback.
- **Context Injection:** Automatically factors in the student's tracked skills, target role, and the specific opportunity requirements currently on screen.
- Answers queries like *"How can I improve my match score?"*, *"Analyze my skill gaps for this role"*, and *"What portfolio projects should I build?"* in seconds.

### 🌌 2. 3D Interactive Skill Galaxy & Guided Roadmaps
- **3D Particle Canvas:** Interactive Three.js particle constellation reacting to user cursor movement.
- **5-Stage Skill Gap Progression:** `Skill Gap Detected` → `Foundational Prep` → `Practical Exercises` → `Capstone Project` → `Opportunity Ready`.
- Interactive course tracking with auto-updating readiness percentages.

### 🏢 3. Dual-Sided Portal Ecosystem
- **Student Portal:**
  - Dynamic 5-factor dashboard with personalized match gauges.
  - Interactive digital resume generation and instant PDF export.
  - Real-time application tracker with Kanban pipeline view (*Applied → Reviewing → Shortlisted → Interview → Offer*).
- **Employer Recruitment Suite:**
  - 5-step role publication wizard with automatic candidate eligibility scoring.
  - Ranked applicant reviews sorted by mathematically transparent compatibility %.
  - 1-click candidate progression and stage update broadcasts.
- **Admin Command Center:**
  - System-wide telemetry (Total Students, Active Roles, Match Success Rates).
  - Platform-wide announcement broadcast engine with live banner toggles.
  - Moderation controls for users, listings, and canonical skill taxonomies.

### 📧 4. Resilient Live Email OTP Dispatch (Brevo HTTPS API)
- Production-grade passwordless and registration OTP verification.
- Uses **Brevo v3 HTTPS REST API (Port 443)** ensuring 100% cloud firewall traversal and zero SMTP port blocking on modern cloud hosts (Render, Vercel).
- Automated fallback to Nodemailer Gmail SMTP for local offline environments.

---

## 🔑 1-Click Judge & Evaluator Demo Accounts

For hackathon judges, evaluators, and rapid testing, OpenPath includes pre-seeded production accounts accessible with **1-Click Demo Buttons** on both the Landing Page and Login Page:

| Portal Role | Email Address | Password | Focus Area to Test |
|---|---|---|---|
| **Student / Candidate** | `alex.rivera@university.edu` | `password123` | Match Breakdown, Skill Gaps, AI Career Mentor, PDF Resume |
| **Employer / Recruiter** | `recruiter@techcorp.io` | `password123` | Role Creation Wizard, Ranked Candidate Reviews, Stage Pipeline |
| **Platform Administrator**| `admin@openpath.io` | `password123` | System Telemetry, Announcement Broadcasts, User Governance |

---

## 🏗️ Full-Stack System Architecture

```
                                  ┌───────────────────────────┐
                                  │   Browser / Mobile Client │
                                  │   (React 19 + Vite 8 SPA) │
                                  └─────────────┬─────────────┘
                                                │
                          HTTPS / REST / SSE    │ (Port 443)
                                                ▼
                                  ┌───────────────────────────┐
                                  │   Node.js / Express API   │
                                  │    Reverse Proxy Trust    │
                                  └──────┬─────────────┬──────┘
                                         │             │
                    ┌────────────────────┘             └────────────────────┐
                    ▼                                                       ▼
        ┌────────────────────────┐                             ┌────────────────────────┐
        │     MongoDB Atlas      │                             │    Brevo Cloud API     │
        │  Multi-Region Sharded  │                             │  HTTPS OTP Dispatch    │
        │ (Users, Roles, Skills) │                             │   (Instant Delivery)   │
        └────────────────────────┘                             └────────────────────────┘
```

### Monorepo Directory Organization
```
OpenPath/
├── backend/                        # Node.js + Express REST API
│   ├── src/
│   │   ├── config/                 # DB connection, Seed data, Environment
│   │   ├── controllers/            # Auth, Users, Roles, AI, Admin controllers
│   │   ├── middleware/             # Rate limiters, JWT verification, Security headers
│   │   ├── models/                 # Mongoose schemas (User, Opportunity, Skill, etc.)
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/               # 5-factor matching algorithm & AI engine
│   │   └── utils/                  # JWT token management, Brevo email service
│   ├── .env.example                # Backend environment configuration template
│   └── package.json
├── frontend/                       # React 19 + Vite Frontend SPA
│   ├── public/                     # Favicons, vector assets, static icons
│   ├── src/
│   │   ├── components/             # AI Drawer, Navbar, Sidebar, 3D Cards, Modals
│   │   ├── pages/                  # 16 complete screen views (Dashboard, Match, etc.)
│   │   ├── store/                  # Zustand stores (Auth, Opportunities, UI state)
│   │   └── utils/                  # API client, dynamic local/cloud router
│   ├── .env.example                # Frontend environment configuration template
│   └── package.json
├── render.yaml                     # Render Cloud Infrastructure as Code (IaC)
└── README.md
```

---

## 💻 Tech Stack

### Frontend Architecture
- **Framework:** React 19 + Vite 8
- **State Management:** Zustand (reactive, zero-boilerplate client state)
- **Styling:** Modular CSS Design System with CSS variables and responsive glassmorphism
- **Visuals & 3D:** Three.js particle constellation canvas, Canvas Confetti
- **Document Export:** jsPDF + html2canvas for instant digital resume generation
- **Icons:** Lucide React (clean vector icons)

### Backend Architecture
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express.js 4.19
- **Database:** MongoDB Atlas with Mongoose 8 ORM
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only security cookies & Bearer tokens
- **Email Delivery:** Brevo v3 HTTPS REST API (Port 443) + Nodemailer SMTP fallback
- **Security:** Helmet-style security headers, Mongo Sanitize, sliding-window rate limiters

---

## 📡 REST API Endpoints Specification

### Authentication & OTP
- `POST /api/auth/register` — Register student or employer account
- `POST /api/auth/login` — Password authentication & token issuance
- `POST /api/auth/otp/send` — Generate & dispatch 6-digit verification code via email
- `POST /api/auth/otp/verify` — Verify email OTP code
- `POST /api/auth/otp/login` — Passwordless login via OTP
- `POST /api/auth/logout` — Clear session cookies & revoke authentication

### Matching & Opportunities
- `GET /api/opportunities` — Query filtered listings with live search & tag filters
- `GET /api/opportunities/:id` — Fetch complete listing details & required skill breakdown
- `POST /api/opportunities` — Create opportunity (Employer restricted)
- `GET /api/matches` — Get candidate's personalized match scores across all active roles
- `GET /api/matches/explain/:opportunityId` — Fetch 5-factor mathematical point breakdown
- `GET /api/matches/skill-gap/:opportunityId` — Get matched vs missing skills & learning plan

### AI Career Intelligence
- `POST /api/ai/chat` — Synchronous AI Career Mentor query
- `POST /api/ai/stream` — Real-time Server-Sent Events (SSE) AI response streaming

### Platform Administration
- `GET /api/admin/analytics` — Fetch system-wide platform telemetry & user statistics
- `GET /api/admin/announcements` — Retrieve and broadcast live platform notices
- `PUT /api/admin/users/:id/status` — Moderate user accounts (suspend, activate)

---

## 🛠️ Local Installation & Development

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or free MongoDB Atlas URI)
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/harshviswakarma9749247288-ui/OpenPath.git
cd OpenPath
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and enter your MONGODB_URI and BREVO_API_KEY
npm run seed       # Populates skills, demo accounts, and real opportunity listings
npm run dev        # Starts backend API on http://localhost:5000
```

### 4. Frontend Setup
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev        # Starts Vite client on http://localhost:4173 or http://localhost:5173
```

Open `http://localhost:4173` or `http://localhost:5173` in your browser.

---

## ☁️ Cloud Deployment Configuration (Render)

OpenPath is pre-configured with a native `render.yaml` blueprint for zero-downtime deployment:

### Backend Service (`openpath-backend`)
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check:** `/api/health`
- **Required Environment Variables:**
  - `NODE_ENV=production`
  - `MONGODB_URI=<your_mongodb_atlas_connection_string>`
  - `JWT_SECRET=<strong_random_secret_string>`
  - `CLIENT_URL=https://openpath-1.onrender.com`
  - `BREVO_API_KEY=xkeysib-...`
  - `BREVO_SENDER_EMAIL=harshviswakarma9749247288@gmail.com`

### Frontend Service (`openpath-frontend`)
- **Environment:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Routing:** Rewrite `/*` → `/index.html` (SPA fallback)
- **Required Environment Variables:**
  - `VITE_API_URL=https://openpath-jkpo.onrender.com/api`

---

## 🛡️ Security & Privacy Hardening

- **Zero Black-Box Scoring:** Algorithmic criteria are published and mathematically explainable.
- **Password Security:** Salted hashing with `bcryptjs` (10 rounds).
- **Injection Protection:** Input sanitization to prevent NoSQL query injection and XSS.
- **Strict CORS & CSRF Controls:** Whitelisted origins across localhost and production domains.
- **Brute-Force Shielding:** Sliding-window rate limiters on sensitive endpoints (OTP dispatch max 20 req / 2 min, login attempts max 30 req / 5 min).

---

<div align="center">

**OpenPath — Built with passion for hackathon excellence.**  
*Your Path. Your Opportunity.*

</div>
