export const ML_MODULES = [
  {
    id: "what-is-ml",
    title: "What is Machine Learning?",
    level: "Beginner",
    summary:
      "Machine Learning allows systems to learn patterns from data and improve without being explicitly programmed.",
    highlights: [
      "Data -> Pattern -> Prediction loop",
      "Training vs inference",
      "Real-world examples in recommendation and fraud detection",
    ],
  },
  {
    id: "supervised-unsupervised",
    title: "Supervised vs Unsupervised Learning",
    level: "Beginner",
    summary:
      "Supervised learning uses labeled examples, while unsupervised learning finds hidden structure in unlabeled data.",
    highlights: [
      "Classification and regression",
      "Clustering and dimensionality reduction",
      "When to choose each paradigm",
    ],
  },
  {
    id: "neural-network-basics",
    title: "Neural Network Basics",
    level: "Intermediate",
    summary:
      "Neural networks are layered mathematical models that learn representations through weighted connections.",
    highlights: [
      "Neurons, weights, and activation functions",
      "Forward pass and loss",
      "Backpropagation intuition",
    ],
  },
];

export const QUIZ_BANK = {
  "what-is-ml": [
    {
      id: "q1",
      question: "What is the core goal of ML?",
      options: [
        "Replacing all software with AI",
        "Learning patterns from data to make predictions",
        "Only storing big datasets",
        "Building hardware for GPUs",
      ],
      answer: 1,
    },
    {
      id: "q2",
      question: "Inference in ML means:",
      options: ["Collecting labels", "Training the model", "Using trained model to predict", "Removing outliers"],
      answer: 2,
    },
  ],
  "supervised-unsupervised": [
    {
      id: "q3",
      question: "Which task is unsupervised?",
      options: ["Spam detection", "House price prediction", "Customer clustering", "Sentiment classification"],
      answer: 2,
    },
    {
      id: "q4",
      question: "Supervised learning requires:",
      options: ["Unlabeled data", "Labeled examples", "No data", "Only images"],
      answer: 1,
    },
  ],
  "neural-network-basics": [
    {
      id: "q5",
      question: "What does an activation function do?",
      options: [
        "Deletes bad features",
        "Adds non-linearity to the network",
        "Sorts dataset by labels",
        "Stores model weights",
      ],
      answer: 1,
    },
    {
      id: "q6",
      question: "Backpropagation is primarily used to:",
      options: ["Visualize data", "Update model weights", "Load datasets", "Normalize outputs"],
      answer: 1,
    },
  ],
};

export const PYTHON_SNIPPET = `# Binary classification demo (simulated)\nimport random\n\nfeatures = [2.3, 3.1, 1.2, 5.6, 4.8]\nthreshold = 3.0\npredictions = [1 if x > threshold else 0 for x in features]\n\nprint('Input features:', features)\nprint('Predictions:', predictions)\naccuracy = round(0.84 + random.random() * 0.1, 2)\nprint('Validation accuracy:', accuracy)`;

export const GAME_ITEMS = {
  classify: [
    { id: "img-1", label: "Cat", target: "animals" },
    { id: "img-2", label: "Car", target: "vehicles" },
    { id: "img-3", label: "Dog", target: "animals" },
    { id: "img-4", label: "Bike", target: "vehicles" },
  ],
};

export const HEATMAP_DAYS = 84;
