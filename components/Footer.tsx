"use client";

import { useEffect, useState } from "react";
import { email } from "@/content/site";

export function Footer({ commit }: { commit: string }) {
  const [trip, setTrip] = useState<{ region: string; ms: number } | null>(null);

  useEffect(() => {
    const started = performance.now();
    fetch("/api/ping", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ region }: { region: string }) => setTrip({ region, ms: Math.round(performance.now() - started) }))
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <a href={`mailto:${email}`}>{email}</a>
      <span>
        {trip && (
          <>
            <span className="dot dot-ok" aria-hidden="true" /> {trip.ms} ms to {trip.region}.{" "}
          </>
        )}
        Commit <code>{commit}</code>. No trackers.
      </span>
    </footer>
  );
}
