const STAR_PATH = 'M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8L10 1.5z'

export default function StarIcon({ filled, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`transition-colors ${className}`}
      fill={filled ? '#C41230' : 'none'}
      stroke={filled ? '#C41230' : '#22222240'}
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d={STAR_PATH} strokeLinejoin="round" />
    </svg>
  )
}