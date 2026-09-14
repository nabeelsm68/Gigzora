"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock } from "lucide-react";

interface Lead {
  id: string;
  business_name: string;
  email: string;
  lead_score: number;
  status: string;
}

export default function RecentLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    setLeads(data || []);
  }

  return (
    <div className="flex flex-col rounded-lg border border-[#262626] bg-[#161616]">
      <div className="flex items-center gap-2 p-5 border-b border-[#262626]">
        <Clock className="w-4 h-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Recent Pipeline Additions
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="px-5 py-3 text-xs font-mono text-zinc-500 font-medium uppercase tracking-wider">
                Business
              </th>
              <th className="px-5 py-3 text-xs font-mono text-zinc-500 font-medium uppercase tracking-wider">
                Contact
              </th>
              <th className="px-5 py-3 text-xs font-mono text-zinc-500 font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-mono text-zinc-500 font-medium uppercase tracking-wider text-right">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-5 text-sm text-zinc-500 text-center">
                  No recent leads.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#262626]/50 hover:bg-[#1C1C1C] transition-colors last:border-0"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm text-zinc-200 font-medium">
                      {lead.business_name}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-zinc-400">
                      {lead.email && lead.email !== 'nil' ? lead.email : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                      {lead.status || 'NEW'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-mono text-zinc-300">
                      {lead.lead_score}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}