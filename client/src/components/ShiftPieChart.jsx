import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ShiftPieChart({
  morningMilk,
  eveningMilk,
}) {

  const data = [
    {
      name: "Morning",
      value: morningMilk,
    },
    {
      name: "Evening",
      value: eveningMilk,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#22c55e",
  ];

  return (
    <div className="bg-slate-900 p-5 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        Shift Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
          >
            {data.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ShiftPieChart;