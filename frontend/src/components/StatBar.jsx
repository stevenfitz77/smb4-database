import 'StatBar.css';

function getStatColor(value) {
  if (value < 40) return '#E24B4A';   // red
  if (value < 60) return '#D4537E';   // pink
  if (value < 80) return '#0C447C';   // dark blue
  return '#378ADD';                    // light blue
}

function StatBar({ label, value }) {
  if (value === null || value === undefined) return null;

  const color = getStatColor(value);

  return (
    <div className="stat-bar">
      <div className="stat-bar-label">{label}</div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
        <span className="stat-bar-number">{value}</span>
      </div>
    </div>
  );
}

export default StatBar;