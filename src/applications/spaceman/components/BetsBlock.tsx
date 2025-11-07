'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Bar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { 
  FaUser, 
  FaEnvelope, 
  FaCrown, 
  FaCalendarAlt, 
  FaCog,
  FaShieldAlt,
  FaCreditCard
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';

ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip,
  RadialLinearScale,
  ArcElement
);

interface BetsBlockProps {
  history: any[];
  serviceStatus: any;
  isConnected: boolean;
  showEma: boolean;
  setShowEma: (show: boolean) => void;
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  showSupportResistance: boolean;
  setShowSupportResistance: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
}

export default function BetsBlock({ 
  history, 
  serviceStatus, 
  isConnected,
  showEma,
  setShowEma,
  showBollingerBands,
  setShowBollingerBands,
  showSupportResistance,
  setShowSupportResistance,
  showGrid,
  setShowGrid
}: BetsBlockProps) {
  const [activeTab, setActiveTab] = useState('Inicio');
  const tabs = ['Inicio', 'Config'];
  const chartRef = useRef(null);
  const polarChartRef = useRef(null);
  const { user } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1_000_000_000) {
      return `${sign}${(absValue / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
      return `${sign}${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      return `${sign}${(absValue / 1_000).toFixed(1)}K`;
    } else {
      return `${sign}${absValue.toFixed(0)}`;
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 1.00 && multiplier <= 1.99) {
      return 'rgb(52, 180, 255)';
    } else if (multiplier >= 2.00 && multiplier <= 9.99) {
      return 'rgb(145, 62, 248)';
    } else if (multiplier >= 10.00) {
      return 'rgb(192, 23, 180)';
    }
    return 'rgb(52, 180, 255)';
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Sin plan';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace('.', '');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Datos para el gráfico de barras (finanzas)
  const chartData = useMemo(() => {
    if (!history || history.length === 0) return { labels: [], datasets: [] };

    const recentRounds = history.slice(-100).map(round => ({ ...round }));
    
    return {
      labels: recentRounds.map(() => ''),
      datasets: [
        {
          label: 'Ganancia/Pérdida del Casino',
          data: recentRounds.map((round) => parseFloat(round.casinoProfit) || 0),
          backgroundColor: recentRounds.map((round) =>
            parseFloat(round.casinoProfit) >= 0
              ? 'rgba(76, 175, 80, 0.6)'
              : 'rgba(239, 68, 68, 0.6)'
          ),
          borderColor: recentRounds.map((round) =>
            parseFloat(round.casinoProfit) >= 0 ? '#4CAF50' : '#EF4444'
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [history]);

  // Opciones para el gráfico de barras
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.raw),
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return `Ronda: ${history.slice(-100)[index]?.roundId || 'N/A'}`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#A0A0A0',
          font: { size: 10 },
          callback: (value: any) => formatCurrency(value),
        },
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8,
      },
    },
    animation: {
      duration: 200,
      easing: 'easeInOut',
    },
  }), [history]);

  // Datos para el gráfico polar (distribución de multiplicadores)
  const polarData = useMemo(() => {
    if (!history || history.length === 0) return { data: [], maxValue: 0 };

    // Crear rangos para el polar chart (idénticos a Aviator)
    const ranges = [
      { min: 1.00, max: 1.50, label: '1.00-1.50x', color: '#34B4FF' },
      { min: 1.51, max: 2.00, label: '1.51-2.00x', color: '#FBBF24' },
      { min: 2.01, max: 3.00, label: '2.01-3.00x', color: '#FB923C' },
      { min: 3.01, max: 5.00, label: '3.01-5.00x', color: '#F56565' },
      { min: 5.01, max: 10.00, label: '5.01-10.00x', color: '#EF4444' },
      { min: 10.01, max: Infinity, label: '10.01x+', color: '#DC2626' }
    ];

    const counts = ranges.map(range => {
      return history.filter(round => {
        const multiplier = parseFloat(round.maxMultiplier) || 0;
        return multiplier >= range.min && multiplier <= range.max;
      }).length;
    });

    const maxValue = Math.max(...counts);
    
    return { 
      data: counts.map((count, index) => ({
        range: ranges[index].label,
        count,
        percentage: ((count / history.length) * 100).toFixed(1),
        color: ranges[index].color,
        intensity: count / maxValue
      })),
      maxValue
    };
  }, [history]);

  // Datos para el Polar Area Chart
  const polarChartData = useMemo(() => {
    return {
      labels: polarData.data.map(item => item.range),
      datasets: [
        {
          label: 'Distribución de Multiplicadores',
          data: polarData.data.map(item => item.count),
          backgroundColor: polarData.data.map(item => `${item.color}80`),
          borderColor: polarData.data.map(item => item.color),
          borderWidth: 2,
        },
      ],
    };
  }, [polarData]);

  // Opciones para el Polar Area Chart
  const polarChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#A0A0A0',
          font: { size: 10 },
          usePointStyle: true,
          padding: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const item = polarData.data[dataIndex];
            return `${item.count} rondas (${item.percentage}%)`;
          },
          title: (tooltipItems: any) => {
            const dataIndex = tooltipItems[0].dataIndex;
            return polarData.data[dataIndex].range;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8,
      },
    },
    animation: {
      duration: 200,
      easing: 'easeInOut',
    },
  }), [polarData]);

  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;
    if (chartInstance) {
      chartInstance.data = chartData;
      chartInstance.update({ duration: 200, easing: 'easeInOut' });
    }
  }, [chartData]);

  useEffect(() => {
    const polarChartInstance = polarChartRef.current?.chartInstance;
    if (polarChartInstance) {
      polarChartInstance.data = polarChartData;
      polarChartInstance.update({ duration: 200, easing: 'easeInOut' });
    }
  }, [polarChartData]);

  return (
    <div className="bets-block-spaceman modern-scroll">
      <div className="navigation-switcher">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Contenido del tab activo */}
      <div className="tab-content modern-scroll">
        {activeTab === 'Inicio' && (
          <div className="inicio-tab">
            
            {/* Primera tarjeta - Gráfico de Finanzas */}
            <div className="finance-chart-card">
              <div className="finance-chart">
                <div className="w-full h-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <Bar ref={chartRef} data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda tarjeta - Polar Area Chart */}
            <div className="future-chart-card">
              <div className="future-chart">
                <div className="w-full h-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <PolarArea ref={polarChartRef} data={polarChartData} options={polarChartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Config' && (
          <div className="config-tab">
            {/* Información del Usuario */}
            <div className="user-profile-section">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <h3>{user?.fullName || 'Usuario'}</h3>
                <div className="user-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{user?.email || 'usuario@ejemplo.com'}</span>
                  </div>
                  <div className="detail-item">
                    <FaCrown className="detail-icon" />
                    <span className="plan-badge">Plan Premium</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>Vence: {formatDate(user?.planEndDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración del Gráfico de Tendencia */}
            <div className="config-sections">
              <div className="config-section">
                <h4><FaCog className="section-icon" /> Configuración del Gráfico</h4>
                <div className="config-options">
                  <div className="config-item">
                    <div className="config-item-left">
                      <div className="config-icon-ema">EMA</div>
                      <div className="config-text">
                        <label>Línea EMA</label>
                        <span>Media Móvil Exponencial</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showEma}
                        onChange={(e) => setShowEma(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <div className="config-item-left">
                      <div className="config-icon-bb">BB</div>
                      <div className="config-text">
                        <label>Bandas de Bollinger</label>
                        <span>Bandas superior e inferior</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showBollingerBands}
                        onChange={(e) => setShowBollingerBands(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <div className="config-item-left">
                      <div className="config-icon-sr">S/R</div>
                      <div className="config-text">
                        <label>Soporte y Resistencia</label>
                        <span>Niveles clave de precio</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showSupportResistance}
                        onChange={(e) => setShowSupportResistance(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <div className="config-item-left">
                      <div className="config-icon-grid">GRID</div>
                      <div className="config-text">
                        <label>Cuadrícula</label>
                        <span>Líneas de fondo del gráfico</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
