// Main Configuration File

export const APP_CONFIG = {
  name: 'INTELLI SOFTWARE',
  version: '2.0.0',
  description: 'Multi-Game Platform',
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://grupoaviatorcolombia.app',
    timeout: 10000,
    retries: 3
  },
  
  // Authentication
  auth: {
    tokenKey: 'aviarix_token',
    refreshTokenKey: 'aviarix_refresh_token',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Games Configuration
  games: {
    aviator: {
      id: 1,
      name: 'Aviator',
      description: 'Aviator Game',
      minBet: 1,
      maxBet: 1000
    },
    spaceman: {
      id: 2,
      name: 'Spaceman',
      description: 'Spaceman Game',
      minBet: 1,
      maxBet: 1000
    },
    roulettes: {
      id: 3,
      name: 'Roulettes',
      description: 'Roulettes Game',
      minBet: 1,
      maxBet: 1000
    }
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#6366f1',
      secondary: '#1f2937',
      accent: '#f59e0b',
      background: '#000000',
      text: '#ffffff',
      border: '#374151'
    },
    fonts: {
      primary: 'Orbitron',
      secondary: 'SF Pro Display'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px'
    }
  },
  
  // Features
  features: {
    websockets: true,
    realTimeUpdates: true,
    analytics: true,
    notifications: true
  }
};

export default APP_CONFIG;
