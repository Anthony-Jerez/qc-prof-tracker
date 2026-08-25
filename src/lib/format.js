export function formatGpa(value) {
  return value.toFixed(2)
}

export function formatRating(value) {
  return value.toFixed(1)
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`
}

export function formatCount(value) {
  return value.toLocaleString()
}
