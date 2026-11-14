import Link from "next/link";

// Selector "Ingresar / Crear cuenta"
export default function AuthTabs({ active }: { active: "signIn" | "register" }) {
  const base = "relative z-10 flex-1 rounded-xl py-2.5 text-center text-sm font-medium transition";

  return (
    <div className="relative flex rounded-2xl border border-white/5 bg-black/40 p-1">
      <span
        className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-xl bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300"
        style={{ left: active === "signIn" ? 4 : "50%" }}
      />
      <Link href="/signIn" className={`${base} ${active === "signIn" ? "text-foreground" : "text-muted hover:text-foreground"}`}>
        Ingresar
      </Link>
      <Link href="/register" className={`${base} ${active === "register" ? "text-foreground" : "text-muted hover:text-foreground"}`}>
        Crear cuenta
      </Link>
    </div>
  );
}