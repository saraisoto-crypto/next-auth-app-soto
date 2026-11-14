import LoginExperience from "@/components/LoginExperience";

// Mensajes para los errores que NextAuth envía en la URL (?error=...)
const OAUTH_ERRORS: Record<string, string> = {
  OAuthSignin: "No se pudo iniciar la conexión con el proveedor.",
  OAuthCallback: "El proveedor rechazó la solicitud. Revisa las URLs de callback.",
  OAuthAccountNotLinked: "Ese correo ya está asociado a otro método de inicio de sesión.",
  AccessDenied: "Acceso denegado por el proveedor.",
  Callback: "Ocurrió un error al volver del proveedor.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const oauthError =
    error && error !== "CredentialsSignin"
      ? OAUTH_ERRORS[error] ?? "No se pudo iniciar sesión. Inténtalo de nuevo."
      : "";

  return <LoginExperience oauthError={oauthError} />;
}