'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Round {
  max_multiplier: number | string;
  created_at: string;
  round_id?: string;
}

interface MultiplierTrendProps {
  rounds: Round[];
  isLoadingRounds: boolean;
  onEmaStatusChange: (status: boolean) => void;
  showEma?: boolean;
  showBollingerBands?: boolean;
  showSupportResistance?: boolean;
  showGrid?: boolean;
}

const MultiplierTrend = ({ 
  rounds, 
  isLoadingRounds, 
  onEmaStatusChange,
  showEma = true,
  showBollingerBands = true,
  showSupportResistance = true,
  showGrid = true
}: MultiplierTrendProps) => {
  // console.log('📊 MultiplierTrend - Props recibidos:', {
  //   roundsCount: rounds?.length,
  //   isLoadingRounds,
  //   showEma,
  //   showBollingerBands,
  //   showSupportResistance,
  //   showGrid
  // });
  
  // if (rounds?.length > 0) {
  //   console.log('📊 MultiplierTrend - Primeros 3 rounds:', rounds.slice(0, 3));
  //   console.log('📊 MultiplierTrend - Últimos 3 rounds:', rounds.slice(-3));
  // }
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathData, setPathData] = useState<any[]>([]);
  const [containerHeight, setContainerHeight] = useState(300);
  const [containerWidth, setContainerWidth] = useState(0);

  const [scrollY, setScrollY] = useState(0);
  const [emaData, setEmaData] = useState<any[]>([]);
  interface Point {
    x: number;
    y: number;
  }

  const [bollingerBands, setBollingerBands] = useState<{ upper: (Point | null)[]; lower: (Point | null)[]; sma: (Point | null)[] }>({ 
    upper: [], 
    lower: [], 
    sma: [] 
  });
  
  const [supportResistance, setSupportResistance] = useState<{ support: number | null; resistance: number | null }>({ 
    support: null, 
    resistance: null 
  });
  
  const [lastRoundId, setLastRoundId] = useState<string | null>(null);
  const [isAboveEma, setIsAboveEma] = useState(false);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  const padding = isMobile ? 20 : 40;
  const paddingRight = isMobile ? 5 : 10;
  const fixedStepX = isMobile ? 20 : 30;
  const extraRightSpace = isMobile ? 20 : 40;
  const verticalMargin = isMobile ? 10 : 20;
  const threshold = 2.01;
  const dataCount = 100;
  const emaPeriod = 20;
  const bollingerPeriod = 20;
  const bollingerStdDev = 2;
  const srLookback = 40;

  const calculateEMA = useMemo(() => (data: number[], period: number) => {
    if (!data || data.length < period) return [];
    const k = 2 / (period + 1);
    const ema: number[] = [];
    let sma = data.slice(0, period).reduce((sum: number, val: number) => sum + (val || 0), 0) / period;
    ema.push(sma);
    for (let i = period; i < data.length; i++) {
      sma = (data[i] * k) + (ema[ema.length - 1] * (1 - k));
      ema.push(sma);
    }
    return ema;
  }, []);

  const calculateBollingerBands = useMemo(() => (data: number[]) => {
    if (!data || data.length < bollingerPeriod) return { upper: [], lower: [], sma: [] };
    const sma: number[] = [];
    const upper: number[] = [];
    const lower: number[] = [];
    for (let i = bollingerPeriod - 1; i < data.length; i++) {
      const slice = data.slice(i - bollingerPeriod + 1, i + 1);
      const mean = slice.reduce((sum: number, val: number) => sum + (val || 0), 0) / bollingerPeriod;
      const variance = slice.reduce((sum: number, val: number) => sum + Math.pow((val || 0) - mean, 2), 0) / bollingerPeriod;
      const std = Math.sqrt(variance) || 0;
      sma.push(mean);
      upper.push(mean + bollingerStdDev * std);
      lower.push(mean - bollingerStdDev * std);
    }
    return { upper, lower, sma };
  }, []);

  const calculateSupportResistance = useMemo(() => (data: number[]) => {
    if (!data || data.length === 0) return { support: null, resistance: null };
    const lookbackData = data.slice(-srLookback);
    if (!lookbackData.length) return { support: null, resistance: null };
    const max = Math.max(...lookbackData);
    const min = Math.min(...lookbackData);
    return { support: min, resistance: max };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const parentCard = container.parentElement;
      const updateDimensions = () => {
        const isMobile = window.innerWidth <= 768;
        const height = parentCard ? parentCard.clientHeight - 32 : 300;
        const width = parentCard ? parentCard.clientWidth - 32 : 480;
        setContainerHeight(height > 0 ? height : isMobile ? 166 : 300);
        setContainerWidth(width > 0 ? width : 480);
      };
      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      if (parentCard) resizeObserver.observe(parentCard);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const processedData = useMemo(() => {
    if (isLoadingRounds || !rounds || rounds.length < 2) {
      return { newPathData: [], ema: [], bollinger: { upper: [], lower: [], sma: [] }, sr: { support: null, resistance: null }, isAboveEma: false };
    }

    const reversedRounds = rounds.slice().reverse();
    const limitedRounds = reversedRounds.slice(0, Math.min(dataCount, reversedRounds.length));

    const transformedData = limitedRounds.map((round) => {
      const maxMultiplier = parseFloat(round?.max_multiplier?.toString() || '0') || 0;
      return maxMultiplier > threshold ? 1 : -1;
    });

    let yValue = 0;
    const plotData = transformedData.map((value) => (yValue += value));

    const ema = calculateEMA(plotData, emaPeriod);
    const bollinger = calculateBollingerBands(plotData);
    const sr = calculateSupportResistance(plotData);

    const lastTwoPoints = plotData.slice(-2);
    const lastTwoEma = ema.slice(-2);
    const isAboveEma = lastTwoPoints.length >= 2 && lastTwoEma.length >= 2
      ? lastTwoPoints.every((point, idx) => point > lastTwoEma[idx])
      : false;

    const maxYValue = plotData.length > 0 ? Math.max(...plotData, 0) : 0;
    const minYValue = plotData.length > 0 ? Math.min(...plotData, 0) : 0;
    const rangeY = maxYValue - minYValue || 1;

    const totalPoints = limitedRounds.length;
    const availableWidth = containerWidth || 400;
    const availableHeight = containerHeight || 300;

    const newPathData = plotData.map((y, index) => {
      const xPos = padding + index * fixedStepX;
      const yPos = (availableHeight - padding * 2) * (1 - (y - minYValue) / rangeY) + padding;
      const maxMultiplier = parseFloat(limitedRounds[index]?.max_multiplier?.toString() || '0') || 0;
      return {
        x: xPos,
        y: yPos,
        value: transformedData[index],
        cumulative: y,
        max_multiplier: maxMultiplier,
      };
    });

    const adjustedEmaData = ema.map((value, idx) => {
      const index = idx + emaPeriod - 1;
      if (index >= totalPoints) return null;
      const xPos = padding + index * fixedStepX;
      const yPos = (availableHeight - padding * 2) * (1 - (value - minYValue) / rangeY) + padding;
      return { x: xPos, y: yPos };
    }).filter(Boolean);

    const adjustedBollinger = {
      upper: bollinger.upper.map((value, idx) => {
        const index = idx + bollingerPeriod - 1;
        if (index >= totalPoints) return null;
        const xPos = padding + index * fixedStepX;
        const yPos = (availableHeight - padding * 2) * (1 - (value - minYValue) / rangeY) + padding;
        return { x: xPos, y: yPos };
      }).filter(Boolean),
      lower: bollinger.lower.map((value, idx) => {
        const index = idx + bollingerPeriod - 1;
        if (index >= totalPoints) return null;
        const xPos = padding + index * fixedStepX;
        const yPos = (availableHeight - padding * 2) * (1 - (value - minYValue) / rangeY) + padding;
        return { x: xPos, y: yPos };
      }).filter(Boolean),
      sma: bollinger.sma.map((value, idx) => {
        const index = idx + bollingerPeriod - 1;
        if (index >= totalPoints) return null;
        const xPos = padding + index * fixedStepX;
        const yPos = (availableHeight - padding * 2) * (1 - (value - minYValue) / rangeY) + padding;
        return { x: xPos, y: yPos };
      }).filter(Boolean),
    };

    const adjustedSR = {
      support: sr.support !== null ? (availableHeight - padding * 2) * (1 - (sr.support - minYValue) / rangeY) + padding : null,
      resistance: sr.resistance !== null ? (availableHeight - padding * 2) * (1 - (sr.resistance - minYValue) / rangeY) + padding : null,
    };

    return { newPathData, ema: adjustedEmaData, bollinger: adjustedBollinger, sr: adjustedSR, isAboveEma };
  }, [rounds, isLoadingRounds, containerHeight, containerWidth, calculateEMA, calculateBollingerBands, calculateSupportResistance]);

  useEffect(() => {
    if (isLoadingRounds || !rounds || rounds.length < 2) {
      setPathData([]);
      setEmaData([]);
      setBollingerBands({ upper: [], lower: [], sma: [] });
      setSupportResistance({ support: null, resistance: null });
      onEmaStatusChange(false);
      return;
    }

    const currentRound = rounds[0];
    const currentRoundId = currentRound?.round_id || `round-${Date.now()}`;
    if (currentRoundId === lastRoundId) return;

    setLastRoundId(currentRoundId);
    setPathData(processedData.newPathData);
    setEmaData(processedData.ema);
    setBollingerBands(processedData.bollinger);
    setSupportResistance(processedData.sr);
    setIsAboveEma(processedData.isAboveEma);
    onEmaStatusChange(processedData.isAboveEma);
  }, [processedData, isLoadingRounds, rounds, lastRoundId, onEmaStatusChange]);

  useEffect(() => {
    if (rounds.length > 0 && rounds[0].round_id) {
      setLastRoundId(rounds[0].round_id);
    } else if (rounds.length > 0) {
      setLastRoundId(`round-${Date.now()}`);
    } else {
      setLastRoundId(null);
    }
  }, [rounds]);

  // Desplazar el scroll horizontal completamente a la derecha cuando pathData cambia
  useEffect(() => {
    if (containerRef.current && pathData.length > 0) {
      const container = containerRef.current;
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    }
  }, [pathData]);

  const handleScroll = () => {
    if (!containerRef.current || !pathData.length) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const visibleStartX = scrollLeft;
    const visibleEndX = scrollLeft + containerWidth;
    const visiblePoints = pathData.filter((point) => point.x >= visibleStartX && point.x <= visibleEndX);
    if (visiblePoints.length) {
      const visibleYs = pathData.map(p => p.y).filter(Number.isFinite);
      const maxY = Math.max(...visibleYs);
      const minY = Math.min(...visibleYs);
      const centerY = (maxY + minY) / 2;
      const targetScrollY = centerY - containerHeight / 2 + padding;
      const maxScrollY = Math.max(0, Math.max(...pathData.map(p => p.y)) - containerHeight + padding + verticalMargin);
      const minScrollY = Math.min(0, Math.min(...pathData.map(p => p.y)) - padding - verticalMargin);
      const boundedScrollY = Math.max(minScrollY, Math.min(maxScrollY, targetScrollY));
      setScrollY(boundedScrollY);
    }
  };

  if (isLoadingRounds || !rounds || rounds.length === 0) {
    return (
      <div 
        className="graphics"
        style={{
          background: 'rgba(17, 24, 39, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid #292929',
          flexGrow: 1,
          flexShrink: 1,
          boxSizing: 'border-box',
          height: '100%',
          position: 'relative'
        }}
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Cargando rondas...</div>
      </div>
    );
  }
  if (rounds.length === 1) {
    return (
      <div 
        className="graphics"
        style={{
          background: 'rgba(17, 24, 39, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid #292929',
          flexGrow: 1,
          flexShrink: 1,
          boxSizing: 'border-box',
          height: '100%',
          position: 'relative'
        }}
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Se necesitan al menos dos rondas.</div>
      </div>
    );
  }
  if (!pathData.length) {
    return (
      <div 
        className="graphics"
        style={{
          background: 'rgba(17, 24, 39, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid #292929',
          flexGrow: 1,
          flexShrink: 1,
          boxSizing: 'border-box',
          height: '100%',
          position: 'relative'
        }}
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>No hay datos disponibles para el gráfico.</div>
      </div>
    );
  }

  const totalPoints = pathData.length;
  const availableWidth = containerWidth || 400;
  const availableHeight = containerHeight || 300;
  const totalWidth = padding + (totalPoints - 1) * fixedStepX + paddingRight + extraRightSpace;
  const totalHeight = availableHeight;

  const pathD = pathData.reduce((acc, point, index) => {
    if (!point) return acc;
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const emaPathD = emaData.reduce((acc, point, index) => {
    if (!point) return acc;
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const bollingerUpperPathD = bollingerBands.upper.reduce((acc, point, index) => {
    if (!point || point.x === undefined || point.y === undefined) return acc;
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const bollingerLowerPathD = bollingerBands.lower.reduce((acc, point, index) => {
    if (!point || point.x === undefined || point.y === undefined) return acc;
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const bollingerAreaPathD = bollingerBands.upper.length > 0 ? [
    ...bollingerBands.upper.filter((point): point is Point => point !== null).map((point, index) => (
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )),
    ...bollingerBands.lower.slice().reverse().filter((point): point is Point => point !== null).map((point, index) => (
      index === 0 ? `L ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )),
    'Z'
  ].join(' ') : '';

  return (
    <div 
      className="graphics modern-scroll"
      style={{
        background: 'rgba(17, 24, 39, 0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid #292929',
        flexGrow: 1,
        flexShrink: 1,
        boxSizing: 'border-box',
        height: '100%',
        position: 'relative'
      }}
    >
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
          height: '100%',
          width: '100%'
        }}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className="multiplier-trend-wrapper" style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}>
          <svg
            ref={svgRef}
            width="100%"
            height={totalHeight}
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            preserveAspectRatio="xMinYMid meet"
            className="bg-transparent"
          >
            <defs>
              {/* Línea principal (gris→blanco) se queda igual */}
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#F9FAFB" />
              </linearGradient>

              {/* Área VERDE (arriba→abajo) */}
              <linearGradient
                id="areaGradGreen"
                x1={0}
                y1={padding}
                x2={0}
                y2={totalHeight - padding}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="#22C55E" stopOpacity="0.28" />
                <stop offset="60%"  stopColor="#22C55E" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.00" />
              </linearGradient>

              {/* Área ROJA (arriba→abajo) */}
              <linearGradient
                id="areaGradRed"
                x1={0}
                y1={padding}
                x2={0}
                y2={totalHeight - padding}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="#EF4444" stopOpacity="0.28" />
                <stop offset="60%"  stopColor="#EF4444" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.00" />
              </linearGradient>

              {/* Gradiente neutro para Bollinger */}
              <linearGradient
                id="bollGrad"
                x1={0}
                y1={padding}
                x2={0}
                y2={totalHeight - padding}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="#9CA3AF" stopOpacity="0.18" /> {/* arriba tenue */}
                <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.00" /> {/* abajo transparente */}
              </linearGradient>

              {/* Glow sutil */}
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Gradiente azul sobrio para EMA */}
              <linearGradient id="emaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />  {/* azul-500 */}
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" /> {/* azul-400 */}
              </linearGradient>

              {/* Grid de líneas cuadriculadas */}
              {showGrid && (
                <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <defs>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#374151" stopOpacity="0.3" />   {/* gris */}
                      <stop offset="100%" stopColor="#111827" stopOpacity="0.3" /> {/* negro */}
                    </linearGradient>
                  </defs>
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="url(#gridGrad)" strokeWidth="0.5" />
                </pattern>
              )}

            </defs>

            {/* Grid de fondo */}
            {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

            {/* Área bajo la serie principal (sin opacity en el path) */}
            <path
              d={`${pathD} L ${totalWidth - paddingRight} ${totalHeight - padding} L ${padding} ${totalHeight - padding} Z`}
              fill={isAboveEma ? 'url(#areaGradGreen)' : 'url(#areaGradRed)'}
            />

            {/* Línea principal */}
            <path
              d={pathD}
              stroke="url(#lineGrad)"
              strokeWidth={isMobile ? 1.5 : 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />

            {/* Elementos de análisis técnico */}
            {/* Área entre bandas de Bollinger */}
            {showBollingerBands && bollingerAreaPathD && (
              <path d={bollingerAreaPathD} fill="url(#bollGrad)" stroke="none" />
            )}
            
            {/* Líneas de Soporte y Resistencia */}
            {showSupportResistance && supportResistance.support !== null && (
              <line
                x1={padding}
                y1={supportResistance.support}
                x2={totalWidth - paddingRight}
                y2={supportResistance.support}
                stroke="#4CAF50"
                strokeWidth={isMobile ? 0.8 : 1}
                strokeDasharray="5,5"
              />
            )}
            {showSupportResistance && supportResistance.resistance !== null && (
              <line
                x1={padding}
                y1={supportResistance.resistance}
                x2={totalWidth - paddingRight}
                y2={supportResistance.resistance}
                stroke="#F44336"
                strokeWidth={isMobile ? 0.8 : 1}
                strokeDasharray="5,5"
              />
            )}
            
            {/* Línea EMA */}
            {showEma && emaData.length > 0 && (
              <path
                d={emaPathD}
                stroke="url(#emaGrad)"
                strokeWidth={isMobile ? 1.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
            {/* Puntos por encima de la línea */}
            {pathData.map((point, index) => {
              if (!point) return null;

              const emaPoint = emaData[index - (emaPeriod - 1)];
              const isAboveEMA = emaPoint && point.y < emaPoint.y;

              let fillColor = 'rgba(156,163,175,0.9)'; // default gris
              if (isAboveEMA) fillColor = 'rgba(59,130,246,0.65)'; // azul sobrio
              else if (point.value > 0) fillColor = 'rgba(34,197,94,0.65)'; // verde sobrio
              else fillColor = 'rgba(239,68,68,0.65)'; // rojo sobrio

              return (
                <g key={index}>
                  {/* Borde exterior grueso para cubrir la línea */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isMobile ? 5 : 6}
                    fill={fillColor}
                    stroke="#0F1117"   // color del fondo para "tapar" la línea
                    strokeWidth={3}    // grosor suficiente para cubrir el path debajo
                  />
                  {/* Borde fino blanco por encima */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isMobile ? 5 : 6}
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"  // borde fino blanco encima
                    strokeWidth={1.5}
                  />

                  {/* Conserva tus textos si quieres (puedes bajarles la opacidad si se ven cargados) */}
                  <text
                    x={point.x}
                    y={point.y - (isMobile ? 12 : 15)}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.8)"
                    fontSize={isMobile ? 8 : 10}
                    fontWeight="600"
                  >
                    {point.cumulative > 0 ? `+${point.cumulative}` : point.cumulative}
                  </text>
                  <text
                    x={point.x}
                    y={point.y + (isMobile ? 12 : 15)}
                    textAnchor="middle"
                    fill="rgba(226,232,240,0.75)"
                    fontSize={isMobile ? 6 : 8}
                    fontWeight="400"
                  >
                    {point.max_multiplier.toFixed(2)}x
                  </text>
                </g>
              );
            })}
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation={isMobile ? 1.5 : 2} />
                <feOffset dx="0" dy={isMobile ? 1.5 : 2} result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

      </div>
    </div>
  );
};

export default MultiplierTrend;
