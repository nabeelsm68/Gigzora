"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  business_name: string;
  lead_score: number;
}

export default function HotLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

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
    <div className="flex flex-col rounded-lg border border-[#262626] bg-[#161616]">
      <div className="flex items-center gap-2 p-5 border-b border-[#262626]">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Top Rated Leads
        </h2>
      </div>

      <div className="flex flex-col p-2">
        {leads.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500">No leads found.</div>
        ) : (
          leads.map((lead, index) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-3 rounded hover:bg-[#1C1C1C] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-zinc-300 font-medium">
                  {lead.business_name}
                </p>
              </div>

              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                {lead.lead_score}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}