"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ModulesPage.module.css";

/* SAMPLE DATA */
const ML_MODULES = [
  {
    id: "m1",
    title: "Introduction to Machine Learning",
    level: "Beginner",
    duration: "15 min",
    summary: "Understand the fundamentals of ML and how machines learn from data",
    highlights: ["What is ML?", "Types of Learning", "Real-world Applications"],
    icon: "🤖",
    color: "#6366f1",
  },
  {
    id: "m2",
    title: "Supervised Learning",
    level: "Beginner",
    duration: "20 min",
    summary: "Learn how algorithms learn from labeled data to make predictions",
    highlights: ["Classification", "Regression", "Training & Testing"],
    icon: "📊",
    color: "#8b5cf6",
  },
  {
    id: "m3",
    title: "Unsupervised Learning",
    level: "Intermediate",
    duration: "20 min",
    summary: "Discover patterns in data without labeled examples",
    highlights: ["Clustering", "Dimensionality Reduction", "Anomaly Detection"],
    icon: "🔍",
    color: "#ec4899",
  },
  {
    id: "m4",
    title: "Neural Networks",
    level: "Intermediate",
    duration: "25 min",
    summary: "Explore brain-inspired models that power deep learning",
    highlights: ["Neurons & Layers", "Activation Functions", "Backpropagation"],
    icon: "🧠",
    color: "#f59e0b",
  },
  {
    id: "m5",
    title: "Deep Learning",
    level: "Advanced",
    duration: "30 min",
    summary: "Master advanced neural network architectures and techniques",
    highlights: ["CNNs", "RNNs", "Transfer Learning"],
    icon: "⚡",
    color: "#10b981",
  },
  {
    id: "m6",
    title: "Natural Language Processing",
    level: "Advanced",
    duration: "25 min",
    summary: "Teach machines to understand and generate human language",
    highlights: ["Text Processing", "Sentiment Analysis", "Transformers"],
    icon: "💬",
    color: "#06b6d4",
  },
  {
    id: "m7",
    title: "Computer Vision",
    level: "Advanced",
    duration: "25 min",
    summary: "Enable machines to see and interpret visual information",
    highlights: ["Image Classification", "Object Detection", "Image Segmentation"],
    icon: "👁️",
    color: "#ef4444",
  },
];

const lessonStep = (title, text, example, question) => ({ title, text, example, question });

