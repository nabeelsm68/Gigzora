"use client";

import { useState } from "react";

interface Props {
  lead: any;
  onGenerateReport: () => Promise<void>;
}

export default function LeadActions({
  lead,
  onGenerateReport,
}: Props) {
  const [sending, setSending] = useState(false);
  const [researching, setResearching] =
    useState(false);

  async function sendEmail() {
    try {
      setSending(true);

      const res = await fetch(
        "/api/send-email",
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

      alert("✅ AI Email Sent");

    } catch (err) {

      console.error(err);

      alert("Failed to send email.");

    } finally {

      setSending(false);

    }
  }

  async function generateReport() {
    try {

      setResearching(true);

      await onGenerateReport();

    } finally {

      setResearching(false);

    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-8">

      <button
        onClick={sendEmail}
        disabled={sending}
        className="
        rounded-xl
        bg-blue-600
        hover:bg-blue-500
        transition
        py-3
        disabled:opacity-60
        "
      >
        {sending
          ? "Sending..."
          : "🚀 Send AI Email"}
      </button>

      <button
        onClick={generateReport}
        disabled={researching}
        className="
        rounded-xl
        bg-purple-600
        hover:bg-purple-500
        transition
        py-3
        disabled:opacity-60
        "
      >
        {researching
          ? "Generating..."
          : "🤖 AI Research"}
      </button>

      <a
        href={lead.website}
        target="_blank"
        className="
        rounded-xl
        bg-zinc-800
        hover:bg-zinc-700
        transition
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
        hover:bg-zinc-700
        transition
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
        hover:bg-zinc-700
        transition
        py-3
        text-center
        col-span-2
        "
      >
        📞 Call
      </a>

    </div>
  );
}