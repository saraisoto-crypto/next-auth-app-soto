import { FiLock, FiUnlock, FiKey } from "react-icons/fi";
import { GoogleIcon, GithubIcon } from "@/components/BrandIcons";

// Dial de bóveda animado. Cambia a rojo cuando la cuenta está bloqueada.
export default function VaultDial({ locked = false }: { locked?: boolean }) {
  const color = locked ? "var(--danger)" : "var(--accent)";
  const ticks = Array.from({ length: 60 });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
      {/* Halo */}
      <div
        className="absolute inset-[18%] rounded-full blur-3xl transition-colors duration-700"
        style={{ background: locked ? "rgba(255,92,122,0.25)" : "rgba(198,243,107,0.18)" }}
      />

      {/* Anillo exterior con marcas */}
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,0.08)" />
        {ticks.map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="6"
            x2="100"
            y2={i % 5 === 0 ? "14" : "10"}
            stroke={i % 5 === 0 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)"}
            strokeWidth={i % 5 === 0 ? 1.2 : 0.8}
            transform={`rotate(${i * 6} 100 100)`}
          />
        ))}
      </svg>

      {/* Anillo medio punteado */}
      <svg viewBox="0 0 200 200" className="spin-mid absolute inset-[11%] h-[78%] w-[78%]">
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke={color}
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          style={{ transition: "stroke 0.6s" }}
        />
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="70 520"
          strokeLinecap="round"
          style={{ transition: "stroke 0.6s" }}
        />
      </svg>

      {/* Anillo interior */}
      <svg viewBox="0 0 200 200" className="spin-fast absolute inset-[24%] h-[52%] w-[52%]">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="2"
          strokeDasharray="30 150"
          strokeLinecap="round"
        />
      </svg>

      {/* Núcleo */}
      <div className="absolute inset-[36%] flex items-center justify-center">
        <div
          className={`pulse-core ${locked ? "is-danger" : ""} flex h-full w-full items-center justify-center rounded-full border bg-surface/90 backdrop-blur transition-colors duration-500`}
          style={{ borderColor: locked ? "rgba(255,92,122,0.5)" : "rgba(198,243,107,0.4)" }}
        >
          {locked ? (
            <FiLock className="text-4xl text-danger" />
          ) : (
            <FiUnlock className="text-4xl text-accent" />
          )}
        </div>
      </div>

      {/* Chips orbitando */}
      <div className="orbit">
        <span className="absolute left-1/2 top-[2%] -translate-x-1/2">
          <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
            <GoogleIcon size={20} />
          </span>
        </span>
        <span className="absolute bottom-[16%] left-[4%]">
          <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-white">
            <GithubIcon size={20} />
          </span>
        </span>
        <span className="absolute bottom-[16%] right-[4%]">
          <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-accent-2">
            <FiKey size={19} />
          </span>
        </span>
      </div>
    </div>
  );
}