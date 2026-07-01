"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LeadDrawer from "./lead-drawer";

export default function LeadTable() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("lead_score", { ascending: false });

    setLeads(data || []);
  }

  const filtered = leads.filter((lead) =>
    lead.business_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  function gradeColor(grade: string) {
    if (grade?.includes("HOT")) {
      return "bg-green-500/15 text-green-400";
    }

    if (grade?.includes("WARM")) {
      return "bg-yellow-500/15 text-yellow-400";
    }

    return "bg-blue-500/15 text-blue-400";
  }

  async function updateStatus(
    leadId: number,
    newStatus: string
  ) {
    const { error } = await supabase
      .from("leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      return;
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );
  }

  return (
    <>
      <div className="space-y-6">

        <div className="flex gap-4">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="
            flex-1
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-3
            outline-none
            "
          />

          <button
            className="
            px-5
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            transition
            "
          >
            Export
          </button>

        </div>

        <div
          className="
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-900/40
          backdrop-blur-xl
          overflow-hidden
          "
        >

          <table className="w-full">

            <thead className="border-b border-zinc-800">

              <tr className="text-zinc-400">

                <th className="p-5 text-left">
                  Business
                </th>

                <th className="p-5 text-left">
                  Email
                </th>

                <th className="p-5 text-left">
                  Score
                </th>

                <th className="p-5 text-left">
                  Grade
                </th>

                <th className="p-5 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((lead) => (

                <tr
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setDrawerOpen(true);
                  }}
                  className="
                  border-b
                  border-zinc-800
                  hover:bg-zinc-800/40
                  cursor-pointer
                  transition
                  "
                >

                  <td className="p-5">

                    <div>

                      <p className="font-semibold">
                        {lead.business_name}
                      </p>

                      <p className="text-zinc-500 text-sm">
                        {lead.website || "No website"}
                      </p>

                    </div>

                  </td>

                  <td className="p-5">
                    {lead.email || "N/A"}
                  </td>

                  <td className="p-5">

                    <span className="font-bold">
                      {lead.lead_score}
                    </span>

                  </td>

                  <td className="p-5">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${gradeColor(lead.lead_grade)}
                      `}
                    >
                      {lead.lead_grade}
                    </span>

                  </td>

                  <td
                    className="p-5"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <select
                      value={
                        lead.status || "NEW"
                      }
                      onChange={(e) =>
                        updateStatus(
                          lead.id,
                          e.target.value
                        )
                      }
                      className="
                      bg-zinc-900
                      border
                      border-zinc-700
                      rounded-lg
                      px-3
                      py-2
                      "
                    >
                      <option value="NEW">
                        NEW
                      </option>

                      <option value="CONTACTED">
                        CONTACTED
                      </option>

                      <option value="REPLIED">
                        REPLIED
                      </option>

                      <option value="CLIENT">
                        CLIENT
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <LeadDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        lead={selectedLead}
      />
    </>
  );
}