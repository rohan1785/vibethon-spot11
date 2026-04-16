"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PYTHON_SNIPPET } from "@/lib/sampleData";
import styles from "./PlaygroundPage.module.css";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

let pyodideLoaderPromise = null;

async function loadPyodideRuntime() {
  if (typeof window === "undefined") {
    throw new Error("Python runtime is only available in the browser.");
  }

  if (window.pyodide) {
    return window.pyodide;
  }

  if (!pyodideLoaderPromise) {
    pyodideLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-pyodide-loader="true"]');
      const script = existingScript || document.createElement("script");

      script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
      script.async = true;
      script.dataset.pyodideLoader = "true";
      script.onload = async () => {
        try {
          const runtime = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
          window.pyodide = runtime;
          resolve(runtime);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error("Failed to load the Python runtime."));

      if (!existingScript) {
        document.head.appendChild(script);
      }
    });
  }

  return pyodideLoaderPromise;
}

const SPAM_KEYWORDS = ["free", "win", "urgent", "limited", "claim", "prize", "offer", "cash"];
const IMAGE_SCENARIOS = [
  {
    id: "cat",
    label: "Cat photo",
    guess: "Animal",
    confidence: 94,
    explanation: "Soft edges, whiskers, and a compact face shape point to a pet image.",
  },
  {
    id: "car",
    label: "Street car photo",
    guess: "Vehicle",
    confidence: 91,
    explanation: "Wheels, body geometry, and road context are strong vehicle cues.",
  },
  {
    id: "bike",
    label: "Bike image",
    guess: "Vehicle",
    confidence: 86,
    explanation: "Two wheels, handlebars, and frame silhouette match a bicycle category.",
  },
];

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [code, setCode] = useState(PYTHON_SNIPPET);
  const [output, setOutput] = useState("");
  const [runtimeState, setRuntimeState] = useState("Ready to execute Python code in the browser.");
  const [running, setRunning] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [loadingSet, setLoadingSet] = useState(false);
  const [spamInput, setSpamInput] = useState("Claim your free prize now and win cash today!");
  const [spamResult, setSpamResult] = useState(null);
  const [spamAnalyzing, setSpamAnalyzing] = useState(false);
  const [spamSteps, setSpamSteps] = useState([]);
  const [imageChoice, setImageChoice] = useState(IMAGE_SCENARIOS[0].id);
  const [imageResult, setImageResult] = useState(null);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const [imageSteps, setImageSteps] = useState([]);

  const runCode = async () => {
    setRunning(true);
    setRuntimeState("Loading Python runtime...");

    try {
      const pyodide = await loadPyodideRuntime();
      const stdout = [];
      const stderr = [];

      pyodide.setStdout({
        batched: (text) => stdout.push(text),
      });
      pyodide.setStderr({
        batched: (text) => stderr.push(text),
      });

      const result = await pyodide.runPythonAsync(code);
      const chunks = [
        `User: ${user?.email || "demo"}`,
        ...stdout,
        ...(result !== undefined && result !== null && String(result).trim() ? [String(result)] : []),
      ];

      if (stderr.length) {
        chunks.push(...stderr);
      }

      setOutput(chunks.join("\n").trim() || "Execution complete.");
      setRuntimeState("Python executed successfully in-browser.");
    } catch (error) {
      console.error(error);
      setOutput(`Execution failed: ${error.message}`);
      setRuntimeState("Python runtime failed to start.");
    } finally {
      setRunning(false);
    }
  };

  const loadDataset = async () => {
    setLoadingSet(true);
    try {
      const res = await fetch("/api/dataset");
      const data = await res.json();
      setDataset(data.points || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load dataset API.");
    } finally {
      setLoadingSet(false);
    }
  };

  const analyzeSpam = async () => {
    setSpamAnalyzing(true);
    setSpamResult(null);
    setSpamSteps([]);

    const normalized = spamInput.toLowerCase();
    const matches = SPAM_KEYWORDS.filter((word) => normalized.includes(word));

    // Animated steps
    const steps = [
      { id: 1, text: "Tokenizing message...", delay: 300 },
      { id: 2, text: "Extracting features...", delay: 600 },
      { id: 3, text: `Found ${matches.length} spam keywords`, delay: 900 },
      { id: 4, text: "Computing spam score...", delay: 1200 },
      { id: 5, text: "Classification complete!", delay: 1500 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setSpamSteps((prev) => [...prev, step]);
    }

    const score = Math.min(98, 18 + matches.length * 20 + (normalized.includes("!") ? 8 : 0));
    const verdict = score >= 50 ? "Spam" : "Legit message";

    await new Promise((resolve) => setTimeout(resolve, 300));
    setSpamResult({
      score,
      verdict,
      matches,
    });
    setSpamAnalyzing(false);
  };

  const classifyImage = async () => {
    setImageAnalyzing(true);
    setImageResult(null);
    setImageSteps([]);

    const selected = IMAGE_SCENARIOS.find((item) => item.id === imageChoice) || IMAGE_SCENARIOS[0];

    // Animated steps
    const steps = [
      { id: 1, text: "Loading image data...", delay: 300 },
      { id: 2, text: "Preprocessing pixels...", delay: 600 },
      { id: 3, text: "Running CNN layers...", delay: 900 },
      { id: 4, text: "Computing probabilities...", delay: 1200 },
      { id: 5, text: `Detected: ${selected.guess}`, delay: 1500 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setImageSteps((prev) => [...prev, step]);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    setImageResult(selected);
    setImageAnalyzing(false);
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">Coding Playground</h1>
        <p className="page-subtitle">Run Python in-browser and watch AI algorithms work in real-time.</p>
      </header>

      <div className={styles.grid}>
        <article className={`card ${styles.editorCard}`}>
          <h3>Python Editor</h3>
          <textarea
            className="textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            aria-label="Python code editor"
          />
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={runCode} disabled={running}>
              {running ? "Running..." : "Run Code"}
            </button>
            <button type="button" className="button-secondary" onClick={loadDataset} disabled={loadingSet}>
              {loadingSet ? "Loading API..." : "Load Dataset API"}
            </button>
          </div>
          <p className={styles.runtimeState}>{runtimeState}</p>
        </article>

        <motion.article className={`card ${styles.outputCard}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Output Console</h3>
          <pre>{output || "Click Run Code to see simulation output."}</pre>
          <h4>Dataset API Preview</h4>
          {dataset.length === 0 ? (
            <p>No dataset loaded yet.</p>
          ) : (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {dataset.slice(0, 8).map((row, idx) => (
                <motion.li
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  Feature: {row.feature} | Label: {row.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.article>
      </div>

      <div className={styles.simulationGrid}>
        {/* SPAM DETECTION WITH ANIMATION */}
        <article className={`card ${styles.simulationCard}`}>
          <h3>🔍 Spam Detection Demo</h3>
          <p>Watch how the algorithm analyzes text for spam patterns.</p>
          <textarea
            className="textarea"
            rows={4}
            value={spamInput}
            onChange={(e) => setSpamInput(e.target.value)}
            aria-label="Spam detection message input"
          />
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={analyzeSpam} disabled={spamAnalyzing}>
              {spamAnalyzing ? "Analyzing..." : "Analyze Message"}
            </button>
          </div>

          {/* Animation Steps */}
          <AnimatePresence>
            {spamSteps.length > 0 && (
              <motion.div className={styles.processingSteps}>
                {spamSteps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    className={styles.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <motion.div
                      className={styles.stepIcon}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: spamAnalyzing ? Infinity : 0 }}
                    >
                      {idx === spamSteps.length - 1 && !spamAnalyzing ? "✓" : "⚙️"}
                    </motion.div>
                    <span>{step.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result with Animation */}
          <AnimatePresence>
            {spamResult && (
              <motion.div
                className={styles.simulationResult}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className={styles.resultHeader}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <strong>{spamResult.verdict}</strong>
                  <motion.div
                    className={styles.scoreBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${spamResult.score}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      background: spamResult.score >= 50 ? "#ef4444" : "#10b981",
                    }}
                  />
                  <span>Spam score: {spamResult.score}%</span>
                </motion.div>
                <p>
                  {spamResult.matches.length
                    ? `Matched keywords: ${spamResult.matches.join(", ")}`
                    : "No spam keywords matched."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </article>

        {/* IMAGE CLASSIFICATION WITH ANIMATION */}
        <article className={`card ${styles.simulationCard}`}>
          <h3>🖼️ Image Classification Demo</h3>
          <p>See how a neural network processes and classifies images.</p>
          <div className={styles.choiceGrid}>
            {IMAGE_SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={imageChoice === item.id ? styles.choiceActive : styles.choiceButton}
                onClick={() => setImageChoice(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={classifyImage} disabled={imageAnalyzing}>
              {imageAnalyzing ? "Classifying..." : "Run Classifier"}
            </button>
          </div>

          {/* Animation Steps */}
          <AnimatePresence>
            {imageSteps.length > 0 && (
              <motion.div className={styles.processingSteps}>
                {imageSteps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    className={styles.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <motion.div
                      className={styles.stepIcon}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: imageAnalyzing ? Infinity : 0 }}
                    >
                      {idx === imageSteps.length - 1 && !imageAnalyzing ? "✓" : "⚙️"}
                    </motion.div>
                    <span>{step.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result with Animation */}
          <AnimatePresence>
            {imageResult && (
              <motion.div
                className={styles.simulationResult}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className={styles.resultHeader}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <strong>{imageResult.guess}</strong>
                  <motion.div
                    className={styles.scoreBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${imageResult.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ background: "#6366f1" }}
                  />
                  <span>Confidence: {imageResult.confidence}%</span>
                </motion.div>
                <p>{imageResult.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </div>
    </section>
  );
}
