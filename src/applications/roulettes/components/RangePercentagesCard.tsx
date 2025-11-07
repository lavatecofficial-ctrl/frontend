'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RangePercentagesCardProps {
  stats?: {
    low: number;    // 1-18
    high: number;   // 19-36
    zero: number;   // 0
  };
  roundData?: {
    number: number;
    color: string;
  };
}

const RangePercentagesCard: React.FC<RangePercentagesCardProps> = ({ stats, roundData }) => {
  const percentages = stats || { low: 0, high: 0, zero: 0 };

  const data = {
    labels: ['1-18', '19-36', '0'],
    datasets: [
      {
        data: [percentages.low, percentages.high, percentages.zero],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Azul para 1-18
          'rgba(16, 185, 129, 0.8)', // Verde para 19-36
          'rgba(239, 68, 68, 0.8)',  // Rojo para 0
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Hace las barras horizontales
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.x}%`;
          }
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-900/20 backdrop-blur-xl rounded-xl p-2 flex-1 flex flex-col">
      <div className="flex flex-col h-full">
        <h3 className="text-xs font-semibold text-white mb-2 text-center">
          Rangos (Número {roundData?.number ?? 'N/A'})
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-full">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangePercentagesCard;
