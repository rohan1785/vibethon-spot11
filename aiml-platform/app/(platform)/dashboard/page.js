"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { BADGE_DEFINITIONS, buildHeatmapDays } from "@/lib/firestoreService";
import { ML_MODULES } from "@/lib/sampleData";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress, loading } = useUserProgress(user?.uid);

  if (loading || !progress) {
    return <LoadingSpinner label="Loading your dashboard" />;
  }

  const completed = progress.completedModules || [];
  const quizScores = progress.quizScores || {};
  const badgeIds = progress.badgeIds || [];
  const unlockedBadges = BADGE_DEFINITIONS.filter((badge) => badgeIds.includes(badge.id));
  const chartData = ML_MODULES.map((mod) => ({
    name: mod.title.split(" ")[0],
    score: quizScores[mod.id] || 0,
  }));
  const trendData = (progress.quizAttempts || []).slice(-6).map((entry, index) => ({
    name: `A${index + 1}`,
    score: entry.scorePercent,
  }));

  return (
    <section className={styles.gridWrap}>
      <header>
        <h1 className="page-title">Your AIML Command Center</h1>
        <p className="page-subtitle">
          Realtime insights on modules, quizzes, consistency, and performance.
        </p>
      </header>

      <div className={styles.statsGrid}>
        {[
          { label: "Progress", value: `${progress.progressPercent || 0}%` },
          { label: "Modules Completed", value: `${completed.length}/${ML_MODULES.length}` },
          { label: "Total Points", value: progress.totalPoints || 0 },
          {
            label: "Current Streak",
            value: `${progress.currentStreak || 0} days`,
          },
          { label: "Unlocked Badges", value: `${badgeIds.length}` },
        ].map((item, idx) => (
          <motion.article
            key={item.label}
            className={`card ${styles.statCard}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </motion.article>
        ))}
      </div>

      <article className={`card ${styles.rewardCard}`}>
        <div className={styles.rewardHeader}>
          <div>
            <h3>Rewards and Streaks</h3>
            <p>
              Keep learning daily to extend your streak and unlock more badges.
            </p>
          </div>
          <div className={styles.rewardNumbers}>
            <span>
              <strong>{progress.currentStreak || 0}</strong> current streak
            </span>
            <span>
              <strong>{progress.longestStreak || 0}</strong> best streak
            </span>
            <span>
              <strong>{progress.rewardPoints || progress.totalPoints || 0}</strong> reward points
            </span>
          </div>
        </div>

        <div className={styles.badgeGrid}>
          {unlockedBadges.length ? (
            unlockedBadges.map((badge) => (
              <motion.div
                key={badge.id}
                className={styles.badgeCard}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>{badge.label}</strong>
                <p>{badge.description}</p>
              </motion.div>
            ))
          ) : (
            <p className={styles.badgeEmpty}>Complete a module or quiz to unlock your first badge.</p>
          )}
        </div>
      </article>

      <article className={`card ${styles.progressCard}`}>
        <div className={styles.progressTitleRow}>
          <h3>Learning Progress</h3>
          <span>{progress.progressPercent || 0}%</span>
        </div>
        <div className={styles.progressBarOuter}>
          <motion.div
            className={styles.progressBarInner}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progressPercent || 0}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </article>

      <article className={`card ${styles.heatmapCard}`}>
        <h3>Activity Heatmap</h3>
        <ActivityHeatmap days={buildHeatmapDays(progress.activityMap)} />
      </article>

      <article className={`card ${styles.chartCard}`}>
        <h3>Quiz Performance by Module</h3>
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce7fa" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#0f74ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={`card ${styles.chartCard}`}>
        <h3>Recent Quiz Trend</h3>
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData.length ? trendData : [{ name: "A1", score: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce7fa" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#00a86b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
