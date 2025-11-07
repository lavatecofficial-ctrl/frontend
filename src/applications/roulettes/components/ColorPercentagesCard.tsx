'use client';

import React, { useState, useEffect } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: any;
  };

interface ColorPercentagesCardProps {
  stats?: {
    red: number;
    black: number;
    green: number;
  };
  roundData?: {
    number: number;
    color: string;
  };
}

const RADIAN = Math.PI / 180;
const COLORS = [
  'rgba(239, 68, 68, 0.8)', // Rojo
  'rgba(17, 24, 39, 0.8)',  // Negro
  'rgba(34, 197, 94, 0.8)', // Verde
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const ColorPercentagesCard: React.FC<ColorPercentagesCardProps> = ({ stats, roundData }) => {
  const [outerRadius, setOuterRadius] = useState(80);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setOuterRadius(50);
      } else if (window.innerWidth <= 768) {
        setOuterRadius(60);
      } else {
        setOuterRadius(80);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const percentages = stats || { red: 0, black: 0, green: 0 };

  const data = [
    { name: 'Rojo', value: percentages.red },
    { name: 'Negro', value: percentages.black },
    { name: 'Verde', value: percentages.green },
  ];

  return (
    <div className="bg-gray-900/20 backdrop-blur-xl rounded-xl p-2 flex-1 flex flex-col">
      <div className="flex flex-col h-full">
        <h3 className="text-xs font-semibold text-white mb-2 text-center">
          Colores (Número {roundData?.number ?? 'N/A'})
        </h3>
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: outerRadius * 2 + 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ColorPercentagesCard;
