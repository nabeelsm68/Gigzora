"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Mail,
  Users,
  Flame,
  Eye,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

interface ScrapeEvent {
  type: string;
  message?: string;
  phase?: number;
  current?: number;
  total?: number;
  count?: number;
  name?: string;
  email_found?: boolean;
  hot?: number;
  warm?: number;
  with_email?: number;
  elapsed_seconds?: number;
}

interface Lead {
  id: number;
  business_name: string;
  email: string;
  category: string;
  website: string;
  phone: string;
  address: string;
  lead_score: number;
  lead_grade: string;
  business_size: string;
  status: string;
  rating: number;
}

// ─────────────────────────────────────────────────────
// Placeholder chips
// ─────────────────────────────────────────────────────

const PLACEHOLDERS = [
  { label: "Business Name", value: "{{business_name}}" },
  { label: "Category", value: "{{category}}" },
  { label: "Website", value: "{{website}}" },
  { label: "City", value: "{{city}}" },
  { label: "Business Size", value: "{{business_size}}" },
  { label: "Sender Name", value: "{{sender_name}}" },
];

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

export default function CampaignsPage() {
  // ── Scraper state ────────────────────────────────
  const [scrapeQuery, setScrapeQuery] = useState("");
  const [maxLeads, setMaxLeads] = useState(50);
  const [scraping, setScraping] = useState(false);
  const [scrapeLog, setScrapeLog] = useState<
    ScrapeEvent[]
  >([]);
  const [scrapeResult, setScrapeResult] =
    useState<ScrapeEvent | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // ── Email state ──────────────────────────────────
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadFilter, setLeadFilter] = useState<
    "all_new" | "hot" | "all_with_email"
  >("all_new");
  const [subject, setSubject] = useState(
    "Hi {{business_name}} — Quick question about your online presence"
  );
  const [body, setBody] = useState(
    `Hi there,\n\nI came across {{business_name}} while researching {{category}} businesses in {{city}} and was impressed.\n\nI noticed a few opportunities to boost your online presence — especially around your website and social media.\n\nWe help {{business_size}} businesses like yours with:\n• Professional website design\n• Social media marketing\n• AI-powered automation\n\nWould you be open to a quick 10-minute call this week?\n\nBest,\n{{sender_name}}`
  );
  const [testMode, setTestMode] = useState(true);
  const [testEmail, setTestEmail] = useState(
    "sudeepmukul@gmail.com"
  );
  const [senderName, setSenderName] =
    useState("Sudeep Mukul");
  const [senderEmail, setSenderEmail] = useState(
    "sudeepmukul@zencystudios.in"
  );
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);
  const [showPreview, setShowPreview] =
    useState(false);
  const [showConfirm, setShowConfirm] =
    useState(false);

  // ── Load leads on mount ──────────────────────────
  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [scrapeLog]);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("lead_score", { ascending: false });
    setLeads(data || []);
  }

  // ── Filtered leads for email ─────────────────────

  function getFilteredLeads(): Lead[] {
    return leads.filter((l) => {
      const hasEmail =
        l.email &&
        l.email !== "nil" &&
        l.email !== "";

      if (!hasEmail) return false;

      if (leadFilter === "all_new") {
        return (
          !l.status || l.status === "NEW"
        );
      }
      if (leadFilter === "hot") {
        return l.lead_grade?.includes("HOT");
      }
      return true; // all_with_email
    });
  }

  // ── Preview helper ───────────────────────────────

  function previewReplace(
    template: string,
    lead?: Lead
  ): string {
    if (!lead) return template;

    const address = lead.address || "";
    const cityParts = address.split(",");
    const city =
      cityParts.length > 1
        ? cityParts[cityParts.length - 2]?.trim()
        : cityParts[0]?.trim() || "";

    return template
      .replace(
        /\{\{business_name\}\}/g,
        lead.business_name || "Business"
      )
      .replace(
        /\{\{email\}\}/g,
        lead.email || ""
      )
      .replace(
        /\{\{category\}\}/g,
        lead.category || "Business"
      )
      .replace(
        /\{\{website\}\}/g,
        lead.website || ""
      )
      .replace(
        /\{\{phone\}\}/g,
        lead.phone || ""
      )
      .replace(
        /\{\{address\}\}/g,
        lead.address || ""
      )
      .replace(/\{\{city\}\}/g, city)
      .replace(
        /\{\{rating\}\}/g,
        String(lead.rating || "")
      )
      .replace(
        /\{\{lead_score\}\}/g,
        String(lead.lead_score || "")
      )
      .replace(
        /\{\{lead_grade\}\}/g,
        lead.lead_grade || ""
      )
      .replace(
        /\{\{business_size\}\}/g,
        lead.business_size || ""
      )
      .replace(
        /\{\{sender_name\}\}/g,
        senderName
      )
      .replace(
        /\{\{sender_email\}\}/g,
        senderEmail
      );
  }

  // ── Start scraping ───────────────────────────────

  async function startScraping() {
    if (!scrapeQuery.trim()) return;

    setScraping(true);
    setScrapeLog([]);
    setScrapeResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: scrapeQuery,
          maxLeads,
        }),
      });

      const reader =
        res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } =
          await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: ScrapeEvent =
                JSON.parse(line.slice(6));

              setScrapeLog((prev) => [
                ...prev,
                event,
              ]);

              if (
                event.type === "complete"
              ) {
                setScrapeResult(event);
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err: any) {
      setScrapeLog((prev) => [
        ...prev,
        {
          type: "error",
          message: err.message,
        },
      ]);
    } finally {
      setScraping(false);
      // Refresh leads list
      loadLeads();
    }
  }

  // ── Send campaign ────────────────────────────────

  async function sendCampaign() {
    setShowConfirm(false);
    setSending(true);
    setSendResult(null);

    try {
      const filteredLeads = getFilteredLeads();
      const leadIds = filteredLeads.map(
        (l) => l.id
      );

      const res = await fetch(
        "/api/campaign/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            leadIds,
            subject,
            body,
            testMode,
            testEmail,
            senderName,
            senderEmail,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSendResult({
          sent: data.sent,
          failed: data.failed,
          total: data.total,
        });
        loadLeads();
      } else {
        alert(
          `Error: ${data.error}`
        );
      }
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  // ── Render ───────────────────────────────────────

  const filteredLeads = getFilteredLeads();
  const previewLead = filteredLeads[0];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-4xl font-bold">
          Campaigns
        </h1>
        <p className="text-zinc-500 mt-2">
          Scrape leads and send personalized emails — all in one place.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          SECTION 1: AUTO SCRAPER
          ═══════════════════════════════════════ */}

      <div
        className="
        flex flex-col rounded-lg border border-[#262626] bg-[#161616] p-6
      "
      >
        <div className="flex items-center gap-3 mb-6 border-b border-[#262626] pb-4">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Search
              className="text-blue-400"
              size={20}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Auto Scraper
            </h2>
            <p className="text-zinc-500 text-sm">
              Scrape Google Maps for business
              leads automatically
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            value={scrapeQuery}
            onChange={(e) =>
              setScrapeQuery(e.target.value)
            }
            placeholder='e.g. "Restaurants in Mumbai"'
            disabled={scraping}
            className="
              flex-1 rounded border border-[#262626] bg-[#0A0A0A]
              px-4 py-2 text-sm outline-none
              focus:border-[#3B82F6]
              transition placeholder:text-zinc-600
              disabled:opacity-50 text-white
            "
            onKeyDown={(e) => {
              if (e.key === "Enter")
                startScraping();
            }}
          />

          <div className="flex items-center gap-2">
            <label className="text-zinc-500 text-sm whitespace-nowrap">
              Max:
            </label>
            <input
              type="number"
              value={maxLeads}
              onChange={(e) =>
                setMaxLeads(
                  Math.max(
                    1,
                    parseInt(e.target.value) ||
                      1
                  )
                )
              }
              disabled={scraping}
              className="
                w-20 rounded border border-[#262626] bg-[#0A0A0A]
                px-3 py-2 text-sm outline-none text-center
                focus:border-[#3B82F6]
                disabled:opacity-50 text-white
              "
            />
          </div>

          <button
            onClick={startScraping}
            disabled={
              scraping || !scrapeQuery.trim()
            }
            className="
              px-6 py-2 rounded bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white
              transition text-sm font-medium
              disabled:opacity-50
              flex items-center gap-2
              whitespace-nowrap
            "
          >
            {scraping ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={18}
                />
                Scraping...
              </>
            ) : (
              <>
                <Zap size={18} />
                Start Scraping
              </>
            )}
          </button>
        </div>

        {/* Scrape log */}
        {scrapeLog.length > 0 && (
          <div
            className="
            rounded-xl border border-zinc-800
            bg-black/50 p-4 max-h-72 overflow-y-auto
            font-mono text-sm space-y-1
          "
          >
            {scrapeLog.map((event, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  event.type === "error"
                    ? "text-red-400"
                    : event.type === "complete"
                    ? "text-green-400"
                    : event.type === "phase"
                    ? "text-blue-400 font-semibold"
                    : "text-zinc-400"
                }`}
              >
                <span className="text-zinc-600 select-none shrink-0">
                  {event.type === "error"
                    ? "✗"
                    : event.type === "complete"
                    ? "✓"
                    : event.type === "phase"
                    ? "►"
                    : "·"}
                </span>
                <span>
                  {event.message}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}

        {/* Scrape result summary */}
        {scrapeResult && (
          <div
            className="
            mt-4 rounded-xl border border-green-800/50
            bg-green-950/30 p-5
          "
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                className="text-green-400"
                size={20}
              />
              <span className="font-semibold text-green-400">
                Scraping Complete!
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {scrapeResult.total}
                </p>
                <p className="text-zinc-500 text-sm">
                  Total Leads
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">
                  {scrapeResult.hot}
                </p>
                <p className="text-zinc-500 text-sm">
                  🔥 Hot
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {scrapeResult.warm}
                </p>
                <p className="text-zinc-500 text-sm">
                  ⚡ Warm
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {scrapeResult.with_email}
                </p>
                <p className="text-zinc-500 text-sm">
                  📧 With Email
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          SECTION 2: EMAIL CAMPAIGN
          ═══════════════════════════════════════ */}

      <div
        className="
        flex flex-col rounded-lg border border-[#262626] bg-[#161616] p-6
      "
      >
        <div className="flex items-center gap-3 mb-6 border-b border-[#262626] pb-4">
          <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
            <Mail
              className="text-purple-400"
              size={20}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Email Campaign
            </h2>
            <p className="text-zinc-500 text-sm">
              Send personalized emails to your scraped leads
            </p>
          </div>
        </div>

        {/* ── Sender config ─────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-zinc-500 text-sm mb-1 block">
              Sender Name
            </label>
            <input
              value={senderName}
              onChange={(e) =>
                setSenderName(e.target.value)
              }
              className="
                w-full rounded border border-[#262626] bg-[#0A0A0A]
                px-4 py-2 text-sm outline-none text-white
                focus:border-[#3B82F6]
                transition
              "
            />
          </div>
          <div>
            <label className="text-zinc-500 text-sm mb-1 block font-medium">
              Sender Email
            </label>
            <input
              value={senderEmail}
              onChange={(e) =>
                setSenderEmail(e.target.value)
              }
              className="
                w-full rounded border border-[#262626] bg-[#0A0A0A]
                px-4 py-2 text-sm outline-none text-white
                focus:border-[#3B82F6]
                transition
              "
            />
          </div>
        </div>

        {/* ── Lead filter ───────────────────── */}
        <div className="mb-6">
          <label className="text-zinc-500 text-sm mb-2 block font-medium">
            Send to
          </label>
          <div className="flex gap-3">
            {[
              {
                key: "all_new" as const,
                label: "All NEW leads with email",
                icon: <Users size={16} />,
              },
              {
                key: "hot" as const,
                label: "HOT leads only",
                icon: <Flame size={16} />,
              },
              {
                key: "all_with_email" as const,
                label: "All leads with email",
                icon: <Mail size={16} />,
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() =>
                  setLeadFilter(f.key)
                }
                className={`
                  px-4 py-2 rounded border
                  transition text-sm font-medium
                  flex items-center gap-2
                  ${
                    leadFilter === f.key
                      ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]"
                      : "border-[#262626] bg-[#0A0A0A] text-zinc-400 hover:border-[#3F3F46]"
                  }
                `}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-zinc-600 text-sm mt-2">
            {filteredLeads.length} leads match
            this filter
          </p>
        </div>

        {/* ── Subject line ──────────────────── */}
        <div className="mb-4">
          <label className="text-zinc-500 text-sm mb-1 block">
            Subject Line
          </label>
          <input
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            className="
              w-full rounded border border-[#262626] bg-[#0A0A0A]
              px-4 py-2 text-sm outline-none text-white
              focus:border-[#3B82F6]
              transition
            "
          />
        </div>

        {/* ── Placeholder chips ─────────────── */}
        <div className="mb-4">
          <label className="text-zinc-500 text-sm mb-2 block font-medium">
            Insert placeholder
          </label>
          <div className="flex flex-wrap gap-2">
            {PLACEHOLDERS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setBody(
                    (prev) =>
                      prev + " " + p.value
                  );
                }}
                className="
                  px-3 py-1.5 rounded
                  bg-[#0A0A0A] border border-[#262626]
                  text-zinc-400 text-xs font-mono
                  hover:border-[#3B82F6] hover:text-[#3B82F6]
                  transition
                "
              >
                <Sparkles
                  size={12}
                  className="inline mr-1.5"
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body textarea ─────────────────── */}
        <div className="mb-6">
          <label className="text-zinc-500 text-sm mb-1 block">
            Email Body
          </label>
          <textarea
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
            rows={12}
            className="
              w-full rounded border border-[#262626] bg-[#0A0A0A]
              px-4 py-3 text-sm outline-none text-white
              focus:border-[#3B82F6]
              transition font-mono
              resize-y
            "
          />
        </div>

        {/* ── Preview ───────────────────────── */}
        <div className="mb-6">
          <button
            onClick={() =>
              setShowPreview(!showPreview)
            }
            className="
              flex items-center gap-2
              text-sm text-zinc-400
              hover:text-white transition
            "
          >
            <Eye size={16} />
            {showPreview
              ? "Hide Preview"
              : "Show Preview"}
          </button>

          {showPreview && previewLead && (
            <div
              className="
              mt-3 rounded-xl border
              border-zinc-700 bg-zinc-950 p-6
            "
            >
              <p className="text-zinc-500 text-xs mb-3">
                Preview for:{" "}
                <span className="text-white">
                  {previewLead.business_name}
                </span>
              </p>
              <div className="border-b border-zinc-800 pb-3 mb-3">
                <p className="text-sm text-zinc-400">
                  Subject:
                </p>
                <p className="font-semibold">
                  {previewReplace(
                    subject,
                    previewLead
                  )}
                </p>
              </div>
              <div className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">
                {previewReplace(
                  body,
                  previewLead
                )}
              </div>
            </div>
          )}

          {showPreview && !previewLead && (
            <p className="mt-3 text-zinc-600 text-sm">
              No matching leads to preview. Try
              changing the filter or scrape some
              leads first.
            </p>
          )}
        </div>

        {/* ── Test mode toggle ──────────────── */}
        <div
          className="
          rounded-xl border border-yellow-800/50
          bg-yellow-950/20 p-4 mb-6
        "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="text-yellow-500"
                size={18}
              />
              <div>
                <p className="font-semibold text-yellow-400 text-sm">
                  Test Mode{" "}
                  {testMode ? "ON" : "OFF"}
                </p>
                <p className="text-zinc-500 text-xs">
                  {testMode
                    ? "Emails will be sent to your test email only"
                    : "⚠️ Emails will be sent to ACTUAL leads"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {testMode && (
                <input
                  value={testEmail}
                  onChange={(e) =>
                    setTestEmail(e.target.value)
                  }
                  className="
                    rounded-lg border border-zinc-700
                    bg-zinc-800 px-3 py-1.5
                    text-sm outline-none w-56
                  "
                  placeholder="test@email.com"
                />
              )}
              <button
                onClick={() =>
                  setTestMode(!testMode)
                }
                className={`
                  px-4 py-1.5 rounded-lg text-sm
                  font-medium transition
                  ${
                    testMode
                      ? "bg-yellow-600/30 text-yellow-400 border border-yellow-700"
                      : "bg-red-600/30 text-red-400 border border-red-700"
                  }
                `}
              >
                {testMode
                  ? "Test Mode"
                  : "LIVE Mode"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Send button ───────────────────── */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={
            sending ||
            filteredLeads.length === 0
          }
          className="
            w-full py-3 rounded
            bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white
            transition text-sm font-semibold
            disabled:opacity-40
            flex items-center justify-center gap-2
          "
        >
          {sending ? (
            <>
              <Loader2
                className="animate-spin"
                size={22}
              />
              Sending Emails...
            </>
          ) : (
            <>
              <Send size={22} />
              Send Campaign (
              {filteredLeads.length} leads)
            </>
          )}
        </button>

        {/* ── Send result ───────────────────── */}
        {sendResult && (
          <div
            className={`
            mt-4 rounded-xl border p-5
            ${
              sendResult.failed === 0
                ? "border-green-800/50 bg-green-950/30"
                : "border-yellow-800/50 bg-yellow-950/30"
            }
          `}
          >
            <div className="flex items-center gap-2 mb-2">
              {sendResult.failed === 0 ? (
                <CheckCircle2
                  className="text-green-400"
                  size={20}
                />
              ) : (
                <AlertTriangle
                  className="text-yellow-400"
                  size={20}
                />
              )}
              <span className="font-semibold">
                Campaign Complete
              </span>
            </div>
            <p className="text-zinc-400 text-sm">
              ✅ {sendResult.sent} sent
              {sendResult.failed > 0 &&
                ` · ❌ ${sendResult.failed} failed`}
              {" "}· out of{" "}
              {sendResult.total} total
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          CONFIRMATION MODAL
          ═══════════════════════════════════════ */}

      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() =>
              setShowConfirm(false)
            }
          />
          <div
            className="
            fixed top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            z-50 w-[480px]
            rounded-2xl border border-zinc-700
            bg-zinc-900 p-8
          "
          >
            <h3 className="text-xl font-bold mb-4">
              Confirm Send
            </h3>
            <div className="space-y-2 text-sm text-zinc-400 mb-6">
              <p>
                📧 Sending to:{" "}
                <span className="text-white font-medium">
                  {filteredLeads.length} leads
                </span>
              </p>
              <p>
                📬 Mode:{" "}
                <span
                  className={
                    testMode
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {testMode
                    ? `Test (${testEmail})`
                    : "LIVE — real emails"}
                </span>
              </p>
              <p>
                👤 Sender:{" "}
                <span className="text-white">
                  {senderName} ({senderEmail})
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowConfirm(false)
                }
                className="
                  flex-1 py-2 rounded text-sm font-medium
                  border border-[#262626] bg-[#0A0A0A] text-white
                  hover:bg-[#161616] transition
                "
              >
                Cancel
              </button>
              <button
                onClick={sendCampaign}
                className="
                  flex-1 py-2 rounded text-sm font-medium
                  bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white
                  transition
                "
              >
                Send Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}