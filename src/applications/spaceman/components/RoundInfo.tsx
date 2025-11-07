'use client';
import { FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface PredictionInfo {
  prediction: number;
  confidence: number; // 0..1
  casino_mood: number; // 0 neutral, 1 cuidado, 2 peligroso
  score?: number;
}

interface RoundInfoProps {
  roundData?: {
    game_state: string;
    round_id?: string;
  };
  isConnected?: boolean;
  prediction?: PredictionInfo | null;
  trend?: 'alcista' | 'bajista';
}

export default function RoundInfo({ prediction, trend }: RoundInfoProps) {
  // Normalización a formato Aviator: priorizar prediction.apostar y usar casino_mood como respaldo
  const apostar: 'SI' | 'NO' | null = prediction
    ? (prediction as any).apostar ?? (prediction.casino_mood === 0 ? 'SI' : 'NO')
    : null;

  return (
    <div className={`flex-1 ${apostar === 'SI' ? 'bg-gradient-to-b from-emerald-950 via-neutral-900 to-black border border-emerald-900/60' : 'bg-gradient-to-b from-amber-950 via-neutral-900 to-black border border-amber-900/60'} text-gray-200 flex flex-col p-4 relative overflow-hidden`} style={{ borderRadius: '20px', height: '100%' }}>

      {/* Contenido de predicción (estilo Aviator) */}
      {prediction && apostar ? (
        <div className="flex-1 flex items-center justify-center pt-0">
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className={`${apostar === 'SI' ? 'text-emerald-300' : 'text-amber-300'}`}>
              {apostar === 'SI' ? (
                <FaCheckCircle size={26} />
              ) : (
                <FaExclamationTriangle size={26} />
              )}
            </div>
            <div
              className={`text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent select-none text-center
                ${apostar === 'SI'
                  ? 'bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-300'
                  : 'bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300'}`}
            >
              {apostar === 'SI' ? 'APOSTAR' : 'NO APOSTAR'}
            </div>
            <div className={`${apostar === 'SI' ? 'text-emerald-200/90' : 'text-amber-200/90'} text-[13px] md:text-sm tracking-wide`}>
              Score: <span className="font-semibold text-white">{prediction.score}</span>
            </div>
            {/* Nota: ya no mostramos texto de tendencia aquí; usamos overlay cuando es bajista */}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            Esperando predicción...
          </div>
        </div>
      )}
      {/* Overlay de seguridad cuando la tendencia es bajista */}
      {trend === 'bajista' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4" style={{ borderRadius: '20px' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-950 via-neutral-900 to-black" style={{ borderRadius: '20px' }}></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="mx-auto -mt-2 mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-black border border-rose-500 shadow-[0_0_18px_rgba(190,18,60,0.6)]">
              <FaShieldAlt className="text-rose-300" size={22} />
            </div>
            <div className="text-[11px] md:text-xs tracking-wide font-semibold text-rose-100">
              POR SU SEGURIDAD, EVITE APOSTAR
            </div>
            <div className="text-lg md:text-xl font-extrabold text-rose-200 drop-shadow">TENDENCIA BAJISTA</div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-white/5 z-10"></div>
    </div>
  );
}
