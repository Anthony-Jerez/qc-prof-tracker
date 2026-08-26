import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import StatTile from '../components/StatTile'
import StatCard from '../components/StatCard'
import TrendChart from '../components/TrendChart'
import GradeBarChart from '../components/GradeBarChart'
import ReviewFeed from '../components/ReviewFeed'
import ReviewForm from '../components/ReviewForm'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useSupabaseRpc } from '../hooks/useSupabaseRpc'
import {
  describeWithdrawalRate,
  formatCount,
  formatGpa,
  formatPercent,
  formatRating,
} from '../lib/format'

function CourseDashboard() {
  const { name, course } = useParams()
  const [subject, ...rest] = course.split('-')
  const nbr = rest.join('-')
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [reviewsReloadKey, setReviewsReloadKey] = useState(0)

  const dashboard = useSupabaseRpc(
    'get_course_dashboard',
    { p_prof: name, p_subject: subject, p_nbr: nbr },
    [name, subject, nbr],
  )

  const withdrawalTrend = useMemo(
    () =>
      (dashboard.data?.terms ?? []).map((t) => ({
        term: t.term,
        withdrawalPct: t.withdrawal_rate * 100,
      })),
    [dashboard.data],
  )

  if (dashboard.loading) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <LoadingSpinner />
      </div>
    )
  }

  if (dashboard.error) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <main className="flex flex-1 items-center px-6 pb-16 sm:px-10">
          <EmptyState
            eyebrow="Something went wrong"
            title="Couldn't load this course"
            message="There was a problem reaching the database. Please try again."
            actionLabel="Try again"
            onAction={() => dashboard.refetch()}
          />
        </main>
      </div>
    )
  }

  const terms = dashboard.data?.terms ?? []

  if (!dashboard.data || terms.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <main className="flex flex-1 items-center px-6 pb-16 sm:px-10">
          <EmptyState
            eyebrow="No record found"
            title={`${subject} ${nbr}`}
            message={`We don't have any grade data for this course under ${name}.`}
            actionTo={`/prof/${encodeURIComponent(name)}`}
            actionLabel={`← Back to ${name}`}
          />
        </main>
      </div>
    )
  }

  const stats = dashboard.data
  const activeTermName = selectedTerm ?? terms[terms.length - 1].term
  const activeTerm = terms.find((t) => t.term === activeTermName) ?? terms[terms.length - 1]

  return (
    <div className="flex min-h-screen flex-col bg-qc-grey">
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            to={`/prof/${encodeURIComponent(name)}`}
            className="font-mono text-xs text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
          >
            ← Back to {name}
          </Link>

          <span className="mt-4 block font-mono text-xs font-medium uppercase tracking-[0.2em] text-qc-red">
            {subject} {nbr}
          </span>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-[-0.03em] text-qc-charcoal sm:text-5xl">
            {stats.course_name}
          </h1>
          <p className="mt-2 text-sm text-qc-charcoal/60">Taught by {name}</p>

          <div className="grain relative mt-8 overflow-hidden rounded-3xl bg-qc-charcoal shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 90% 0%, rgba(196,18,48,0.25), transparent 55%)',
              }}
            />
            <div className="relative grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <StatTile label="Avg GPA" value={formatGpa(stats.avg_gpa)} />
              <StatTile
                label="Withdrawal Rate"
                value={formatPercent(stats.withdrawal_rate)}
                caption={describeWithdrawalRate(stats.withdrawal_rate)}
              />
              <StatTile
                label="Rating"
                value={stats.rating != null ? `${formatRating(stats.rating)} / 5` : '—'}
                caption={stats.rating != null ? null : 'No ratings yet'}
              />
            </div>
          </div>

          <h2 className="mt-14 font-display text-2xl font-medium tracking-[-0.03em] text-qc-charcoal">
            Historical Trends
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <TrendChart
              title="Average GPA Trend"
              data={terms}
              dataKey="avg_gpa"
              valueFormatter={(value) => value.toFixed(2)}
              yDomain={[0, 4]}
            />
            <TrendChart
              title="Withdrawal Percentage Trend"
              data={withdrawalTrend}
              dataKey="withdrawalPct"
              valueFormatter={(value) => `${value.toFixed(0)}%`}
            />
          </div>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-medium tracking-[-0.03em] text-qc-charcoal">
              Semester Breakdown
            </h2>
            <label className="flex items-center gap-2 text-sm text-qc-charcoal/70">
              <span className="font-mono text-xs uppercase tracking-wider text-qc-charcoal/50">
                Select Semester
              </span>
              <select
                value={activeTermName}
                onChange={(event) => setSelectedTerm(event.target.value)}
                className="rounded-lg border border-qc-charcoal/15 bg-white px-3 py-2 text-sm text-qc-charcoal shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
              >
                {terms.map((t) => (
                  <option key={t.term} value={t.term}>
                    {t.term}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Withdrawals" value={formatCount(activeTerm.w)} />
            <StatCard label="Incompletes" value={formatCount(activeTerm.inc)} />
            <StatCard label="Total Enrollment" value={formatCount(activeTerm.total)} />
          </div>

          <div className="mt-6 rounded-2xl border border-qc-charcoal/10 bg-white p-5 shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-6">
            <h3 className="text-sm font-semibold text-qc-charcoal">
              Grade Distribution — {activeTerm.term}
            </h3>
            <div className="mt-4">
              <GradeBarChart grades={activeTerm} />
            </div>
          </div>

          <div className="mt-14">
            <ReviewFeed
              profName={name}
              courseSubject={subject}
              courseNbr={nbr}
              reloadKey={reviewsReloadKey}
            />
          </div>

          <div className="mt-8">
            <ReviewForm
              profName={name}
              courseSubject={subject}
              courseNbr={nbr}
              validTerms={[...terms].map((t) => t.term).reverse()}
              onSubmitted={() => setReviewsReloadKey((key) => key + 1)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default CourseDashboard
