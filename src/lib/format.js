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

export function describeWithdrawalRate(rate) {
  if (rate === null || rate === undefined) return null
  if (rate <= 0) return 'Few to no students withdraw.'
  if (rate >= 1) return 'Nearly all students withdraw.'

  const n = Math.round(1 / rate)
  if (n <= 1) return 'More than half of students withdraw.'
  return `About 1 in ${n} students withdraw.`
}
