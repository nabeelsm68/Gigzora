"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecentLeads() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setLeads(data || []);
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-semibold mb-6">
        Recent Leads
      </h2>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between border-b border-zinc-800 pb-3"
          >
            <div>
              <p className="font-medium">
                {lead.business_name}
              </p>

              <p className="text-sm text-zinc-400">
                {lead.email}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">
                {lead.lead_score}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}