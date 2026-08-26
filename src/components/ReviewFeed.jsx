import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const PAGE_SIZE = 10
const STAR_PATH = 'M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8L10 1.5z'

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

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill={n <= rating ? '#C41230' : 'none'}
          stroke={n <= rating ? '#C41230' : '#22222235'}
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path d={STAR_PATH} strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

function ReviewFeed({ profName, courseSubject, courseNbr, reloadKey }) {
  const [sort, setSort] = useState('newest')
  const [reviews, setReviews] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

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
  }, [fetchPage, reloadKey])

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
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-qc-charcoal/10 bg-white p-5 shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Stars rating={review.rating} />
                  <h4 className="mt-2 font-display text-base font-medium text-qc-charcoal">
                    {review.title}
                  </h4>
                </div>
                <div className="text-right font-mono text-[0.65rem] uppercase tracking-[0.15em] text-qc-charcoal/40">
                  <div>{review.term}</div>
                  <div className="mt-1">{formatDate(review.created_at)}</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-[1.7] text-qc-charcoal/70">{review.comment}</p>
            </article>
          ))}
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
