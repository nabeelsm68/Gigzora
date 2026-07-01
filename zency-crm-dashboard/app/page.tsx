"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
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
      hot: data.filter((l) => l.lead_grade?.includes("HOT")).length,
      warm: data.filter((l) => l.lead_grade?.includes("WARM")).length,
      cold: data.filter((l) => l.lead_grade?.includes("COLD")).length,
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Zency CRM Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="border rounded-xl p-6">
          <h2>Total Leads</h2>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2>🔥 Hot Leads</h2>
          <p className="text-4xl font-bold">{stats.hot}</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2>⚡ Warm Leads</h2>
          <p className="text-4xl font-bold">{stats.warm}</p>
        </div>

        <div className="border rounded-xl p-6">
          <h2>❄️ Cold Leads</h2>
          <p className="text-4xl font-bold">{stats.cold}</p>
        </div>
      </div>
    </div>
  );
}