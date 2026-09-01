import { loadAll, plainDashes } from "./content";

// Builds /llms.txt per the llmstxt.org format: H1 name, blockquote summary,
// context paragraph, then H2 sections of [title](absolute-url): description.
export async function buildLlmsTxt(site: URL): Promise<string> {
  const c = await loadAll();
  const p = c.profile;
  const abs = (path: string) => new URL(path, site).href;
  const lines: string[] = [];

  lines.push(`# ${p.name}`);
  lines.push("");
  lines.push(`> ${p.shortBio}`);
  lines.push("");
  lines.push(
    `${p.name} is a Principal ML Software Engineer at AMD in Seattle focused on on-device AI: running large language models efficiently on consumer hardware. Key facts: co-creator and maintainer of the Lemonade SDK (open-source local AI server, 5k+ GitHub stars); co-creator of TurnkeyML and GroqFlow; previously at Groq and Intel; two granted US patents; publications on AI accelerator evaluation. Expertise: ${p.knowsAbout.slice(0, 12).join(", ")}.`,
  );
  lines.push("");

  lines.push("## Profile");
  lines.push("");
  lines.push(`- [Resume (Markdown)](${abs("resume.md")}): full machine-readable resume`);
  lines.push(`- [Home](${abs("")}): bio, experience timeline, current focus, selected projects`);
  for (const s of p.socials) {
    lines.push(`- [${s.label}](${s.url}): ${s.handle}`);
  }
  lines.push("");

  lines.push("## Current Focus");
  lines.push("");
  for (const f of p.focus) {
    lines.push(
      f.url
        ? `- [${f.title}](${f.url}): ${f.role}. ${f.description}`
        : `- ${f.title}: ${f.role}. ${f.description}`,
    );
  }
  lines.push("");

  lines.push("## Projects");
  lines.push("");
  for (const pr of c.projects) {
    lines.push(`- [${pr.data.name}](${pr.data.url}): ${pr.data.role}. ${pr.data.tagline}`);
  }
  lines.push("");

  lines.push("## Writing");
  lines.push("");
  for (const w of c.writing) {
    lines.push(
      `- [${w.data.title}](${w.data.url}): ${w.body?.trim().replace(/\s+/g, " ") ?? w.data.venue}`,
    );
  }
  lines.push("");

  lines.push("## Talks");
  lines.push("");
  for (const t of c.talks) {
    const link = t.data.youtubeId
      ? `https://www.youtube.com/watch?v=${t.data.youtubeId}`
      : (t.data.url ?? abs("talks"));
    lines.push(
      `- [${t.data.title}](${link}): ${t.data.event}, ${t.data.date.getFullYear()}. ${t.body?.trim().replace(/\s+/g, " ") ?? ""}`.trimEnd(),
    );
  }
  lines.push("");

  lines.push("## Research");
  lines.push("");
  for (const pub of c.publications) {
    lines.push(`- [${pub.data.title}](${pub.data.url}): ${pub.data.venue}, ${pub.data.year}. ${pub.data.summary}`);
  }
  for (const pat of c.patents) {
    lines.push(
      `- [Patent: ${pat.data.title}](${pat.data.url}): ${pat.data.number} (${pat.data.status}), ${pat.data.assignee}, ${pat.data.year}.`,
    );
  }
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Writing index](${abs("writing")}): all articles`);
  lines.push(`- [Talks index](${abs("talks")}): recorded talks and panels`);
  lines.push(`- [Research index](${abs("research")}): publications and patents`);
  lines.push(`- [Highlights](${abs("highlights")}): curated cross-platform highlights`);
  lines.push("");

  return plainDashes(lines.join("\n"));
}
