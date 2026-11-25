import type { Metadata } from "next";
import Link from "next/link";
import posts from "@/content/posts.json";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Writing on Go, Node.js and Web Development",
  description:
    "Articles by Lavish Goyal on Go concurrency, encryption in web apps, Node.js interviews and growing as a developer.",
  path: "/writing",
});

export default function Writing() {
  return (
    <main id="main" className="page">
      <h1>
        Writing
        <span className="h1-sub">Posts on Go, Node.js and web security, from my Hashnode blog.</span>
      </h1>
      <ul className="posts">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`}>{p.title}</Link>
            <span className="muted">
              {new Date(p.date).getFullYear()}, {p.minutes} min
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
