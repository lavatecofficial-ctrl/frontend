// Roulettes Application Index
export { default as RoulettesPortal } from './pages/portal';
export { default as RoulettesGame } from './components/Game';
export { default as RoulettesStats } from './components/Stats';
export { default as RoulettesSettings } from './components/Settings';

// Application metadata
export const ROULETTES_APP = {
  name: 'Roulettes',
  description: 'Roulettes Game Application',
  version: '1.0.0',
  gameId: 3,
  routes: {
    portal: '/roulettes/portal',
    game: '/roulettes/game',
    stats: '/roulettes/stats',
    settings: '/roulettes/settings'
  }
};
