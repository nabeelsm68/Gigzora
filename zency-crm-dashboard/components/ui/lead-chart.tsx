"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", leads: 20 },
  { day: "Tue", leads: 45 },
  { day: "Wed", leads: 60 },
  { day: "Thu", leads: 40 },
  { day: "Fri", leads: 95 },
  { day: "Sat", leads: 120 },
];

export default function LeadChart() {
  return (
    <div className="rounded-3xl border border-zinc-800 p-6 bg-zinc-900/50">

      <h2 className="text-xl font-semibold mb-6">
        Lead Growth
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}