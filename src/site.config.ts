// Single source of truth for the site's URL.
// Domain cutover = change SITE_URL, add public/CNAME with the bare domain, redeploy.
// Until the custom domain is live on GitHub Pages, the site serves from the
// project path (BASE "/portfolio"); with the domain attached it serves at "/".
export const SITE_URL = "https://ramkrishna.dev"; // PENDING: confirm final domain purchase
export const BASE = "/";

export const SITE_TITLE = "Ramakrishnan Sivakumar";
export const SITE_DESCRIPTION =
  "Ramakrishnan Sivakumar — Principal Engineer at AMD working on on-device AI: running large language models efficiently on consumer hardware. Maintainer of Lemonade, the open-source local LLM SDK. Writing, talks, publications, and patents on ML systems, compilers, and AI accelerators.";

export const ANALYTICS_ID = "G-3R4GCX66NY";
