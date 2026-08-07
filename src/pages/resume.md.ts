import type { APIRoute } from "astro";
import { buildResumeMarkdown } from "../lib/resume";

export const GET: APIRoute = async ({ site }) => {
  const md = await buildResumeMarkdown(site!);
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
