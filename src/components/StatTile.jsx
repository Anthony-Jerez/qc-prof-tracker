function StatTile({ label, value }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:px-6 sm:py-5">
      <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em] text-qc-red">
        {label}
      </span>
      <span className="font-mono text-2xl font-medium text-qc-grey sm:text-3xl">
        {value}
      </span>
    </div>
  )
}

export default StatTile
