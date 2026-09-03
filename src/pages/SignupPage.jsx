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
  extractNameFromEmail, 
  verifyOtpSubmit 
} from '../lib/validation'

function SignupPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('signup')

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState({})

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
    const emailErr = validateEmail(form.email)
    const passErr = validatePassword(form.password)
    const confirmErr = validateConfirmPassword(form.password, form.confirmPassword)
    
    if (emailErr) next.email = emailErr
    if (passErr) next.password = passErr
    if (confirmErr) next.confirmPassword = confirmErr

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSignupSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    const { firstName, lastName } = extractNameFromEmail(form.email)

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    })
    setSubmitting(false)

    if (error) {
      setFormError(error.message)
      return
    }

    if (data.session) {
      navigate('/', { replace: true })
    } else {
      setStep('otp')
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)
    const { data, error } = await verifyOtpSubmit(supabase, form.email, otp, 'signup')
    setSubmitting(false)

    if (error) {
      setFormError(error)
      return
    }

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
                  Reviews are limited to Queens College students. Sign up using any student email associated with Queens College.
                </p>

                <form onSubmit={handleSignupSubmit} noValidate className="mt-8 flex flex-col gap-4">
                  <TextField
                    id="signup-email"
                    label="Student Email"
                    type="email"
                    autoComplete="email"
                    placeholder="first.last12@qmail.cuny.edu"
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
                  <TextField
                    id="signup-confirm-password"
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={updateField('confirmPassword')}
                    error={errors.confirmPassword}
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
              <OtpForm
                email={form.email.trim()}
                otp={otp}
                setOtp={setOtp}
                onSubmit={handleOtpSubmit}
                error={formError}
                submitting={submitting}
                onBack={handleBackToSignup}
                title="Check your inbox"
                buttonText="Verify account"
              />
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