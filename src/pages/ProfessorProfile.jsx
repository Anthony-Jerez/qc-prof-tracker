import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import StatTile from '../components/StatTile'
import CourseCard from '../components/CourseCard'
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

function ProfessorProfile() {
  const { name } = useParams()

  const overview = useSupabaseRpc('get_professor_overview', { p_prof: name }, [name])
  const courses = useSupabaseRpc('get_professor_courses', { p_prof: name }, [name])

  if (overview.loading || courses.loading) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <LoadingSpinner />
      </div>
    )
  }

  if (overview.error || courses.error) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <main className="flex flex-1 items-center px-6 pb-16 sm:px-10">
          <EmptyState
            eyebrow="Something went wrong"
            title="Couldn't load this professor"
            message="There was a problem reaching the database. Please try again."
            actionLabel="Try again"
            onAction={() => {
              overview.refetch()
              courses.refetch()
            }}
          />
        </main>
      </div>
    )
  }

  if (!overview.data) {
    return (
      <div className="flex min-h-screen flex-col bg-qc-grey">
        <Header />
        <main className="flex flex-1 items-center px-6 pb-16 sm:px-10">
          <EmptyState
            eyebrow="No record found"
            title={name}
            message="We don't have any grade data for this professor. Double check the spelling and format — e.g. ABREGO, R."
            actionTo="/"
            actionLabel="← Back to search"
          />
        </main>
      </div>
    )
  }

  const stats = overview.data
  const courseList = courses.data ?? []

  return (
    <div className="flex min-h-screen flex-col bg-qc-grey">
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/"
            className="font-mono text-xs text-qc-red underline decoration-qc-red/40 underline-offset-4 transition-colors hover:text-qc-red-dim focus-visible:outline-none focus-visible:text-qc-red-dim"
          >
            ← Back to search
          </Link>

          <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] text-qc-charcoal sm:text-5xl">
            {name}
          </h1>

          <div className="grain relative mt-8 overflow-hidden rounded-3xl bg-qc-charcoal shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
            <div className="relative grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <StatTile label="Avg GPA" value={formatGpa(stats.avg_gpa)} />
              <StatTile
                label="Rating"
                value={stats.rating != null ? `${formatRating(stats.rating)} / 5` : '—'}
                caption={stats.rating != null ? null : 'No ratings yet'}
              />
              <StatTile
                label="Withdrawal Rate"
                value={formatPercent(stats.withdrawal_rate)}
                caption={describeWithdrawalRate(stats.withdrawal_rate)}
              />
              <StatTile 
                label="Students Taught" 
                value={formatCount(stats.total_students)} 
                caption="Fall '21 – Fall '25"
              />
            </div>
          </div>

          <h2 className="mt-14 font-display text-2xl font-medium tracking-[-0.03em] text-qc-charcoal">
            Courses Taught
          </h2>
          {courseList.length === 0 ? (
            <p className="mt-6 text-sm text-qc-charcoal/50">
              No course data on record for this professor yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courseList.map((course) => (
                <CourseCard
                  key={`${course.subject}-${course.nbr}`}
                  profName={name}
                  course={{
                    subject: course.subject,
                    nbr: course.nbr,
                    courseName: course.course_name,
                    avgGpa: course.avg_gpa,
                    rating: course.rating,
                    lastTerm: course.last_term,
                    totalEnrollments: course.total_students,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfessorProfile
