import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Avatar from "@/components/Avatar";
import ProviderBadge from "@/components/ProviderBadge";
import SessionTimer from "@/components/SessionTimer";
import { GoogleIcon, GithubIcon } from "@/components/BrandIcons";
import { FiArrowUpRight, FiCheck, FiCpu, FiEdit3, FiGrid, FiKey, FiLock, FiShield, FiUser } from "react-icons/fi";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const user = session.user;
  const expiresAt = session.expiresAt ?? "";
  const provider = user?.provider ?? "credentials";
  const firstName = user?.name?.split(" ")[0] ?? "usuario";
  const isOAuth = provider !== "credentials";

  // Pasos del flujo según el proveedor usado
  const flow = isOAuth
    ? [
        { icon: <FiUser />, title: "Tú", sub: "Clic en el botón" },
        {
          icon: provider === "google" ? <GoogleIcon size={16} /> : <GithubIcon size={16} />,
          title: provider === "google" ? "Google" : "GitHub",
          sub: "Valida identidad",
        },
        { icon: <FiCpu />, title: "Callback", sub: "/api/auth/callback" },
        { icon: <FiKey />, title: "JWT", sub: "Token firmado" },
        { icon: <FiGrid />, title: "Dashboard", sub: "Acceso concedido" },
      ]
    : [
        { icon: <FiUser />, title: "Tú", sub: "Correo + contraseña" },
        { icon: <FiEdit3 />, title: "authorize()", sub: "Busca en MongoDB" },
        { icon: <FiLock />, title: "bcrypt", sub: "compare(hash)" },
        { icon: <FiKey />, title: "JWT", sub: "Token firmado" },
        { icon: <FiGrid />, title: "Dashboard", sub: "Acceso concedido" },
      ];

  const checks = [
    isOAuth ? "Identidad verificada por OAuth 2.0" : "Contraseña cifrada con bcrypt",
    "Sesión JWT firmada (HS256)",
    "Rutas protegidas por proxy",
    "Bloqueo anti fuerza bruta",
  ];

  // Payload de la sesión (lo que contiene el token)
  const payload: [string, string][] = [
    ["id", user?.id ?? "—"],
    ["name", user?.name ?? "—"],
    ["email", user?.email ?? "—"],
    ["provider", provider],
    ["expires", expiresAt],
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <div className="grid gap-5 lg:grid-cols-12 [&>*]:min-w-0">
        {/* ---------- Hero ---------- */}
        <section className="fade-up glass ring-glow relative overflow-hidden rounded-[28px] p-8 lg:col-span-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Sesión activa
            </span>
            <ProviderBadge provider={provider} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-6xl leading-[0.9] tracking-tight md:text-[5.5rem]">
                Hola, <span className="italic text-accent">{firstName}</span>.
              </h1>
              <p className="mt-4 max-w-md text-muted">
                Tu identidad fue verificada. Todo lo que ves aquí está protegido y solo existe para ti.
              </p>
            </div>
            <div className="hidden shrink-0 md:block">
              <Avatar name={user?.name} image={user?.image} size={88} rounded="rounded-3xl" />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Método</p>
              <p className="mt-1.5 text-sm">{isOAuth ? "OAuth 2.0" : "Credenciales"}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Estrategia</p>
              <p className="mt-1.5 text-sm">JWT · sin estado</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Expira en</p>
              <p className="mt-1.5 text-sm text-accent">
                <SessionTimer expires={expiresAt} />
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Nivel de seguridad ---------- */}
        <section
          className="fade-up glass flex flex-col rounded-[28px] p-7 lg:col-span-4"
          style={{ animationDelay: "0.08s" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Nivel de protección</p>
          <div className="relative mx-auto my-5 h-40 w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={0}
                style={{ filter: "drop-shadow(0 0 10px rgba(198,243,107,0.5))" }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c6f36b" />
                  <stop offset="100%" stopColor="#8b7cff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-5xl leading-none">100</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Óptimo</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] text-accent">
                  <FiCheck />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Flujo de autenticación ---------- */}
        <section className="fade-up glass rounded-[28px] p-7 lg:col-span-7" style={{ animationDelay: "0.16s" }}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Cómo entraste</p>
            <span className="font-mono text-[10px] text-accent">{isOAuth ? "OAuth 2.0 flow" : "Credentials flow"}</span>
          </div>
          <h3 className="mt-2 font-serif text-3xl">Flujo de autenticación</h3>

          <div className="-mx-2 mt-8 overflow-x-auto px-2 pb-2">
            <div className="flex min-w-[540px] items-start">
              {flow.map((step, i) => (
                <div key={step.title} className="flex flex-1 items-start">
                  <div className="flex w-full flex-col items-center text-center">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg ${
                        i === flow.length - 1
                          ? "border-accent/50 bg-accent text-black shadow-[0_0_30px_rgba(198,243,107,0.45)]"
                          : "border-white/10 bg-black/40 text-foreground"
                      }`}
                    >
                      {step.icon}
                    </span>
                    <p className="mt-3 text-sm font-medium">{step.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">{step.sub}</p>
                  </div>
                  {i < flow.length - 1 && (
                    <div className="mt-6 h-px w-full min-w-4 flex-1 bg-white/10">
                      <div className="flow-line h-px w-full" style={{ animationDelay: `${i * 0.3}s` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Payload de sesión ---------- */}
        <section
          className="fade-up glass overflow-hidden rounded-[28px] lg:col-span-5"
          style={{ animationDelay: "0.24s" }}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">session.json</span>
          </div>
          <pre className="overflow-x-auto px-6 py-5 font-mono text-[12.5px] leading-7">
            <span className="text-muted">{"{"}</span>
            {"\n"}
            {payload.map(([k, v], i) => (
              <span key={k}>
                {"  "}
                <span className="text-accent-2">&quot;{k}&quot;</span>
                <span className="text-muted">: </span>
                <span className={k === "provider" ? "text-accent" : "text-amber-200"}>
                  &quot;{v.length > 28 ? `${v.slice(0, 28)}…` : v}&quot;
                </span>
                <span className="text-muted">{i < payload.length - 1 ? "," : ""}</span>
                {"\n"}
              </span>
            ))}
            <span className="text-muted">{"}"}</span>
          </pre>
        </section>

        {/* ---------- Capas de seguridad ---------- */}
        {[
          {
            icon: <FiShield />,
            title: "Proxy de rutas",
            text: "/dashboard y /profile exigen sesión válida antes de renderizar.",
            visual: (
              <div className="flex gap-2 font-mono text-[11px]">
                <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
                  /dashboard
                </span>
                <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">/profile</span>
              </div>
            ),
          },
          {
            icon: <FiLock />,
            title: "Anti fuerza bruta",
            text: "Tras 3 intentos fallidos la cuenta se bloquea 5 minutos.",
            visual: (
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-7 rounded-full bg-danger/70" />
                ))}
                <span className="ml-1 font-mono text-[11px] text-danger">→ 05:00</span>
              </div>
            ),
          },
          {
            icon: <FiKey />,
            title: "Hash bcrypt",
            text: "Las contraseñas se guardan como hash con salt, nunca en texto plano.",
            visual: <p className="truncate font-mono text-[11px] text-accent-2">$2b$10$N9qo8uLOickgx2ZMRZoMye…</p>,
          },
        ].map((card, i) => (
          <section
            key={card.title}
            className="fade-up glass group rounded-[24px] p-6 transition hover:-translate-y-1 lg:col-span-4"
            style={{ animationDelay: `${0.32 + i * 0.08}s` }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-accent">
              {card.icon}
            </span>
            <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{card.text}</p>
            <div className="mt-5">{card.visual}</div>
          </section>
        ))}

        {/* ---------- Acceso a perfil ---------- */}
        <Link
          href="/profile"
          className="fade-up group relative flex items-center justify-between overflow-hidden rounded-[24px] bg-accent p-7 text-black transition hover:brightness-105 lg:col-span-12"
          style={{ animationDelay: "0.56s" }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">Siguiente</p>
            <p className="mt-1 font-serif text-4xl">Ver mi credencial de acceso</p>
          </div>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-accent transition group-hover:rotate-45">
            <FiArrowUpRight />
          </span>
        </Link>
      </div>
    </div>
  );
}