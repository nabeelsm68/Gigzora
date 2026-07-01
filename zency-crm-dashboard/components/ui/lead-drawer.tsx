"use client";

import { useState } from "react";

import AIReport from "./ai-report";
import LeadActions from "./lead-actions";
import ScoreCard from "./score-card";
import ContactCard from "./contact-card";
import NotesCard from "./notes-card";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
}

export default function LeadDrawer({
  open,
  onOpenChange,
  lead,
}: Props) {
  const [report, setReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] =
    useState(false);

  if (!open || !lead) return null;

  async function generateReport() {
    try {
      setLoadingReport(true);

      const res = await fetch(
        "/api/ai-research",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            lead,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      setReport(data.report);

    } catch (err) {

      console.error(err);

      alert("Failed to generate AI report.");

    } finally {

      setLoadingReport(false);

    }
  }

  return (
    <>
      <div
        className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm
        z-40
        "
        onClick={() => onOpenChange(false)}
      />

      <div
        className="
        fixed
        right-0
        top-0
        h-screen
        w-[560px]
        bg-zinc-950
        border-l
        border-zinc-800
        overflow-y-auto
        z-50
        "
      >
        <div className="p-8">

          <div className="flex justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                {lead.business_name}
              </h1>

              <p className="text-zinc-500 mt-2">
                Lead Workspace
              </p>

            </div>

            <button
              onClick={() =>
                onOpenChange(false)
              }
              className="
              text-2xl
              text-zinc-500
              hover:text-white
              "
            >
              ✕
            </button>

          </div>

          <LeadActions
            lead={lead}
            onGenerateReport={generateReport}
          />

          <ScoreCard
            score={lead.lead_score || 0}
          />

          <ContactCard lead={lead} />

          {loadingReport && (

            <div
              className="
              mt-8
              rounded-2xl
              border
              border-zinc-800
              p-10
              text-center
              "
            >
              <h2 className="text-xl font-semibold">
                🤖 AI is researching...
              </h2>

              <p className="text-zinc-500 mt-2">
                This takes a few seconds.
              </p>
            </div>

          )}

          {!loadingReport && report && (

            <AIReport
              report={report}
            />

          )}

          <NotesCard
            lead={lead}
          />

        </div>

      </div>

    </>
  );
}