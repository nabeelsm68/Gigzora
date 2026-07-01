"use client";

interface Props {
  report: any;
}

export default function AIReport({ report }: Props) {
  if (!report) return null;

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">

      <h2 className="text-2xl font-bold mb-6">
        🤖 AI Business Report
      </h2>

      {/* Summary */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          Business Summary
        </h3>

        <p className="text-zinc-300 leading-7">
          {report.summary}
        </p>

      </div>

      {/* Strengths */}

      <div className="mb-8">

        <h3 className="text-green-400 font-semibold text-lg mb-3">
          💪 Strengths
        </h3>

        <ul className="space-y-2">

          {report.strengths?.map(
            (item: string, index: number) => (

              <li key={index}>
                ✅ {item}
              </li>

            )
          )}

        </ul>

      </div>

      {/* Weaknesses */}

      <div className="mb-8">

        <h3 className="text-red-400 font-semibold text-lg mb-3">
          ⚠️ Weaknesses
        </h3>

        <ul className="space-y-2">

          {report.weaknesses?.map(
            (item: string, index: number) => (

              <li key={index}>
                • {item}
              </li>

            )
          )}

        </ul>

      </div>

      {/* Opportunities */}

      <div className="mb-8">

        <h3 className="text-yellow-400 font-semibold text-lg mb-3">
          💰 Opportunities
        </h3>

        <ul className="space-y-2">

          {report.opportunities?.map(
            (item: string, index: number) => (

              <li key={index}>
                ⭐ {item}
              </li>

            )
          )}

        </ul>

      </div>

      {/* Bottom Cards */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-zinc-800 p-5">

          <p className="text-zinc-500 text-sm">
            Recommended Service
          </p>

          <p className="font-semibold mt-2">
            {report.recommendedService}
          </p>

        </div>

        <div className="rounded-2xl bg-blue-600 p-5">

          <p className="text-blue-100 text-sm">
            Closing Probability
          </p>

          <p className="text-3xl font-bold mt-2">
            {report.closingProbability}
          </p>

        </div>

      </div>

    </div>
  );
}