"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./AuthPage.module.css";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name too short"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const { login, signup, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  const schema = mode === "login" ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setBusy(true);
    setError("");

    try {
      if (mode === "login") {
        await login(values);
      } else {
        await signup(values);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleBusy(true);
    setError("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <main className={styles.wrap}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card ${styles.panel}`}
      >
        <h1 className="page-title">Welcome to AIML Nexus</h1>
        <p className="page-subtitle">Login or signup to start your hackathon demo journey.</p>

        {!isFirebaseConfigured && (
          <p className={styles.demoNote}>
            Running in local demo mode. Add Firebase env vars for production auth.
          </p>
        )}

        <div className={styles.modeButtons}>
          <button type="button" onClick={() => setMode("login")} className={mode === "login" ? styles.active : ""}>
            Login
          </button>
          <button type="button" onClick={() => setMode("signup")} className={mode === "signup" ? styles.active : ""}>
            Signup
          </button>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={!isFirebaseConfigured || googleBusy || busy}
        >
          <span className={styles.googleBadge} aria-hidden="true">G</span>
          <span>{googleBusy ? "Connecting..." : "Continue with Google"}</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} aria-label="Authentication form">
          {mode === "signup" && (
            <label>
              Name
              <input className="input" {...register("name")} aria-invalid={Boolean(errors.name)} />
              {errors.name && <small>{errors.name.message}</small>}
            </label>
          )}

          <label>
            Email
            <input className="input" {...register("email")} aria-invalid={Boolean(errors.email)} />
            {errors.email && <small>{errors.email.message}</small>}
          </label>

          <label>
            Password
            <input type="password" className="input" {...register("password")} aria-invalid={Boolean(errors.password)} />
            {errors.password && <small>{errors.password.message}</small>}
          </label>

          {mode === "signup" && (
            <label>
              Skill level
              <select className="select" {...register("skillLevel")} defaultValue="Beginner">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className="button-primary" type="submit" disabled={busy}>
            {busy ? <LoadingSpinner label="Please wait" /> : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
