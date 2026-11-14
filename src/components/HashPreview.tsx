"use client";

import { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { FiArrowDown } from "react-icons/fi";

// Muestra en vivo cómo bcrypt transforma la contraseña en un hash.
// Es solo una vista previa: el hash real se genera en el servidor con otro salt.
export default function HashPreview({ password }: { password: string }) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (!password) return;
    const t = setTimeout(async () => {
      const h = await bcrypt.hash(password, 10);
      setHash(h);
    }, 350);
    return () => clearTimeout(t);
  }, [password]);

  const shownHash = password ? hash : "";

  // Partes de un hash bcrypt: $2b$ | 10$ | salt (22) | hash (31)
  const algo = shownHash.slice(0, 4);
  const cost = shownHash.slice(4, 7);
  const salt = shownHash.slice(7, 29);
  const digest = shownHash.slice(29);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">bcrypt · laboratorio</p>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
          cost 10
        </span>
      </div>

      {/* Entrada */}
      <div className="mt-5 rounded-xl border border-white/5 bg-black/40 px-4 py-3 font-mono text-sm">
        <span className="text-muted">input: </span>
        <span className="text-foreground">{password ? "•".repeat(Math.min(password.length, 24)) : "—"}</span>
      </div>

      <div className="my-3 flex justify-center text-accent">
        <FiArrowDown className={password ? "animate-bounce" : "opacity-30"} />
      </div>

      {/* Hash */}
      <div className="min-h-[88px] break-all rounded-xl border border-white/5 bg-black/40 px-4 py-3 font-mono text-[13px] leading-6">
        {shownHash ? (
          <>
            <span className="text-accent-2">{algo}</span>
            <span className="text-[#78dcff]">{cost}</span>
            <span className="text-amber-300">{salt}</span>
            <span className="text-accent">{digest}</span>
          </>
        ) : (
          <span className="text-muted/60">Escribe una contraseña para ver su hash…</span>
        )}
      </div>

      {/* Leyenda */}
      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10.5px]">
        {[
          ["bg-accent-2", "Algoritmo $2b$"],
          ["bg-[#78dcff]", "Costo 2¹⁰ rondas"],
          ["bg-amber-300", "Salt aleatorio"],
          ["bg-accent", "Hash resultante"],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-2 text-muted">
            <span className={`h-2 w-2 rounded-sm ${c}`} /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}