"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HotLeads() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("lead_score", { ascending: false })
      .limit(5);

    setLeads(data || []);
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-semibold mb-6">
        🔥 Top Hot Leads
      </h2>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex justify-between"
          >
            <p>{lead.business_name}</p>

            <span className="text-blue-400">
              {lead.lead_score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}