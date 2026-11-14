"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiAlertTriangle, FiArrowRight, FiMail, FiShield } from "react-icons/fi";
import VaultDial from "@/components/VaultDial";
import SecurityLog from "@/components/SecurityLog";
import AuthTabs from "@/components/AuthTabs";
import PasswordInput from "@/components/PasswordInput";
import CountdownRing from "@/components/CountdownRing";
import { GoogleIcon, GithubIcon } from "@/components/BrandIcons";

const MAX_ATTEMPTS = 3;
const LOCK_TIME_MS = 5 * 60 * 1000;

export default function LoginExperience({ oauthError }: { oauthError: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"" | "credentials" | "google" | "github">("");
  const [error, setError] = useState(oauthError);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [shakeKey, setShakeKey] = useState(0);

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (!lockUntil) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= lockUntil) {
        setLockUntil(null);
        setAttemptsLeft(null);
        setError("");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  const remaining = lockUntil ? Math.max(0, lockUntil - now) : 0;
  const isLocked = remaining > 0;
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  const handleOAuth = (provider: "google" | "github") => {
    setLoading(provider);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading("");

    if (result?.ok && !result.error) {
      router.push("/dashboard");
      router.refresh(); // para que el navbar (servidor) lea la nueva sesión
      return;
    }

    const code = result?.error ?? "";
    setShakeKey((k) => k + 1);
    setPassword("");

    if (code.startsWith("LOCKED:")) {
      setLockUntil(Number(code.split(":")[1]));
      setNow(Date.now());
      setAttemptsLeft(0);
      setError("Demasiados intentos fallidos. La cuenta quedó bloqueada temporalmente.");
    } else if (code.startsWith("INVALID:")) {
      const left = Number(code.split(":")[1]);
      setAttemptsLeft(left);
      setError(`Contraseña incorrecta. Te ${left === 1 ? "queda 1 intento" : `quedan ${left} intentos`}.`);
    } else if (code === "MISSING") {
      setError("Completa el correo y la contraseña.");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const oauthBtn =
    "group flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* ---------- Columna visual ---------- */}
      <section className="fade-up hidden lg:block">
        <div className="mb-8 flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${isLocked ? "bg-danger" : "bg-accent"} animate-pulse`} />
          <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${isLocked ? "text-danger" : "text-accent"}`}>
            {isLocked ? "Acceso restringido" : "Sistema de acceso seguro"}
          </p>
        </div>

        <h1 className="font-serif text-[5.5rem] leading-[0.88] tracking-tight">
          Tu identidad,
          <br />
          <span className={`italic ${isLocked ? "text-danger" : "text-accent"}`}>
            {isLocked ? "en pausa." : "bajo llave."}
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-[1fr_1.1fr] items-center gap-8">
          <VaultDial locked={isLocked} />
          <div className="space-y-4">
            <p className="text-[15px] leading-relaxed text-muted">
              Autenticación con <span className="text-foreground">OAuth 2.0</span>, contraseñas cifradas con{" "}
              <span className="text-foreground">bcrypt</span> y bloqueo automático ante{" "}
              <span className="text-foreground">ataques de fuerza bruta</span>.
            </p>
            <SecurityLog key={String(isLocked)} locked={isLocked} />
          </div>
        </div>
      </section>

      {/* ---------- Columna formulario ---------- */}
      <section className="fade-up mx-auto w-full max-w-[440px]" style={{ animationDelay: "0.12s" }}>
        <div
          key={shakeKey}
          className={`glass ring-glow ${isLocked ? "is-danger" : ""} rounded-[28px] p-7 sm:p-8 ${shakeKey > 0 ? "shake" : ""}`}
        >
          <AuthTabs active="signIn" />

          <div className="mb-7 mt-8">
            <h2 className="font-serif text-[2.6rem] leading-none">Bienvenida de vuelta</h2>
            <p className="mt-2 text-sm text-muted">Elige cómo quieres verificar tu identidad.</p>
          </div>

          {/* Proveedores OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleOAuth("google")} disabled={!!loading} className={oauthBtn}>
              <GoogleIcon /> {loading === "google" ? "Conectando..." : "Google"}
            </button>
            <button onClick={() => handleOAuth("github")} disabled={!!loading} className={oauthBtn}>
              <GithubIcon /> {loading === "github" ? "Conectando..." : "GitHub"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
            o con tu correo
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
          </div>

          {isLocked ? (
            /* ---------- Estado bloqueado ---------- */
            <div className="flex flex-col items-center rounded-2xl border border-danger/25 bg-danger/[0.06] px-5 py-6 text-center">
              <CountdownRing remaining={remaining} total={LOCK_TIME_MS} label={`${mm}:${ss}`} />
              <p className="mt-4 font-medium text-foreground">Cuenta bloqueada</p>
              <p className="mt-1 text-sm text-muted">{error}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-danger/80">
                {MAX_ATTEMPTS} intentos fallidos · bloqueo de 5 min
              </p>
            </div>
          ) : (
            /* ---------- Formulario ---------- */
            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label className="label">Correo electrónico</label>
                <div className="field">
                  <FiMail className="shrink-0 text-muted" />
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Contraseña</label>
                  {attemptsLeft !== null && (
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Intentos</span>
                      <div className="flex gap-1">
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-4 rounded-full transition-colors ${
                              i < attemptsLeft ? "bg-accent shadow-[0_0_8px_rgba(198,243,107,0.6)]" : "bg-danger/70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  danger={attemptsLeft !== null}
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-3 text-sm text-amber-100">
                  <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-300" />
                  <p>{error}</p>
                </div>
              )}

              <button type="submit" disabled={!!loading} className="btn-primary group mt-2">
                {loading === "credentials" ? "Verificando identidad..." : "Ingresar"}
                {loading !== "credentials" && <FiArrowRight className="transition group-hover:translate-x-1" />}
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <FiShield className="text-accent" /> Cifrado bcrypt · Sesión JWT
          </div>
        </div>
      </section>
    </div>
  );
}