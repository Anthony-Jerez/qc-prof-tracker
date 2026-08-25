import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import StatTile from '../components/StatTile'
import CourseCard from '../components/CourseCard'
import { mockOverview, mockCourses } from '../mocks/professorMock'
import { formatGpa, formatPercent, formatRating, formatCount } from '../lib/format'

function ProfessorProfile() {
  const { name } = useParams()

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
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 90% 0%, rgba(196,18,48,0.25), transparent 55%)',
              }}
            />
            <div className="relative grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <StatTile label="Avg GPA" value={formatGpa(mockOverview.avgGpa)} />
              <StatTile
                label="Rating"
                value={`${formatRating(mockOverview.rating)} / 5`}
              />
              <StatTile
                label="Withdrawal Rate"
                value={formatPercent(mockOverview.withdrawalRate)}
              />
              <StatTile
                label="Students Taught"
                value={formatCount(mockOverview.totalStudents)}
              />
            </div>
          </div>

          <h2 className="mt-14 font-display text-2xl font-medium tracking-[-0.03em] text-qc-charcoal">
            Courses Taught
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <CourseCard
                key={`${course.subject}-${course.nbr}`}
                profName={name}
                course={course}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfessorProfile
