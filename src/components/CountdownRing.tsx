// Anillo circular que se vacía mientras dura el bloqueo
export default function CountdownRing({
  remaining,
  total,
  label,
}: {
  remaining: number;
  total: number;
  label: string;
}) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, remaining / total));

  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,92,122,0.12)" strokeWidth="6" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--danger)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 8px rgba(255,92,122,0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-medium tracking-wider text-danger">{label}</span>
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">restante</span>
      </div>
    </div>
  );
}