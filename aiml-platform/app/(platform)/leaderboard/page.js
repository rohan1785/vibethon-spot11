"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Flame, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { BADGE_DEFINITIONS, fetchLeaderboardEntries } from "@/lib/firestoreService";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./LeaderboardPage.module.css";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { progress, loading } = useUserProgress(user?.uid);
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      setEntriesLoading(true);
      try {
        const data = await fetchLeaderboardEntries(8);
        if (active) {
          setEntries(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setEntriesLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  const badgeLookup = useMemo(
    () => Object.fromEntries(BADGE_DEFINITIONS.map((badge) => [badge.id, badge])),
    []
  );

  const mergedEntries = useMemo(() => {
    const nextEntries = [...entries];

    if (user && progress) {
      nextEntries.push({
        uid: user.uid,
        name: user.displayName || user.email || "You",
        totalPoints: progress.totalPoints || 0,
        currentStreak: progress.currentStreak || 0,
        longestStreak: progress.longestStreak || 0,
        badgeIds: progress.badgeIds || [],
        isCurrentUser: true,
      });
    }

    return nextEntries
      .sort((left, right) => (right.totalPoints || 0) - (left.totalPoints || 0))
      .slice(0, 8)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [entries, progress, user]);

  if (loading || entriesLoading) {
    return <LoadingSpinner label="Loading leaderboard" />;
  }

  const topThree = mergedEntries.slice(0, 3);

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Competition</p>
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-subtitle">
            See who is leading on points, streaks, and badge unlocks.
          </p>
        </div>
        <div className={styles.summaryCard}>
          <Trophy size={20} />
          <div>
            <strong>{mergedEntries.length}</strong>
            <span>active learners tracked</span>
          </div>
        </div>
      </header>

      <div className={styles.podiumGrid}>
        {topThree.map((entry) => (
          <motion.article
            key={entry.uid}
            className={`${styles.podiumCard} ${entry.isCurrentUser ? styles.currentUser : ""}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.rankBadge}>#{entry.rank}</div>
            <h3>{entry.name}</h3>
            <p>{entry.totalPoints} points</p>
            <div className={styles.podiumStats}>
              <span>
                <Flame size={14} /> {entry.currentStreak || 0} day streak
              </span>
              <span>
                <BadgeCheck size={14} /> {(entry.badgeIds || []).length} badges
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <article className={`card ${styles.listCard}`}>
        <div className={styles.listHeader}>
          <h3>Full Ranking</h3>
          <span>Points, streaks, and badge count update from Firestore or demo data.</span>
        </div>

        <div className={styles.rowList}>
          {mergedEntries.map((entry) => (
            <div key={entry.uid} className={`${styles.row} ${entry.isCurrentUser ? styles.currentUserRow : ""}`}>
              <div className={styles.rank}>{entry.rank}</div>
              <div className={styles.userMeta}>
                <strong>{entry.name}</strong>
                <span>
                  {entry.currentStreak || 0} day streak · {entry.longestStreak || 0} best
                </span>
              </div>
              <div className={styles.score}>{entry.totalPoints || 0} pts</div>
              <div className={styles.badges}>
                {(entry.badgeIds || []).slice(0, 3).map((badgeId) => (
                  <span key={badgeId}>{badgeLookup[badgeId]?.label || badgeId}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
