"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    } else if (!loading && user) {
      router.replace("/modules");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <LoadingSpinner label="Authenticating session" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
