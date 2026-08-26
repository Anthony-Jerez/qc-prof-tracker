import { Link } from 'react-router-dom'
import { formatGpa, formatRating, formatCount } from '../lib/format'

function CourseCard({ profName, course }) {
  const slug = `${course.subject}-${course.nbr}`

  return (
    <Link
      to={`/prof/${encodeURIComponent(profName)}/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-qc-charcoal p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qc-red"
    >
      <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-qc-red">
        {course.subject} {course.nbr}
      </span>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-qc-grey">
        {course.courseName}
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-qc-grey/40">
            GPA
          </span>
          <span className="font-mono text-xl text-qc-grey">
            {formatGpa(course.avgGpa)}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-qc-grey/40">
            Rating
          </span>
          <span className="font-mono text-xl text-qc-grey">
            {course.rating != null ? formatRating(course.rating) : '—'}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-qc-grey/40">
            Last Term
          </span>
          <span className="font-mono text-sm text-qc-grey">
            {course.lastTerm}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-qc-grey/40">
            Total Enrolled
          </span>
          <span className="font-mono text-xl text-qc-grey">
            {formatCount(course.totalEnrollments)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
