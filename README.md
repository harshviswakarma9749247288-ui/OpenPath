# OpenPath — Your Path. Your Opportunity.

> **Hackathon-Ready Opportunity Discovery, Explainable Matching & Skill Guidance Platform**  
> Built with **React (Vite) + Node.js (Express) + MongoDB (Mongoose) + Zustand + Custom CSS**

---

## 🌟 Brand Philosophy
- **Brand Promise**: *Your Path. Your Opportunity.*
- **Supporting Message**: *Build Skills. Find Opportunities. Grow Your Future.*
- **Action Message**: *Connect. Grow. Succeed.*

---

## 🎨 Color Palette & Design System Tokens
Strictly implemented according to the **UI/UX Design Brief**:
- **Primary Blue (`#2563EB`)**: Primary buttons, links, active navigation, key highlights
- **Secondary Navy (`#1E40AF`)**: Headings, strong blue emphasis, footer
- **Accent Blue (`#3B82F6`)**: Secondary accents and interactive hover states
- **Primary Text (`#0F172A`)**: Headings and main typography
- **Secondary Text (`#64748B`)**: Supporting text and metadata
- **Background (`#F8FAFC`)**: Application canvas with subtle radial gradients
- **Cards (`#FFFFFF`)**: Panels, forms, and cards
- **Borders (`#E2E8F0`)**: Dividers and input borders
- **Typography**: `Poppins` for headings, `Inter` for body/UI text
- **Radii**: `12px` normal radius, `16px` featured radius

---

## 🧮 5-Factor Explainable Matching Algorithm
Unlike black-box recommendation systems, OpenPath explicitly shows candidates and employers the transparent mathematical score breakdown:
1. **Skill Match (40%)**: Intersection of candidate profile skills with opportunity required competencies.
2. **Academic Qualification (20%)**: Degree level and major field alignment.
3. **Location Compatibility (20%)**: Remote suitability or regional city alignment.
4. **Industry Interest (10%)**: Shared domain tags and career interest tags.
5. **Experience Level (10%)**: Appropriateness for freshers, students, or project contributors.

**Match Badges**:
- 🟢 **High Match (`>= 80%`)**: Strong compatibility across core requirements.
- 🟡 **Good Match (`50% - 79%`)**: Good baseline with specific bridgeable gaps.
- 🔴 **Growth Opportunity (`< 50%`)**: Additional foundational skills recommended.

---

## 📱 The 16 Approved Screens (App Flow)
All 16 screens from the **App Flow / Navigation Logic** specification are built and interconnected:
1. **Landing Page**: Hero, How It Works (5-step visual journey), Core Capabilities, Student & Employer sections, Live preview, Trust statistics, Final CTA, and Navy Footer.
2. **Login Page**: Split branding & credentials layout, password toggle, forgot password flow, and 1-click Demo Logins.
3. **Register Page**: Role selector (`Student/Fresher` vs `Employer`), validation, and 6-digit OTP verification flow.
4. **Profile Setup Page**: Guided onboarding wizard (Education, Technical Skills, Career Interests, Location, and Bio).
5. **Student Dashboard**: Profile completeness gauge, missing fields alert, 3 categorized carousels (*Best Matches*, *Based on Your Skills*, *Based on Your Interests*), and quick actions.
6. **Opportunities / Browse Page**: Live search, quick chips, left filter panel (type, location, salary, min match %, sort), and Grid/List view toggle.
7. **Opportunity Details Page**: Match-first layout header with circular match badge, responsibilities, requirements, matched vs missing skills, and Apply modal.
8. **Match Explanation Page**: Deep-dive mathematical view showing exact point contributions for each of the 5 factors.
9. **Skill Gap Page**: Matched vs Missing skills breakdown, priority labels (*High Priority*, *Recommended*), readiness percentage, and direct learning triggers.
10. **Learning Recommendations Page**: 5-stage progression roadmap (*Skill Gap → Beginner → Practice → Project → Ready*) with course cards and interactive completion checkboxes.
11. **Applications Page**: Summary dashboard metrics, status filter tabs, vertical multi-stage timeline, and optional Kanban board view (*Applied → Reviewing → Shortlisted → Interview → Selected*).
12. **Profile Page**: Full digital resume dashboard, completeness meter, editable fields, and simulated text/PDF resume download.
13. **Employer Dashboard**: Metrics (*Active Listings*, *Total Candidates*, *Shortlisted*, *Interviews*), quick post button, and recent applicant overview.
14. **Create Opportunity Page**: 5-step wizard (*1. Basic Info → 2. Location & Salary → 3. Requirements → 4. Skills & Eligibility → 5. Review & Publish*).
15. **Manage Opportunities Page**: Table of employer listings, active/closed status toggles, applicant counters, and delete actions.
16. **Candidate Review Page**: Candidate cards ranked by algorithmic match score %, education, experience, and live recruitment stage buttons.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local daemon or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed       # Seeds canonical skills, demo accounts, and real opportunities
npm start          # Runs backend REST API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Launches Vite development server on http://localhost:5173
```

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login)
For judges, evaluators, and testing:

| Role | Email | Password |
|---|---|---|
| **Student / Fresher** | `alex.rivera@university.edu` | `password123` |
| **Employer / Recruiter** | `recruiter@techcorp.io` | `password123` |

*Note: You can also use the **Instant Demo** buttons directly on the Landing Page and Login Page to switch between Student and Employer experiences in 1 click!*

---

## 🛡️ Backend Architecture
Strictly follows the **TRD** architecture:
`Routes → Controllers → Services/Logic → Models`
- `models/`: `User`, `Opportunity`, `Application`, `Skill`, `LearningResource`, `OTP`, `Notification`
- `services/`: `matchingService.js`, `skillGapService.js`, `learningService.js`
- `middleware/`: `authMiddleware.js` (JWT & cookie), `roleMiddleware.js`, `errorMiddleware.js`
- `utils/`: `jwt.js`, `response.js`
