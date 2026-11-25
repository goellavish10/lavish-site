import posts from "@/content/posts.json";
import { cases, email, jobs, links, offers, projects } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const site = siteUrl;

export function GET() {
  const md = [
    "# Lavish Goyal",
    "",
    "> Full-stack engineer at Letterdrop. Backend-leaning: queues, rate limits, slow queries, LLM agents.",
    "",
    `Contact: ${email}. ${links.map((l) => `[${l.label}](${l.href})`).join(", ")}.`,
    "",
    "## Work",
    "",
    ...cases.map((c) => `- [${c.title}](${site}/work/${c.slug}): ${c.big} ${c.bigLabel}. ${c.problem} ${c.call} ${c.result}`),
    "",
    "## Experience",
    "",
    ...jobs.map((j) => `- ${j.years}, ${j.where}, ${j.role}. ${j.what}`),
    "",
    "## Side projects",
    "",
    ...projects.map((p) => `- [${p.name}](${p.href}): ${p.what}`),
    "",
    "## Freelance",
    "",
    ...offers.map((o) => `- ${o.title}: ${o.what}`),
    "",
    "## Optional",
    "",
    ...posts.map((p) => `- [${p.title}](${site}/writing/${p.slug}) (${p.date})`),
    "",
  ].join("\n");
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
