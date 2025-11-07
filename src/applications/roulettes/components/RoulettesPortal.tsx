'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmaker } from '@/types/portal';
import { useRouletteData } from '@/hooks/useRouletteData';
import { useRoulettePrediction } from '@/hooks/useRoulettePrediction';
import { useAuth } from '@/hooks/useAuth';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoHome } from 'react-icons/io5';
import RouletteSpinner from './RouletteSpinner';
import ColumnPercentagesCard from './ColumnPercentagesCard';
import DozenPercentagesCard from './DozenPercentagesCard';
import ColorPercentagesCard from './ColorPercentagesCard';
import RangePercentagesCard from './RangePercentagesCard';
import RoulettePredictionCard from './RoulettePredictionCard';
import '../styles/portal.css';

interface RouletteRoundData {
  number: number;
  color: string;
}

interface RoulettesPortalProps {
  selectedBookmaker: Bookmaker;
}

export default function RoulettesPortal({ selectedBookmaker }: RoulettesPortalProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const {
    isConnected,
    roundData,
    historyData,
    error: rouletteError,
    rawPrediction: rawPredictionData,
    subscribeRoulette,
    unsubscribeRoulette,
    disconnect: disconnectRoulette,
  } = useRouletteData();

  // Predicción de ruleta
  const {
    predictionData,
    rawPrediction,
    subscribePrediction,
    unsubscribePrediction,
    getLatestHistory,
    requestImmediateUpdate,
    joinBookmaker,
  } = useRoulettePrediction();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  // Función para calcular estadísticas de docenas
  const calculateDozenStats = (rounds: RouletteRoundData[]) => {
    if (!rounds || rounds.length === 0) {
      return { zero: 0, first: 0, second: 0, third: 0 };
    }

    let zeroCount = 0, firstDozenCount = 0, secondDozenCount = 0, thirdDozenCount = 0;

    rounds.forEach((round) => {
      const num = round.number;
      if (num === 0) {
        zeroCount++;
      } else if (num >= 1 && num <= 12) {
        firstDozenCount++;
      } else if (num >= 13 && num <= 24) {
        secondDozenCount++;
      } else if (num >= 25 && num <= 36) {
        thirdDozenCount++;
      }
    });

    const total = rounds.length;
    return {
      zero: total > 0 ? Math.round((zeroCount / total) * 100) : 0,
      first: total > 0 ? Math.round((firstDozenCount / total) * 100) : 0,
      second: total > 0 ? Math.round((secondDozenCount / total) * 100) : 0,
      third: total > 0 ? Math.round((thirdDozenCount / total) * 100) : 0
    };
  };

  // Función para calcular estadísticas de columnas
  const calculateColumnStats = (rounds: RouletteRoundData[]) => {
    if (!rounds || rounds.length === 0) {
      return { zero: 0, first: 0, second: 0, third: 0 };
    }

    let zeroCount = 0, firstColumnCount = 0, secondColumnCount = 0, thirdColumnCount = 0;

    rounds.forEach((round) => {
      const num = round.number;
      if (num === 0) {
        zeroCount++;
      } else if (num % 3 === 1) {
        firstColumnCount++;
      } else if (num % 3 === 2) {
        secondColumnCount++;
      } else if (num % 3 === 0) {
        thirdColumnCount++;
      }
    });

    const total = rounds.length;
    return {
      zero: total > 0 ? Math.round((zeroCount / total) * 100) : 0,
      first: total > 0 ? Math.round((firstColumnCount / total) * 100) : 0,
      second: total > 0 ? Math.round((secondColumnCount / total) * 100) : 0,
      third: total > 0 ? Math.round((thirdColumnCount / total) * 100) : 0
    };
  };

  // Función para calcular estadísticas de rangos
  const calculateRangeStats = (rounds: RouletteRoundData[]) => {
    if (!rounds || rounds.length === 0) {
      return { low: 0, high: 0, zero: 0 };
    }

    let lowCount = 0, highCount = 0, zeroCount = 0;

    rounds.forEach((round) => {
      const num = round.number;
      if (num === 0) {
        zeroCount++;
      } else if (num >= 1 && num <= 18) {
        lowCount++;
      } else if (num >= 19 && num <= 36) {
        highCount++;
      }
    });

    const total = rounds.length;
    return {
      low: total > 0 ? Math.round((lowCount / total) * 100) : 0,
      high: total > 0 ? Math.round((highCount / total) * 100) : 0,
      zero: total > 0 ? Math.round((zeroCount / total) * 100) : 0
    };
  };

  // Función para calcular estadísticas de colores
  const calculateColorStats = (rounds: RouletteRoundData[]) => {
    if (!rounds || rounds.length === 0) {
      return { red: 0, black: 0, green: 0 };
    }

    let redCount = 0, blackCount = 0, greenCount = 0;

    rounds.forEach((round) => {
      const color = round.color?.toLowerCase();
      if (color === 'red') {
        redCount++;
      } else if (color === 'black') {
        blackCount++;
      } else if (color === 'green' || round.number === 0) {
        greenCount++;
      }
    });

    const total = rounds.length;
    return {
      red: total > 0 ? Math.round((redCount / total) * 100) : 0,
      black: total > 0 ? Math.round((blackCount / total) * 100) : 0,
      green: total > 0 ? Math.round((greenCount / total) * 100) : 0
    };
  };

  // Función para calcular estadísticas de la ruleta
  const calculateRouletteStats = (rounds: RouletteRoundData[]) => {
    if (!rounds || rounds.length === 0) {
      return {
        dozens: { first: 0, second: 0, third: 0 },
        columns: { first: 0, second: 0, third: 0 },
        lastSpins: { 
          firstDozen: '-', 
          secondDozen: '-', 
          thirdDozen: '-',
          firstColumn: '-', 
          secondColumn: '-', 
          thirdColumn: '-'
        }
      };
    }

    let firstDozen = 0, secondDozen = 0, thirdDozen = 0;
    let firstColumn = 0, secondColumn = 0, thirdColumn = 0;
    
    // Variables para rastrear la última aparición de cada docena y columna
    let lastFirstDozen = '-', lastSecondDozen = '-', lastThirdDozen = '-';
    let lastFirstColumn = '-', lastSecondColumn = '-', lastThirdColumn = '-';

    // Recorrer las rondas desde la más reciente (índice 0) hasta la más antigua
    rounds.forEach((round, index) => {
      const num = round.number;
      
      // Calcular docenas (1-12, 13-24, 25-36)
      if (num >= 1 && num <= 12) {
        firstDozen++;
        // Solo actualizar si no hemos encontrado una aparición más reciente
        if (lastFirstDozen === '-') {
          lastFirstDozen = index === 0 ? 'AHORA' : `${index}`;
        }
      } else if (num >= 13 && num <= 24) {
        secondDozen++;
        if (lastSecondDozen === '-') {
          lastSecondDozen = index === 0 ? 'AHORA' : `${index}`;
        }
      } else if (num >= 25 && num <= 36) {
        thirdDozen++;
        if (lastThirdDozen === '-') {
          lastThirdDozen = index === 0 ? 'AHORA' : `${index}`;
        }
      }

      // Calcular columnas (1,4,7,10,13,16,19,22,25,28,31,34)
      if (num !== 0) { // Solo procesar columnas si no es 0
        if (num % 3 === 1) {
          firstColumn++;
          if (lastFirstColumn === '-') {
            lastFirstColumn = index === 0 ? 'AHORA' : `${index}`;
          }
        } else if (num % 3 === 2) {
          secondColumn++;
          if (lastSecondColumn === '-') {
            lastSecondColumn = index === 0 ? 'AHORA' : `${index}`;
          }
        } else if (num % 3 === 0) {
          thirdColumn++;
          if (lastThirdColumn === '-') {
            lastThirdColumn = index === 0 ? 'AHORA' : `${index}`;
          }
        }
      }
    });

    const total = rounds.length;

    return {
      dozens: {
        first: firstDozen,
        second: secondDozen,
        third: thirdDozen,
        firstPct: total > 0 ? Math.round((firstDozen / total) * 100) : 0,
        secondPct: total > 0 ? Math.round((secondDozen / total) * 100) : 0,
        thirdPct: total > 0 ? Math.round((thirdDozen / total) * 100) : 0
      },
      columns: {
        first: firstColumn,
        second: secondColumn,
        third: thirdColumn,
        firstPct: total > 0 ? Math.round((firstColumn / total) * 100) : 0,
        secondPct: total > 0 ? Math.round((secondColumn / total) * 100) : 0,
        thirdPct: total > 0 ? Math.round((thirdColumn / total) * 100) : 0
      },
      lastSpins: {
        firstDozen: lastFirstDozen,
        secondDozen: lastSecondDozen,
        thirdDozen: lastThirdDozen,
        firstColumn: lastFirstColumn,
        secondColumn: lastSecondColumn,
        thirdColumn: lastThirdColumn
      }
    };
  };

  // Calcular estadísticas con los datos del historial
  const stats = calculateRouletteStats(historyData || []);
  const colorStats = calculateColorStats(historyData || []);
  const rangeStats = calculateRangeStats(historyData || []);
  const dozenStats = calculateDozenStats(historyData || []);
  const columnStats = calculateColumnStats(historyData || []);

  // Debug: Log cuando cambia historyData
  useEffect(() => {
    console.log('RoulettesPortal: historyData actualizado:', historyData);
    console.log('RoulettesPortal: Número de rondas en historial:', historyData?.length || 0);
    if (historyData && historyData.length > 0) {
      console.log('RoulettesPortal: Primera ronda del historial:', historyData[0]);
      console.log('RoulettesPortal: Última ronda del historial:', historyData[historyData.length - 1]);
    }
  }, [historyData]);

  // Debug: Log cuando cambia roundData
  useEffect(() => {
    console.log('RoulettesPortal: roundData actualizado:', roundData);
  }, [roundData]);

  // Forzar re-render cuando cambian los datos para actualización en tiempo real
  useEffect(() => {
    if (roundData) {
      console.log('RoulettesPortal: Nueva ronda detectada, actualizando estadísticas...');
    }
  }, [roundData, historyData]);

  useEffect(() => {
    if (selectedBookmaker?.id) {
      console.log(`RoulettesPortal: Suscribiendo a bookmaker ${selectedBookmaker.id}`);
      subscribeRoulette(selectedBookmaker.id);
      // Unirse también al canal de predicciones para ese bookmaker
      joinBookmaker(selectedBookmaker.id);
      
      return () => {
        console.log(`RoulettesPortal: Desuscribiendo de bookmaker ${selectedBookmaker.id}`);
        unsubscribeRoulette(selectedBookmaker.id);
      };
    }
  }, [selectedBookmaker?.id]); // Removidas las dependencias que causan re-renders

  // Cargar historial más reciente del canal de predicciones
  useEffect(() => {
    if (selectedBookmaker?.id) {
      getLatestHistory(selectedBookmaker.id);
    }
  }, [selectedBookmaker?.id, getLatestHistory]);

  useEffect(() => {
    if (selectedBookmaker?.id && roundData?.number) {
      subscribePrediction(selectedBookmaker.id, roundData.number);
    }

    return () => {
      if (selectedBookmaker?.id && roundData?.number) {
        unsubscribePrediction(selectedBookmaker.id, roundData.number);
      }
    };
  }, [selectedBookmaker?.id, roundData?.number, subscribePrediction, unsubscribePrediction]);

  // Obtener el número más reciente del historial o usar datos por defecto
  const getCurrentRoundData = () => {
    // Si hay datos de ronda actual, usarlos
    if (roundData) {
      return roundData;
    }
    
    // Si hay historial, usar el número más reciente
    if (historyData && historyData.length > 0) {
      return historyData[0]; // El primer elemento es el más reciente
    }
    
    // Si no hay nada, devolver undefined para respetar tipos opcionales
    return undefined;
  };

  const currentRoundData = getCurrentRoundData();

  // Forzar re-cálculo cuando cambie el historial para actualizar el spinner
  useEffect(() => {
    if (historyData && historyData.length > 0) {
      console.log('RoulettesPortal: Historial actualizado, spinner mostrará:', historyData[0]);
      console.log('RoulettesPortal: Estadísticas de colores:', colorStats);
      console.log('RoulettesPortal: Estadísticas de rangos:', rangeStats);
      console.log('RoulettesPortal: Estadísticas de docenas:', dozenStats);
      console.log('RoulettesPortal: Estadísticas de columnas:', columnStats);
    }
  }, [historyData, colorStats, rangeStats, dozenStats, columnStats]);

  return (
    <div className="h-screen grid grid-cols-12 gap-1 p-1 overflow-hidden roulettes-container relative bg-[radial-gradient(900px_600px_at_20%_0%,rgba(0,212,167,0.06),transparent_60%),radial-gradient(1200px_800px_at_100%_100%,rgba(242,193,78,0.05),transparent_65%),linear-gradient(to_bottom,#0B0F12,#0B0F12)] modern-scroll" style={{ gap: '4px', padding: '4px', gridTemplateRows: '50px 35px 1fr 1fr' }}>
      {/* Overlay radial adicional */}
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_70%)] pointer-events-none"></div>
      
      {/* Header - Fila 1 completa */}
      <div className="col-span-12 bg-transparent border border-[#1F2A33] rounded-[20px] flex items-center justify-between px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white font-orbitron">
            {selectedBookmaker.bookmaker}
          </h1>
        </div>
        
        {/* Burger Menu */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1 transition-all duration-300 cursor-pointer"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg transition-all duration-300 z-50 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`} style={{ boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.08)' }}>
            <div className="py-2">
              <button
                onClick={handleGoHome}
                className="flex items-center w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-900 transition-colors duration-200 cursor-pointer font-orbitron-medium"
              >
                <IoHome className="mr-3 text-lg" />
                Inicio
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-900 transition-colors duration-200 cursor-pointer font-orbitron-medium"
              >
                <BiLogOutCircle className="mr-3 text-lg" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila completa - Fila 2 - Historial de números */}
      <div className="col-span-12 bg-transparent py-1 relative mx-auto" style={{ maxWidth: '90%' }}>
        <div className="w-full h-full">
          <div className="flex gap-2 items-center overflow-hidden modern-scroll-horizontal">
            {historyData && historyData.length > 0 ? (
              historyData.map((round, index) => {
                console.log(`Renderizando ronda ${index}:`, round);
                return (
                  <div
                    key={index}
                    className={`relative flex-shrink-0 group cursor-pointer transition-all duration-300 hover:scale-110 ${
                      round.color === 'Red' 
                        ? 'bg-gradient-to-br from-red-500 to-red-700' 
                        : round.color === 'Black' 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-900' 
                        : 'bg-gradient-to-br from-green-500 to-green-700'
                    }`}
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Efecto de brillo interno */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Número */}
                    <span className="text-white font-bold text-sm relative z-10 drop-shadow-sm">
                      {round.number}
                    </span>
                    
                    {/* Borde brillante en hover */}
                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      round.color === 'Red' 
                        ? 'border border-red-300/50' 
                        : round.color === 'Black' 
                        ? 'border border-gray-300/50' 
                        : 'border border-green-300/50'
                    }`}></div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-gray-400 text-sm font-medium">
                  Sin datos de historial
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primera fila completa dividida en 4 partes */}
      <div className="col-span-6 bg-transparent border border-[#1F2A33] rounded-[20px] p-4 overflow-y-auto">
        <div className="w-full h-full">
          {/* Header de la tabla */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="text-center">
              <h4 className="text-xs font-bold text-white font-sans">BET</h4>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold text-white font-sans">TOTAL</h4>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold text-white font-sans">PCT</h4>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold text-white font-sans">LAST SPIN</h4>
            </div>
          </div>
          
          {/* Filas de datos */}
          <div className="space-y-1">
            {/* 1st DOZEN */}
            <div className="grid grid-cols-4 gap-2 items-center border-b border-gray-600 pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">1st DOZEN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.first}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.firstPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.firstDozen === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.firstDozen !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.firstDozen}
                </span>
              </div>
            </div>
            
            {/* 2nd DOZEN */}
            <div className="grid grid-cols-4 gap-2 items-center border-b border-gray-600 pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">2nd DOZEN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.second}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.secondPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.secondDozen === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.secondDozen !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.secondDozen}
                </span>
              </div>
            </div>
            
            {/* 3rd DOZEN */}
            <div className="grid grid-cols-4 gap-2 items-center border-b border-gray-600 pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">3rd DOZEN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.third}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.dozens.thirdPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.thirdDozen === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.thirdDozen !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.thirdDozen}
                </span>
              </div>
            </div>
            
            {/* 1st COLUMN */}
            <div className="grid grid-cols-4 gap-2 items-center border-b border-gray-600 pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">1st COLUMN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.first}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.firstPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.firstColumn === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.firstColumn !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.firstColumn}
                </span>
              </div>
            </div>
            
            {/* 2nd COLUMN */}
            <div className="grid grid-cols-4 gap-2 items-center border-b border-gray-600 pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">2nd COLUMN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.second}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.secondPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.secondColumn === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.secondColumn !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.secondColumn}
                </span>
              </div>
            </div>
            
            {/* 3rd COLUMN */}
            <div className="grid grid-cols-4 gap-2 items-center pb-1">
              <div className="text-center">
                <span className="text-xs text-gray-300 font-sans">3rd COLUMN</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.third}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white font-sans">{stats.columns.thirdPct}%</span>
              </div>
              <div className="text-center">
                <span className={`text-xs font-sans ${
                  stats.lastSpins.thirdColumn === 'AHORA' 
                    ? 'text-green-400 font-bold' 
                    : stats.lastSpins.thirdColumn !== '-' 
                    ? 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {stats.lastSpins.thirdColumn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] p-2 flex">
        <ColorPercentagesCard 
          stats={colorStats}
          roundData={currentRoundData}
        />
      </div>
      
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] p-2 flex">
        <RangePercentagesCard 
          stats={rangeStats}
          roundData={currentRoundData}
        />
      </div>

      {/* Segunda fila completa dividida en 4 partes */}
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] flex items-center justify-center p-0">
        <RouletteSpinner roundData={currentRoundData} />
      </div>
      
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] flex items-center justify-center p-2">
        <RoulettePredictionCard predictionData={predictionData} rawPrediction={rawPrediction || rawPredictionData} />
      </div>
      
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] p-2 flex">
        <DozenPercentagesCard 
          stats={dozenStats}
          roundData={currentRoundData}
        />
      </div>
      
      <div className="col-span-3 bg-transparent border border-[#1F2A33] rounded-[20px] p-2 flex">
        <ColumnPercentagesCard 
          stats={columnStats}
          roundData={currentRoundData}
        />
      </div>
    </div>
  );
}
