'use client';

import { LiaUsersSolid } from 'react-icons/lia';
import { MdDoNotDisturbOnTotalSilence } from 'react-icons/md';
import { HiOutlineCreditCard } from 'react-icons/hi';

interface SpacemanRoundData {
  online_players: number;
  bets_count: number;
  total_bet_amount: number;
  total_cashout: number;
  current_multiplier: number;
  max_multiplier: number;
  game_state: 'Bet' | 'Run' | 'End';
  round_id?: string;
  casino_profit?: number;
  service_status: 'connected' | 'disconnected' | 'error';
  last_update: string;
}

interface SmallCardsProps {
  roundData: SpacemanRoundData;
}

export default function SmallCards({ roundData }: SmallCardsProps) {
  return (
    <div
      className="col-span-12 row-span-2 md:row-span-1 grid small-cards overflow-visible"
      style={{ gap: '4px' }}
    >
      {/* Card 1 - Jugadores */}
      <div className="bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] text-gray-200 relative small-card p-2" style={{ borderRadius: '20px' }}>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-400 card-icon">
          <LiaUsersSolid size={22} />
        </div>
        <div className="flex flex-col h-full justify-end items-end">
          <div className="text-green-400 font-bold text-xs card-value">
            {roundData.online_players.toLocaleString()}
          </div>
          <div className="text-gray-300 text-xs font-medium card-title">
            JUGADORES
          </div>
        </div>
      </div>

      {/* Card 2 - Apuestas */}
      <div className="bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] text-gray-200 relative small-card p-2" style={{ borderRadius: '20px' }}>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 card-icon">
          <MdDoNotDisturbOnTotalSilence size={22} />
        </div>
        <div className="flex flex-col h-full justify-end items-end">
          <div className="text-blue-400 font-bold text-xs card-value">
            {roundData.bets_count.toLocaleString()}
          </div>
          <div className="text-gray-300 text-xs font-medium card-title">
            APUESTAS
          </div>
        </div>
      </div>

      {/* Card 3 - Total Apostado */}
      <div className="bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] text-gray-200 relative small-card p-2" style={{ borderRadius: '20px' }}>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-400 card-icon">
          <HiOutlineCreditCard size={22} />
        </div>
        <div className="flex flex-col h-full justify-end items-end">
          <div className="text-yellow-400 font-bold text-xs card-value">
            ${roundData.total_bet_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-gray-300 text-xs font-medium card-title">
            TOTAL APOSTADO
          </div>
        </div>
      </div>

      {/* Card 4 - Total Retirado */}
      <div className="bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] text-gray-200 relative small-card p-2" style={{ borderRadius: '20px' }}>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-400 card-icon">
          <HiOutlineCreditCard size={22} />
        </div>
        <div className="flex flex-col h-full justify-end items-end">
          <div className="text-red-400 font-bold text-xs card-value">
            ${roundData.total_cashout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-gray-300 text-xs font-medium card-title">
            TOTAL RETIRADO
          </div>
        </div>
      </div>

      {/* Quinta card eliminada: MÁXIMO */}
    </div>
  );
}
