'use client';

import { useState } from 'react';
import { Bookmaker } from '@/types/portal';
import SmallCards from './SmallCards';
import LiveMultiplier from './LiveMultiplier';
import RoundInfo from './RoundInfo';
import PortalHeader from './PortalHeader';
import HistoryChart from './HistoryChart';
import MultiplierTrend from './MultiplierTrend';
import BetsBlock from './BetsBlock';
import useSpacemanSocket from '@/hooks/useSpacemanSocket';
import '../styles/portal.css';

interface SpacemanPortalProps {
  selectedBookmaker: Bookmaker;
}

export default function SpacemanPortal({ selectedBookmaker }: SpacemanPortalProps) {
  // Usar el hook de Spaceman para datos en tiempo real
  const { 
    roundData, 
    history, 
    serviceStatus, 
    isConnected, 
    notification, 
    clearNotification,
    prediction
  } = useSpacemanSocket(selectedBookmaker.id);

  const [isAboveEma, setIsAboveEma] = useState(false);
  
  // Estados para controlar la visibilidad de elementos del gráfico
  const [showEma, setShowEma] = useState(true);
  const [showBollingerBands, setShowBollingerBands] = useState(true);
  const [showSupportResistance, setShowSupportResistance] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Transformar el historial para el formato que espera MultiplierTrend
  const transformedHistory = history.map(item => {
    const createdAt = typeof item.createdAt === 'string' ? item.createdAt : item.createdAt.toISOString();
    return {
      max_multiplier: parseFloat(item.maxMultiplier as any) || 0,
      created_at: createdAt,
      round_id: item.roundId || `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  });

  // Log para depuración
  console.log('📊 Historial transformado para MultiplierTrend:', {
    originalLength: history.length,
    transformedLength: transformedHistory.length,
    firstItem: transformedHistory[0],
    lastItem: transformedHistory[transformedHistory.length - 1]
  });

  return (
    <div className="spaceman-portal h-screen md:h-screen grid grid-cols-12 gap-1 p-1 overflow-hidden portal-container portal-enter relative bg-gradient-to-b from-[#0B0B0B] via-[#1A0B1A] to-[#2A0B2A] modern-scroll" style={{ gap: '4px', padding: '4px', gridTemplateRows: '50px 50px 32px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr' }}>
      {/* Overlay radial adicional */}
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
      
      {/* Prediction Banner eliminado: la predicción ahora vive en RoundInfo */}
      
      {/* Header - Fila 1 completa */}
      <PortalHeader selectedBookmaker={selectedBookmaker} />

      {/* 4 Small Cards - Fila 2 */}
      <SmallCards roundData={roundData} />

      {/* Columna izquierda 30% - Filas 3-12 */}
      <div className="bets-block col-span-12 md:col-span-4 row-span-10 text-gray-200 order-3 md:order-none modern-scroll-sidebar" style={{ borderRadius: '20px' }}>
        <BetsBlock 
          history={history}
          serviceStatus={serviceStatus}
          isConnected={isConnected}
          showEma={showEma}
          setShowEma={setShowEma}
          showBollingerBands={showBollingerBands}
          setShowBollingerBands={setShowBollingerBands}
          showSupportResistance={showSupportResistance}
          setShowSupportResistance={setShowSupportResistance}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
        />
      </div>

      {/* Columna Derecha 70% - Game Play completo */}
      <div className="game-play col-span-12 md:col-span-8 row-span-10 text-gray-200 order-2 md:order-none flex flex-col modern-scroll" style={{ gap: '4px' }}>
        {/* HistoryChart */}
        <div className="flex-shrink-0">
          <HistoryChart history={history} />
        </div>

        {/* MultiplierTrend - ocupa el espacio restante */}
        <div className="flex-grow overflow-hidden" style={{ minHeight: '0' }}>
          <MultiplierTrend
            rounds={transformedHistory}
            isLoadingRounds={history.length === 0}
            onEmaStatusChange={setIsAboveEma}
            showEma={showEma}
            showBollingerBands={showBollingerBands}
            showSupportResistance={showSupportResistance}
            showGrid={showGrid}
          />
        </div>

        {/* RoundInfo y LiveMultiplier - altura fija */}
        <div className="cards-container flex items-stretch" style={{ minHeight: '0', gap: '4px', flexShrink: 0 }}>
          <RoundInfo roundData={roundData} isConnected={isConnected} prediction={prediction} trend={isAboveEma ? 'alcista' : 'bajista'} />
          <LiveMultiplier 
            roundData={roundData}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Notificaciones */}
      {notification?.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification?.type === 'success' 
            ? 'bg-green-600 text-white' 
            : notification?.type === 'error' 
            ? 'bg-red-600 text-white' 
            : 'bg-blue-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{notification.message}</span>
            <button 
              onClick={clearNotification}
              className="text-white hover:text-gray-200 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
