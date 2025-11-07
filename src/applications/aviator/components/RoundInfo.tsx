'use client';
import { FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

import { RoundData, Prediction } from '@/types/portal';

interface RoundInfoProps {
  roundData: RoundData;
  prediction?: Prediction | null;
  trend?: 'alcista' | 'bajista';
}

export default function RoundInfo({ roundData, prediction, trend }: RoundInfoProps) {
  return (
    <div className={`flex-1 ${prediction?.apostar === 'SI' ? 'bg-gradient-to-br from-emerald-950/40 via-neutral-900/60 to-black border-2 border-emerald-500/30' : 'bg-gradient-to-br from-amber-950/40 via-neutral-900/60 to-black border-2 border-amber-500/30'} text-gray-200 flex flex-col p-5 relative overflow-hidden backdrop-blur-sm`} style={{ borderRadius: '20px', height: '100%', boxShadow: prediction?.apostar === 'SI' ? '0 8px 32px rgba(16, 185, 129, 0.15)' : '0 8px 32px rgba(245, 158, 11, 0.15)' }}>

      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-20 ${prediction?.apostar === 'SI' ? 'bg-gradient-to-br from-emerald-500/20 to-transparent' : 'bg-gradient-to-br from-amber-500/20 to-transparent'}`} style={{ filter: 'blur(40px)' }}></div>

      {/* Contenido de predicción */}
      {prediction ? (
        <div className="flex-1 flex items-center justify-center pt-0 relative z-10">
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {/* Icono con animación y efecto */}
            <div className={`relative ${prediction.apostar === 'SI' ? 'text-emerald-400' : 'text-amber-400'}`}>
              <div className={`absolute inset-0 ${prediction.apostar === 'SI' ? 'bg-emerald-400' : 'bg-amber-400'} rounded-full blur-xl opacity-40 animate-pulse`}></div>
              {prediction.apostar === 'SI' ? (
                <FaCheckCircle size={32} className="relative drop-shadow-lg" />
              ) : (
                <FaExclamationTriangle size={32} className="relative drop-shadow-lg" />
              )}
            </div>

            {/* Texto de decisión con mejor estilo */}
            <div
              className={`
                text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent select-none text-center
                ${prediction.apostar === 'SI'
                  ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400'}`}
              style={{ 
                textShadow: prediction.apostar === 'SI' 
                  ? '0 0 30px rgba(16, 185, 129, 0.3)' 
                  : '0 0 30px rgba(245, 158, 11, 0.3)',
                letterSpacing: '0.02em'
              }}
            >
              {prediction.apostar === 'SI' ? 'APOSTAR' : 'NO APOSTAR'}
            </div>

            {/* Score con badge mejorado */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${prediction.apostar === 'SI' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
              <FaChartLine className={`${prediction.apostar === 'SI' ? 'text-emerald-400' : 'text-amber-400'}`} size={14} />
              <span className={`text-sm font-medium ${prediction.apostar === 'SI' ? 'text-emerald-300' : 'text-amber-300'}`}>
                Score: <span className="font-bold text-white">{prediction.score}</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">Esperando predicción...</span>
            </div>
          </div>
        </div>
      )}
      {/* Overlay de seguridad cuando la tendencia es bajista */}
      {trend === 'bajista' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4" style={{ borderRadius: '20px' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-950 to-black border-2 border-rose-500/50" style={{ borderRadius: '20px', boxShadow: '0 8px 32px rgba(190, 18, 60, 0.4)' }}></div>
          
          {/* Glow effect sutil */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-rose-500/20 blur-3xl"></div>
          
          {/* Contenido compacto horizontal */}
          <div className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 border border-rose-500/40 backdrop-blur-sm">
            {/* Icono compacto */}
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/50">
              <FaShieldAlt className="text-rose-400" size={18} />
            </div>
            
            {/* Textos compactos */}
            <div className="flex flex-col gap-0.5 text-left">
              <div className="text-[11px] font-semibold text-rose-300/80 uppercase tracking-wide">
                Evite apostar
              </div>
              <div className="text-base font-black text-rose-400 tracking-tight">
                TENDENCIA BAJISTA
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-white/5 z-10"></div>
    </div>
  );
}
