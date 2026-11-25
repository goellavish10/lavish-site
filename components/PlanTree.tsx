const before = [
  { stage: "LIMIT", note: "" },
  { stage: "SORT", note: "in memory, spilled to disk" },
  { stage: "FETCH", note: "every matching document" },
  { stage: "IXSCAN", note: "{ workspace }" },
];

const after = [
  { stage: "LIMIT", note: "" },
  { stage: "PROJECTION_COVERED", note: "0 documents fetched" },
  { stage: "IXSCAN", note: "{ workspace, lastAttemptedAt, lastActiveAt, _id }" },
];

function Tree({ title, stages, tone }: { title: string; stages: typeof before; tone: "slow" | "fast" }) {
  return (
    <div className={`plan plan-${tone}`}>
      <h3>{title}</h3>
      <ol>
        {stages.map((s) => (
          <li key={s.stage}>
            <code>{s.stage}</code>
            {s.note && <span>{s.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PlanTree() {
  return (
    <figure className="plans">
      <div className="plan-pair">
        <Tree title="Before" stages={before} tone="slow" />
        <Tree title="After" stages={after} tone="fast" />
      </div>
      <figcaption>After: 6 ms on the largest workspace, same order as before.</figcaption>
    </figure>
  );
}
