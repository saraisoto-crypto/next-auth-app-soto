import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Política de bloqueo
export const MAX_ATTEMPTS = 3; // intentos fallidos permitidos
export const LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutos de bloqueo

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("MISSING");
        }

        await connectDB();
        const user = await User.findOne({ email });

        // No revelamos si el correo existe o no
        if (!user) {
          throw new Error("INVALID");
        }

        // 1. ¿La cuenta está bloqueada?
        if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
          throw new Error(`LOCKED:${user.lockUntil.getTime()}`);
        }

        // 2. Comparar contraseña con el hash guardado
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          user.failedAttempts = (user.failedAttempts ?? 0) + 1;

          // 3. Si llegó al máximo, bloquear la cuenta
          if (user.failedAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
            user.failedAttempts = 0;
            await user.save();
            throw new Error(`LOCKED:${user.lockUntil.getTime()}`);
          }

          await user.save();
          throw new Error(`INVALID:${MAX_ATTEMPTS - user.failedAttempts}`);
        }

        // 4. Login correcto: reiniciar contador
        user.failedAttempts = 0;
        user.lockUntil = null;
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Guardamos en el token con qué proveedor inició sesión
    async jwt({ token, user, account }) {
      if (account) token.provider = account.provider;
      if (user) token.id = user.id;
      return token;
    },
    // Pasamos esos datos del token a la sesión
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      // getServerSession borra "expires" en componentes de servidor,
      // así que guardamos una copia en "expiresAt"
      session.expiresAt = session.expires;
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  secret: process.env.NEXTAUTH_SECRET,
};