const LESSON_CONTENT = {
  m1: {
    label: "Foundations",
    sections: [
      lessonStep(
        "Lesson 1: How ML Works",
        "Machine learning is a loop: collect data, learn a pattern, make a prediction, and improve with feedback.",
        "A movie app learns that users who watch sci-fi often like sci-fi recommendations next.",
        "What is the first thing ML needs to learn from?"
      ),
      lessonStep(
        "Lesson 2: Real-world use cases",
        "Recommendation engines, fraud detection, spam filtering, and search ranking are common ML applications.",
        "A bank can flag unusual payments before money is lost.",
        "Which example is a real ML use case?"
      ),
      lessonStep(
        "Lesson 3: Try this",
        "Think about one task in your day that could be improved by predictions from data.",
        "A food app could predict your next favorite meal based on your order history.",
        "What is one daily task ML could improve?"
      ),
    ],
    checklist: ["Data becomes examples", "Patterns become predictions", "Feedback improves the model"],
    question: {
      prompt: "What is the main goal of ML?",
      answer: "Learning patterns from data to make predictions",
    },
  },
  m2: {
    label: "Supervised Workflow",
    sections: [
      lessonStep(
        "Lesson 1: Labeled data",
        "Supervised learning uses examples where the correct answer is already known.",
        "A dataset of emails marked as spam or not spam is labeled data.",
        "What makes data supervised?"
      ),
      lessonStep(
        "Lesson 2: Classification vs regression",
        "Classification predicts a category, while regression predicts a number.",
        "Classifying a photo as cat/dog is classification; predicting house price is regression.",
        "Which task predicts a number instead of a label?"
      ),
      lessonStep(
        "Lesson 3: Training and testing",
        "Training teaches the model; testing checks how well it generalizes to new data.",
        "You train on old exam questions and test on a fresh set of questions.",
        "Why do we test a model after training?"
      ),
    ],
    checklist: ["Needs labels", "Predicts classes or numbers", "Evaluated with test data"],
    question: {
      prompt: "Which task is supervised?",
      answer: "House price prediction",
    },
  },
  m3: {
    label: "Unsupervised Discovery",
    sections: [
      lessonStep(
        "Lesson 1: No labels required",
        "Unsupervised learning finds structure in raw data without labeled answers.",
        "A store has customer records without tags, and the model still finds patterns.",
        "Does unsupervised learning need labeled answers?"
      ),
      lessonStep(
        "Lesson 2: Clustering",
        "Clustering groups similar records together, like customer segments.",
        "An app groups people with similar shopping habits into one cluster.",
        "What does clustering do?"
      ),
      lessonStep(
        "Lesson 3: Dimensionality reduction",
        "This compresses data into fewer useful features while preserving meaning.",
        "A huge dataset can be compressed into fewer important signals for faster analysis.",
        "Why reduce dimensions in data?"
      ),
    ],
    checklist: ["Works on unlabeled data", "Finds hidden patterns", "Useful for grouping and compression"],
    question: {
      prompt: "Which task is unsupervised?",
      answer: "Customer clustering",
    },
  },
  m4: {
    label: "Neural Network Basics",
    sections: [
      lessonStep(
        "Lesson 1: Neurons and layers",
        "Neural networks stack layers of simple units that transform inputs into predictions.",
        "An image passes through several layers before the model decides what it is.",
        "What do layers do in a neural network?"
      ),
      lessonStep(
        "Lesson 2: Activation functions",
        "Activations add non-linearity so the network can learn complex patterns.",
        "Without activation, the network would behave too simply for complex data.",
        "Why are activation functions important?"
      ),
      lessonStep(
        "Lesson 3: Backpropagation",
        "Backpropagation updates weights based on error so the network improves over time.",
        "The model checks its mistake and shifts weights to reduce the next error.",
        "What does backpropagation change in the model?"
      ),
    ],
    checklist: ["Layers transform data", "Activations add non-linearity", "Weights update through error"],
    question: {
      prompt: "What does an activation function do?",
      answer: "Adds non-linearity to the network",
    },
  },
  m5: {
    label: "Deep Learning",
    sections: [
      lessonStep(
        "Lesson 1: Bigger networks",
        "Deep learning uses more layers to model richer patterns in large datasets.",
        "A deeper model can detect both simple edges and complex shapes in an image.",
        "What makes deep learning different from simpler ML?"
      ),
      lessonStep(
        "Lesson 2: CNNs and RNNs",
        "CNNs are strong for images; RNNs were designed for sequences like text or time series.",
        "A CNN can spot faces in photos while an RNN can read text one token at a time.",
        "Which network type is useful for images?"
      ),
      lessonStep(
        "Lesson 3: Transfer learning",
        "A pre-trained model can be adapted to a new task with much less data.",
        "A model trained on millions of images is reused for your smaller custom image project.",
        "Why is transfer learning useful?"
      ),
    ],
    checklist: ["Many layers", "Specialized architectures", "Can reuse pre-trained knowledge"],
    question: {
      prompt: "Which model type is commonly used for images?",
      answer: "CNNs",
    },
  },
  m6: {
    label: "NLP Basics",
    sections: [
      lessonStep(
        "Lesson 1: Text processing",
        "NLP turns raw text into tokens, features, or embeddings a model can understand.",
        "A sentence is broken into words or tokens before the model reads it.",
        "What does NLP do to raw text first?"
      ),
      lessonStep(
        "Lesson 2: Sentiment and intent",
        "Models can classify sentiment, detect intent, and summarize meaning from language.",
        "A chatbot can tell whether a user is happy, angry, or asking for help.",
        "What is a common task in NLP?"
      ),
      lessonStep(
        "Lesson 3: Transformers",
        "Transformers power modern language systems with attention-based context understanding.",
        "A transformer looks at the whole sentence to understand the meaning of each word.",
        "Why are transformers powerful for language?"
      ),
    ],
    checklist: ["Text to tokens", "Understands intent", "Transformers are modern NLP models"],
    question: {
      prompt: "What is a common NLP task?",
      answer: "Sentiment analysis",
    },
  },
  m7: {
    label: "Vision Systems",
    sections: [
      lessonStep(
        "Lesson 1: Pixel understanding",
        "Computer vision teaches models to interpret image pixels and detect shapes or objects.",
        "The model sees an image as a grid of colored pixels.",
        "What does a vision model read first?"
      ),
      lessonStep(
        "Lesson 2: Classification vs detection",
        "Classification names the whole image; detection finds where objects appear.",
        "A cat photo can be labeled 'cat' or also have a box around the cat.",
        "What is the difference between classification and detection?"
      ),
      lessonStep(
        "Lesson 3: Practical impact",
        "Vision models power quality inspection, medical imaging, and self-driving systems.",
        "A factory camera checks if a product has a defect before shipping.",
        "Where can computer vision be used?"
      ),
    ],
    checklist: ["Works on pixels", "Can classify or detect", "Used in many real systems"],
    question: {
      prompt: "What does image classification do?",
      answer: "Assigns a label to the whole image",
    },
  },
};

