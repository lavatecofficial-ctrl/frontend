// Shared Paths Configuration
// This file centralizes all import paths to avoid hardcoded strings

export const PATHS = {
  // Shared Components
  components: {
    input: '@/shared/components/Input',
    login: '@/shared/components/Login'
  },
  
  // Shared Styles
  styles: {
    fonts: '@/shared/styles/fonts.css',
    globals: '@/shared/styles/globals.css',
    googleButton: '@/shared/styles/googleButton.css',
    loginAnimations: '@/shared/styles/loginAnimations.css'
  },
  
  // Application Styles
  applications: {
    aviator: {
      portal: '@/applications/aviator/styles/portal.css',
      dashboard: '@/applications/aviator/styles/dashboard.css'
    },
    spaceman: {
      portal: '@/applications/spaceman/styles/portal.css',
      dashboard: '@/applications/spaceman/styles/dashboard.css'
    },
    roulettes: {
      portal: '@/applications/roulettes/styles/portal.css',
      dashboard: '@/applications/roulettes/styles/dashboard.css'
    }
  },
  
  // Application Components
  apps: {
    aviator: '@/applications/aviator',
    spaceman: '@/applications/spaceman',
    roulettes: '@/applications/roulettes'
  },
  
  // Configuration
  config: '@/config',
  
  // Hooks
  hooks: '@/hooks',
  
  // Services
  services: '@/services'
};

export default PATHS;
