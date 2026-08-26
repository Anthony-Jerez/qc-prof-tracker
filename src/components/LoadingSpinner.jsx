function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="flex items-center gap-3 font-mono text-sm text-qc-charcoal/50">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-qc-red" aria-hidden="true" />
        Loading…
      </div>
    </div>
  )
}

export default LoadingSpinner
