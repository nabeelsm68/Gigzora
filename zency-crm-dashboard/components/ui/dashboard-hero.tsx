export default function DashboardHero() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-zinc-800
      bg-gradient-to-r
      from-blue-500/20
      via-purple-500/10
      to-transparent
      p-8
      mb-8
      "
    >
      <h1 className="text-5xl font-bold">
        Welcome back, Nabeel 👋
      </h1>

      <p className="text-zinc-400 mt-4 text-lg">
        You generated 247 leads this week and
        converted 8 into active opportunities.
      </p>
    </div>
  );
}