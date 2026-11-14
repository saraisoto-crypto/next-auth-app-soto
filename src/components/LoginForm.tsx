"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiLock, FiAlertTriangle, FiArrowRight, FiShield } from "react-icons/fi";
import PasswordInput from "@/components/PasswordInput";

const MAX_ATTEMPTS = 3;

export default function LoginForm({ oauthError }: { oauthError: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"" | "credentials" | "google" | "github">("");
  const [error, setError] = useState(oauthError);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [shakeKey, setShakeKey] = useState(0);

  // Cuenta regresiva mientras la cuenta está bloqueada
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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

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
      setError("Cuenta bloqueada por demasiados intentos fallidos.");
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
    "flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] disabled:opacity-50";

  return (
    <div key={shakeKey} className={`glass rounded-3xl p-8 ${shakeKey > 0 ? "shake" : ""}`}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted">Bienvenida de vuelta 👋</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
          <FiShield size={22} />
        </span>
      </div>

      {/* Proveedores OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => handleOAuth("google")} disabled={!!loading} className={oauthBtn}>
          <FaGoogle /> {loading === "google" ? "Abriendo..." : "Google"}
        </button>
        <button onClick={() => handleOAuth("github")} disabled={!!loading} className={oauthBtn}>
          <FaGithub /> {loading === "github" ? "Abriendo..." : "GitHub"}
        </button>
      </div>

      <div className="my-7 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        <span className="h-px flex-1 bg-white/10" />o con tu correo
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Formulario de credenciales */}
      <form onSubmit={handleCredentials} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
            Correo
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Contraseña
            </label>
            {/* Indicador de intentos restantes */}
            {attemptsLeft !== null && (
              <div className="flex items-center gap-1.5" title="Intentos restantes">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-5 rounded-full transition ${
                      i < attemptsLeft ? "bg-accent" : "bg-red-500/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLocked}
          />
        </div>

        {error && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
              isLocked
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-amber-400/30 bg-amber-500/10 text-amber-100"
            }`}
          >
            {isLocked ? (
              <FiLock className="mt-0.5 shrink-0" />
            ) : (
              <FiAlertTriangle className="mt-0.5 shrink-0" />
            )}
            <div>
              <p>{error}</p>
              {isLocked && (
                <>
                  <p className="mt-1 font-mono text-2xl tracking-widest text-red-300">
                    {mm}:{ss}
                  </p>
                  <p className="mt-1 text-xs text-red-200/70">
                    Podrás intentarlo de nuevo cuando termine el contador.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!!loading || isLocked}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading === "credentials" ? "Verificando..." : isLocked ? "Bloqueado" : "Entrar"}
          {!loading && !isLocked && (
            <FiArrowRight className="transition group-hover:translate-x-1" />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}