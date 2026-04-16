import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
