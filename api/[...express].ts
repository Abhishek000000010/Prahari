import type { IncomingMessage, ServerResponse } from "http";
import app from "../server";

// Single entrypoint for every /api/* request — vercel.json rewrites them all
// here. Express already registers each route under both "/api/x" and "/x", so
// it matches whichever path shape Vercel hands over.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    return (app as any)(req, res);
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
