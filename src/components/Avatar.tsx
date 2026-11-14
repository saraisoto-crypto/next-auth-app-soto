import Image from "next/image";

type Props = {
  name?: string | null;
  image?: string | null;
  size?: number;
  rounded?: string;
};

// Foto de Google/GitHub o iniciales con degradado (usuarios con credenciales)
export default function Avatar({ name, image, size = 40, rounded = "rounded-full" }: Props) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Perfil"}
        width={size}
        height={size}
        className={`${rounded} object-cover ring-1 ring-white/15`}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`${rounded} flex shrink-0 items-center justify-center bg-[conic-gradient(from_200deg,var(--accent),var(--accent-2),#78dcff,var(--accent))] font-semibold text-black ring-1 ring-white/15`}
    >
      {initials}
    </div>
  );
}