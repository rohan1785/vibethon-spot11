"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrainCircuit, UserCircle2, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

const links = [
  { href: "/modules", label: "Modules" },
  { href: "/playground", label: "Playground" },
  { href: "/games", label: "Games" },
  { href: "/quiz", label: "Quizzes" },
  { href: "/tutor", label: "AI Tutor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/auth");
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/modules" className={styles.brand} aria-label="AIML Nexus home">
          <BrainCircuit size={24} className={styles.brandIcon} />
          <span>AIML Nexus</span>
        </Link>

        <nav aria-label="Primary navigation" className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {pathname === link.href && <motion.span layoutId="nav-pill" className={styles.activePill} />}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userZone} ref={ref}>
          <button
            className={styles.profileBtn}
            aria-label="Profile menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <UserCircle2 size={28} />
          </button>

          {open && (
            <div className={styles.dropdown}>
              {user && (
                <p className={styles.dropdownUser}>{user.displayName || user.email || "User"}</p>
              )}
              <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
