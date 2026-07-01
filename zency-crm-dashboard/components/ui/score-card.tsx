interface Props {
  score: number;
}

export default function ScoreCard({
  score,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 p-6">

      <p className="text-zinc-400">
        Lead Health Score
      </p>

      <h2 className="text-5xl font-bold mt-2">
        {score}
      </h2>

      <div className="w-full h-3 bg-zinc-800 rounded-full mt-4">

        <div
          className="h-3 rounded-full bg-blue-500 rounded-full"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  );
}