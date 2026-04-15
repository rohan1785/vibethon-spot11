"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BrainCircuit, UserCircle2 } from "lucide-react";
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

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/modules" className={styles.brand} aria-label="AIML Nexus home">
          <BrainCircuit size={19} />
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

        <div className={styles.userZone}>
          <Link href="/dashboard" className={styles.profileBtn} aria-label="View profile">
            <UserCircle2 size={28} />
          </Link>
        </div>
      </div>
    </header>
  );
}
