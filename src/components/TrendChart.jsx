import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function TrendChart({ title, data, dataKey, valueFormatter, yDomain }) {
  return (
    <div className="rounded-2xl border border-qc-charcoal/10 bg-white p-5 shadow-[0_16px_32px_-20px_rgba(34,34,34,0.25)] sm:p-6">
      <h3 className="text-sm font-semibold text-qc-charcoal">{title}</h3>
      <div className="mt-4 h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="#22222214" vertical={false} />
            <XAxis
              dataKey="term"
              tick={{ fontSize: 11, fill: '#22222299' }}
              tickLine={false}
              axisLine={{ stroke: '#22222220' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#22222299' }}
              tickLine={false}
              axisLine={false}
              domain={yDomain}
              tickFormatter={valueFormatter}
              width={44}
            />
            <Tooltip
              formatter={(value) => valueFormatter(value)}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(34,34,34,0.1)',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#C41230"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#C41230', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendChart
