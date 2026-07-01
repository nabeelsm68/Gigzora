import DashboardHero from "@/components/ui/dashboard-hero";
import DashboardCards from "@/components/ui/dashboard-cards";
import LeadChart from "@/components/ui/lead-chart";
import RecentLeads from "@/components/ui/recent-leads";
import HotLeads from "@/components/ui/hot-leads";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <DashboardHero />

      <DashboardCards />

      <div className="grid lg:grid-cols-2 gap-8">
        <LeadChart />
        <HotLeads />
      </div>

      <RecentLeads />

    </div>
  );
}