// Main Applications Index
import { AVIATOR_APP, AviatorPortal } from './aviator';
import { SPACEMAN_APP, SpacemanPortal } from './spaceman';
import { ROULETTES_APP, RoulettesPortal } from './roulettes';

// Import shared components
import { Input, Login, SHARED_CONFIG } from '../shared';

// Export all applications
export {
  AVIATOR_APP,
  AviatorPortal,
  SPACEMAN_APP,
  SpacemanPortal,
  ROULETTES_APP,
  RoulettesPortal
};

// Applications registry
export const APPLICATIONS = {
  aviator: {
    ...AVIATOR_APP,
    Portal: AviatorPortal
  },
  spaceman: {
    ...SPACEMAN_APP,
    Portal: SpacemanPortal
  },
  roulettes: {
    ...ROULETTES_APP,
    Portal: RoulettesPortal
  }
};

// Application types
export type ApplicationName = keyof typeof APPLICATIONS;
export type Application = typeof APPLICATIONS[ApplicationName];

// Helper functions
export const getApplication = (name: ApplicationName): Application => {
  return APPLICATIONS[name];
};

export const getApplicationByGameId = (gameId: number): Application | null => {
  return Object.values(APPLICATIONS).find(app => app.gameId === gameId) || null;
};

export const getAllApplications = (): Application[] => {
  return Object.values(APPLICATIONS);
};

// Export shared components and config
export { Input, Login, SHARED_CONFIG };
