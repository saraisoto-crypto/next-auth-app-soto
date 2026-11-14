"use client";

import { useEffect, useState } from "react";

// Cuenta regresiva hasta que expire la sesión
export default function SessionTimer({ expires }: { expires: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null || !expires) return <span className="font-mono">--d --:--:--</span>;

  const diff = Math.max(0, new Date(expires).getTime() - now);
  const d = Math.floor(diff / 86_400_000);
  const h = String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0");

  return (
    <span className="font-mono tabular-nums">
      {d}d {h}:{m}:{s}
    </span>
  );
}