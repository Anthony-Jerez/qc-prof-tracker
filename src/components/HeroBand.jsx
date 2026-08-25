function HeroBand() {
  return (
    <div className="grain relative overflow-hidden bg-qc-charcoal px-6 py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 15% 0%, rgba(196,18,48,0.28), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.05), transparent 45%)',
        }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <svg
          width="52"
          height="40"
          viewBox="0 0 24 18"
          fill="none"
          aria-hidden="true"
          className="mb-4"
        >
          <path d="M12 1 22 6.5 12 12 2 6.5 12 1Z" fill="#F4F4F4" />
          <path
            d="M6 8.8V13c0 1.66 2.69 3 6 3s6-1.34 6-3V8.8l-6 3-6-3Z"
            fill="#F4F4F4"
            opacity="0.85"
          />
          <line
            x1="22"
            y1="6.5"
            x2="22"
            y2="13"
            stroke="#F4F4F4"
            strokeWidth="1.2"
          />
          <circle cx="22" cy="14" r="1.6" fill="#C41230" />
        </svg>

        <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-qc-grey sm:text-5xl">
          <span className="text-qc-red">QC</span> Prof Tracker
        </h1>
        <p className="mt-3 text-base leading-[1.7] text-qc-grey/70 sm:text-lg">
          Explore grade distributions for{' '}
          <span className="font-semibold text-qc-red">Queens College</span>{' '}
          courses
        </p>
      </div>
    </div>
  )
}

export default HeroBand
