// Aviator Application Index
export { default as AviatorPortal } from './pages/portal';
export { default as AviatorGame } from './components/Game';
export { default as AviatorStats } from './components/Stats';
export { default as AviatorSettings } from './components/Settings';

// Application metadata
export const AVIATOR_APP = {
  name: 'Aviator',
  description: 'Aviator Game Application',
  version: '1.0.0',
  gameId: 1,
  routes: {
    portal: '/aviator/portal',
    game: '/aviator/game',
    stats: '/aviator/stats',
    settings: '/aviator/settings'
  }
};
