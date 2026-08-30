const STAR_PATH = 'M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8L10 1.5z'

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill={n <= rating ? '#C41230' : 'none'}
          stroke={n <= rating ? '#C41230' : '#22222235'}
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path d={STAR_PATH} strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

function ReviewPost({ review, isOwner, onEdit }) {
  return (
    <article className="rounded-2xl border border-qc-charcoal/10 bg-white p-5 shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Stars rating={review.rating} />
          <h4 className="mt-2 font-display text-base font-medium text-qc-charcoal">
            {review.title}
          </h4>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right font-mono text-[0.65rem] uppercase tracking-[0.15em] text-qc-charcoal/40">
            <div>{review.term}</div>
            <div className="mt-1">{formatDate(review.created_at)}</div>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={onEdit}
              className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.15em] text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-[1.7] text-qc-charcoal/70">{review.comment}</p>
    </article>
  )
}

export default ReviewPost