import { FiKey } from "react-icons/fi";
import { GoogleIcon, GithubIcon } from "@/components/BrandIcons";

export const PROVIDER_INFO: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  google: {
    label: "Google",
    icon: <GoogleIcon size={12} />,
    className: "border-white/15 bg-white/[0.06] text-foreground",
  },
  github: {
    label: "GitHub",
    icon: <GithubIcon size={12} />,
    className: "border-white/15 bg-white/[0.06] text-foreground",
  },
  credentials: {
    label: "Credenciales",
    icon: <FiKey size={12} />,
    className: "border-accent-2/35 bg-accent-2/10 text-accent-2",
  },
};

// Etiqueta con el proveedor con el que inició sesión el usuario
export default function ProviderBadge({ provider }: { provider?: string }) {
  const p = PROVIDER_INFO[provider ?? "credentials"] ?? PROVIDER_INFO.credentials;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider ${p.className}`}
    >
      {p.icon} {p.label}
    </span>
  );
}