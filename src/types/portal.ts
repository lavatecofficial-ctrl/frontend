export interface RoundData {
  online_players: number;
  bets_count: number;
  total_bet_amount: number;
  total_cashout: number;
  casino_profit?: number;
  round_id?: string;
  game_state: string;
  current_multiplier: number;
  max_multiplier: number;
}

export interface Bookmaker {
  id: number;
  bookmaker: string;
  bookmakerImg: string;
  gameId: number;
}

// Predicción enviada por el backend vía WebSocket para Aviator
export interface Prediction {
  prediction: number; // multiplicador predicho
  score: number;      // confianza o score del modelo
  apostar: 'SI' | 'NO';
  round_id: string;
}
