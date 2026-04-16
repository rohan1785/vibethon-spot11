import styles from "./ActivityHeatmap.module.css";

function intensity(count) {
  if (count === 0) return styles.l0;
  if (count <= 1) return styles.l1;
  if (count <= 3) return styles.l2;
  if (count <= 5) return styles.l3;
  return styles.l4;
}

export default function ActivityHeatmap({ days }) {
  return (
    <div className={styles.wrap} role="img" aria-label="Activity heatmap">
      {days.map((day) => (
        <div
          key={day.date}
          className={`${styles.cell} ${intensity(day.count)}`}
          title={`${day.date}: ${day.count} activities`}
        />
      ))}
    </div>
  );
}
