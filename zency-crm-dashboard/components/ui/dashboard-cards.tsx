"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data } = await supabase
      .from("leads")
      .select("*");

    if (!data) return;

    setStats({
      total: data.length,

      hot: data.filter((lead) =>
        lead.lead_grade?.includes("HOT")
      ).length,

      warm: data.filter((lead) =>
        lead.lead_grade?.includes("WARM")
      ).length,

      cold: data.filter((lead) =>
        lead.lead_grade?.includes("COLD")
      ).length,
    });
  }

  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      color: "from-blue-500/20",
    },
    {
      title: "Hot Leads",
      value: stats.hot,
      color: "from-green-500/20",
    },
    {
      title: "Warm Leads",
      value: stats.warm,
      color: "from-yellow-500/20",
    },
    {
      title: "Cold Leads",
      value: stats.cold,
      color: "from-cyan-500/20",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
            rounded-3xl
            border
            border-zinc-800
            bg-gradient-to-br
            ${card.color}
            to-transparent
            backdrop-blur-xl
            p-6
            hover:scale-[1.02]
            transition
          `}
        >
          <p className="text-zinc-400 text-sm">
            {card.title}
          </p>

          <h2 className="text-5xl font-bold mt-4">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}