export default function ModulesPage() {
  const [completed, setCompleted] = useState([]);
  const [busyModule, setBusyModule] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [lessonConfirmed, setLessonConfirmed] = useState(false);

  const completedSet = new Set(completed);

  const activeLesson = selectedModule
    ? LESSON_CONTENT[selectedModule.id] || {
        label: "Learning Path",
        sections: [
          lessonStep(
            "Lesson 1: Understand the idea",
            selectedModule.summary,
            `A simple example related to ${selectedModule.title.toLowerCase()}.`,
            `What is the core idea of ${selectedModule.title}?`
          ),
          lessonStep(
            "Lesson 2: Focus on the highlights",
            selectedModule.highlights.join(" • "),
            `One practical example of ${selectedModule.title.toLowerCase()} in action.`,
            `Which part of ${selectedModule.title} matters most?`
          ),
          lessonStep(
            "Lesson 3: Apply what you learned",
            "Use the playground, quiz, or games to reinforce this module.",
            `Try a hands-on example after reading ${selectedModule.title}.`,
            `How will you apply this topic today?`
          ),
        ],
        checklist: selectedModule.highlights,
        question: {
          prompt: `What is the main idea of ${selectedModule.title}?`,
          answer: selectedModule.summary,
        },
      }
    : null;

  const markDone = (id) => {
    setBusyModule(id);
    setTimeout(() => {
      setCompleted((prev) => [...prev, id]);
      setBusyModule("");
    }, 800);
  };

  const openLesson = (module) => {
    setSelectedModule(module);
    setLessonStep(0);
    setLessonConfirmed(false);
  };

  const closeLesson = () => {
    setSelectedModule(null);
    setLessonStep(0);
    setLessonConfirmed(false);
  };

  const totalLessonSteps = activeLesson?.sections?.length || 0;
  const isLastStep = lessonStep >= totalLessonSteps - 1;

  return (
    <div className={styles.pageWrap}>
      {/* HERO */}
      <motion.header 
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.heroTitle}>
          Master <span className={styles.gradient}>AI & Machine Learning</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Interactive modules designed to take you from beginner to expert
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{ML_MODULES.length}</span>
            <span className={styles.statLabel}>Modules</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{completed.length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{Math.round((completed.length / ML_MODULES.length) * 100)}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </motion.header>

      {/* PROGRESS BAR */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / ML_MODULES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* MODULES GRID */}
      <div className={styles.modulesGrid}>
        {ML_MODULES.map((module, idx) => {
          const done = completedSet.has(module.id);

          return (
            <motion.article
              key={module.id}
              className={`${styles.moduleCard} ${done ? styles.completed : ""}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => openLesson(module)}
            >
              {/* Status Badge */}
              {done && <div className={styles.completedBadge}>✓ Completed</div>}
              
              {/* Icon */}
              <div className={styles.moduleIcon} style={{ background: `${module.color}15` }}>
                <span style={{ fontSize: "2.5rem" }}>{module.icon}</span>
              </div>

              {/* Content */}
              <div className={styles.moduleContent}>
                <div className={styles.moduleHeader}>
                  <h3 className={styles.moduleTitle}>{module.title}</h3>
                  <div className={styles.moduleMeta}>
                    <span className={styles.levelBadge} style={{ background: `${module.color}20`, color: module.color }}>
                      {module.level}
                    </span>
                    <span className={styles.duration}>⏱️ {module.duration}</span>
                  </div>
                </div>

                <p className={styles.moduleSummary}>{module.summary}</p>

                {/* Highlights */}
                <ul className={styles.highlights}>
                  {module.highlights.map((item) => (
                    <li key={item}>
                      <span className={styles.checkmark}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                className={done ? styles.btnCompleted : styles.btnStart}
                disabled={busyModule === module.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openLesson(module);
                }}
                style={{ background: done ? "#10b981" : module.color }}
              >
                {done ? "✓ Completed" : busyModule === module.id ? "Saving..." : "Start Learning"}
              </button>
            </motion.article>
          );
        })}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <motion.div 
          className={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedModule(null)}
        >
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={closeLesson}>✕</button>
            <div className={styles.modalIcon} style={{ background: `${selectedModule.color}15` }}>
              <span style={{ fontSize: "3rem" }}>{selectedModule.icon}</span>
            </div>
            <h2>{selectedModule.title}</h2>
            <p className={styles.modalSummary}>{selectedModule.summary}</p>
            <div className={styles.modalMeta}>
              <span className={styles.levelBadge} style={{ background: `${selectedModule.color}20`, color: selectedModule.color }}>
                {selectedModule.level}
              </span>
              <span className={styles.duration}>⏱️ {selectedModule.duration}</span>
            </div>
            <div className={styles.lessonProgress}>
              {activeLesson.sections.map((section, index) => (
                <button
                  key={section.title}
                  type="button"
                  className={index === lessonStep ? styles.lessonStepActive : styles.lessonStep}
                  onClick={() => setLessonStep(index)}
                >
                  <span>{index + 1}</span>
                  {section.title}
                </button>
              ))}
            </div>

            <article className={styles.lessonCard}>
              <p className={styles.lessonLabel}>{activeLesson.label}</p>
              <p className={styles.lessonStepText}>
                Lesson {lessonStep + 1} of {totalLessonSteps}
              </p>
              <h4>{activeLesson.sections[lessonStep].title}</h4>
              <p>{activeLesson.sections[lessonStep].text}</p>
            </article>

            <section className={styles.lessonBlock}>
              <h4>Example</h4>
              <div className={styles.exampleBox}>
                {activeLesson.sections[lessonStep].example}
              </div>
            </section>

            <section className={styles.lessonBlock}>
              <h4>Mini question</h4>
              <div className={styles.questionBox}>
                <p>{activeLesson.sections[lessonStep].question}</p>
                <small>Think it through before moving to the next lesson.</small>
              </div>
            </section>

            <section className={styles.lessonBlock}>
              <h4>What you&apos;ll learn</h4>
              <ul className={styles.modalHighlights}>
                {selectedModule.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.lessonBlock}>
              <h4>Quick checkpoint</h4>
              <p>{activeLesson.question.prompt}</p>
              <div className={styles.checklist}>
                {activeLesson.checklist.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <div className={styles.lessonActions}>
              <button
                type="button"
                className={styles.lessonSecondary}
                onClick={() => setLessonStep((prev) => Math.max(prev - 1, 0))}
                disabled={lessonStep === 0}
              >
                Previous
              </button>
              {!isLastStep ? (
                <button
                  type="button"
                  className={styles.lessonPrimary}
                  style={{ background: selectedModule.color }}
                  onClick={() => setLessonStep((prev) => Math.min(prev + 1, totalLessonSteps - 1))}
                >
                  Next lesson
                </button>
              ) : (
                <button
                  className={styles.btnStartModal}
                  style={{ background: selectedModule.color }}
                  onClick={() => {
                    setLessonConfirmed(true);
                    markDone(selectedModule.id);
                    closeLesson();
                  }}
                >
                  {lessonConfirmed ? "✓ Ready" : "Mark as Completed"}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
