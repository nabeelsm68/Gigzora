"use client";

import { 
  Users, 
  Flame, 
  Briefcase, 
  Mail, 
  Target, 
  TrendingUp 
} from "lucide-react";

interface Props {
  stats: {
    total: number;
    hot: number;
    clients: number;
    averageScore: number;
    emails: number;
    conversion: number;
  };
}

export default function DashboardCards({ stats }: Props) {
  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      icon: <Users className="w-4 h-4 text-zinc-400" />,
    },
    {
      title: "HOT Leads",
      value: stats.hot,
      icon: <Flame className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: "Clients Won",
      value: stats.clients,
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
    },
    {
      title: "Emails Sent",
      value: stats.emails,
      icon: <Mail className="w-4 h-4 text-zinc-400" />,
    },
    {
      title: "Average Score",
      value: stats.averageScore,
      icon: <Target className="w-4 h-4 text-zinc-400" />,
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversion}%`,
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            flex flex-col
            rounded-lg
            border border-[#262626]
            bg-[#161616]
            p-4
            transition-colors
            hover:bg-[#1C1C1C]
          "
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider font-mono">
              {card.title}
            </p>
            {card.icon}
          </div>
          
          <h2 className="text-2xl font-semibold text-white tracking-tight mt-auto">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}