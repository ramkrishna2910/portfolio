import { loadAll, fmtRange, plainDashes } from "./content";

// Builds the agent-readable markdown resume. Pure function of the content
// collections — never edit the output by hand; edit src/content/ instead.
export async function buildResumeMarkdown(site: URL): Promise<string> {
  const c = await loadAll();
  const p = c.profile;
  const lines: string[] = [];

  lines.push(`# ${p.name}`);
  lines.push("");
  lines.push(`**${p.headline}**`);
  lines.push("");
  lines.push(`- Location: ${p.location}`);
  lines.push(`- Email: ${p.email}`);
  lines.push(`- Website: ${site.href}`);
  for (const s of p.socials) {
    lines.push(`- ${s.label}: ${s.url}`);
  }
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  for (const para of p.longBio) {
    lines.push(para);
    lines.push("");
  }

  lines.push("## Current Focus");
  lines.push("");
  for (const f of p.focus) {
    lines.push(`- **${f.title}** (${f.role}): ${f.description}${f.url ? ` ${f.url}` : ""}`);
  }
  lines.push("");

  lines.push("## Experience");
  lines.push("");
  for (const e of c.experience) {
    const d = e.data;
    lines.push(`### ${d.title} — ${d.company}`);
    lines.push("");
    lines.push(`${fmtRange(d.start, d.end)} · ${d.location}`);
    lines.push("");
    for (const h of d.highlights) lines.push(`- ${h}`);
    lines.push("");
    lines.push(`Technologies: ${d.tech.join(", ")}`);
    lines.push("");
  }

  lines.push("## Education");
  lines.push("");
  const ed = c.education;
  lines.push(
    `- ${ed.degree} in ${ed.field}, ${ed.institution} (${ed.start.slice(0, 4)}–${ed.end.slice(0, 4)})`,
  );
  lines.push("");

  lines.push("## Open-Source Projects");
  lines.push("");
  for (const pr of c.projects) {
    const d = pr.data;
    lines.push(`### ${d.name} (${d.role})`);
    lines.push("");
    lines.push(`${d.url}`);
    lines.push("");
    lines.push(pr.body?.trim() ?? d.tagline);
    lines.push("");
  }

  lines.push("## Selected Writing");
  lines.push("");
  for (const w of c.writing) {
    const d = w.data;
    lines.push(
      `- [${d.title}](${d.url}) — ${d.venue}, ${d.date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" })}`,
    );
  }
  lines.push("");

  lines.push("## Talks");
  lines.push("");
  for (const t of c.talks) {
    const d = t.data;
    const link = d.youtubeId ? `https://www.youtube.com/watch?v=${d.youtubeId}` : d.url;
    const titlePart = link ? `[${d.title}](${link})` : d.title;
    lines.push(
      `- ${d.role === "Moderator" ? "Moderator, " : ""}${titlePart} — ${d.event}, ${d.date.getFullYear()}`,
    );
  }
  lines.push("");

  lines.push("## Publications");
  lines.push("");
  for (const pub of c.publications) {
    const d = pub.data;
    lines.push(`- [${d.title}](${d.url}) — ${d.venue}, ${d.year}`);
  }
  lines.push("");

  lines.push("## Patents");
  lines.push("");
  for (const pat of c.patents) {
    const d = pat.data;
    lines.push(
      `- [${d.title}](${d.url}) — ${d.number} (${d.status}), ${d.assignee}, ${d.year}`,
    );
  }
  lines.push("");

  lines.push("## Skills");
  lines.push("");
  for (const g of p.skillGroups) {
    lines.push(`### ${g.label}`);
    lines.push("");
    for (const item of g.items) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    `This document is generated from the same source as ${site.href} — see also [llms.txt](${new URL("llms.txt", site).href}).`,
  );
  lines.push("");

  return plainDashes(lines.join("\n"));
}
