import { useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

function ReviewFeed({ profName, courseSubject, courseNbr, validTerms }) {
  const { user } = useAuth()
  const [sort, setSort] = useState('newest')
  const [editingReviewId, setEditingReviewId] = useState(null)
  const queryClient = useQueryClient()

  // Infinite query for data fetching, caching, and review pagination
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    // Adding `sort` to the queryKey means React Query will automatically 
    // refetch from page 0 whenever the user changes the sort dropdown.
    queryKey: ['reviews', profName, courseSubject, courseNbr, sort],
    // Trust the cache for 5 minutes before checking the database again
    staleTime: 1000 * 60 * 5, 
    queryFn: async ({ pageParam = 0 }) => {
      // Calculate the Supabase offset based on the current page
      const offset = pageParam * PAGE_SIZE
      const query = supabase
        .from('reviews')
        .select('*')
        .eq('prof_name', profName)
        .eq('course_subject', courseSubject)
        .eq('course_nbr', courseNbr)
      
      const { data: pageData, error } = await applySort(query, sort).range(offset, offset + PAGE_SIZE - 1)
      
      if (error) throw error
      return pageData
    },
    
    // Tell React Query how to determine the next page number
    getNextPageParam: (lastPage, allPages) => {
      // If the last page we fetched has exactly 10 items, there might be more. 
      // Return the next page index. Otherwise, return undefined to stop.
      return lastPage?.length === PAGE_SIZE ? allPages.length : undefined
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (reviewId) => {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate the cache to instantly refresh the feed.
      // We leave `sort` out of the invalidation key so it refreshes ALL sorts for this course.
      queryClient.invalidateQueries({ queryKey: ['reviews', profName, courseSubject, courseNbr] })
    },
    onError: () => {
      alert('Failed to delete review. Please try again.')
    }
  })

  function handleDelete(reviewId) {
    const isSure = window.confirm('Are you sure you want to delete this review?')
    if (isSure) {
      deleteMutation.mutate(reviewId)
    }
  }
  
  // Flattening the pages
  // `data.pages` is the master array of arrays (e.g. [[page 0], [page 1]]).
  // We use `flatMap` to merge them into a single list of reviews for rendering.
  const reviews = data?.pages.flatMap((page) => page) ?? []

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
        {isLoading && <p className="font-mono text-sm text-qc-charcoal/50">Loading reviews…</p>}

        {!isLoading && isError && (
          <p role="alert" className="text-sm text-qc-red">
            Couldn't load reviews. Please try again.
          </p>
        )}

        {!isLoading && !isError && reviews.length === 0 && (
          <p className="text-sm leading-[1.7] text-qc-charcoal/60">
            No reviews yet — be the first to share your experience with this course.
          </p>
        )}

        {!isLoading &&
          !isError &&
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
                  onSubmitted={() => {
                    setEditingReviewId(null)
                    queryClient.invalidateQueries({ queryKey: ['reviews', profName, courseSubject, courseNbr] })
                  }}
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

      {!isLoading && !isError && hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-6 w-full rounded-lg border border-qc-charcoal/15 bg-white px-4 py-3 font-mono text-sm font-medium text-qc-charcoal transition-colors hover:border-qc-red/40 hover:text-qc-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}

export default ReviewFeed