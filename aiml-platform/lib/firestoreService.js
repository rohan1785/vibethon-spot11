import {
  collection,
  arrayUnion,
  getDocs,
  doc,
  getDoc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { HEATMAP_DAYS, ML_MODULES } from "@/lib/sampleData";

const STORAGE_KEY = "aiml_nexus_demo_user_data";

export const BADGE_DEFINITIONS = [
  {
    id: "starter",
    label: "Starter",
    description: "Complete your first module.",
  },
  {
    id: "quiz-sprinter",
    label: "Quiz Sprinter",
    description: "Finish a quiz attempt.",
  },
  {
    id: "streak-3",
    label: "3-Day Streak",
    description: "Learn on three days in a row.",
  },
  {
    id: "builder",
    label: "Builder",
    description: "Reach 100 total points.",
  },
  {
    id: "mentor",
    label: "Mentor",
    description: "Reach 300 total points.",
  },
  {
    id: "explorer",
    label: "Explorer",
    description: "Complete every learning module.",
  },
];

const DEMO_LEADERBOARD = [
  {
    uid: "demo-1",
    name: "Aarav Mehta",
    totalPoints: 320,
    currentStreak: 9,
    longestStreak: 14,
    badgeIds: ["starter", "quiz-sprinter", "streak-3", "builder", "explorer"],
  },
  {
    uid: "demo-2",
    name: "Nisha Rao",
    totalPoints: 286,
    currentStreak: 6,
    longestStreak: 11,
    badgeIds: ["starter", "quiz-sprinter", "streak-3", "builder"],
  },
  {
    uid: "demo-3",
    name: "Kabir Shah",
    totalPoints: 240,
    currentStreak: 4,
    longestStreak: 8,
    badgeIds: ["starter", "quiz-sprinter", "streak-3"],
  },
  {
    uid: "demo-4",
    name: "Mira Patil",
    totalPoints: 195,
    currentStreak: 5,
    longestStreak: 7,
    badgeIds: ["starter", "quiz-sprinter"],
  },
];

function cloneMap(map = {}) {
  return Object.fromEntries(Object.entries(map || {}));
}

function normalizeData(data = {}) {
  const base = defaultUserData(data.skillLevel);
  const merged = {
    ...base,
    ...data,
    completedModules: Array.isArray(data.completedModules) ? [...new Set(data.completedModules)] : base.completedModules,
    quizScores: data.quizScores ? { ...data.quizScores } : base.quizScores,
    quizAttempts: Array.isArray(data.quizAttempts) ? [...data.quizAttempts] : base.quizAttempts,
    gameScores: data.gameScores ? { ...data.gameScores } : base.gameScores,
    activityMap: data.activityMap ? cloneMap(data.activityMap) : base.activityMap,
    badgeIds: Array.isArray(data.badgeIds) ? [...data.badgeIds] : base.badgeIds,
  };

  return merged;
}

function dayFromKey(key) {
  return new Date(`${key}T00:00:00Z`);
}

function shiftDayKey(key, delta) {
  const next = dayFromKey(key);
  next.setUTCDate(next.getUTCDate() + delta);
  return next.toISOString().slice(0, 10);
}

function calculateCurrentStreak(activityMap = {}) {
  let streak = 0;
  let cursor = todayKey();

  while ((activityMap[cursor] || 0) > 0) {
    streak += 1;
    cursor = shiftDayKey(cursor, -1);
  }

  return streak;
}

function calculateLongestStreak(activityMap = {}) {
  const activeDays = Object.entries(activityMap)
    .filter(([, count]) => count > 0)
    .map(([key]) => key)
    .sort();

  let longest = 0;
  let current = 0;
  let previousKey = null;

  activeDays.forEach((key) => {
    if (!previousKey) {
      current = 1;
    } else {
      const gap = Math.round((dayFromKey(key) - dayFromKey(previousKey)) / 86400000);
      current = gap === 1 ? current + 1 : 1;
    }

    longest = Math.max(longest, current);
    previousKey = key;
  });

  return longest;
}

function deriveBadgeIds(data = {}) {
  const unlocked = [];

  if ((data.completedModules || []).length >= 1) unlocked.push("starter");
  if ((data.quizAttempts || []).length >= 1) unlocked.push("quiz-sprinter");
  if ((data.currentStreak || 0) >= 3) unlocked.push("streak-3");
  if ((data.totalPoints || 0) >= 100) unlocked.push("builder");
  if ((data.totalPoints || 0) >= 300) unlocked.push("mentor");
  if ((data.completedModules || []).length >= ML_MODULES.length) unlocked.push("explorer");

  return unlocked;
}

function applyRewardState(data = {}) {
  const normalized = normalizeData(data);
  const currentStreak = calculateCurrentStreak(normalized.activityMap);
  const longestStreak = Math.max(normalized.longestStreak || 0, calculateLongestStreak(normalized.activityMap), currentStreak);
  const badgeIds = deriveBadgeIds({ ...normalized, currentStreak, longestStreak });
  const progressPercent = recalcProgress({ ...normalized, currentStreak, longestStreak, badgeIds });

  return {
    ...normalized,
    currentStreak,
    longestStreak,
    badgeIds,
    progressPercent,
    rewardPoints: normalized.totalPoints || 0,
  };
}

async function syncProgressState(ref, data) {
  const nextState = applyRewardState(data);

  await updateDoc(ref, {
    progressPercent: recalcProgress(nextState),
    currentStreak: nextState.currentStreak,
    longestStreak: nextState.longestStreak,
    badgeIds: nextState.badgeIds,
    rewardPoints: nextState.rewardPoints,
    updatedAt: serverTimestamp(),
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultUserData(skillLevel = "Beginner") {
  return {
    skillLevel,
    completedModules: [],
    quizScores: {},
    quizAttempts: [],
    progressPercent: 0,
    totalPoints: 0,
    gameScores: {},
    activityMap: {},
    currentStreak: 0,
    longestStreak: 0,
    badgeIds: [],
    rewardPoints: 0,
    updatedAt: new Date().toISOString(),
  };
}

function recalcProgress(data) {
  const moduleWeight = Math.round((data.completedModules.length / ML_MODULES.length) * 60);
  const quizEntries = Object.values(data.quizScores);
  const quizAverage = quizEntries.length
    ? Math.round(quizEntries.reduce((sum, score) => sum + score, 0) / quizEntries.length)
    : 0;
  return Math.min(100, moduleWeight + Math.round(quizAverage * 0.4));
}

function readLocalData() {
  if (typeof window === "undefined") {
    return defaultUserData();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = defaultUserData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return applyRewardState(JSON.parse(raw));
}

function writeLocalData(nextValue) {
  if (typeof window === "undefined") {
    return;
  }
  const nextData = applyRewardState(nextValue);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  window.dispatchEvent(new CustomEvent("aiml-data-update", { detail: nextData }));
}

export async function ensureUserDocument(uid, payload = {}) {
  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...defaultUserData(payload.skillLevel),
        email: payload.email || "",
        createdAt: serverTimestamp(),
      });
    } else {
      await syncProgressState(ref, snap.data());
    }
    return;
  }

  const local = readLocalData();
  writeLocalData({ ...local, skillLevel: payload.skillLevel || local.skillLevel });
}

export function subscribeToUserDocument(uid, callback) {
  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(defaultUserData());
        return;
      }
      callback(applyRewardState(snap.data()));
    });
  }

  const emit = () => callback(readLocalData());
  emit();
  window.addEventListener("aiml-data-update", emit);
  return () => window.removeEventListener("aiml-data-update", emit);
}

