// Shared Components and Styles Index

// Components
export { default as Input } from './components/Input';
export { default as Login } from './components/Login';

// Paths configuration
export { PATHS } from './paths';

// Styles - Note: CSS files cannot be exported directly in TypeScript
// Import them directly in components that need them

// Shared utilities and constants
export const SHARED_CONFIG = {
  fonts: {
    primary: 'Orbitron',
    secondary: 'SF Pro Display'
  },
  colors: {
    primary: '#6366f1',
    secondary: '#1f2937',
    accent: '#f59e0b',
    background: '#000000',
    text: '#ffffff'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
};
