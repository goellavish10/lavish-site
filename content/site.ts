export const email = "goellavish10@gmail.com";

export const links = [
  { label: "GitHub", href: "https://github.com/goellavish10" },
  { label: "LinkedIn", href: "https://linkedin.com/in/goellavish10" },
  { label: "X", href: "https://x.com/lavishG10" },
  { label: "Résumé", href: "https://tinyurl.com/resumelavish" },
];

export const games = [
  { title: "GTA VI", status: "Playing now", now: true, progress: null, cover: "/games/gta6.jpg" },
  { title: "Red Dead Redemption 2", status: "About halfway", progress: 0.5, cover: "/games/rdr2.jpg" },
  { title: "God of War", status: "Finished the series", progress: 1, note: "Ragnarök's father and son story got me.", cover: "/games/gowr.jpg" },
  { title: "Spider-Man", status: "Played the series", progress: null, cover: "/games/msm2.jpg" },
  { title: "Hogwarts Legacy", status: "Finished", progress: 1, cover: "/games/hogwarts.jpg" },
] as const;

// Single source for "what I'm playing": the home map, the Now line and /play all read this.
export const nowPlaying = games.find((g) => "now" in g)?.title;

export const nodes = [
  { href: "/work", name: "Work", stat: "−55% database spend" },
  { href: "/lab", name: "Lab", stat: "4 side tools" },
  { href: "/play", name: "Play", stat: nowPlaying ? `Playing ${nowPlaying}` : "Games and running" },
  { href: "/writing", name: "Writing", stat: "6 posts" },
  { href: "/hire", name: "Hire me", stat: "4 ways to work together" },
] as const;

export type Case = {
  slug: string;
  title: string;
  big: string;
  bigLabel: string;
  problem: string;
  call: string;
  result: string;
  note?: string;
};

export const cases: Case[] = [
  {
    slug: "rate-limiter",
    title: "Rewriting a shared Redis rate limiter",
    big: "1 in 10",
    bigLabel: "requests timed out under burst, before my rewrite",
    problem:
      "Every server shared one limiter in front of a third-party API. Under burst, 1 in 10 requests timed out, and one server got 25× the turns of another.",
    call:
      "I reproduced it first with a 5-process burst test. Then I rewrote the core as one atomic Lua script that takes a slot and pops the next job in a single step.",
    result:
      "Fair turns from a random starting slot, an urgent lane for people who are waiting, timeouts that grow with the queue, and a backup provider before anything fails.",
    note: "A teammate built the first version. I proposed and built the rewrite.",
  },
  {
    slug: "database-spend",
    title: "Cutting MongoDB spend by 55%",
    big: "−55%",
    bigLabel: "MongoDB spend",
    problem: "Slow queries every day, and a database bill that grew with the data.",
    call: "Fixed query shapes and indexes, and set retention so old data stopped riding along.",
    result: "Spend down 55%. Daily slow-query time down 66%.",
  },
  {
    slug: "nightly-spike",
    title: "Fixing a nightly MongoDB CPU spike",
    big: "108% → 8%",
    bigLabel: "peak CPU, local benchmark of the fix",
    problem: "A read replica hit 83% CPU every night, a minute after a batch job started.",
    call:
      "Tested three suspects one at a time. Lazy loading alone barely moved it. The cause was a sort with no index behind it.",
    result: "A covering index plus lazy loading: 0.5 s of CPU instead of 10–12 s. Merged five hours after the alert.",
  },
  {
    slug: "crash-safe-workers",
    title: "Crash-safe job workers on Cloud Run",
    big: "Mid-stream",
    bigLabel: "where a killed worker picks back up",
    problem: "Long jobs ran on cloud instances that can be shut down at any moment. A kill meant starting over.",
    call: "Made every job record how far it got, so a fresh instance carries on from there.",
    result: "A killed instance resumes mid-stream instead of starting over.",
  },
];

export const deletions = [
  { what: "Retired outreach product", lines: 31091 },
  { what: "Unused agent framework", lines: 16430 },
  { what: "Three dead AI features", lines: 11076 },
  { what: "Stats store, indexes 3.4× its data", lines: 3389 },
  { what: "CRM sync nobody read", lines: 327 },
];

export const jobs = [
  { years: "2024 – now", where: "Letterdrop", role: "Full-stack engineer", what: "The four stories above." },
  {
    years: "2023 – 24",
    where: "Xeno",
    role: "SDE intern",
    what: "Infra that took 27M+ hits in one weekend. Frontend builds 36% faster.",
  },
  { years: "2023", where: "ATC Couriers", role: "Software engineer", what: "Multi-carrier booking platform. Company acquired." },
  { years: "Earlier", where: "BookPal", role: "Side project", what: "Connected warehouses to couriers. Acquired." },
];

export const projects = [
  {
    name: "clipshelf",
    href: "https://github.com/goellavish10/clipshelf",
    what: "Clipboard history in the macOS menu bar. Local only, Swift.",
    art: "clipshelf",
  },
  {
    name: "AI cost calculator",
    href: "https://github.com/goellavish10/AI-API-cost-calculator-aggregator",
    what: "Token costs across Claude, GPT and Gemini, cached and thinking tokens included.",
    art: "cost",
  },
  {
    name: "codebase-indexing-v2",
    href: "https://github.com/goellavish10/codebase-indexing-v2",
    what: "Ask a codebase questions in plain English. pgvector and HNSW underneath.",
    art: "index",
  },
  {
    name: "auth-mid",
    href: "https://github.com/goellavish10/auth-mid",
    what: "Authentication middleware for Go.",
    art: "auth",
  },
] as const;


export const offers = [
  { icon: "gauge", title: "Backend and infra fixes", what: "Slow databases, flaky jobs, runaway cloud bills." },
  { icon: "agent", title: "AI agents and LLM features", what: "Agents and retrieval that hold up in production." },
  { icon: "rocket", title: "MVP builds", what: "Idea to shipped product, frontend and backend." },
  { icon: "plug", title: "Integrations", what: "CRMs, payments and webhooks that survive the other side failing." },
] as const;