export async function completeModule(uid, moduleId) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      completedModules: arrayUnion(moduleId),
      totalPoints: increment(25),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : defaultUserData();
    await syncProgressState(ref, current);
    return;
  }

  const local = readLocalData();
  if (!local.completedModules.includes(moduleId)) {
    local.completedModules.push(moduleId);
  }
  local.totalPoints += 25;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export async function saveQuizAttempt(uid, moduleId, scorePercent) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`quizScores.${moduleId}`]: scorePercent,
      quizAttempts: arrayUnion({
        moduleId,
        scorePercent,
        at: new Date().toISOString(),
      }),
      totalPoints: increment(15),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : defaultUserData();
    await syncProgressState(ref, current);
    return;
  }

  const local = readLocalData();
  local.quizScores[moduleId] = scorePercent;
  local.quizAttempts.push({ moduleId, scorePercent, at: new Date().toISOString() });
  local.totalPoints += 15;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export async function saveGameScore(uid, gameId, score) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`gameScores.${gameId}`]: score,
      totalPoints: increment(10),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : defaultUserData();
    await syncProgressState(ref, current);
    return;
  }

  const local = readLocalData();
  local.gameScores[gameId] = Math.max(local.gameScores[gameId] || 0, score);
  local.totalPoints += 10;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export async function fetchLeaderboardEntries(count = 8) {
  if (isFirebaseConfigured) {
    const ref = query(collection(db, "users"), orderBy("totalPoints", "desc"), limit(count));
    const snap = await getDocs(ref);

    return snap.docs.map((item, index) => {
      const data = applyRewardState(item.data());
      return {
        uid: item.id,
        rank: index + 1,
        name: data.displayName || data.email || `Learner ${index + 1}`,
        ...data,
      };
    });
  }

  return DEMO_LEADERBOARD.slice(0, count).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export function buildHeatmapDays(activityMap = {}) {
  const days = [];
  const now = new Date();

  for (let i = HEATMAP_DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: activityMap[key] || 0,
    });
  }

  return days;
}
