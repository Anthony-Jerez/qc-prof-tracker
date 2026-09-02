import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TextField from '../components/TextField'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { isQcEmail, QC_EMAIL_DOMAIN } from '../lib/email'

function SignupPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('signup') // tracks the current stage within the multi-step flow
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (step === 'signup' && !authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [step, authLoading, user, navigate])

  if (step === 'signup' && !authLoading && user) return null

  function updateField(field) {
    return (event) => setForm((f) => ({ ...f, [field]: event.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.'
    if (!form.email.trim()) {
      next.email = 'Enter your student email.'
    } else if (!isQcEmail(form.email)) {
      next.email = `Use your @${QC_EMAIL_DOMAIN} email address.`
    }
    if (form.password.length < 12) {
      next.password = 'Use at least 12 characters.'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)) {
      next.password = 'Must include uppercase, lowercase, a number, and a symbol.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSignupSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { first_name: form.firstName.trim(), last_name: form.lastName.trim() },
      },
    })
    setSubmitting(false)

    if (error) {
      setFormError(
        isQcEmail(form.email)
          ? error.message
          : `Only Queens College (@${QC_EMAIL_DOMAIN}) email addresses can register.`,
      )
      return
    }

    if (data.session) {
      navigate('/', { replace: true })
    } else {
      setStep('otp') // switch to use otp
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!/^\d{6}$/.test(otp.trim())) {
      setFormError('Enter the 6-digit code from your email.')
      return
    }

    setSubmitting(true)
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token: otp.trim(),
      type: 'signup',
    })
    setSubmitting(false)

    if (verifyError) {
      setFormError(verifyError.message)
      return
    }

    // verifyOtp for signups usually returns a session immediately
    if (data.session) {
      navigate('/', { replace: true })
    } else {
      setStep('done')
    }
  }

  function handleBackToSignup() {
    setFormError('')
    setOtp('')
    setStep('signup')
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
            {step === 'signup' && (
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  Student sign up
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Create your account
                </h1>
                <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
                  Reviews are limited to Queens College students — sign up with your @
                  {QC_EMAIL_DOMAIN} email.
                </p>

                <form onSubmit={handleSignupSubmit} noValidate className="mt-8 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      id="signup-first-name"
                      label="First Name"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={updateField('firstName')}
                      error={errors.firstName}
                      required
                    />
                    <TextField
                      id="signup-last-name"
                      label="Last Name"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={updateField('lastName')}
                      error={errors.lastName}
                      required
                    />
                  </div>
                  <TextField
                    id="signup-email"
                    label="Student Email"
                    type="email"
                    autoComplete="email"
                    placeholder={`you@${QC_EMAIL_DOMAIN}`}
                    value={form.email}
                    onChange={updateField('email')}
                    error={errors.email}
                    required
                  />
                  <TextField
                    id="signup-password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={updateField('password')}
                    error={errors.password}
                    required
                  />

                  {formError && (
                    <p role="alert" className="text-sm text-qc-red">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg bg-qc-red px-4 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                  >
                    {submitting ? 'Creating account…' : 'Create account'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-qc-grey/60">
                  Already have an account?{' '}
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
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  Check your inbox
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Enter your code
                </h1>
                <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
                  We sent a 6-digit code to {form.email}. Enter it below to verify your account.
                </p>

                <form onSubmit={handleOtpSubmit} noValidate className="mt-8 flex flex-col gap-4">
                  <TextField
                    id="signup-otp"
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

                  {formError && (
                    <p role="alert" className="text-sm text-qc-red">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg bg-qc-red px-4 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                  >
                    {submitting ? 'Verifying…' : 'Verify account'}
                  </button>
                </form>
                
                <button
                  type="button"
                  onClick={handleBackToSignup}
                  className="mt-6 font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
                >
                  ← Use a different email
                </button>
              </>
            )}

            {step === 'done' && (
              <>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
                  Verified
                </span>
                <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
                  Account Created
                </h1>
                <p className="mt-4 text-sm leading-[1.7] text-qc-grey/70">
                  Your email has been verified successfully.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim"
                >
                  ← Go to sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignupPage