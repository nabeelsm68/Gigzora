export default function Topbar() {
  return (
    <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">

      <input
        placeholder="Search leads..."
        className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 w-96"
      />

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-zinc-700" />

      </div>

    </div>
  );
}