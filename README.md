# Alquiler Directo

Plataforma moderna de alquiler de propiedades con matching inteligente, construida con Next.js y tecnologías web contemporáneas.

## 📋 Descripción del Proyecto

InmoApp es una aplicación web completa para la gestión, búsqueda y publicación de propiedades inmobiliarias. Proporciona a usuarios y administradores herramientas para conectar ofertas de alquiler y venta de manera efectiva.

### Características Principales

- 🔐 **Autenticación**: Sistema de login y registro seguro con Firebase
- 🏠 **Gestión de Propiedades**: Publicar, editar y administrar listados de propiedades
- 🔍 **Búsqueda Avanzada**: Búsqueda inteligente con filtros personalizados
- ⭐ **Sistema de Calificaciones**: Valoraciones y reseñas de propiedades
- 👥 **Perfiles de Usuario**: Gestión de perfil y mis publicaciones
- 📊 **Panel Administrativo**: Dashboard para administradores
- 🎨 **Interfaz Responsiva**: Diseño moderno con soporte para temas oscuro/claro
- 📊 **Analytics**: Integración con Vercel Analytics

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [Next.js 16.0.10](https://nextjs.org/)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.9 + PostCSS
- **UI Components**: Radix UI (accesible y customizable)
- **Formularios**: React Hook Form + Zod (validación)
- **Iconos**: Lucide React

### Backend & Services
- **Firebase**: Autenticación y base de datos en tiempo real
- **N8N**: Integración de automatizaciones (API proxy)
- **Vercel Analytics**: Seguimiento de métricas

### Herramientas Adicionales
- **Carousel**: Embla Carousel
- **Gráficos**: Recharts
- **Notificaciones**: Sonner (toast notifications)
- **Temas**: Next Themes
- **Datos**: Date-fns, Class Variance Authority, CLSX

## 📁 Estructura del Proyecto

```
├── app/                      # App Router de Next.js
│   ├── admin/               # Panel administrativo
│   ├── buscar/              # Búsqueda de propiedades
│   ├── login/               # Página de login
│   ├── registro/            # Página de registro
│   ├── perfil/              # Perfil de usuario
│   ├── mis-publicaciones/   # Gestión de anuncios
│   ├── api/                 # Rutas API
│   │   └── n8n/            # Proxy para n8n
│   └── layout.tsx           # Layout principal
├── components/              # Componentes React
│   ├── ui/                 # Componentes UI (Radix UI)
│   ├── auth-guard.tsx      # Guard de autenticación
│   ├── navbar.tsx          # Barra de navegación
│   ├── rating-display.tsx  # Componente de calificaciones
│   └── theme-provider.tsx  # Proveedor de temas
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts       # Detección de dispositivo móvil
│   └── use-toast.ts        # Hook para notificaciones
├── lib/                     # Utilidades y librerías
│   ├── api.ts              # Cliente API
│   ├── mockData.ts         # Datos de prueba
│   ├── searchParser.ts     # Parseador de búsquedas
│   └── utils.ts            # Funciones auxiliares
├── types/                   # Definiciones de tipos TypeScript
├── public/                  # Activos estáticos
├── styles/                  # Estilos globales
└── next.config.mjs         # Configuración de Next.js
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ (recomendado 20+)
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repositorio>
   cd real-estate-web-app
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o npm install / yarn install / bun install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env.local` con las credenciales de Firebase y otras configuraciones necesarias.

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```
   La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

- `pnpm dev` - Inicia servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia servidor de producción
- `pnpm lint` - Ejecuta linting con ESLint

## 🔐 Autenticación

La aplicación utiliza Firebase para:
- Registro e inicio de sesión
- Gestión de sesiones
- Control de acceso a rutas protegidas (Auth Guard)

Las rutas protegidas verifican autenticación antes de permitir acceso.

## 🎨 Personalización

### Temas
La aplicación soporta temas claros y oscuros mediante `next-themes`. Se adapta automáticamente a las preferencias del sistema.

### Componentes UI
Los componentes están construidos sobre Radix UI y son totalmente personalizables. Modificar Tailwind CSS en `tailwind.config.ts` para cambiar colores y estilos globales.

## 📝 Convenciones del Proyecto

- **TypeScript**: Tipado completo para mayor seguridad
- **Componentes**: Usar componentes funcionales con hooks
- **Estilos**: Tailwind CSS para utility-first styling
- **Validación**: Zod para validación de esquemas

## 🔄 Integración con N8N

La aplicación incluye un proxy API hacia n8n para automatizaciones. Rutas:
```
/api/n8n/[...path]
```

## 📊 Datos

El proyecto incluye `mockData.ts` con datos de ejemplo para desarrollo y testing.

## 🚢 Despliegue

El proyecto está optimizado para despliegue en **Vercel**:
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

## 📧 Contacto

Para más información o reportar problemas, contactar al equipo de desarrollo.

---

**Versión**: 0.1.0  
**Última actualización**: 28 de diciembre de 2025
