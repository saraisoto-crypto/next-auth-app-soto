import type { DefaultSession } from "next-auth";

// Agregamos "id" y "provider" a la sesión y al token JWT
declare module "next-auth" {
  interface Session {
    expiresAt?: string;
    user: {
      id?: string;
      provider?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
  }
}