"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const [imageChoice, setImageChoice] = useState(IMAGE_SCENARIOS[0].id);
  const [imageResult, setImageResult] = useState(null);

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

  const analyzeSpam = () => {
    const normalized = spamInput.toLowerCase();
    const matches = SPAM_KEYWORDS.filter((word) => normalized.includes(word));
    const score = Math.min(98, 18 + matches.length * 20 + (normalized.includes("!") ? 8 : 0));
    const verdict = score >= 50 ? "Spam" : "Legit message";

    setSpamResult({
      score,
      verdict,
      matches,
    });
  };

  const classifyImage = () => {
    const selected = IMAGE_SCENARIOS.find((item) => item.id === imageChoice) || IMAGE_SCENARIOS[0];
    setImageResult(selected);
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">Coding Playground</h1>
        <p className="page-subtitle">Run Python in-browser and test real-world AI simulation demos.</p>
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
            <ul>
              {dataset.slice(0, 8).map((row) => (
                <li key={row.id}>
                  Feature: {row.feature} | Label: {row.label}
                </li>
              ))}
            </ul>
          )}
        </motion.article>
      </div>

      <div className={styles.simulationGrid}>
        <article className={`card ${styles.simulationCard}`}>
          <h3>Spam Detection Demo</h3>
          <p>Try a message and see how a simple classifier flags spam-like language.</p>
          <textarea
            className="textarea"
            rows={4}
            value={spamInput}
            onChange={(e) => setSpamInput(e.target.value)}
            aria-label="Spam detection message input"
          />
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={analyzeSpam}>
              Analyze Message
            </button>
          </div>
          {spamResult && (
            <div className={styles.simulationResult}>
              <strong>{spamResult.verdict}</strong>
              <span>Spam score: {spamResult.score}%</span>
              <p>{spamResult.matches.length ? `Matched keywords: ${spamResult.matches.join(", ")}` : "No spam keywords matched."}</p>
            </div>
          )}
        </article>

        <article className={`card ${styles.simulationCard}`}>
          <h3>Image Classification Demo</h3>
          <p>Pick a sample image and preview a lightweight classifier decision.</p>
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
            <button type="button" className="button-primary" onClick={classifyImage}>
              Run Classifier
            </button>
          </div>
          {imageResult && (
            <div className={styles.simulationResult}>
              <strong>{imageResult.guess}</strong>
              <span>Confidence: {imageResult.confidence}%</span>
              <p>{imageResult.explanation}</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
