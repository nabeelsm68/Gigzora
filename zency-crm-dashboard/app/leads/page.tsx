import LeadTable from "@/components/ui/lead-table";

export default function LeadsPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Leads
        </h1>

        <p className="text-zinc-500 mt-2">
          Manage and track your generated leads.
        </p>
      </div>

      <LeadTable />

    </div>
  );
}