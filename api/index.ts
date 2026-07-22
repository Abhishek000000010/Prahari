import type { IncomingMessage, ServerResponse } from "http";

// Single entrypoint for every /api/* request — vercel.json rewrites them all
// here. Express already registers each route under both "/api/x" and "/x", so
// it matches whichever path shape Vercel hands over.
//
// The import is inside the handler on purpose. A module-level failure gives
// nothing but an opaque FUNCTION_INVOCATION_FAILED with the stack buried in
// the dashboard; catching it here turns the same failure into a readable JSON
// body, which is the difference between diagnosing a deploy in one request and
// guessing at it across several.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const mod: any = await import("../server.js");
    return mod.default(req, res);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        error: "entrypoint_failed",
        message: String(err?.message ?? err),
        stack: String(err?.stack ?? "").split("\n").slice(0, 10),
      })
    );
  }
}
