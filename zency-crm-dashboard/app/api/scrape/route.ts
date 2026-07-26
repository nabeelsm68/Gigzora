import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query, maxLeads = 50 } = await req.json();

    if (!query) {
      return Response.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    // Resolve path to the Python scraper
    const projectRoot = path.resolve(
      process.cwd(),
      ".."
    );
    const scriptPath = path.join(
      projectRoot,
      "run_scraper.py"
    );

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const python = spawn("python", [
          scriptPath,
          "--query",
          query,
          "--max",
          String(maxLeads),
        ], {
          cwd: projectRoot,
          env: {
            ...process.env,
            PYTHONUNBUFFERED: "1",
          },
        });

        python.stdout.on("data", (data: Buffer) => {
          const lines = data
            .toString("utf-8")
            .split("\n")
            .filter(Boolean);

          for (const line of lines) {
            controller.enqueue(
              encoder.encode(`data: ${line}\n\n`)
            );
          }
        });

        python.stderr.on("data", (data: Buffer) => {
          const msg = data.toString("utf-8").trim();
          if (msg) {
            const errorEvent = JSON.stringify({
              type: "log",
              message: msg,
            });
            controller.enqueue(
              encoder.encode(
                `data: ${errorEvent}\n\n`
              )
            );
          }
        });

        python.on("close", (code) => {
          const doneEvent = JSON.stringify({
            type: "done",
            exitCode: code,
          });
          controller.enqueue(
            encoder.encode(
              `data: ${doneEvent}\n\n`
            )
          );
          controller.close();
        });

        python.on("error", (err) => {
          const errorEvent = JSON.stringify({
            type: "error",
            message: `Failed to start scraper: ${err.message}`,
          });
          controller.enqueue(
            encoder.encode(
              `data: ${errorEvent}\n\n`
            )
          );
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
