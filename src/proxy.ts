import { withAuth } from "next-auth/middleware";

// Protege las rutas: si no hay sesión, redirige a /signIn
export default withAuth({
  pages: {
    signIn: "/signIn",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};