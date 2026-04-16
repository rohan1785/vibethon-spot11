"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, ChartNoAxesCombined, CodeXml, Gamepad2, Sparkles } from "lucide-react";
import styles from "./HomePage.module.css";

const features = [
  {
    icon: Brain,
    title: "Learn AIML Fast",
    text: "Digestible visual modules for machine learning fundamentals.",
  },
  {
    icon: CodeXml,
    title: "Practice by Building",
    text: "Interactive Python playground with preloaded ML snippets.",
  },
  {
    icon: Gamepad2,
    title: "Play to Understand",
    text: "Mini-games that convert concepts into hands-on intuition.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Track Real Progress",
    text: "Realtime dashboard with charts, heatmap, scores, streaks, badges, and leaderboard ranking.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.heroWrap}>
      <div className="container">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.hero}
        >
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>

              <h1>
                AIML Nexus: Learn, Code, Play, and Visualize <span className={styles.aiHighlight}>AI</span> in One Platform
              </h1>
              <p>
                A startup-grade MVP for AI/ML education with Firebase auth, real-time dashboard insights,
                quizzes, mini-games, and an AI Tutor for instant concept explanation.
              </p>
              <div className={styles.actions}>
                <Link href="/auth" className={`button-primary ${styles.primaryCta}`} aria-label="Start learning now">
                  Get Started
                </Link>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.visualGlow} />
              <div className={styles.visualOrbital} />
              <div className={styles.visualHeader}>AIML Command Center</div>
              <div className={styles.visualStack}>
                <div className={styles.visualPanel}>
                  <Brain size={18} aria-hidden="true" />
                  <div className={styles.visualBars}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={styles.visualPanel}>
                  <CodeXml size={18} aria-hidden="true" />
                  <div className={styles.visualBars}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={styles.visualPanel}>
                  <ChartNoAxesCombined size={18} aria-hidden="true" />
                  <div className={styles.visualBars}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              <div className={styles.visualFooter}>
                <span>Realtime Progress</span>
                <span>AI Tutor Ready</span>
                <span>Game Insights</span>
              </div>
            </div>
          </div>
        </motion.section>

        <section className={styles.featureGrid}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`card ${styles.featureCard}`}
              >
                <div className={styles.featureIcon}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
