import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page">
      <h1>404</h1>
      <p className="lede">This route has no handler. The limiter let you through, but there&rsquo;s nothing here.</p>
      <p>
        <Link href="/" className="button">
          Back to the map
        </Link>
      </p>
    </main>
  );
}
