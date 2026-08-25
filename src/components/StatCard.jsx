function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-qc-charcoal px-5 py-4 shadow-[0_16px_32px_-18px_rgba(0,0,0,0.45)] sm:px-6 sm:py-5">
      <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em] text-qc-red">
        {label}
      </span>
      <div className="mt-1 font-mono text-2xl font-medium text-qc-grey sm:text-3xl">
        {value}
      </div>
    </div>
  )
}

export default StatCard
