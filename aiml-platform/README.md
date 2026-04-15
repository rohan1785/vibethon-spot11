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

<<<<<<< HEAD
## Features

- Login, Signup, Logout + onboarding skill level
- Personalized dashboard with:
	- Progress percentage
	- Completed module count
	- Quiz score charts
	- Activity heatmap (GitHub-style)
	- Realtime updates from Firestore or local demo state
- AIML modules:
	- What is ML
	- Supervised vs Unsupervised
	- Neural Network basics
- Coding playground with Python snippet simulation + dataset API preview
- 3 mini-games:
	- Object classification (drag-drop)
	- Decision tree logic challenge
	- Dataset sorting challenge
- Quiz system with instant scoring and persistence
- AI Tutor (OpenAI API route with fallback demo response)
- Analytics event tracking (`module_completed`, `quiz_attempt`, `games_attempted`)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Add Firebase + OpenAI keys in `.env.local`.

4. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Demo Flow (3 minutes)

1. Login/Signup from `/auth`
2. Open `/dashboard` and show real-time cards/charts/heatmap
3. Complete one module in `/modules`
4. Play mini-games in `/games`
5. Submit quiz in `/quiz` and show dashboard updates
6. Ask AI Tutor in `/tutor`

## Notes

- If Firebase env vars are missing, app runs in local demo mode so the hackathon demo never blocks.
- Firestore integration is production-ready and activates automatically when env vars are present.

## Design Resources

- AI/ML UX Framework: `AI-ML-UX-Framework.md`


# vibethon-TeamSparten-spot11

Main app lives in `aiml-platform`.

Run locally:
=======
## ✨ Features
- **Authentication**: Login/Signup/Logout + skill level onboarding
- **Dashboard**: Progress %, module count, quiz charts, GitHub-style activity heatmap, realtime updates
- **Modules**: ML basics (What is ML, Supervised/Unsupervised, Neural Networks)
- **Coding Playground**: Python snippets + dataset API
- **Mini-Games** (3x): Object classification, decision tree challenge, dataset sorting
- **Quizzes**: Instant scoring + persistence
- **AI Tutor**: OpenAI-powered explanations (demo fallback)
- **Analytics**: Event tracking (module_completed, quiz_attempt, etc.)
>>>>>>> ce028aa96430756941bcb65dd919267889e25330

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

