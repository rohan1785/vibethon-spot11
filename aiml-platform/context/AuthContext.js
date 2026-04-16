"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { ensureUserDocument } from "@/lib/firestoreService";

const AuthContext = createContext(null);
const LOCAL_USER_KEY = "aiml_nexus_demo_user";

function readLocalUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LOCAL_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeLocalUser(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(LOCAL_USER_KEY);
    return;
  }
  window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (isFirebaseConfigured ? null : readLocalUser()));
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const actions = useMemo(
    () => ({
      signup: async ({ name, email, password, skillLevel }) => {
        if (!isFirebaseConfigured) {
          const localUser = {
            uid: `demo-${Date.now()}`,
            displayName: name,
            email,
            skillLevel,
          };
          writeLocalUser(localUser);
          setUser(localUser);
          await ensureUserDocument(localUser.uid, { email, skillLevel });
          return localUser;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
        await ensureUserDocument(cred.user.uid, { email, skillLevel });
        return cred.user;
      },
      login: async ({ email, password }) => {
        if (!isFirebaseConfigured) {
          const demoUser = readLocalUser();
          if (!demoUser) {
            throw new Error("No demo user found. Please sign up first.");
          }
          setUser(demoUser);
          return demoUser;
        }

        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDocument(cred.user.uid, { email: cred.user.email });
        return cred.user;
      },
      loginWithGoogle: async () => {
        if (!isFirebaseConfigured) {
          throw new Error("Google login requires Firebase configuration.");
        }

        const provider = new GoogleAuthProvider();
        try {
          const cred = await signInWithPopup(auth, provider);
          await ensureUserDocument(cred.user.uid, { email: cred.user.email });
          return cred.user;
        } catch (err) {
          const code = err?.code || "";

          if (code === "auth/popup-blocked") {
            throw new Error("Popup blocked. Please allow popups for localhost and try Google login again.");
          }

          if (code === "auth/popup-closed-by-user") {
            throw new Error("Google sign-in popup was closed before completion.");
          }

          if (code === "auth/unauthorized-domain") {
            throw new Error("This domain is not authorized in Firebase Auth. Add localhost to Authorized domains.");
          }

          throw new Error("Google login failed. Please try again.");
        }
      },
      loginWithGitHub: async () => {
        if (!isFirebaseConfigured) {
          throw new Error("GitHub login requires Firebase configuration.");
        }

        const provider = new GithubAuthProvider();
        try {
          const cred = await signInWithPopup(auth, provider);
          await ensureUserDocument(cred.user.uid, { email: cred.user.email });
          return cred.user;
        } catch (err) {
          const code = err?.code || "";

          if (code === "auth/popup-blocked") {
            throw new Error("Popup blocked. Please allow popups for localhost and try GitHub login again.");
          }

          if (code === "auth/popup-closed-by-user") {
            throw new Error("GitHub sign-in popup was closed before completion.");
          }

          if (code === "auth/unauthorized-domain") {
            throw new Error("This domain is not authorized in Firebase Auth. Add localhost to Authorized domains.");
          }

          throw new Error("GitHub login failed. Please try again.");
        }
      },
      logout: async () => {
        if (!isFirebaseConfigured) {
          writeLocalUser(null);
          setUser(null);
          return;
        }
        await signOut(auth);
      },
    }),
    []
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isFirebaseConfigured,
      ...actions,
    }),
    [actions, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
