"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Mail,
  Bot,
  BarChart3,
  Settings
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 p-4">

      <div className="mb-10">
  <h1 className="text-3xl font-bold">
    ⚡ Zency
  </h1>

  <p className="text-zinc-500 text-sm">
    Lead Intelligence Platform
  </p>
</div>

      <div className="space-y-2">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <LayoutDashboard size={18}/>
          Dashboard
        </Link>

        <Link
          href="/leads"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <Users size={18}/>
          Leads
        </Link>

        <Link
          href="/pipeline"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <KanbanSquare size={18}/>
          Pipeline
        </Link>

        <Link
          href="/campaigns"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <Mail size={18}/>
          Campaigns
        </Link>

        <Link
          href="/agent"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <Bot size={18}/>
          AI Agent
        </Link>

        <Link
          href="/analytics"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <BarChart3 size={18}/>
          Analytics
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
        >
          <Settings size={18}/>
          Settings
        </Link>

      </div>
    </div>
  );
}

<div className="absolute bottom-6 left-4 right-4">

  <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900">

    <p className="font-semibold">
      Nabeel
    </p>

    <p className="text-zinc-500 text-sm">
      Founder
    </p>

  </div>

</div>