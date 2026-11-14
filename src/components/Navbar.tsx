"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUser } from "react-icons/fi";
import LogoutButton from "@/components/LogoutButton";
import Avatar from "@/components/Avatar";

type NavUser = { name?: string | null; image?: string | null } | null;

export default function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    ...(user ? [{ href: "/profile", label: "Perfil", icon: <FiUser /> }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-accent text-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <path d="M12 4v3M12 17v3M4 12h3M17 12h3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-serif text-[1.6rem] italic leading-none tracking-tight">
            Vault<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Links */}
        <ul className="hidden items-center gap-1 rounded-xl border border-white/5 bg-black/30 p-1 sm:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                    active
                      ? "bg-white/[0.08] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className={active ? "text-accent" : ""}>{l.icon}</span>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Usuario */}
        {user ? (
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link href="/profile" className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition hover:bg-white/5">
              <Avatar name={user.name} image={user.image} size={32} />
              <span className="hidden text-sm md:block">{user.name?.split(" ")[0]}</span>
            </Link>
          </div>
        ) : (
          <Link
            href="/signIn"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Ingresar
          </Link>
        )}
      </nav>
    </header>
  );
}