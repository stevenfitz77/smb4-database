export function getStatColor(value) {
  if (value < 55) return '#E24B4A';
  if (value < 70) return '#D4537E';
  if (value < 80) return '#5e0c70';
  if (value < 91) return '#0C447C';
  return '#378ADD';
}