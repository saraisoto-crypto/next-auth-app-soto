import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import IdCard from "@/components/IdCard";
import ProviderBadge from "@/components/ProviderBadge";
import SessionTimer from "@/components/SessionTimer";
import { FiCheckCircle, FiHash, FiMail, FiUser, FiClock, FiShield } from "react-icons/fi";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const user = session.user;
  const expiresAt = session.expiresAt ?? "";
  const provider = user?.provider ?? "credentials";

  const rows: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [
    { icon: <FiUser />, label: "Nombre", value: user?.name ?? "—" },
    { icon: <FiMail />, label: "Correo", value: user?.email ?? "No público" },
    { icon: <FiShield />, label: "Proveedor", value: <ProviderBadge provider={provider} /> },
    { icon: <FiHash />, label: "ID de usuario", value: <span className="font-mono text-xs">{user?.id ?? "—"}</span> },
    {
      icon: <FiClock />,
      label: "Sesión expira en",
      value: (
        <span className="text-accent">
          <SessionTimer expires={expiresAt} />
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <div className="fade-up mb-10">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Perfil verificado
        </p>
        <h1 className="mt-4 font-serif text-6xl leading-[0.9] tracking-tight md:text-7xl">
          Tu <span className="italic text-accent">credencial</span>.
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          Esta es la identidad que NextAuth guardó en tu sesión. Mueve el mouse sobre la tarjeta.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="fade-up" style={{ animationDelay: "0.1s" }}>
          <IdCard
            name={user?.name}
            email={user?.email}
            image={user?.image}
            provider={provider}
            id={user?.id}
            expires={expiresAt}
          />
        </div>

        <div className="fade-up glass overflow-hidden rounded-[28px]" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <h2 className="font-serif text-3xl">Detalles</h2>
            <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
              <FiCheckCircle /> Verificado
            </span>
          </div>
          <dl className="divide-y divide-white/5">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-foreground">
                    {r.icon}
                  </span>
                  {r.label}
                </dt>
                <dd className="truncate text-right text-sm">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}