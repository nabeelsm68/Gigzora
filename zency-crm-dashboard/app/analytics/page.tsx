"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DashboardCards from "@/components/ui/dashboard-cards";

export default function Analytics() {

  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    clients: 0,
    averageScore: 0,
    emails: 0,
    conversion: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    const { data } = await supabase
      .from("leads")
      .select("*");

    if (!data) return;

    const total = data.length;

    const hot = data.filter(
      l => l.lead_grade?.includes("HOT")
    ).length;

    const clients = data.filter(
      l => l.status === "CLIENT"
    ).length;

    const emails = data.filter(
      l => l.last_email_sent_at
    ).length;

    const averageScore =
      Math.round(
        data.reduce(
          (a, b) => a + (b.lead_score || 0),
          0
        ) / Math.max(total,1)
      );

    const conversion =
      total === 0
        ? 0
        : Math.round(
            (clients / total) * 100
          );

    setStats({
      total,
      hot,
      clients,
      emails,
      averageScore,
      conversion,
    });

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Analytics
        </h1>

        <p className="text-zinc-500 mt-3">
          Live CRM performance
        </p>

      </div>

      <DashboardCards stats={stats} />

    </div>

  );

}