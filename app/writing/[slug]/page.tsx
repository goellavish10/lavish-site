import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "@/content/posts.json";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, alternates: { canonical: post.canonical } };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/posts/${slug}.md`);
  const date = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main id="main" className="page post">
      <p className="crumb">
        <Link href="/writing">Writing</Link>
      </p>
      <h1>{post.title}</h1>
      <p className="muted">
        {date}, {post.minutes} min read. First published on{" "}
        <a href={post.canonical}>Hashnode</a>.
      </p>
      <article className="prose">
        <Body />
      </article>
    </main>
  );
}
