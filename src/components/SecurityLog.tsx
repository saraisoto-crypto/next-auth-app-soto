"use client";

import { useEffect, useState } from "react";

const IDLE_LINES = [
  "oauth2.handshake(google) ··· ok",
  "oauth2.handshake(github) ··· ok",
  "bcrypt.compare(cost=10) ···· listo",
  "jwt.sign(HS256) ··········· listo",
  "proxy.guard(/dashboard) ···· activo",
  "lockout.policy(3, 5min) ···· activo",
];

const LOCKED_LINES = [
  "auth.failed(attempt=3) ···· ✗",
  "lockout.trigger() ········· BLOQUEADO",
  "account.status ············ locked",
];

// Consola que va "escribiendo" eventos de seguridad
export default function SecurityLog({ locked = false }: { locked?: boolean }) {
  const lines = locked ? LOCKED_LINES : IDLE_LINES;
  const [shown, setShown] = useState<string[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const id = setInterval(() => {
      const line = lines[lineIndex % lines.length];
      charIndex++;
      setTyping(line.slice(0, charIndex));

      if (charIndex >= line.length) {
        setShown((prev) => [...prev, line].slice(-3));
        setTyping("");
        charIndex = 0;
        lineIndex++;
      }
    }, 28);

    return () => clearInterval(id);
  }, [lines]);

  return (
    <div className="glass rounded-2xl p-4 font-mono text-[11.5px] leading-6">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-muted">security.log</span>
      </div>
      {shown.map((l, i) => (
        <p key={`${l}-${i}`} className="text-muted">
          <span className={locked ? "text-danger" : "text-accent"}>›</span> {l}
        </p>
      ))}
      <p className={`caret ${locked ? "text-danger" : "text-foreground"}`}>
        <span className={locked ? "text-danger" : "text-accent"}>›</span> {typing}
      </p>
    </div>
  );
}