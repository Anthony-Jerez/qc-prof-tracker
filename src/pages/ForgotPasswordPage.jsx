import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TextField from '../components/TextField'
import OtpForm from '../components/OtpForm'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  verifyOtpSubmit 
} from '../lib/validation'

function ForgotPasswordPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (step === 'email' && !authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [step, authLoading, user, navigate])

  if (step === 'email' && !authLoading && user) return null

  async function handleEmailSubmit(event) {
    event.preventDefault()
    setError('')

    const emailErr = validateEmail(email)
    if (emailErr) {
      setError(emailErr)
      return
    }

    setSubmitting(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim())
    setSubmitting(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setStep('otp')
  }

  async function handleOtpSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: verifyError } = await verifyOtpSubmit(supabase, email, otp, 'recovery')
    setSubmitting(false)

    if (verifyError) {
      setError(verifyError)
      return
    }

    setStep('password')
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validatePassword(newPassword)
    const matchError = validateConfirmPassword(newPassword, confirmPassword)
    
    if (validationError || matchError) {
      setError(validationError || matchError)
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setStep('done')
  }

  return (
    <div className="flex min-h-screen flex-col bg-qc-grey">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="grain relative w-full max-w-md overflow-hidden rounded-3xl bg-qc-charcoal p-8 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] sm:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at 85% -10%, rgba(196,18,48,0.3), transparent 55%)',
            }}
          />
          <div className="relative">
            {step === 'email' && (
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  Reset password
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Forgot your password?
                </h1>
                <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
                  Enter your Queens College student email and we'll send you a 6-digit code.
                </p>

                <form onSubmit={handleEmailSubmit} noValidate className="mt-8 flex flex-col gap-4">
                  <TextField
                    id="forgot-password-email"
                    label="Student Email"
                    type="email"
                    autoComplete="email"
                    placeholder="first.last12@qmail.cuny.edu"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  {error && (
                    <p role="alert" className="text-sm text-qc-red">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg bg-qc-red px-4 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Send code'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-qc-grey/60">
                  Remembered your password?{' '}
                  <Link
                    to="/login"
                    className="text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}

            {step === 'otp' && (
              <OtpForm
                email={email.trim()}
                otp={otp}
                setOtp={setOtp}
                onSubmit={handleOtpSubmit}
                error={error}
                submitting={submitting}
                onBack={() => { setError(''); setOtp(''); setStep('email'); }}
                title="Check your email"
                buttonText="Verify code"
              />
            )}

            {step === 'password' && (
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  Reset password
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Choose a new password
                </h1>
                <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
                  Must be at least 12 characters, with an uppercase letter, a lowercase letter, a
                  number, and a symbol.
                </p>

                <form
                  onSubmit={handlePasswordSubmit}
                  noValidate
                  className="mt-8 flex flex-col gap-4"
                >
                  <TextField
                    id="forgot-password-new"
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                  <TextField
                    id="forgot-password-confirm"
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />

                  {error && (
                    <p role="alert" className="text-sm text-qc-red">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg bg-qc-red px-4 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                  >
                    {submitting ? 'Updating…' : 'Update Password'}
                  </button>
                </form>
              </>
            )}

            {step === 'done' && (
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  All set
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Password updated
                </h1>
                <p className="mt-4 text-sm leading-[1.7] text-qc-grey/70">
                  Your password has been changed successfully. You are securely signed in and ready to go.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim"
                >
                  ← Go to homepage
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage