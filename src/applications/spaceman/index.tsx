// Spaceman Application Index
export { default as SpacemanPortal } from './components/SpacemanPortal';
export { default as SpacemanGame } from './components/SpacemanPortal';
export { default as SpacemanStats } from './components/SpacemanPortal';
export { default as SpacemanSettings } from './components/SpacemanPortal';

// Component exports
export { default as SmallCards } from './components/SmallCards';
export { default as PortalHeader } from './components/PortalHeader';
export { default as BetsBlock } from './components/BetsBlock';
export { default as HistoryChart } from './components/HistoryChart';
export { default as MultiplierTrend } from './components/MultiplierTrend';
export { default as RoundInfo } from './components/RoundInfo';
export { default as LiveMultiplier } from './components/LiveMultiplier';

// Hook exports
export { default as useSpacemanSocket } from '@/hooks/useSpacemanSocket';

// Application metadata
export const SPACEMAN_APP = {
  name: 'Spaceman',
  description: 'Spaceman Game Application',
  version: '1.0.0',
  gameId: 2,
  routes: {
    portal: '/spaceman/portal',
    game: '/spaceman/game',
    stats: '/spaceman/stats',
    settings: '/spaceman/settings'
  }
};
