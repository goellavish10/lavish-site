import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

const exts = ["jpg", "jpeg", "png", "webp"];

// Renders public/photos/<name>.<ext> if it exists, otherwise nothing (or the fallback).
export function Photo({
  name,
  alt,
  className,
  sizes,
  fallback,
}: {
  name: string;
  alt: string;
  className?: string;
  sizes: string;
  fallback?: string;
}) {
  const ext = exts.find((e) => existsSync(join(process.cwd(), "public/photos", `${name}.${e}`)));
  const src = ext ? `/photos/${name}.${ext}` : fallback;
  if (!src) return null;
  return (
    <span className={`photo ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes} />
    </span>
  );
}
