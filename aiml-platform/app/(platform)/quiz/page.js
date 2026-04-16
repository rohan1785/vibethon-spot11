"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveQuizAttempt } from "@/lib/firestoreService";
import { trackEvent } from "@/lib/analytics";
import { ML_MODULES, QUIZ_BANK } from "@/lib/sampleData";
import styles from "./QuizPage.module.css";

export default function QuizPage() {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState(ML_MODULES[0].id);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = useMemo(() => QUIZ_BANK[selectedModule] || [], [selectedModule]);

  const submitQuiz = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (Number(answers[q.id]) === q.answer) correct += 1;
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    setResult({ scorePercent, correct, total: questions.length });

    try {
      await saveQuizAttempt(user.uid, selectedModule, scorePercent);
      trackEvent("quiz_attempt", { uid: user.uid, moduleId: selectedModule, scorePercent });
    } catch (err) {
      console.error(err);
      alert("Unable to save score");
    }
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">Quiz Arena</h1>
        <p className="page-subtitle">Get instant feedback and save your module scores.</p>
      </header>

      <article className={`card ${styles.card}`}>
        <label>
          Select module
          <select className="select" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
            {ML_MODULES.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.title}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.questions}>
          {questions.map((q, idx) => (
            <div key={q.id} className={styles.questionBlock}>
              <h4>
                {idx + 1}. {q.question}
              </h4>
              <div className={styles.optionCol}>
                {q.options.map((opt, optIndex) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={q.id}
                      value={optIndex}
                      checked={String(answers[q.id]) === String(optIndex)}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="button-primary" type="button" onClick={submitQuiz}>
          Submit Quiz
        </button>

        {result && (
          <div className={styles.result}>
            <strong>
              Score: {result.scorePercent}% ({result.correct}/{result.total})
            </strong>
            <p>{result.scorePercent >= 70 ? "Great work!" : "Review module and retry."}</p>
          </div>
        )}
      </article>
    </section>
  );
}
