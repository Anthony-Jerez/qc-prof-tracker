import { Link } from 'react-router-dom'

function EmptyState({ eyebrow, title, message, actionTo, actionLabel, onAction }) {
  return (
    <div className="mx-auto w-full max-w-md text-center">
      <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
        {eyebrow}
      </span>
      <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-charcoal sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-[1.7] text-qc-charcoal/60">{message}</p>

      {actionTo && (
        <Link
          to={actionTo}
          className="mt-8 inline-flex font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
        >
          {actionLabel}
        </Link>
      )}

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-8 inline-flex font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
