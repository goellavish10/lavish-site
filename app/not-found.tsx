import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page">
      <h1>404</h1>
      <p className="lede">No page at this address.</p>
      <p>
        <Link href="/" className="button">
          Back to the map
        </Link>
      </p>
    </main>
  );
}
