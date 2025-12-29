# 🏠 Alquiler Directo

Una plataforma moderna para alquiler directo de propiedades (sin intermediarios), con sistema de matching inteligente.

**Construcción**: Next.js 16 | React 19 | TypeScript | Tailwind CSS | Firebase

---

## 📌 Descripción General

**InmoApp** es una aplicación web fullstack que conecta propietarios y arrendatarios a través de una plataforma intuitiva y completa. Ofrece búsqueda avanzada, gestión de publicaciones, perfiles de usuario y un panel administrativo.

### ✨ Características Clave

| Característica | Descripción |
|---|---|
| 🔐 **Autenticación segura** | Login/Registro con Firebase |
| 🏘️ **Gestión de propiedades** | Crear, editar y eliminar publicaciones |
| 🔎 **Búsqueda inteligente** | Filtros avanzados y búsqueda por palabras clave |
| ⭐ **Sistema de calificaciones** | Valoraciones y reseñas de usuarios |
| 👤 **Perfiles personalizados** | Gestión de perfil y mis publicaciones |
| 🛠️ **Panel administrativo** | Dashboard para moderadores |
| 🌓 **Temas dinámicos** | Soporte para modo claro/oscuro |
| 📈 **Analytics** | Integración con Vercel Analytics |

---

## 🛠️ Tecnologías

### Core
```
Next.js 16.0.10      - React framework con App Router
React 19.2.0         - Librería UI
TypeScript 5.x       - Tipado estático
Tailwind CSS 4.1.9   - Utility-first CSS framework
```

### UI & Componentes
```
Radix UI             - Componentes accesibles sin estilos
React Hook Form      - Gestión eficiente de formularios
Zod                  - Validación de esquemas en TypeScript
Lucide React         - Iconografía moderna
```

### Backend & Datos
```
Firebase             - Autenticación y Firestore
N8N                  - Automatizaciones (vía API proxy)
Vercel Analytics     - Monitoreo de métricas
```

### Utilidades
```
Sonner               - Notificaciones toast
Next Themes          - Manejo de temas
Recharts             - Visualización de datos
Embla Carousel       - Carrusel de imágenes
Date-fns             - Utilidades de fechas
```

---

## 📂 Estructura del Proyecto

```
real-estate-web-app/
├── app/
│   ├── api/                    # Rutas API
│   │   ├── n8n/[...path]       # Proxy para N8N
│   │   └── upload/             # Carga de archivos
│   ├── admin/                  # Panel administrativo (protegido)
│   ├── buscar/                 # Búsqueda de propiedades
│   ├── login/                  # Página de inicio de sesión
│   ├── registro/               # Página de registro
│   ├── perfil/                 # Perfil de usuario (protegido)
│   ├── mis-publicaciones/      # Mis anuncios (protegido)
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # Home (redirige a login)
│   └── globals.css             # Estilos globales
│
├── components/
│   ├── ui/                     # Componentes UI base (40+)
│   │   ├── button.tsx          # Botones personalizados
│   │   ├── card.tsx            # Cards reutilizables
│   │   ├── form.tsx            # Formularios
│   │   ├── dialog.tsx          # Modales
│   │   └── ... (más componentes)
│   ├── auth-guard.tsx          # Protector de rutas
│   ├── navbar.tsx              # Barra de navegación
│   ├── rating-display.tsx      # Componente de calificaciones
│   ├── theme-provider.tsx      # Proveedor de temas
│   └── spinner.tsx             # Indicador de carga
│
├── hooks/
│   ├── use-mobile.ts           # Detecta si es dispositivo móvil
│   └── use-toast.ts            # Hook para notificaciones
│
├── lib/
│   ├── api.ts                  # Cliente API
│   ├── auth.ts                 # Utilidades de autenticación
│   ├── firebaseClient.ts       # Config cliente de Firebase
│   ├── firebaseAdmin.ts        # Config admin de Firebase
│   ├── mockData.ts             # Datos de prueba
│   ├── searchParser.ts         # Parser de búsquedas
│   ├── storage.ts              # Gestión de almacenamiento
│   └── utils.ts                # Funciones auxiliares
│
├── types/
│   └── index.ts                # Definiciones de tipos TypeScript
│
├── public/                     # Activos estáticos (iconos, imágenes)
├── styles/                     # Estilos adicionales
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuración TypeScript
├── next.config.mjs             # Configuración Next.js
├── tailwind.config.ts          # Configuración Tailwind
└── README.md                   # Este archivo
```

