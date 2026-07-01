"use client";

import { useState } from "react";

export default function AgentPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi Nabeel 👋 Ask me to generate leads, find hot leads, draft emails, or launch campaigns.",
    },
  ]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      console.log("CHAT RESPONSE:", data);

      let toolData = null;

      try {
        toolData = JSON.parse(
          data.reply
            .replace("```json", "")
            .replace("```", "")
            .trim()
        );
      } catch {
        toolData = null;
      }

      if (
        toolData &&
        toolData.tool === "generateLeads"
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "🚀 Generating leads... Please wait.",
          },
        ]);

        const leadRes = await fetch(
          "/api/generate-leads",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              query: toolData.query,
            }),
          }
        );

        const leadData =
          await leadRes.json();

        console.log(
          "LEAD RESPONSE:",
          leadData
        );

        if (leadData.success) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "✅ Lead generation completed successfully and saved to CRM.",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "❌ Lead generation failed.",
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
          },
        ]);
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="h-[80vh] flex flex-col">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          AI Copilot
        </h1>

        <p className="text-zinc-500 mt-2">
          Talk to your CRM.
        </p>
      </div>

      <div
        className="
        flex-1
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-6
        overflow-y-auto
        "
      >
        <div className="space-y-4">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`
                max-w-3xl
                rounded-2xl
                p-4
                whitespace-pre-wrap

                ${
                  msg.role === "user"
                    ? "bg-blue-600 ml-auto"
                    : "bg-zinc-800"
                }
              `}
            >
              {msg.content}
            </div>

          ))}

          {loading && (

            <div
              className="
              max-w-xl
              rounded-2xl
              bg-zinc-800
              p-4
              "
            >
              Thinking...
            </div>

          )}

        </div>
      </div>

      <div className="mt-4 flex gap-4">

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask your CRM anything..."
          className="
          flex-1
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          px-4
          py-3
          "
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="
          px-6
          rounded-xl
          bg-blue-600
          hover:bg-blue-500
          disabled:opacity-50
          "
        >
          Send
        </button>

      </div>

    </div>
  );
}