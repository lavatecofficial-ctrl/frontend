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
import { useAuth } from '../../../hooks/useAuth';
import { 
  FaUser, 
  FaEnvelope, 
  FaCrown, 
  FaCalendarAlt, 
  FaBell, 
  FaSync, 
  FaMoon, 
  FaCog,
  FaShieldAlt,
  FaCreditCard
} from 'react-icons/fa';
import { RoundData, Prediction } from '@/types/portal';
import RoundInfo from './RoundInfo';
import LiveMultiplier from './LiveMultiplier';

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
  showEma: boolean;
  setShowEma: (show: boolean) => void;
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  showSupportResistance: boolean;
  setShowSupportResistance: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  roundData: RoundData;
  prediction?: Prediction | null;
  trend?: 'alcista' | 'bajista';
}

export default function BetsBlock({ 
  history, 
  showEma, 
  setShowEma, 
  showBollingerBands, 
  setShowBollingerBands, 
  showSupportResistance, 
  setShowSupportResistance,
  showGrid,
  setShowGrid,
  roundData,
  prediction,
  trend
}: BetsBlockProps) {
  const [activeTab, setActiveTab] = useState('Inicio');
  const tabs = ['Inicio', 'Finanzas', 'Config'];
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
    return '#ebebeb'; // color por defecto
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

  const recentRounds = useMemo(() => {
    // El historial viene en orden ASC (antiguo → reciente)
    // Tomar las últimas 100 e invertir para que el gráfico muestre reciente a la izquierda
    return history.slice(-100).reverse();
  }, [history]);

  // Calcular datos para el Polar Area Chart de multiplicadores
  const polarData = useMemo(() => {
    if (history.length === 0) return { data: [], maxValue: 0 };

    // Crear rangos para el polar chart
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

  const chartData = useMemo(() => {
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
  }, [recentRounds]);

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
             return `Ronda: ${recentRounds[index]?.roundId || 'N/A'}`;
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
  }), [recentRounds]);

  // Datos para el Polar Area Chart
  const polarChartData = useMemo(() => {
    return {
      labels: polarData.data.map(item => item.range),
      datasets: [
        {
          label: 'Distribución de Multiplicadores',
          data: polarData.data.map(item => item.count),
          backgroundColor: polarData.data.map(item => `${item.color}80`), // 50% opacity
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
    <div className="bets-block-container">
      {/* Tarjeta Superior - Predicción (45%) */}
      <div className="bets-block-prediction">
        <RoundInfo roundData={roundData} prediction={prediction} trend={trend} />
      </div>

      {/* Tarjeta Inferior - Multiplicador en Vivo (55%) */}
      <div className="bets-block-multiplier">
        <LiveMultiplier roundData={roundData} />
      </div>
    </div>
  );
}
