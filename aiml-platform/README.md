# AIML Nexus - All-in-One AIML Learning Platform

Production-style hackathon MVP built with Next.js App Router, Firebase-ready auth/data, interactive modules, quizzes, mini-games, coding playground, and AI Tutor.

## Tech Stack

- Next.js (App Router)
- React (JavaScript)
- CSS Modules + custom global design system
- Framer Motion animations
- Firebase Auth + Firestore (with local demo fallback)
- Recharts for visual analytics
- React Hook Form + Zod validation

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

```bash
cd aiml-platform
npm install
npm run dev
```


