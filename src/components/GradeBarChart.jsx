import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const GRADE_KEYS = [
  'a_plus', 'a', 'a_minus',
  'b_plus', 'b', 'b_minus',
  'c_plus', 'c', 'c_minus',
  'd_plus', 'd', 'f', 'w', 'inc',
]

const GRADE_LABELS = {
  a_plus: 'A+', a: 'A', a_minus: 'A-',
  b_plus: 'B+', b: 'B', b_minus: 'B-',
  c_plus: 'C+', c: 'C', c_minus: 'C-',
  d_plus: 'D+', d: 'D', f: 'F', w: 'W', inc: 'INC',
}

const UNSATISFACTORY_COLOR = '#B8534F'
const SATISFACTORY_COLOR = 'var(--color-qc-red)' // QC-red color
const ADMIN_COLOR = '#22222266'

function GradeBarChart({ grades }) {
  const data = GRADE_KEYS.map((key) => ({
    grade: GRADE_LABELS[key],
    count: grades[key] ?? 0,
  }))

  return (
    <div className="flex h-80 flex-col sm:h-[350px]">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="#22222214" vertical={false} />
            <XAxis
              dataKey="grade"
              tick={{ fontSize: 11, fill: '#22222299' }}
              tickLine={false}
              axisLine={{ stroke: '#22222220' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#22222299' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: 'rgba(34,34,34,0.04)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(34,34,34,0.1)',
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => {
                let fillColor = SATISFACTORY_COLOR // Default: Satisfactory (QC Red)
                
                if (['C-', 'D+', 'D', 'F'].includes(entry.grade)) {
                  fillColor = UNSATISFACTORY_COLOR // Unsatisfactory (desaturated, deep rust-red)
                } else if (['W', 'INC'].includes(entry.grade)) {
                  fillColor = ADMIN_COLOR // Administrative (Grey)
                }

                return <Cell key={entry.grade} fill={fillColor} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-wider text-qc-charcoal/60 sm:mt-6">
        <div className="flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: SATISFACTORY_COLOR }} aria-hidden="true" />
          <span>Satisfactory (A+ to C)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: UNSATISFACTORY_COLOR }} aria-hidden="true" />
          <span>Unsatisfactory (C- to F)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ADMIN_COLOR }} aria-hidden="true" />
          <span>Administrative (W, INC)</span>
        </div>
      </div>
    </div>
  )
}

export default GradeBarChart