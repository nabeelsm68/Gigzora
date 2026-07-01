"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
    }
  }, [lead]);

  if (!open || !lead) return null;

  const score = lead.lead_score || 0;

  async function saveNotes() {
    setSaving(true);

    const { error } = await supabase
      .from("leads")
      .update({
        notes,
      })
      .eq("id", lead.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Notes saved successfully!");
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={() => onOpenChange(false)}
      />

      <div
        className="
        fixed
        right-0
        top-0
        h-screen
        w-[520px]
        bg-zinc-950
        border-l
        border-zinc-800
        overflow-y-auto
        z-50
        "
      >
        <div className="p-8">

          {/* Header */}

          <div className="flex justify-between items-start">

            <div>

              <h1 className="text-3xl font-bold">
                {lead.business_name}
              </h1>

              <p className="text-zinc-500 mt-2">
                Lead Profile
              </p>

            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="text-zinc-500 hover:text-white text-xl"
            >
              ✕
            </button>

          </div>

          {/* Actions */}

          <div className="grid grid-cols-2 gap-3 mt-8">

            <button
              onClick={async () => {
                try {

                  const res = await fetch("/api/send-email", {
                    method: "POST",

                    headers: {
                      "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                      lead,
                    }),
                  });

                  const data = await res.json();

                  if (!data.success) {
                    alert(data.error || "Failed");
                    return;
                  }

                  alert("✅ Email sent successfully!");

                } catch (err) {

                  console.error(err);

                  alert("Failed to send email.");

                }
              }}
              className="
              rounded-xl
              bg-blue-600
              py-3
              hover:bg-blue-500
              transition
              "
            >
              🚀 Send AI Email
            </button>

            <a
              href={lead.website}
              target="_blank"
              className="
              rounded-xl
              bg-zinc-800
              py-3
              text-center
              "
            >
              🌐 Website
            </a>

            <a
              href={`mailto:${lead.email}`}
              className="
              rounded-xl
              bg-zinc-800
              py-3
              text-center
              "
            >
              📧 Open Mail
            </a>

            <a
              href={`tel:${lead.phone}`}
              className="
              rounded-xl
              bg-zinc-800
              py-3
              text-center
              "
            >
              📞 Call
            </a>

          </div>

          {/* Lead Score */}

          <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

            <p className="text-zinc-400">
              Lead Health Score
            </p>

            <h2 className="text-5xl font-bold mt-2">
              {score}
            </h2>

            <div className="w-full h-3 bg-zinc-800 rounded-full mt-4">

              <div
                className="h-3 rounded-full bg-blue-500"
                style={{
                  width: `${score}%`,
                }}
              />

            </div>

          </div>

          {/* Contact */}

          <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

            <h3 className="font-semibold mb-4">
              Contact Information
            </h3>

            <div className="space-y-4">

              <div>

                <p className="text-zinc-500 text-sm">
                  Email
                </p>

                <p>{lead.email || "N/A"}</p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Phone
                </p>

                <p>{lead.phone || "N/A"}</p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Website
                </p>

                <p>{lead.website || "N/A"}</p>

              </div>

            </div>

          </div>

          {/* Notes */}

          <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

            <h3 className="font-semibold mb-4">
              CRM Notes
            </h3>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="
              w-full
              h-40
              rounded-xl
              bg-zinc-900
              border
              border-zinc-700
              p-4
              resize-none
              "
              placeholder="Write meeting notes, reminders, follow-ups..."
            />

            <button
              onClick={saveNotes}
              disabled={saving}
              className="
              mt-4
              w-full
              rounded-xl
              bg-green-600
              py-3
              hover:bg-green-500
              transition
              disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : "💾 Save Notes"}
            </button>

          </div>

        </div>

      </div>

    </>
  );
}