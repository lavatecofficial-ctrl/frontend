'use client';

import { useState, useEffect } from 'react';

interface HistoryItem {
  id: number;
  roundId: string;
  maxMultiplier: number;
  totalBetAmount: number;
  totalCashout: number;
  casinoProfit: number;
  betsCount: number;
  onlinePlayers: number;
  createdAt: Date;
}

interface HistoryChartProps {
  history: HistoryItem[];
}

export default function HistoryChart({ history }: HistoryChartProps) {
  const [displayHistory, setDisplayHistory] = useState<HistoryItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // El historial viene en orden ASC (más antiguo primero)
    // Tomar las últimas 20 e invertir para mostrar la más reciente primero (izquierda), más antigua al final (derecha)
    const latest20 = history.slice(-20).reverse();
    console.log('📊 HistoryChart actualizado:', latest20.length, 'rondas');
    console.log('🔍 Primera ronda del historial (más reciente):', latest20[0]?.roundId, latest20[0]?.maxMultiplier);
    setDisplayHistory(latest20);
  }, [history]);

  const getMultiplierColor = (multiplier: number): string => {
    if (multiplier >= 1.00 && multiplier <= 1.99) {
      return 'rgb(52, 180, 255)'; // Azul cyan
    } else if (multiplier >= 2.00 && multiplier <= 9.99) {
      return 'rgb(145, 62, 248)'; // Púrpura
    } else if (multiplier >= 10.00) {
      return 'rgb(192, 23, 180)'; // Magenta
    }
    return 'rgb(52, 180, 255)'; // Color por defecto
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (history.length === 0) {
    return (
      <div className="stats">
        <div className="loading">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className={`stats dropdown ${isDropdownOpen ? 'show' : ''} modern-scroll`}>
      <div className="multipliers-text-grid">
        {displayHistory
          .filter(item => item.maxMultiplier !== undefined && item.maxMultiplier !== null)
          .map((item) => (
            <span 
              key={item.id} 
              className="multiplier-text"
              style={{ color: getMultiplierColor(item.maxMultiplier) }}
              title={`Ronda ${item.roundId}: ${item.maxMultiplier.toFixed(2)}x`}
            >
              {item.maxMultiplier.toFixed(2)}x
            </span>
          ))}
      </div>
      <div className="button-block">
        <div 
          className="dropdown-toggle button" 
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          <div className="button-icon"></div>
        </div>
      </div>
      
      {/* Dropdown con historial de rondas */}
      {isDropdownOpen && (
        <div className="dropdown-menu show modern-scroll-chat">
          <div className="wrapper">
            <div className="wrapper-header">
              <div className="text">Round History</div>
            </div>
            <div className="payouts-block">
              {displayHistory
                .filter(item => item.maxMultiplier !== undefined && item.maxMultiplier !== null)
                .map((item, index) => (
                  <div 
                    key={item.id} 
                    className="payout"
                    style={{ color: getMultiplierColor(item.maxMultiplier) }}
                  >
                    {item.maxMultiplier.toFixed(2)}x
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
