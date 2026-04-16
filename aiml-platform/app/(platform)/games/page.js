"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { saveGameScore } from "@/lib/firestoreService";
import { trackEvent } from "@/lib/analytics";
import { GAME_ITEMS } from "@/lib/sampleData";
import styles from "./GamesPage.module.css";

const SORT_POOLS = [
  [18, 3, 9, 27, 12],
  [5, 42, 7, 19, 1],
  [33, 8, 15, 2, 44],
  [11, 6, 30, 22, 4],
  [7, 55, 13, 3, 29],
  [40, 2, 17, 8, 36],
  [6, 21, 50, 14, 9],
  [25, 4, 38, 10, 16],
];

const ALL_TREE_QUESTIONS = [
  { question: "Color is red, shape is round. Classify as:", answer: "apple", options: ["apple", "carrot", "bike"] },
  { question: "Color is orange, long and thin shape. Classify as:", answer: "carrot", options: ["apple", "carrot", "bike"] },
  { question: "Has two wheels and no engine. Classify as:", answer: "bike", options: ["apple", "carrot", "bike"] },
  { question: "Grows on a tree, sweet taste. Classify as:", answer: "apple", options: ["apple", "carrot", "bike"] },
  { question: "Grows underground, vegetable. Classify as:", answer: "carrot", options: ["apple", "carrot", "bike"] },
  { question: "Used for cycling, human-powered. Classify as:", answer: "bike", options: ["apple", "carrot", "bike"] },
  { question: "Has seeds inside, crunchy texture. Classify as:", answer: "apple", options: ["apple", "carrot", "bike"] },
  { question: "Rich in beta-carotene, root vegetable. Classify as:", answer: "carrot", options: ["apple", "carrot", "bike"] },
  { question: "Has handlebars and pedals. Classify as:", answer: "bike", options: ["apple", "carrot", "bike"] },
  { question: "Fruit, often red or green, grows on trees. Classify as:", answer: "apple", options: ["apple", "carrot", "bike"] },
  { question: "Orange vegetable used in salads. Classify as:", answer: "carrot", options: ["apple", "carrot", "bike"] },
  { question: "Eco-friendly transport, no fuel needed. Classify as:", answer: "bike", options: ["apple", "carrot", "bike"] },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQueue() {
  return shuffle(ALL_TREE_QUESTIONS);
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, scale: 0.96, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

export default function GamesPage() {
  const { user } = useAuth();
  const [round, setRound] = useState(0);
  const [dragResult, setDragResult] = useState({ animals: [], vehicles: [] });
  const [treeAnswer, setTreeAnswer] = useState("");
  const [sortValues, setSortValues] = useState(SORT_POOLS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [roundScore, setRoundScore] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [message, setMessage] = useState("");

  const [questionQueue, setQuestionQueue] = useState(() => buildQueue());
  const [queueIndex, setQueueIndex] = useState(0);
  const [usedSortIndexes, setUsedSortIndexes] = useState([0]);

  const treeRound = questionQueue[queueIndex];

  const gameOneScore = useMemo(() => {
    let score = 0;
    GAME_ITEMS.classify.forEach((item) => {
      if (dragResult[item.target].includes(item.id)) score += 1;
    });
    return score;
  }, [dragResult]);

  const onDrop = (bucket, ev) => {
    const itemId = ev.dataTransfer.getData("text/plain");
    if (!itemId) return;
    setDragResult((prev) => {
      const next = {
        animals: prev.animals.filter((id) => id !== itemId),
        vehicles: prev.vehicles.filter((id) => id !== itemId),
      };
      next[bucket] = [...next[bucket], itemId];
      return next;
    });
  };

  const submitRound = async () => {
    const gameTwo = treeAnswer === treeRound.answer ? 1 : 0;
    const sorted = [...sortValues].sort((a, b) => a - b).join(",");
    const gameThree = sortValues.join(",") === sorted ? 1 : 0;
    const score = gameOneScore + gameTwo + gameThree;
    const newTotal = totalScore + score;

    setRoundScore(score);
    setTotalScore(newTotal);
    setSubmitted(true);

    try {
      await saveGameScore(user.uid, "mini_games", newTotal);
      trackEvent("games_attempted", { uid: user.uid, score: newTotal, round: round + 1 });
    } catch (err) {
      console.error(err);
    }
  };

  const nextRound = () => {
    const next = round + 1;
    setRound(next);
    setDragResult({ animals: [], vehicles: [] });
    setTreeAnswer("");

    // Advance question queue, reshuffle when exhausted
    let nextQIndex = queueIndex + 1;
    let nextQueue = questionQueue;
    if (nextQIndex >= questionQueue.length) {
      nextQueue = buildQueue();
      nextQIndex = 0;
      setQuestionQueue(nextQueue);
    }
    setQueueIndex(nextQIndex);

    // Pick unused sort pool
    const available = SORT_POOLS.map((_, i) => i).filter((i) => !usedSortIndexes.includes(i));
    let nextSortIdx;
    if (available.length === 0) {
      // All used — reset
      nextSortIdx = Math.floor(Math.random() * SORT_POOLS.length);
      setUsedSortIndexes([nextSortIdx]);
    } else {
      nextSortIdx = available[Math.floor(Math.random() * available.length)];
      setUsedSortIndexes((prev) => [...prev, nextSortIdx]);
    }
    setSortValues(shuffle(SORT_POOLS[nextSortIdx]));

    setSubmitted(false);
    setRoundScore(null);
    setMessage("");
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">AIML Mini-Games</h1>
        <p className="page-subtitle">Play logic challenges to sharpen model intuition.</p>
      </header>

      <div className={styles.roundBadge}>
        <motion.span
          key={round}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Round {round + 1}
        </motion.span>
        <span className={styles.totalScore}>Total Score: {totalScore}</span>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key={`round-${round}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.roundWrap}
          >
            {/* Game 1 */}
            <article className={`card ${styles.card}`}>
              <h3>Game 1: Classify Objects (Drag & Drop)</h3>
              <div className={styles.dragGrid}>
                <div className={styles.items}>
                  {GAME_ITEMS.classify.map((item, i) => (
                    <motion.button
                      key={item.id}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      draggable
                      onDragStart={(ev) => ev.dataTransfer.setData("text/plain", item.id)}
                      className={styles.draggable}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                {["animals", "vehicles"].map((bucket) => (
                  <motion.div
                    key={bucket}
                    className={styles.bucket}
                    onDragOver={(ev) => ev.preventDefault()}
                    onDrop={(ev) => onDrop(bucket, ev)}
                    whileHover={{ borderColor: "#0f74ff", background: "#eef4ff" }}
                    transition={{ duration: 0.15 }}
                  >
                    <strong>{bucket}</strong>
                    <p>{dragResult[bucket].join(", ") || "Drop items here"}</p>
                  </motion.div>
                ))}
              </div>
            </article>

            {/* Game 2 */}
            <article className={`card ${styles.card}`}>
              <h3>Game 2: Decision Tree Choice</h3>
              <p>{treeRound.question}</p>
              <div className={styles.optionRow}>
                {treeRound.options.map((value, i) => (
                  <motion.label
                    key={value}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${styles.optionLabel} ${treeAnswer === value ? styles.optionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={treeAnswer === value}
                      onChange={(e) => setTreeAnswer(e.target.value)}
                    />
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </motion.label>
                ))}
              </div>
            </article>

            {/* Game 3 */}
            <article className={`card ${styles.card}`}>
              <h3>Game 3: Dataset Sorting Challenge</h3>
              <p>Sort these numbers ascending by clicking a number to move it right.</p>
              <div className={styles.sortRow}>
                <AnimatePresence mode="popLayout">
                  {sortValues.map((value, idx) => (
                    <motion.button
                      key={`${value}-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={styles.sortButton}
                      onClick={() => {
                        const next = [...sortValues];
                        if (idx < next.length - 1) {
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          setSortValues(next);
                        }
                      }}
                      whileHover={{ scale: 1.12, background: "#e3edff" }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                    >
                      {value}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              <button
                className="button-secondary"
                type="button"
                onClick={() => setSortValues(shuffle(sortValues))}
              >
                Shuffle
              </button>
            </article>

            <div className={styles.submitRow}>
              <motion.button
                className="button-primary"
                type="button"
                onClick={submitRound}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Submit Round {round + 1}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`result-${round}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`card ${styles.resultCard}`}
          >
            <motion.div
              className={styles.resultEmoji}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            >
              {roundScore >= 5 ? "🏆" : roundScore >= 3 ? "🎯" : "💡"}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Round {round + 1} Complete!
            </motion.h2>
            <motion.p
              className={styles.resultScore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You scored <strong>{roundScore}/6</strong> this round
            </motion.p>
            <motion.p
              className={styles.resultTotal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Total score: <strong>{totalScore}</strong>
            </motion.p>
            <motion.button
              className="button-primary"
              type="button"
              onClick={nextRound}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Round →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
