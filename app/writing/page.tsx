import type { Metadata } from "next";
import Link from "next/link";
import posts from "@/content/posts.json";

export const metadata: Metadata = { title: "Writing" };

export default function Writing() {
  return (
    <main id="main" className="page">
      <h1>Writing</h1>
      <p className="lede">Posts from my Hashnode blog.</p>
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
