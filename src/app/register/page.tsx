"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiCheck, FiAlertTriangle, FiArrowRight, FiMail, FiUser } from "react-icons/fi";
import AuthTabs from "@/components/AuthTabs";
import PasswordInput from "@/components/PasswordInput";
import HashPreview from "@/components/HashPreview";

// Requisitos de la contraseña
const RULES = [
  { label: "8+ caracteres", test: (pw: string) => pw.length >= 8 },
  { label: "Una mayúscula", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Un número", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "Un símbolo", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const LEVELS = [
  { label: "Sin contraseña", color: "var(--muted)" },
  { label: "Muy débil", color: "#ff5c7a" },
  { label: "Débil", color: "#ff9f5c" },
  { label: "Buena", color: "#ffd25c" },
  { label: "Fuerte", color: "var(--accent)" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = RULES.filter((r) => r.test(form.password)).length;
  const level = LEVELS[form.password ? Math.max(1, strength) : 0];
  const matches = form.confirm.length > 0 && form.password === form.confirm;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (strength < 3) {
      setError("La contraseña es muy débil. Cumple al menos 3 requisitos.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.message);
      return;
    }

    // Registro correcto: iniciamos sesión automáticamente
    setSuccess("Cuenta creada. Abriendo tu bóveda...");
    const login = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (login?.ok && !login.error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/signIn");
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* ---------- Columna explicativa ---------- */}
      <section className="fade-up hidden lg:block">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-2" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">Nueva identidad</p>
        </div>
        <h1 className="font-serif text-[5.2rem] leading-[0.88] tracking-tight">
          Tu contraseña
          <br />
          <span className="italic text-accent">nunca se guarda.</span>
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
          Solo almacenamos su <span className="text-foreground">hash bcrypt</span>: una huella irreversible con
          un salt aleatorio. Mira cómo se transforma mientras escribes.
        </p>
        <div className="mt-8 max-w-lg">
          <HashPreview password={form.password} />
        </div>
      </section>

      {/* ---------- Formulario ---------- */}
      <section className="fade-up mx-auto w-full max-w-[440px]" style={{ animationDelay: "0.12s" }}>
        <div className="glass ring-glow rounded-[28px] p-7 sm:p-8">
          <AuthTabs active="register" />

          <div className="mb-7 mt-8">
            <h2 className="font-serif text-[2.6rem] leading-none">Crea tu acceso</h2>
            <p className="mt-2 text-sm text-muted">Tarda menos de un minuto.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre completo</label>
              <div className="field">
                <FiUser className="shrink-0 text-muted" />
                <input name="name" placeholder="Tu nombre" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label">Correo electrónico</label>
              <div className="field">
                <FiMail className="shrink-0 text-muted" />
                <input
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Contraseña</label>
                <span className="mb-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: level.color }}>
                  {level.label}
                </span>
              </div>
              <PasswordInput
                name="password"
                placeholder="Crea una contraseña segura"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              {/* Barra de fuerza */}
              <div className="mt-2.5 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i < strength ? level.color : "rgba(255,255,255,0.08)",
                      boxShadow: i < strength ? `0 0 10px ${level.color}` : "none",
                    }}
                  />
                ))}
              </div>

              {/* Requisitos */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {RULES.map((r) => {
                  const ok = r.test(form.password);
                  return (
                    <span
                      key={r.label}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition ${
                        ok ? "border-accent/40 bg-accent/10 text-accent" : "border-white/10 text-muted"
                      }`}
                    >
                      {ok && <FiCheck />} {r.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label">Confirmar contraseña</label>
              <PasswordInput
                name="confirm"
                placeholder="Repite la contraseña"
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
                danger={form.confirm.length > 0 && !matches}
              />
              {form.confirm && (
                <p className={`mt-1.5 text-xs ${matches ? "text-accent" : "text-danger"}`}>
                  {matches ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/[0.08] p-3 text-sm text-red-100">
                <FiAlertTriangle className="shrink-0 text-danger" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm text-accent">
                <FiCheck className="shrink-0" /> {success}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary group mt-2">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
              {!loading && <FiArrowRight className="transition group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}