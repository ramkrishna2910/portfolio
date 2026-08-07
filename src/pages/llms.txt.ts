import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../lib/llms";

export const GET: APIRoute = async ({ site }) => {
  const txt = await buildLlmsTxt(site!);
  return new Response(txt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
