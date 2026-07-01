import PipelineBoard from "@/components/ui/pipeline-board";

export default function PipelinePage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Pipeline
        </h1>

        <p className="text-zinc-500 mt-2">
          Track lead progress through your sales funnel.
        </p>
      </div>

      <PipelineBoard />

    </div>
  );
}