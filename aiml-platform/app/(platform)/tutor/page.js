"use client";

import { useState } from "react";
import styles from "./TutorPage.module.css";

export default function TutorPage() {
  const [topic, setTopic] = useState("Explain supervised vs unsupervised learning in simple words");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setResponse(data.answer || "No response");
    } catch (err) {
      console.error(err);
      setResponse("Could not connect to AI Tutor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">AI Tutor</h1>
        <p className="page-subtitle">Ask concept questions and get concise explanations.</p>
      </header>

      <article className={`card ${styles.card}`}>
        <label>
          Ask a question
          <textarea
            className="textarea"
            rows={4}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Question for AI Tutor"
          />
        </label>
        <button type="button" className="button-primary" onClick={askTutor} disabled={loading}>
          {loading ? "Thinking..." : "Ask AI Tutor"}
        </button>

        <div className={styles.answerBox}>
          <h3>Tutor Response</h3>
          <p>{response || "Your answer will appear here."}</p>
        </div>
      </article>
    </section>
  );
}
