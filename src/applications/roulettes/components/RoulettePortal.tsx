'use client';

import { RoundData, Bookmaker } from '@/types/portal';

interface RoulettePortalProps {
  selectedBookmaker: Bookmaker;
  roundData: RoundData;
}

export default function RoulettePortal({ selectedBookmaker, roundData }: RoulettePortalProps) {
  return (
    <div className="h-screen bg-black grid grid-cols-8 grid-rows-8 gap-2 p-2 overflow-hidden roulette-container">
      {/* Header - Fila 1 completa */}
      <div className="col-span-8 row-span-1 bg-transparent border border-gray-700 flex items-center px-6" style={{ borderRadius: '20px' }}>
        <img
          src={selectedBookmaker.bookmakerImg}
          alt={`${selectedBookmaker.bookmaker} Logo`}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Estadísticas - Fila 2 */}
      <div className="col-span-8 row-span-1 flex gap-2">
        <div className="flex-1 bg-transparent border border-gray-700 flex items-center justify-center" style={{ borderRadius: '20px' }}>
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">{roundData.online_players.toLocaleString()}</div>
            <div className="text-gray-300 text-xs">JUGADORES</div>
          </div>
        </div>
        <div className="flex-1 bg-transparent border border-gray-700 flex items-center justify-center" style={{ borderRadius: '20px' }}>
          <div className="text-center">
            <div className="text-blue-400 font-bold text-lg">{roundData.bets_count.toLocaleString()}</div>
            <div className="text-gray-300 text-xs">APUESTAS</div>
          </div>
        </div>
        <div className="flex-1 bg-transparent border border-gray-700 flex items-center justify-center" style={{ borderRadius: '20px' }}>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-lg">${roundData.total_bet_amount.toLocaleString()}</div>
            <div className="text-gray-300 text-xs">TOTAL APOSTADO</div>
          </div>
        </div>
      </div>

      {/* Ruleta Principal - Filas 3-6 */}
      <div className="col-span-5 row-span-4 bg-transparent border border-gray-700 flex items-center justify-center" style={{ borderRadius: '20px' }}>
        <div className="text-center">
          <div className="text-white text-4xl font-bold mb-2">🎰</div>
          <div className="text-white text-xl">Ruleta en Vivo</div>
          <div className="text-green-400 text-lg mt-2">{roundData.game_state}</div>
        </div>
      </div>

      {/* Panel de Control - Filas 3-6 */}
      <div className="col-span-3 row-span-4 bg-transparent border border-gray-700 p-4" style={{ borderRadius: '20px' }}>
        <h3 className="text-white text-lg mb-4">Control de Ruleta</h3>
        <div className="space-y-3">
          <div>
            <div className="text-white text-sm">ID de Ronda</div>
            <div className="text-blue-400 font-bold text-sm">{roundData.round_id || 'N/A'}</div>
          </div>
          <div>
            <div className="text-white text-sm">Estado</div>
            <div className="text-green-400 font-bold">{roundData.game_state}</div>
          </div>
          <div>
            <div className="text-white text-sm">Último Número</div>
            <div className="text-purple-400 font-bold text-2xl">32</div>
          </div>
        </div>
      </div>

      {/* Historial - Filas 7-8 */}
      <div className="col-span-8 row-span-2 bg-transparent border border-gray-700 p-4" style={{ borderRadius: '20px' }}>
        <h3 className="text-white text-lg mb-2">Historial de Números</h3>
        <div className="flex gap-2 overflow-x-auto">
          {[32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0].map((number, index) => (
            <div 
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                number === 0 ? 'bg-green-600 text-white' :
                number % 2 === 0 ? 'bg-red-600 text-white' : 'bg-black text-white border border-white'
              }`}
            >
              {number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
