import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useQueryClient } from '@tanstack/react-query'

function Header() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    setOpen(false)
    queryClient.clear() // empty cache on sign out
    await supabase.auth.signOut()
    navigate('/')
  }

  const firstName = user?.user_metadata?.first_name

  return (
    <header className="flex items-center justify-between border-b-4 border-qc-red bg-white px-6 py-4 sm:px-10">
      <Link
        to="/"
        className="inline-flex items-baseline gap-1.5 text-xl font-bold tracking-tight transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none sm:text-2xl"
      >
        <span className="text-qc-red">QC</span>
        <span className="text-qc-charcoal">Prof Tracker</span>
      </Link>

      {!loading && (
        <div className="relative" ref={menuRef}>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="rounded-full bg-qc-charcoal px-4 py-2 font-mono text-xs font-medium text-qc-grey transition-colors hover:bg-qc-charcoal/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
              >
                {firstName ? `Hi, ${firstName}` : 'Profile'}
              </button>

              {open && (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-qc-charcoal/10 bg-white p-3 shadow-[0_20px_40px_-20px_rgba(34,34,34,0.35)]">
                  <p className="truncate px-2 py-1 text-xs text-qc-charcoal/50">
                    Signed in as {user.email}
                  </p>
                  <Link
                    to="/my-reviews"
                    onClick={() => setOpen(false)}
                    className="mt-1 block w-full rounded-lg px-2 py-2 text-left text-sm text-qc-charcoal transition-colors hover:bg-qc-charcoal/5 focus-visible:outline-none focus-visible:bg-qc-charcoal/5"
                  >
                    My Reviews
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-qc-red transition-colors hover:bg-qc-red/5 focus-visible:outline-none focus-visible:bg-qc-red/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-qc-red px-4 py-2 font-mono text-xs font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-charcoal"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
