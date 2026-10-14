# 🚀 OpenPath Production Deployment Guide

This guide provides instructions for deploying **OpenPath** to production using **MongoDB Atlas**, **Render / Railway** (Backend), and **Vercel / Netlify** (Frontend).

---

## 📋 Architectural Overview

- **Frontend:** React + Vite SPA (Hosted on **Vercel** or **Netlify**)
- **Backend:** Node.js + Express REST API (Hosted on **Render**, **Railway**, or similar)
- **Database:** MongoDB (Hosted on **MongoDB Atlas** Cloud Cluster)

---

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create a free account.
2. Click **Create a Deployment** and select the **M0 Free Tier** cluster.
3. In **Database Access**:
   - Create a database user with username (e.g. `openpath_admin`) and secure password.
   - Assign role: **Read and write to any database**.
4. In **Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)** so your cloud backend can connect.
5. In **Database**:
   - Click **Connect** -> Choose **Drivers** (Node.js).
   - Copy your connection string. It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/openpath?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials. Keep the `/openpath` database name.

---

## Step 2: Deploy Backend (Render / Railway)

### Option A: Using Render (Recommended)

1. Push your code to GitHub (ensure branch `release/deployment` is pushed).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Name:** `openpath-backend`
   - **Region:** Closest to your users (e.g., Singapore or Frankfurt)
   - **Branch:** `release/deployment`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   | Key | Value / Description |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (or leave default, Render sets `PORT` automatically) |
   | `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | A secure 32+ character random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | Your frontend production URL (e.g., `https://openpath.vercel.app`) |
   | `SMTP_HOST` | *(Optional)* `smtp.gmail.com` for live OTP emails |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | *(Optional)* Your Gmail address |
   | `SMTP_PASS` | *(Optional)* 16-character Google App Password |
6. Click **Deploy Web Service**.
7. Once deployed, test the health check endpoint:
   ```
   https://<your-backend-name>.onrender.com/api/health
   ```
   It should return: `{"status": "healthy", "product": "OpenPath API", ...}`.

---

## Step 3: Deploy Frontend (Vercel / Netlify)

### Option A: Using Vercel (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select your OpenPath repository from GitHub.
3. In the configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://<your-backend-name>.onrender.com/api` (Backend URL from Step 2) |
   | `VITE_APP_TITLE` | `OpenPath - Career Discovery & Skill Guidance` |
5. Click **Deploy**.
6. Vercel will build and deploy the application. Single Page Application (SPA) routing is automatically handled by [`frontend/vercel.json`](file:///f:/Projects%20Hackathon/OpenPath/OpenPath/frontend/vercel.json).

---

## Step 4: Connect & Finalize

1. Copy your live frontend domain (e.g., `https://openpath.vercel.app`).
2. Go back to Render -> `openpath-backend` -> **Environment Variables**.
3. Update `CLIENT_URL` to your exact frontend domain:
   ```
   CLIENT_URL=https://openpath.vercel.app
   ```
4. Click **Save Changes** (Render will automatically redeploy with the updated CORS whitelist).

---

## Step 5: Post-Deployment Verification Checklist

- [ ] Visit frontend URL: Homepage loads with 3D elements and features.
- [ ] Create a new **Student** account: Registration -> OTP -> Profile Setup -> Database saved.
- [ ] Create a new **Employer** account: Registration -> Employer Dashboard -> Post an opportunity.
- [ ] Apply to an opportunity: Verify applicant appears in Employer Dashboard.
- [ ] Access Admin Command Center at `/admin`: Live user count and platform statistics reflected directly from MongoDB Atlas.
