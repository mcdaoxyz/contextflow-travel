import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const last = messages[messages.length - 1]?.content || "";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const r = `Received: "${last}"\n\nContextFlow demo. Connect Anthropic API key for full RAG.`;
      for (const c of r) { controller.enqueue(encoder.encode(c)); await new Promise(r => setTimeout(r, 15)); }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}