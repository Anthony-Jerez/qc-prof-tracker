import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

const UNIQUE_VIOLATION = '23505'
const STAR_PATH = 'M10 1.5l2.6 5.6 6 .8-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8L10 1.5z'

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-7 w-7 transition-colors"
      fill={filled ? '#C41230' : 'none'}
      stroke={filled ? '#C41230' : '#22222240'}
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d={STAR_PATH} strokeLinejoin="round" />
    </svg>
  )
}

function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
        >
          <Star filled={(hovered || value) >= n} />
        </button>
      ))}
    </div>
  )
}

const fieldLabelClass =
  'font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em] text-qc-red'
const fieldInputClass =
  'rounded-lg border border-qc-charcoal/15 bg-white px-3 py-2.5 text-sm text-qc-charcoal placeholder:text-qc-charcoal/30 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-qc-red'

function ReviewForm({ profName, courseSubject, courseNbr, validTerms, onSubmitted }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [term, setTerm] = useState(validTerms[0] ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    return (
      <div className="rounded-2xl border border-qc-charcoal/10 bg-white p-6 text-center shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-8">
        <span className={fieldLabelClass}>Leave a review</span>
        <p className="mt-3 text-sm leading-[1.7] text-qc-charcoal/70">
          Log in with your Queens College email to share your experience with this course.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-qc-red px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red/40"
          >
            Log in
          </Link>
          <span className="text-sm text-qc-charcoal/40">or</span>
          <Link
            to="/signup"
            className="font-mono text-sm text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
          >
            create an account
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-qc-charcoal/10 bg-white p-6 text-center shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-8">
        <span className={fieldLabelClass}>Review posted</span>
        <p className="mt-3 text-sm leading-[1.7] text-qc-charcoal/70">
          Thanks for sharing your experience with {courseSubject} {courseNbr}.
        </p>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (rating < 1) {
      setFormError('Please select a star rating.')
      return
    }

    if (!title.trim()) {
      setFormError('Please enter a title for your review.')
      return
    }

    if (!comment.trim()) {
      setFormError('Please enter a comment for your review.')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        prof_name: profName,
        course_subject: courseSubject,
        course_nbr: courseNbr,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        term,
        user_id: user.id,
      })
      .select()
      .single()
    setSubmitting(false)

    if (error) {
      setFormError(
        error.code === UNIQUE_VIOLATION
          ? 'You have already submitted a review for this course.'
          : 'Something went wrong submitting your review. Please try again.',
      )
      return
    }

    setSubmitted(true)
    onSubmitted?.(data)
  }

  return (
    <div className="rounded-2xl border border-qc-charcoal/10 bg-white p-6 shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-8">
      <span className={fieldLabelClass}>Leave a review</span>
      <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.03em] text-qc-charcoal">
        {courseSubject} {courseNbr} with {profName}
      </h3>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className={fieldLabelClass}>Rating</span>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-term" className={fieldLabelClass}>
            Term Taken
          </label>
          <select
            id="review-term"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            required
            className={fieldInputClass}
          >
            {validTerms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-title" className={fieldLabelClass}>
            Title
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={80}
            placeholder="Sum it up in a few words"
            className={fieldInputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className={fieldLabelClass}>
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
            rows={4}
            maxLength={1000}
            placeholder="What should other students know about this course?"
            className={`resize-none leading-[1.7] ${fieldInputClass}`}
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-qc-red">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-lg bg-qc-red px-5 py-2.5 font-mono text-sm font-medium text-white transition-colors hover:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red/40 disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post Review'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
