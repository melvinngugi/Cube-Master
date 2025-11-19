import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceChart({ solves }) {
  const data = solves.map((s, i) => {
    const isValidTimestamp =
      s.timestamp && !isNaN(new Date(s.timestamp).getTime());

    return {
      index: i + 1,
      time: typeof s.solve_time === "number" ? s.solve_time / 1000 : 0,
      timestamp: isValidTimestamp
        ? new Date(s.timestamp).toLocaleDateString("en-GB")
        : "",
    };
  });

  return (
    <div className="w-full h-64 bg-white rounded shadow p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="time" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
