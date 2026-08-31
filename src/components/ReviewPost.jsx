import StarIcon from "./StarIcon"

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
        <StarIcon key={n} filled={n <= rating} className="h-3.5 w-3.5" />
      ))}
    </div>
  )
}

function ReviewPost({ review, isOwner, onEdit, onDelete }) {
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onEdit}
                className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.15em] text-qc-charcoal/50 underline decoration-qc-charcoal/30 underline-offset-4 transition-colors hover:text-qc-red hover:decoration-qc-red/40 focus-visible:outline-none focus-visible:text-qc-red focus-visible:decoration-qc-red/40"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.15em] text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-[1.7] text-qc-charcoal/70">{review.comment}</p>
    </article>
  )
}

export default ReviewPost