---

## 🚀 Inicio Rápido

### Requisitos
- **Node.js**: 18+ (recomendado 20 LTS)
- **pnpm**: gestor de paquetes (o npm/yarn/bun)

### Pasos de Instalación

1. **Clonar repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd real-estate-web-app
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar entorno**
   
   Crear archivo `.env.local`:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # N8N (si se usa)
   N8N_API_URL=your_n8n_url
   N8N_API_KEY=your_n8n_key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```
   
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo (con hot reload) |
| `pnpm build` | Construye la app para producción |
| `pnpm start` | Ejecuta la app en modo producción |
| `pnpm lint` | Ejecuta ESLint para verificar código |

---

## 🔐 Autenticación

La app utiliza **Firebase Authentication** para:
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión seguro
- ✅ Gestión de sesiones
- ✅ Control de acceso a rutas protegidas

Las rutas protegidas usan el componente `auth-guard.tsx` para verificar autenticación.

---

## 🎨 Temas y Estilos

- **Framework CSS**: Tailwind CSS 4.1.9
- **Temas**: Light/Dark mode automático (via `next-themes`)
- **Componentes**: Radix UI (accesibles y sin estilos por defecto)
- **Animaciones**: `tailwindcss-animate`

### Personalizar Colores
Edita el archivo de configuración de Tailwind:
```bash
tailwind.config.ts
```

---

## 🔌 Integración con N8N

La app incluye un **proxy API** hacia N8N para automatizaciones:

```
Endpoint: /api/n8n/[...path]
```

Esto permite ejecutar workflows de N8N desde la aplicación.

---

## 📊 Base de Datos

**Firebase Firestore** se usa para:
- Almacenamiento de propiedades
- Perfiles de usuario
- Calificaciones y reseñas
- Datos de publicaciones

**Mock Data** (`lib/mockData.ts`): Datos de ejemplo para desarrollo.

---

## 🚢 Despliegue

### Desplegar en Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura variables de entorno en el dashboard
3. Deploy automático en cada push a `main`

### Desplegar Localmente

```bash
# Construir
pnpm build

# Ejecutar en producción
pnpm start
```

---

## 📝 Notas para Desarrolladores

### Mejores Prácticas
- ✅ Usar TypeScript en todos los archivos
- ✅ Componentes funcionales con React Hooks
- ✅ Estilos con Tailwind CSS (utility-first)
- ✅ Validación con Zod
- ✅ Variables de entorno en `.env.local`

### Estructura de Componentes
```tsx
// app/page.tsx (Server Component por defecto)
export default function Page() {
  return <div>Contenido</div>
}

// components/MyComponent.tsx (use 'use client' si necesitas interactividad)
'use client'

import { useState } from 'react'

export function MyComponent() {
  return <div>Componente interactivo</div>
}
```

---

## 🐛 Troubleshooting

**Error de Firebase**
→ Verifica que `.env.local` tenga las credenciales correctas

**Puerto 3000 en uso**
```bash
pnpm dev -- -p 3001
```

**Caché de Next.js problemático**
```bash
rm -rf .next
pnpm dev
```

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

---

## 👥 Equipo

Desarrollado por el equipo de **Alquiler Directo**.

---

**Versión**: 0.1.0 | **Última actualización**: 29 de diciembre de 2025
