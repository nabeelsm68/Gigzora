"use client";

import { useMemo } from "react";

export default function DashboardHero() {
  const today = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date());
  }, []);

  return (
    <div className="flex flex-col justify-end min-h-[140px] mb-8 pb-6 border-b border-[#262626]">
      <div className="space-y-1">
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          {today}
        </p>
        <h1 className="text-4xl font-semibold text-white tracking-tight">
          Overview
        </h1>
      </div>
    </div>
  );
}