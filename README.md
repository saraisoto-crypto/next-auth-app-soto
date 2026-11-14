<div align="center">

# 🔐 Vault — Autenticación segura con NextAuth.js

**Laboratorio 13 · Desarrollo de Aplicaciones Web Avanzado · Tecsup**

Sistema de autenticación con **Google**, **GitHub** y **credenciales propias**, contraseñas cifradas con **bcrypt**, bloqueo contra **ataques de fuerza bruta** y rutas protegidas.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-7C3AED?style=for-the-badge&logo=auth0&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[🌐 Ver demo en vivo](https://next-auth-app-soto.vercel.app) · [📂 Repositorio](https://github.com/saraisoto-crypto/next-auth-app-soto)

</div>

---

## ✨ Funcionalidades

| Requisito | Implementación |
|---|---|
| 🔑 **Google OAuth** | Inicio de sesión con `GoogleProvider` mediante el flujo OAuth 2.0 |
| 🐙 **GitHub OAuth** | Inicio de sesión con `GitHubProvider` |
| 📝 **Registro de usuarios** | Formulario con validación de fuerza de contraseña y confirmación |
| 🔒 **Credenciales propias** | `CredentialsProvider` con usuarios guardados en MongoDB Atlas |
| 🧂 **Cifrado bcrypt** | Contraseñas guardadas como hash con salt (10 rondas), nunca en texto plano |
| 🚫 **Bloqueo anti fuerza bruta** | 3 intentos fallidos → cuenta bloqueada **5 minutos** (persistido en BD) |
| 🛡️ **Rutas protegidas** | `/dashboard` y `/profile` protegidas con `proxy.ts` (antes `middleware.ts`) |
| 🎫 **Sesión JWT** | Token firmado con `NEXTAUTH_SECRET` que incluye el proveedor usado |

### Detalles de la interfaz

- **Login:** dial de bóveda animado y consola `security.log` que escribe eventos en vivo. Cuando la cuenta se bloquea, todo cambia a rojo con un anillo de cuenta regresiva.
- **Registro:** "laboratorio bcrypt" que muestra en vivo cómo la contraseña se transforma en un hash, coloreado por partes (algoritmo, costo, salt y hash).
- **Dashboard:** medidor de protección, diagrama del flujo de autenticación según el proveedor, payload de la sesión y contador de expiración.
- **Perfil:** credencial de acceso con efecto 3D y brillo holográfico al mover el mouse.

---


## 🧱 Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Autenticación:** NextAuth.js v4
- **Base de datos:** MongoDB Atlas + Mongoose
- **Cifrado:** bcryptjs
- **Estilos:** Tailwind CSS v4
- **Íconos:** react-icons
- **Despliegue:** Vercel

---

## 🔄 ¿Cómo funciona el bloqueo?

```
Intento fallido 1 → failedAttempts = 1 → "Te quedan 2 intentos"
Intento fallido 2 → failedAttempts = 2 → "Te queda 1 intento"
Intento fallido 3 → lockUntil = ahora + 5 min → 🔒 CUENTA BLOQUEADA
Login correcto    → failedAttempts = 0, lockUntil = null
```

El estado se guarda en **MongoDB**, así que el bloqueo **no se evita** recargando la página ni cambiando de navegador.

---

## 🚀 Instalación local

### 1. Clonar e instalar

```bash
git clone https://github.com/saraisoto-crypto/next-auth-app-soto.git
cd next-auth-app-soto
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_ID=
GITHUB_SECRET=

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/nextauth?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=   # generar en https://generate-secret.vercel.app/32
NEXTAUTH_URL=http://localhost:3000
```

### 3. URLs de callback

| Proveedor | Dónde configurarlo | Callback URL |
|---|---|---|
| Google | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | `http://localhost:3000/api/auth/callback/google` |
| GitHub | [GitHub OAuth Apps](https://github.com/settings/developers) | `http://localhost:3000/api/auth/callback/github` |

### 4. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del proyecto

```
src/
├── proxy.ts                         # Protección de rutas (Next.js 16)
├── lib/
│   ├── auth.ts                      # Configuración de NextAuth (3 proveedores + bloqueo)
│   └── mongodb.ts                   # Conexión a MongoDB con caché
├── models/
│   └── User.ts                      # Esquema: name, email, password, failedAttempts, lockUntil
├── types/
│   └── next-auth.d.ts               # Tipos extendidos de la sesión
├── components/
│   ├── LoginExperience.tsx          # Login con estados normal / intentos / bloqueado
│   ├── VaultDial.tsx                # Dial de bóveda animado
│   ├── SecurityLog.tsx              # Consola de eventos
│   ├── HashPreview.tsx              # Vista previa del hash bcrypt
│   ├── IdCard.tsx                   # Credencial holográfica
│   ├── CountdownRing.tsx            # Anillo de cuenta regresiva
│   ├── Navbar.tsx · Avatar.tsx · ProviderBadge.tsx · ...
└── app/
    ├── api/
    │   ├── auth/[...nextauth]/route.ts
    │   └── register/route.ts        # Registro con bcrypt
    ├── signIn/page.tsx
    ├── register/page.tsx
    ├── dashboard/page.tsx
    └── profile/page.tsx
```

---

## ⚠️ Cambios respecto a la guía (Next.js 16)

| Guía | Este proyecto | Motivo |
|---|---|---|
| `middleware.ts` | `proxy.ts` | Renombrado en Next.js 16 |
| `images.domains` | `images.remotePatterns` | `domains` está obsoleto |
| `authOptions` en `route.ts` | `authOptions` en `lib/auth.ts` | Exportarlo desde `route.ts` rompe el build |
| `session.expires` | `session.expiresAt` | `getServerSession` elimina `expires` en Server Components |

---

## 👩‍💻 Autora

**Sarai Sthefanie Soto López**
Desarrollo de Aplicaciones Web Avanzado · Sección C24 · Tecsup 2026-II
Docente: Edwin Arévalo Sermeño

[![GitHub](https://img.shields.io/badge/GitHub-saraisoto--crypto-181717?style=flat-square&logo=github)](https://github.com/saraisoto-crypto)
