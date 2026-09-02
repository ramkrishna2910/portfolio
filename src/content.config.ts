import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const profile = defineCollection({
  loader: file("src/content/profile/profile.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    headline: z.string(),
    shortBio: z.string(),
    longBio: z.array(z.string()),
    location: z.string(),
    email: z.string().email(),
    socials: z.array(
      z.object({
        platform: z.string(),
        label: z.string(),
        url: z.string().url(),
        handle: z.string(),
      }),
    ),
    knowsAbout: z.array(z.string()),
    focus: z.array(
      z.object({
        title: z.string(),
        role: z.string(),
        description: z.string(),
        url: z.string().url().optional(),
      }),
    ),
    skillGroups: z.array(
      z.object({ label: z.string(), items: z.array(z.string()) }),
    ),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/experience" }),
  schema: z.object({
    company: z.string(),
    companyUrl: z.string().url(),
    title: z.string(),
    location: z.string(),
    start: z.string(), // YYYY-MM
    end: z.string().nullable(), // null = present
    order: z.number(),
    highlights: z.array(z.string()),
    tech: z.array(z.string()),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/education" }),
  schema: z.object({
    institution: z.string(),
    institutionUrl: z.string().url(),
    degree: z.string(),
    field: z.string(),
    start: z.string(),
    end: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/projects" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    repo: z.string().optional(),
    role: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
    tagline: z.string(),
    tech: z.array(z.string()),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/writing" }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    venue: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/talks" }),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string().optional(),
    url: z.string().url().optional(),
    images: z.array(z.string()).optional(),
    event: z.string(),
    role: z.string().default("Speaker"),
    date: z.coerce.date(),
    dateDisplay: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    url: z.string().url(),
    type: z.enum(["conference", "workshop", "journal"]),
    summary: z.string(),
  }),
});

const patents = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/patents" }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    status: z.enum(["granted", "application"]),
    url: z.string().url(),
    year: z.number(),
    assignee: z.string(),
    summary: z.string(),
  }),
});

const highlights = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/highlights" }),
  schema: z.object({
    type: z.enum(["youtube", "x", "linkedin", "github", "press"]),
    url: z.string().url(),
    title: z.string(),
    date: z.coerce.date(),
    note: z.string().optional(),
    // youtube
    youtubeId: z.string().optional(),
    // x / linkedin
    excerpt: z.string().optional(),
    // github
    repo: z
      .object({
        name: z.string(),
        description: z.string(),
        language: z.string(),
        stars: z.string().optional(),
      })
      .optional(),
  }),
});

const interests = defineCollection({
  loader: file("src/content/interests/interests.json"),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    url: z.string().url().optional(),
    note: z.string().optional(),
  }),
});

export const collections = {
  profile,
  experience,
  education,
  projects,
  writing,
  talks,
  publications,
  patents,
  highlights,
  interests,
};
