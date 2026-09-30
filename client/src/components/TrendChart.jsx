import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function TrendChart({ data }) {

  return (
    <div className="bg-slate-900 rounded-xl p-5">

      <h2 className="text-xl font-bold mb-4">
        Last 10 Days Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="date"/>

          <YAxis/>

          <Tooltip/>

          <Area
            type="monotone"
            dataKey="milk"
            stroke="#3b82f6"
            fill="#3b82f6"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TrendChart;