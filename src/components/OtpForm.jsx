import TextField from './TextField'

export default function OtpForm({ 
  email, otp, setOtp, onSubmit, error, submitting, onBack, title, buttonText 
}) {
  return (
    <>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
        {title}
      </span>
      <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
        Enter your code
      </h1>
      <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
        We sent a 6-digit code to {email}. Enter it below to continue.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-4">
        <TextField
          id="otp-input"
          label="Verification Code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
          required
        />

        {error && <p role="alert" className="text-sm text-qc-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-qc-red px-4 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
        >
          {submitting ? 'Verifying…' : buttonText}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
      >
        ← Use a different email
      </button>
    </>
  )
}