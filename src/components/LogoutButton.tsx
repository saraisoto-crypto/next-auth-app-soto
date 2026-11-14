"use client";

import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signIn" })}
      title="Cerrar sesión"
      className="group flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-muted transition hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
    >
      <FiLogOut className="transition group-hover:-translate-x-0.5" />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  );
}