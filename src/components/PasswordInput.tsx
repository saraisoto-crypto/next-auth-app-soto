"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { danger?: boolean };

// Campo de contraseña con ícono y botón para mostrar / ocultar
export default function PasswordInput({ danger, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`field ${danger ? "is-danger" : ""}`}>
      <FiLock className="shrink-0 text-muted" />
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="shrink-0 text-muted transition hover:text-foreground"
      >
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}