import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ReviewForm from '../components/ReviewForm'
import ReviewPost from '../components/ReviewPost'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

function MyReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editingTerms, setEditingTerms] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setLoading(true)
    setError(null)

    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError) {
          setError(fetchError)
        } else {
          setReviews(data ?? [])
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, reloadToken])

  async function handleDelete(reviewId) {
    const isSure = window.confirm('Are you sure you want to delete this review?')
    if (!isSure) return

    const { error: deleteError } = await supabase.from('reviews').delete().eq('id', reviewId)

    if (deleteError) {
      alert('Failed to delete review. Please try again.')
      return
    }

    setReloadToken((t) => t + 1)
  }

  async function handleEdit(review) {
    setEditingReviewId(review.id)
    setEditingTerms(null)

    const { data, error: termsError } = await supabase
      .from('course_term_stats')
      .select('term')
      .eq('prof', review.prof_name)
      .eq('subject', review.course_subject)
      .eq('nbr', review.course_nbr)
      .order('term_sort', { ascending: false })

    setEditingTerms(termsError || !data?.length ? [review.term] : data.map((row) => row.term))
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-qc-grey">
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-qc-red">
            Your account
          </span>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-[-0.03em] text-qc-charcoal sm:text-5xl">
            My Reviews
          </h1>
          <p className="mt-2 text-sm leading-[1.7] text-qc-charcoal/60">
            Every review you've posted, across every course.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {loading && (
              <p className="font-mono text-sm text-qc-charcoal/50">Loading your reviews…</p>
            )}

            {!loading && error && (
              <p role="alert" className="text-sm text-qc-red">
                Couldn't load your reviews. Please try again.
              </p>
            )}

            {!loading && !error && reviews.length === 0 && (
              <EmptyState
                eyebrow="Nothing here yet"
                title="You haven't posted a review"
                message="Search for a professor, open a course dashboard, and share your experience."
                actionTo="/"
                actionLabel="Find a professor"
              />
            )}

            {!loading &&
              !error &&
              reviews.map((review) => {
                const courseHref = `/prof/${encodeURIComponent(review.prof_name)}/${review.course_subject}-${review.course_nbr}`
                const courseLabel = `${review.course_subject} ${review.course_nbr} · ${review.prof_name}`

                return (
                  <div key={review.id} className="flex flex-col gap-3">
                    <Link
                      to={courseHref}
                      className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
                    >
                      {courseLabel}
                    </Link>

                    {review.id === editingReviewId ? (
                      editingTerms ? (
                        <ReviewForm
                          profName={review.prof_name}
                          courseSubject={review.course_subject}
                          courseNbr={review.course_nbr}
                          validTerms={editingTerms}
                          existingReview={review}
                          onSubmitted={() => {
                            setEditingReviewId(null)
                            setReloadToken((t) => t + 1)
                          }}
                          onCancel={() => setEditingReviewId(null)}
                        />
                      ) : (
                        <p className="font-mono text-sm text-qc-charcoal/50">Loading form…</p>
                      )
                    ) : (
                      <ReviewPost
                        review={review}
                        isOwner
                        onEdit={() => handleEdit(review)}
                        onDelete={() => handleDelete(review.id)}
                      />
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyReviewsPage
