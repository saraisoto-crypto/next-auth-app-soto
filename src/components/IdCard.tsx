"use client";

import { useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import ProviderBadge from "@/components/ProviderBadge";

type Props = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
  id?: string;
  expires: string;
};

// Credencial de acceso con efecto 3D y brillo holográfico al mover el mouse
export default function IdCard({ name, email, image, provider, id, expires }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x: (py - 50) / -6, y: (px - 50) / 6, px, py });
  };

  const reset = () => setTilt({ x: 0, y: 0, px: 50, py: 50 });

  const code = (id ?? "000000000000").slice(-12).toUpperCase();
  const bars = Array.from(code).map((c) => (c.charCodeAt(0) % 3) + 1);

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,#15151d_0%,#0b0b10_55%,#14121f_100%)] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Capa holográfica */}
        <div
          className="holo pointer-events-none absolute inset-0"
          style={{ backgroundPosition: `${tilt.px}% ${tilt.py}%` }}
        />
        {/* Patrón de líneas */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
          {/* Encabezado */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif text-2xl italic leading-none">
                Vault<span className="text-accent">.</span>
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Credencial de acceso</p>
            </div>
            {/* Chip */}
            <div className="grid h-9 w-12 grid-cols-3 gap-px overflow-hidden rounded-md bg-gradient-to-br from-amber-200 to-amber-500 p-px opacity-90">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="bg-amber-300/70" />
              ))}
            </div>
          </div>

          {/* Identidad */}
          <div className="flex items-center gap-4">
            <Avatar name={name} image={image} size={64} rounded="rounded-2xl" />
            <div className="min-w-0">
              <p className="truncate font-serif text-3xl leading-tight">{name}</p>
              <p className="truncate font-mono text-xs text-muted">{email ?? "correo no público"}</p>
            </div>
          </div>

          {/* Pie */}
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <ProviderBadge provider={provider} />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Válida hasta {expires ? new Date(expires).toLocaleDateString("es-PE") : "—"}
              </p>
            </div>
            <div className="text-right">
              <div className="flex h-8 items-end justify-end gap-[2px]">
                {bars.map((w, i) => (
                  <span key={i} className="h-full bg-foreground/80" style={{ width: w }} />
                ))}
              </div>
              <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-muted">{code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}