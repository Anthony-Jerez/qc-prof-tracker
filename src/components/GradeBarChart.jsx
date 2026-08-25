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

function GradeBarChart({ grades }) {
  const data = GRADE_KEYS.map((key) => ({
    grade: GRADE_LABELS[key],
    count: grades[key] ?? 0,
  }))

  return (
    <div className="h-72 sm:h-80">
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
            {data.map((entry) => (
              <Cell
                key={entry.grade}
                fill={entry.grade === 'W' || entry.grade === 'INC' ? '#22222266' : '#C41230'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GradeBarChart
