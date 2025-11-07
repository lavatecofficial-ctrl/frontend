export interface AviatorRoundData {
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

export interface AviatorBookmaker {
  id: number;
  bookmaker: string;
  bookmakerImg: string;
  gameId: number;
}
