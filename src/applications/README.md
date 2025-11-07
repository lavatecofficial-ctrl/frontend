# Aplicaciones del Sistema

Esta carpeta contiene las diferentes aplicaciones del sistema, organizadas de manera modular para facilitar el mantenimiento y la escalabilidad.

## Estructura

```
applications/
├── aviator/           # Aplicación Aviator
│   ├── components/    # Componentes específicos de Aviator
│   ├── pages/         # Páginas de Aviator
│   ├── styles/        # Estilos específicos de Aviator
│   └── index.tsx      # Exportaciones de Aviator
├── spaceman/          # Aplicación Spaceman
│   ├── components/    # Componentes específicos de Spaceman
│   ├── pages/         # Páginas de Spaceman
│   ├── styles/        # Estilos específicos de Spaceman
│   └── index.tsx      # Exportaciones de Spaceman
├── roulettes/         # Aplicación Roulettes
│   ├── components/    # Componentes específicos de Roulettes
│   ├── pages/         # Páginas de Roulettes
│   ├── styles/        # Estilos específicos de Roulettes
│   └── index.tsx      # Exportaciones de Roulettes
├── index.tsx          # Exportaciones principales
└── AppNavigator.tsx   # Navegador entre aplicaciones
```

## Aplicaciones Disponibles

### 1. Aviator (gameId: 1)
- **Descripción**: Juego de Aviator
- **Rutas**:
  - Portal: `/aviator/portal`
  - Juego: `/aviator/game`
  - Estadísticas: `/aviator/stats`
  - Configuración: `/aviator/settings`

### 2. Spaceman (gameId: 2)
- **Descripción**: Juego de Spaceman
- **Rutas**:
  - Portal: `/spaceman/portal`
  - Juego: `/spaceman/game`
  - Estadísticas: `/spaceman/stats`
  - Configuración: `/spaceman/settings`

### 3. Roulettes (gameId: 3)
- **Descripción**: Juego de Ruletas
- **Rutas**:
  - Portal: `/roulettes/portal`
  - Juego: `/roulettes/game`
  - Estadísticas: `/roulettes/stats`
  - Configuración: `/roulettes/settings`

## Uso

### Importar una aplicación específica
```typescript
import { AviatorPortal, AVIATOR_APP } from '@/applications/aviator';
```

### Importar todas las aplicaciones
```typescript
import { APPLICATIONS, getApplication, getApplicationByGameId } from '@/applications';
```

### Usar el navegador de aplicaciones
```typescript
import AppNavigator from '@/applications/AppNavigator';

// En tu componente
<AppNavigator 
  currentApp="aviator" 
  onAppChange={(app) => console.log('App changed to:', app.name)} 
/>
```

## Agregar una Nueva Aplicación

1. Crear la carpeta de la aplicación:
   ```bash
   mkdir applications/nueva-app
   mkdir applications/nueva-app/components
   mkdir applications/nueva-app/pages
   mkdir applications/nueva-app/styles
   ```

2. Crear el archivo `index.tsx` de la aplicación:
   ```typescript
   export const NUEVA_APP = {
     name: 'NuevaApp',
     description: 'Nueva Aplicación',
     version: '1.0.0',
     gameId: 4,
     routes: {
       portal: '/nueva-app/portal',
       game: '/nueva-app/game',
       stats: '/nueva-app/stats',
       settings: '/nueva-app/settings'
     }
   };
   ```

3. Actualizar el archivo principal `applications/index.tsx`:
   ```typescript
   import { NUEVA_APP, NuevaAppPortal } from './nueva-app';
   
   export const APPLICATIONS = {
     // ... otras apps
     nuevaApp: {
       ...NUEVA_APP,
       Portal: NuevaAppPortal
     }
   };
   ```

4. Agregar el ícono en `AppNavigator.tsx`:
   ```typescript
   case 'nuevaapp':
     return <FaIcon className="text-xl" />;
   ```

## Beneficios de esta Estructura

- **Modularidad**: Cada aplicación es independiente
- **Escalabilidad**: Fácil agregar nuevas aplicaciones
- **Mantenibilidad**: Código organizado y separado
- **Reutilización**: Componentes compartidos entre aplicaciones
- **Tipado**: TypeScript para mejor desarrollo
