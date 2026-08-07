import type { APIRoute } from "astro";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bingbot",
  "CCBot",
  "Applebot-Extended",
  "meta-externalagent",
];

export const GET: APIRoute = ({ site }) => {
  const lines: string[] = ["User-agent: *", "Allow: /", ""];
  for (const agent of AI_CRAWLERS) {
    lines.push(`User-agent: ${agent}`, "Allow: /", "");
  }
  lines.push(`Sitemap: ${new URL("sitemap-index.xml", site).href}`);
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
