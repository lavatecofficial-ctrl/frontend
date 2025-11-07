export interface RouletteRoundData {
  online_players: number;
  bets_count: number;
  total_bet_amount: number;
  total_cashout: number;
  casino_profit?: number;
  round_id?: string;
  game_state: string;
  current_number?: number;
  last_numbers: number[];
}

export interface RouletteBookmaker {
  id: number;
  bookmaker: string;
  bookmakerImg: string;
  gameId: number;
}
