import { getCollection } from "astro:content";

export async function loadAll() {
  const [profileEntry] = await getCollection("profile");
  const [educationEntry] = await getCollection("education");
  const experience = (await getCollection("experience")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const projects = (await getCollection("projects")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const writing = (await getCollection("writing")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const talks = (await getCollection("talks")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const publications = (await getCollection("publications")).sort(
    (a, b) => b.data.year - a.data.year,
  );
  const patents = (await getCollection("patents")).sort(
    (a, b) => b.data.year - a.data.year,
  );
  const highlights = (await getCollection("highlights")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const interests = await getCollection("interests");

  return {
    profile: profileEntry.data,
    education: educationEntry.data,
    experience,
    projects,
    writing,
    talks,
    publications,
    patents,
    highlights,
    interests,
  };
}

// Plain-text outputs (resume.md, llms.txt) avoid em dashes — they render
// poorly in many terminals and markdown viewers. HTML pages keep them.
export function plainDashes(s: string): string {
  return s.replace(/\s*—\s*/g, " - ").replace(/—/g, "-");
}

export function fmtRange(start: string, end: string | null): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y!, (m ?? 1) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}
