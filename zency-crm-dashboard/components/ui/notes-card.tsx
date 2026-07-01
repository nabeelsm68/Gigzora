"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  lead: any;
}

export default function NotesCard({ lead }: Props) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(lead?.notes || "");
  }, [lead]);

  async function saveNotes() {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("leads")
        .update({
          notes,
        })
        .eq("id", lead.id);

      if (error) {
        alert(error.message);
        return;
      }

      alert("✅ Notes saved");

    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

      <h3 className="font-semibold text-lg mb-5">
        📝 CRM Notes
      </h3>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Meeting notes, reminders, follow-ups..."
        className="
        w-full
        h-40
        rounded-xl
        bg-zinc-900
        border
        border-zinc-700
        p-4
        resize-none
        outline-none
        "
      />

      <button
        onClick={saveNotes}
        disabled={saving}
        className="
        mt-4
        w-full
        rounded-xl
        bg-green-600
        hover:bg-green-500
        transition
        py-3
        disabled:opacity-60
        "
      >
        {saving
          ? "Saving..."
          : "💾 Save Notes"}
      </button>

    </div>
  );
}