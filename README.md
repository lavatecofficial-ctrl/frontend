# Frontend - AVIARIX2

Este es el frontend de la aplicación AVIARIX2, construido con Next.js 13+, React, TypeScript y Tailwind CSS.

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 13+
│   ├── dashboard/         # Página del dashboard
│   │   └── page.tsx      # Página de dashboard
│   ├── login/            # Página de login
│   │   └── page.tsx      # Página de login
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal (redirige a login)
├── components/           # Componentes reutilizables
│   └── Login.tsx        # Componente de login
├── hooks/               # Hooks personalizados
│   └── useAuth.ts       # Hook para manejo de autenticación
├── services/            # Servicios para llamadas a API
│   └── authService.ts   # Servicio de autenticación
└── styles/              # Estilos adicionales
    └── globals.css      # Estilos globales personalizados
```

## Características

- **Next.js 13+** con App Router
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Sistema de autenticación** básico
- **Responsive design**
- **Estructura modular** y escalable

## Páginas Disponibles

- `/` - Redirige automáticamente a `/login`
- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (requiere autenticación)

## Componentes

### Login
Componente de login con formulario de email y contraseña, incluye:
- Validación de campos
- Estado de carga
- Manejo de errores
- Diseño responsive

### Dashboard
Página de dashboard que muestra:
- Información del usuario autenticado
- Botón de cerrar sesión
- Layout responsive

## Hooks

### useAuth
Hook personalizado para manejar la autenticación:
- Estado de autenticación
- Funciones de login/logout
- Persistencia en localStorage
- Validación de tokens

## Servicios

### authService
Servicio para manejar las llamadas de autenticación:
- Login con credenciales
- Logout
- Validación de tokens
- Mock login para desarrollo

## Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

4. **Ejecutar en producción:**
   ```bash
   npm start
   ```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Desarrollo

### Autenticación
El sistema de autenticación está configurado para funcionar sin backend:
- Usa localStorage para persistir tokens
- Incluye mock login para desarrollo
- Listo para integrar con backend real

### Estilos
- Tailwind CSS para estilos principales
- Estilos personalizados en `src/styles/globals.css`
- Clases utilitarias predefinidas

### Estructura
- Separación clara de responsabilidades
- Componentes reutilizables
- Hooks personalizados
- Servicios para lógica de negocio

## Próximos Pasos

1. Integrar con backend real
2. Agregar más páginas y componentes
3. Implementar sistema de rutas protegidas
4. Agregar tests unitarios
5. Configurar CI/CD
