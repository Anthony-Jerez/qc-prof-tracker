import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TextField from '../components/TextField'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { validateEmail, validatePassword } from '../lib/validation'

function LoginPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [authLoading, user, navigate])

  if (!authLoading && user) return null

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)

    if (emailErr || passErr) {
      setFormError('Invalid email or password.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)
    
    if (error) {
      setFormError(error.message)
      return
    }

    navigate('/', { replace: true })
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
            <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-qc-red">
              Student sign in
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-qc-grey">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-[1.7] text-qc-grey/70">
              Sign in with your Queens College student email to leave and manage reviews.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
              <TextField
                id="login-email"
                label="Student Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <TextField
                id="login-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="font-mono text-xs text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
                >
                  Forgot your password?
                </Link>
              </div>

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
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-sm text-qc-grey/60">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage