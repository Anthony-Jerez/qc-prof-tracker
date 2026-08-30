import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import ReviewForm from './ReviewForm'
import ReviewPost from './ReviewPost'

const PAGE_SIZE = 10

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
]

function applySort(query, sort) {
  if (sort === 'highest') {
    return query.order('rating', { ascending: false }).order('created_at', { ascending: false })
  }
  if (sort === 'lowest') {
    return query.order('rating', { ascending: true }).order('created_at', { ascending: false })
  }
  return query.order('created_at', { ascending: false })
}

function ReviewFeed({ profName, courseSubject, courseNbr, validTerms, reloadKey }) {
  const { user } = useAuth()
  const [sort, setSort] = useState('newest')
  const [reviews, setReviews] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [internalReloadToken, setInternalReloadToken] = useState(0)

  const fetchPage = useCallback(
    (offset) => {
      const query = supabase
        .from('reviews')
        .select('*')
        .eq('prof_name', profName)
        .eq('course_subject', courseSubject)
        .eq('course_nbr', courseNbr)
      return applySort(query, sort).range(offset, offset + PAGE_SIZE - 1)
    },
    [profName, courseSubject, courseNbr, sort],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchPage(0).then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setReviews(data ?? [])
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [fetchPage, reloadKey, internalReloadToken])

  async function handleLoadMore() {
    setLoadingMore(true)
    const { data, error: fetchError } = await fetchPage(reviews.length)
    setLoadingMore(false)

    if (fetchError) {
      setError(fetchError)
      return
    }
    setReviews((prev) => [...prev, ...(data ?? [])])
    setHasMore((data?.length ?? 0) === PAGE_SIZE)
  }

  async function handleDelete(reviewId) {
    const isSure = window.confirm('Are you sure you want to delete this review?')
    if (!isSure) return

    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      alert('Failed to delete review. Please try again.')
      return
    }

    setInternalReloadToken((t) => t + 1)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-display text-xl font-medium tracking-[-0.03em] text-qc-charcoal">
          Student Reviews
        </h3>
        <label className="flex items-center gap-2 text-sm text-qc-charcoal/70">
          <span className="font-mono text-xs uppercase tracking-wider text-qc-charcoal/50">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-qc-charcoal/15 bg-white px-3 py-2 text-sm text-qc-charcoal shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading && <p className="font-mono text-sm text-qc-charcoal/50">Loading reviews…</p>}

        {!loading && error && (
          <p role="alert" className="text-sm text-qc-red">
            Couldn't load reviews. Please try again.
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-sm leading-[1.7] text-qc-charcoal/60">
            No reviews yet — be the first to share your experience with this course.
          </p>
        )}

        {!loading &&
          !error &&
          reviews.map((review) => {
            if (review.id === editingReviewId) {
              return (
                <ReviewForm
                  key={review.id}
                  profName={profName}
                  courseSubject={courseSubject}
                  courseNbr={courseNbr}
                  validTerms={validTerms}
                  existingReview={review}
                  onSubmitted={() => setInternalReloadToken((t) => t + 1)}
                  onCancel={() => setEditingReviewId(null)}
                />
              )
            }

            return (
              <ReviewPost
                key={review.id}
                review={review}
                isOwner={user?.id === review.user_id}
                onEdit={() => setEditingReviewId(review.id)}
                onDelete={() => handleDelete(review.id)}
              />
            )
          })}
      </div>

      {!loading && !error && hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="mt-6 w-full rounded-lg border border-qc-charcoal/15 bg-white px-4 py-3 font-mono text-sm font-medium text-qc-charcoal transition-colors hover:border-qc-red/40 hover:text-qc-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}

export default ReviewFeed