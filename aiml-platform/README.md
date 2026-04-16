# AIML Nexus - All-in-One AI/ML Learning Platform [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org) [![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react&logoColor=white)](https://react.dev) [![Firebase](https://img.shields.io/badge/Firebase-FDFEFE?style=flat&logo=firebase&logoColor=FFCA28)](https://firebase.google.com) [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

**AIML Nexus** is a production-style web platform for interactive AI/ML education. Learn through digestible modules, practice in a Python playground, play concept-reinforcing mini-games, track progress with realtime dashboards and heatmaps, take scored quizzes, and chat with an AI Tutor—all in one modern Next.js app.

## 📑 Table of Contents
- [Tech Stack](#tech-stack)
- [✨ Features](#features)
- [🚀 Quickstart](#quickstart)
- [🌐 Deployment](#deployment)
- [🎮 Demo Flow](#demo-flow)
- [📝 Notes](#notes)

## 🛠️ Tech Stack
- **Next.js 16** (App Router)
- **React 19** (JavaScript)
- **CSS Modules** + custom global design system
- **Framer Motion** animations
- **Firebase** Auth + Firestore (local demo fallback)
- **Recharts** for visual analytics
- **React Hook Form** + **Zod** validation
- **Lucide React** icons

## ✨ Features
- **Authentication**: Email/password, Google OAuth, GitHub OAuth, logout, and skill-level onboarding
- **Dashboard**: Progress %, module count, quiz charts, GitHub-style activity heatmap, streaks, rewards, badges, and realtime updates
- **Leaderboard**: Ranking by total points with Firestore-backed data and demo fallback
- **Modules**: ML basics covering What is ML, Supervised vs Unsupervised, and Neural Networks
- **Coding Playground**: In-browser Python execution, dataset API preview, spam detection demo, and image classification demo
- **Mini-Games**: Object classification, decision tree challenge, and dataset sorting
- **Quizzes**: Instant scoring, persistence, and module-based feedback
- **AI Tutor**: AI concept explanations with fallback demo response when the API key is missing
- **Analytics**: Event tracking for module completion, quizzes, and games

## 🚀 Quickstart
```bash
# Navigate to app directory
cd aiml-platform

# Install dependencies
npm install

# Copy env template
cp .env.example .env.local

# Add your Firebase & OpenAI keys to .env.local
# (App runs in demo mode if missing)

# Start dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment
1. Push to GitHub.
2. Import to [Vercel](https://vercel.com).
3. Add env vars for Firebase/OpenAI.
4. Deploy instantly with the Next.js build pipeline.

## 🎮 Demo Flow
1. Sign up or log in at `/auth`
2. Open `/dashboard` to show progress, streaks, rewards, and charts
3. Check `/leaderboard` to show ranking
4. Complete one module in `/modules`
5. Run Python and demo simulators in `/playground`
6. Play mini-games in `/games`
7. Submit a quiz in `/quiz` and show dashboard updates
8. Ask the AI Tutor in `/tutor`

## 📝 Notes
- If Firebase env vars are missing, the app runs in local demo mode so the hackathon demo never blocks.
- Firestore integration activates automatically when env vars are present.
- Lint: `npm run lint`
- Build: `npm run build`

---
*Built for Vibethon by Team SpartEn-Spot11*

## 🚀 Quickstart
```bash
# Navigate to app directory
cd aiml-platform

# Install dependencies
npm install

# Copy env template
cp .env.example .env.local

# Add your Firebase & OpenAI keys to .env.local
# (App runs in demo mode if missing)

# Start dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment
1. Push to GitHub.
2. Import to [Vercel](https://vercel.com).
3. Add env vars (Firebase/OpenAI).
4. Deploy instantly—Next.js optimized.

## 🎮 Demo Flow (3 min)
1. Signup at `/auth`
2. View `/dashboard` (realtime cards/charts/heatmap)
3. Complete module at `/modules`
4. Play games at `/games`
5. Quiz at `/quiz` (watch dashboard update)
6. Chat AI Tutor at `/tutor`

## 📝 Notes
- **Demo Mode**: No env vars needed—perfect for hackathons/demos.
- **Production**: Firebase auto-activates with keys.
- **Lint**: `npm run lint`
- **Build**: `npm run build`

---
*Built for Vibethon by Team SpartEn-Spot11*

