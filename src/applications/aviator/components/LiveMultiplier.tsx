'use client';

import { RoundData } from '@/types/portal';
import { memo } from 'react';

interface LiveMultiplierProps {
  roundData: RoundData;
}

function LiveMultiplier({ roundData }: LiveMultiplierProps) {
  return (
    <div className="flex-1 text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ borderRadius: '20px', height: '100%', background: 'transparent' }}>
    
      {/* Glow dinámico detrás del multiplicador - Solo en estado Run */}
      {roundData.game_state === 'Run' && roundData.current_multiplier > 0 && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 glow-active"
          style={{
            width: '250px',
            height: '35px',
            background: roundData.current_multiplier >= 10 ? 'rgb(192, 23, 180)' :
                       roundData.current_multiplier >= 2 ? 'rgb(145, 62, 248)' :
                       'rgb(52, 180, 255)',
            filter: 'blur(35px) brightness(1.1)',
            opacity: 0.8,
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      )}
    
      {/* Texto dinámico "¡SE FUE VOLANDO!" - Capa independiente */}
      {roundData.game_state === 'End' && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-bold z-20 flew-away-text whitespace-nowrap" style={{ top: '20%' }}>
          ¡SE FUE VOLANDO!
        </div>
      )}

      {/* Barra de progreso para estado "Bet" */}
      {roundData.game_state === 'Bet' && (
        <>
          {/* Logo de partners arriba de la barra */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" style={{ top: '30%' }}>
            <img
              src="/logos/partners-logo.svg"
              alt="Partners Logo"
              className="w-32 h-auto partners-logo-mobile"
            />
          </div>
          {/* Barra de progreso */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-gray-600 rounded-full z-20 bet-progress-container">
            <div className="h-full bg-red-500 rounded-full transition-all duration-5000 ease-linear bet-progress-bar"></div>
          </div>
          {/* Logo principal debajo de la barra */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" style={{ top: '63%' }}>
            <img
              src="/logo.png"
              alt="Aviarix Logo"
              className="w-48 h-auto aviarix-logo-mobile"
            />
          </div>
        </>
      )}

      {/* Texto del multiplicador - Capa independiente */}
      {(roundData.game_state === 'Run' || roundData.game_state === 'End') && (
        <div className="text-center relative z-20 flex items-center justify-center h-full">
          <div className={`text-5xl font-bold ${
            roundData.game_state === 'End' ? 'text-red-500' : 'text-white'
          }`}>
            {(roundData.current_multiplier > 0 ? roundData.current_multiplier.toFixed(2) : '0.00') + 'x'}
          </div>
        </div>
      )}
    </div>
  );
}

// Memoizar el componente - Re-renderizar siempre que cambie el estado o multiplicador
export default memo(LiveMultiplier, (prevProps, nextProps) => {
  return (
    prevProps.roundData.game_state === nextProps.roundData.game_state &&
    prevProps.roundData.current_multiplier === nextProps.roundData.current_multiplier
  );
});
