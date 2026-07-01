interface Props {
  lead: any;
}

export default function ContactCard({
  lead,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

      <h3 className="font-semibold text-lg mb-6">
        Contact Information
      </h3>

      <div className="space-y-5">

        <div>
          <p className="text-zinc-500 text-sm">
            Business
          </p>

          <p className="font-medium">
            {lead.business_name || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">
            Category
          </p>

          <p>
            {lead.category || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">
            Email
          </p>

          <p className="break-all">
            {lead.email || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">
            Phone
          </p>

          <p>
            {lead.phone || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">
            Website
          </p>

          {lead.website ? (
            <a
              href={lead.website}
              target="_blank"
              className="
              text-blue-400
              hover:underline
              break-all
              "
            >
              {lead.website}
            </a>
          ) : (
            <p>N/A</p>
          )}
        </div>

        <div>
          <p className="text-zinc-500 text-sm">
            Lead Grade
          </p>

          <span
            className="
            inline-flex
            mt-2
            rounded-full
            bg-green-500/20
            text-green-400
            px-3
            py-1
            text-sm
            "
          >
            {lead.lead_grade || "N/A"}
          </span>
        </div>

      </div>

    </div>
  );
}