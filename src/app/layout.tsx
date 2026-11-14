import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Provider from "@/components/SessionProvider";
import LogoutButton from "@/components/LogoutButton";
import Avatar from "@/components/Avatar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MyAuthApp",
  description: "Autenticación con NextAuth y Google OAuth",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden">
        {/* Fondo decorativo */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="bg-grid absolute inset-0" />
          <div className="aurora left-[-10%] top-[-10%] h-[420px] w-[420px] bg-accent" />
          <div
            className="aurora bottom-[-15%] right-[-10%] h-[520px] w-[520px] bg-accent-2"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-black">
                M
              </span>
              <span className="font-serif text-2xl italic tracking-tight">MyAuthApp</span>
            </Link>

            <ul className="flex items-center gap-6 text-sm text-muted">
              <li>
                <Link href="/dashboard" className="transition hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              {session?.user ? (
                <>
                  <li>
                    <Link href="/profile" className="transition hover:text-foreground">
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <LogoutButton />
                  </li>
                  <li>
                    <Avatar name={session.user.name} image={session.user.image} size={34} />
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/signIn"
                    className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black transition hover:brightness-110"
                  >
                    Iniciar sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}