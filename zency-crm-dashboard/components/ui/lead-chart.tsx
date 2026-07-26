"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Activity } from "lucide-react";

const data = [
  { day: "Mon", leads: 20 },
  { day: "Tue", leads: 45 },
  { day: "Wed", leads: 60 },
  { day: "Thu", leads: 40 },
  { day: "Fri", leads: 95 },
  { day: "Sat", leads: 120 },
  { day: "Sun", leads: 140 },
];

export default function LeadChart() {
  return (
    <div className="flex flex-col rounded-lg border border-[#262626] bg-[#161616]">
      <div className="flex items-center gap-2 p-5 border-b border-[#262626]">
        <Activity className="w-4 h-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Lead Velocity
        </h2>
      </div>

      <div className="p-5 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#52525B" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#52525B" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1C1C1C', 
                border: '1px solid #3F3F46',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#E4E4E7' }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#131313', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}