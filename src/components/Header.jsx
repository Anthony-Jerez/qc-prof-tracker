function Header() {
  return (
    <header className="border-b-4 border-qc-red bg-white px-6 py-4 sm:px-10">
      <a
        href="/"
        className="inline-flex items-baseline gap-1.5 text-xl font-bold tracking-tight transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none sm:text-2xl"
      >
        <span className="text-qc-red">QC</span>
        <span className="text-qc-charcoal">Prof Tracker</span>
      </a>
    </header>
  )
}

export default Header
