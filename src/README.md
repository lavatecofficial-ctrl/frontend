# AVIARIX2 Frontend - Estructura Organizada

## 📁 Estructura del Proyecto

```
src/
├── applications/          # Aplicaciones del sistema
│   ├── aviator/          # Aplicación Aviator
│   │   ├── components/   # Componentes específicos
│   │   ├── pages/        # Páginas (dashboard, login, portal)
│   │   ├── styles/       # Estilos específicos
│   │   └── index.tsx     # Exportaciones
│   ├── spaceman/         # Aplicación Spaceman
│   │   ├── components/   # Componentes específicos
│   │   ├── pages/        # Páginas
│   │   ├── styles/       # Estilos específicos
│   │   └── index.tsx     # Exportaciones
│   ├── roulettes/        # Aplicación Roulettes
│   │   ├── components/   # Componentes específicos
│   │   ├── pages/        # Páginas
│   │   ├── styles/       # Estilos específicos
│   │   └── index.tsx     # Exportaciones
│   ├── index.tsx         # Exportaciones principales
│   ├── AppNavigator.tsx  # Navegador entre apps
│   └── README.md         # Documentación de apps
├── shared/               # Recursos compartidos
│   ├── components/       # Componentes reutilizables
│   │   ├── Input.tsx     # Componente de entrada
│   │   └── Login.tsx     # Componente de login
│   ├── styles/           # Estilos compartidos
│   │   ├── fonts.css     # Definición de fuentes
│   │   ├── globals.css   # Estilos globales
│   │   ├── googleButton.css # Estilos del botón Google
│   │   └── loginAnimations.css # Animaciones de login
│   └── index.tsx         # Exportaciones compartidas
├── config/               # Configuración del proyecto
│   └── index.ts          # Configuración principal
├── hooks/                # Custom hooks
├── services/             # Servicios de API
└── app/                  # Páginas principales de Next.js
    ├── layout.tsx        # Layout principal
    ├── page.tsx          # Página de inicio
    ├── globals.css       # Estilos globales de Next.js
    └── favicon.ico       # Favicon
```

## 🚀 Aplicaciones Disponibles

### 1. **Aviator** (gameId: 1)
- **Descripción**: Juego de Aviator
- **Páginas**: Dashboard, Login, Portal
- **Estilos**: `portal.css`, `dashboard.css`

### 2. **Spaceman** (gameId: 2)
- **Descripción**: Juego de Spaceman
- **Páginas**: Portal (pendiente)
- **Estilos**: (pendiente)

### 3. **Roulettes** (gameId: 3)
- **Descripción**: Juego de Ruletas
- **Páginas**: Portal (pendiente)
- **Estilos**: (pendiente)

## 📦 Componentes Compartidos

### **Input.tsx**
- Componente de entrada reutilizable
- Soporte para diferentes tipos de input
- Validación integrada

### **Login.tsx**
- Componente de autenticación
- Integración con Google OAuth
- Animaciones personalizadas

## 🎨 Estilos Compartidos

### **fonts.css**
- Definición de fuentes Orbitron y SF Pro Display
- Variables CSS para tipografía

### **globals.css**
- Estilos globales del proyecto
- Variables CSS para colores y espaciado

### **googleButton.css**
- Estilos específicos para el botón de Google
- Animaciones y estados hover

### **loginAnimations.css**
- Animaciones para el proceso de login
- Transiciones suaves y efectos visuales

## ⚙️ Configuración

### **config/index.ts**
- Configuración centralizada del proyecto
- Variables de entorno
- Configuración de API
- Configuración de UI
- Configuración de juegos

## 🔧 Uso

### Importar una aplicación específica
```typescript
import { AviatorPortal, AVIATOR_APP } from '@/applications/aviator';
```

### Importar componentes compartidos
```typescript
import { Input, Login } from '@/shared';
```

### Importar configuración
```typescript
import { APP_CONFIG } from '@/config';
```

### Usar el navegador de aplicaciones
```typescript
import AppNavigator from '@/applications/AppNavigator';

<AppNavigator 
  currentApp="aviator" 
  onAppChange={(app) => console.log('App changed to:', app.name)} 
/>
```

## 🧹 Limpieza Realizada

### ✅ **Archivos Movidos**
- `components/Input.tsx` → `shared/components/Input.tsx`
- `components/Login.tsx` → `shared/components/Login.tsx`
- `styles/fonts.css` → `shared/styles/fonts.css`
- `styles/globals.css` → `shared/styles/globals.css`
- `styles/googleButton.css` → `shared/styles/googleButton.css`
- `styles/loginAnimations.css` → `shared/styles/loginAnimations.css`
- `styles/portal.css` → `applications/aviator/styles/portal.css`
- `styles/dashboard.css` → `applications/aviator/styles/dashboard.css`
- `app/dashboard/` → `applications/aviator/pages/dashboard/`
- `app/login/` → `applications/aviator/pages/login/`

### ✅ **Carpetas Eliminadas**
- `components/` (vacía)
- `styles/` (vacía)

### ✅ **Archivos Creados**
- `shared/index.tsx` - Exportaciones compartidas
- `config/index.ts` - Configuración principal
- `applications/index.tsx` - Exportaciones de aplicaciones
- `applications/AppNavigator.tsx` - Navegador de apps

## 🎯 Beneficios de la Nueva Estructura

- **📦 Modularidad**: Cada aplicación es independiente
- **🔄 Reutilización**: Componentes y estilos compartidos
- **📈 Escalabilidad**: Fácil agregar nuevas aplicaciones
- **🔧 Mantenibilidad**: Código organizado y separado
- **⚡ Rendimiento**: Importaciones optimizadas
- **🎨 Consistencia**: Configuración centralizada
- **📝 Documentación**: READMEs detallados

## 🚀 Próximos Pasos

1. **Crear páginas para Spaceman y Roulettes**
2. **Implementar componentes específicos por aplicación**
3. **Agregar estilos específicos para cada app**
4. **Integrar el navegador en el dashboard principal**
5. **Crear componentes compartidos adicionales**
6. **Implementar sistema de temas**
7. **Agregar tests unitarios**
