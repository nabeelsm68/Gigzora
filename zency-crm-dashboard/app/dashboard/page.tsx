import DashboardHero from "@/components/ui/dashboard-hero";
import DashboardCards from "@/components/ui/dashboard-cards";
import LeadChart from "@/components/ui/lead-chart";
import RecentLeads from "@/components/ui/recent-leads";
import HotLeads from "@/components/ui/hot-leads";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic"; // Ensure fresh data on load

export default async function Dashboard() {
  // Fetch real statistics from Supabase
  const [
    { count: totalLeads },
    { count: hotLeads },
    { count: emailsSent },
    { count: clients },
    { data: allScores },
  ] = await Promise.all([
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).ilike("lead_grade", "%HOT%"),
    supabaseAdmin.from("emails_sent").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("status", "WON"),
    supabaseAdmin.from("leads").select("lead_score").not("lead_score", "is", null),
  ]);

  // Calculate Average Score
  let averageScore = 0;
  if (allScores && allScores.length > 0) {
    const sum = allScores.reduce((acc, curr) => acc + (curr.lead_score || 0), 0);
    averageScore = Math.round(sum / allScores.length);
  }

  // Calculate Conversion Rate
  const total = totalLeads || 0;
  const won = clients || 0;
  const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const stats = {
    total: total || 0,
    hot: hotLeads || 0,
    clients: won,
    averageScore,
    emails: emailsSent || 0,
    conversion: conversionRate,
  };

  return (
    <div className="space-y-8 max-w-[1400px]">
      <DashboardHero />

      <DashboardCards stats={stats} />

      <div className="grid lg:grid-cols-2 gap-8">
        <LeadChart />
        <HotLeads />
      </div>

      <RecentLeads />
    </div>
  );
}