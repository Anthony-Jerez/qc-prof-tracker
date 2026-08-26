function TextField({ label, error, className = '', id, ...inputProps }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em] text-qc-red"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className="rounded-lg bg-white/95 px-4 py-3 text-qc-charcoal placeholder:text-qc-charcoal/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
        {...inputProps}
      />
      {error && <span className="text-xs text-qc-red">{error}</span>}
    </div>
  )
}

export default TextField
