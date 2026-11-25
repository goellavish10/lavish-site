"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nodes } from "@/content/site";

export function Header() {
  const path = usePathname();
  return (
    <header className="header">
      <Link href="/" className="wordmark">
        Lavish Goyal
      </Link>
      <nav aria-label="Pages">
        {nodes.map((n) => {
          const here = path === n.href || path.startsWith(`${n.href}/`);
          return (
            <Link key={n.href} href={n.href} aria-current={here ? "page" : undefined}>
              {n.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
