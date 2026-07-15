"use client";

interface Props {
  stats: {
    total: number;
    hot: number;
    clients: number;
    averageScore: number;
    emails: number;
    conversion: number;
  };
}

export default function DashboardCards({
  stats,
}: Props) {

  const cards = [
    {
      title: "📊 Total Leads",
      value: stats.total,
      color: "from-blue-500/20",
    },
    {
      title: "🔥 HOT Leads",
      value: stats.hot,
      color: "from-green-500/20",
    },
    {
      title: "💰 Clients",
      value: stats.clients,
      color: "from-purple-500/20",
    },
    {
      title: "📧 Emails Sent",
      value: stats.emails,
      color: "from-orange-500/20",
    },
    {
      title: "⭐ Avg Score",
      value: stats.averageScore,
      color: "from-cyan-500/20",
    },
    {
      title: "🎯 Conversion",
      value: `${stats.conversion}%`,
      color: "from-pink-500/20",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`
          rounded-3xl
          border
          border-zinc-800
          bg-gradient-to-br
          ${card.color}
          to-transparent
          backdrop-blur-xl
          p-6
          transition-all
          duration-300
          hover:scale-[1.03]
          hover:border-blue-500/40
          `}
        >

          <p className="text-zinc-400 text-sm">
            {card.title}
          </p>

          <h2 className="text-5xl font-bold mt-5">
            {card.value}
          </h2>

        </div>

      ))}

    </div>
  );
}