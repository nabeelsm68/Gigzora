"use client";

import { useState } from "react";

export default function AgentPage() {

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  async function askAI() {

    if (!question.trim()) return;

    try {

      setLoading(true);

      setAnswer("");

      const res = await fetch("/api/agent", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question,
        }),

      });

      const data = await res.json();

      if (!data.success) {

        alert(data.error);

        return;

      }

      setAnswer(data.answer);

    } catch (err) {

      console.error(err);

      alert("Failed to contact AI.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div>

        <h1 className="text-5xl font-bold">

          🤖 Gigzora AI Agent

        </h1>

        <p className="text-zinc-500 mt-3">

          Ask questions about your CRM.

        </p>

      </div>

      <textarea

        value={question}

        onChange={(e) =>
          setQuestion(e.target.value)
        }

        placeholder="Example: Show me the HOT leads."

        className="
        w-full
        h-36
        rounded-2xl
        bg-zinc-900
        border
        border-zinc-800
        p-5
        resize-none
        "

      />

      <button

        onClick={askAI}

        disabled={loading}

        className="
        bg-blue-600
        hover:bg-blue-500
        px-8
        py-3
        rounded-xl
        "

      >

        {loading

          ? "Thinking..."

          : "Ask AI"}

      </button>

      {answer && (

        <div

          className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
          whitespace-pre-wrap
          "

        >

          <h2 className="font-bold text-xl mb-4">

            AI Response

          </h2>

          {answer}

        </div>

      )}

    </div>

  );

}