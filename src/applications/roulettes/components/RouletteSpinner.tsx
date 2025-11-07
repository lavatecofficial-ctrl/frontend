import React, { useEffect, useState, memo } from 'react';
import './RouletteSpinner.css';

interface RouletteSpinnerProps {
  roundData?: {
    number?: number;
    color?: string;
  };
}

const RouletteSpinner: React.FC<RouletteSpinnerProps> = ({ roundData }) => {
  const svgns = 'http://www.w3.org/2000/svg';
  const numSlices = 36;
  const [animate, setAnimate] = useState(false);
  const [fontSize, setFontSize] = useState(60);
  const [maxSize, setMaxSize] = useState(200);

  useEffect(() => {
    if (roundData?.number !== undefined) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  }, [roundData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setFontSize(80);
        setMaxSize(280);
      } else if (window.innerWidth <= 768) {
        setFontSize(70);
        setMaxSize(240);
      } else {
        setFontSize(60);
        setMaxSize(200);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const wheel = document.getElementById('roulette-board-outter');
    if (!wheel) return;

    while (wheel.firstChild) {
      wheel.removeChild(wheel.firstChild);
    }

    const createSlice = (num: number, parent: Element, size: number, radius: number, fillColor: string, strokeColor: string, strokeWidth: number) => {
      const g = document.createElementNS(svgns, 'g');
      const offset = num * size;
      const x1 = 250 + radius * Math.cos(Math.PI * (-90 + offset) / 150);
      const y1 = 250 + radius * Math.sin(Math.PI * (-90 + offset) / 150);
      const x2 = 250 + radius * Math.cos(Math.PI * (-90 + size + offset) / 150);
      const y2 = 250 + radius * Math.sin(Math.PI * (-90 + size + offset) / 150);

      const slice = document.createElementNS(svgns, 'path');
      slice.setAttributeNS(null, 'id', `slice_${num}`);
      slice.setAttributeNS(null, 'd', `M 250 250 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
      slice.setAttributeNS(null, 'fill', fillColor);
      slice.setAttributeNS(null, 'stroke', strokeColor);
      slice.setAttributeNS(null, 'style', `stroke-width:${strokeWidth}px`);
      g.appendChild(slice);

      parent.appendChild(g);
    };

    for (let i = 0; i < numSlices; i++) {
      createSlice(
        i,
        wheel,
        300 / numSlices,
        180,
        i === 0 ? '#009900' : i % 2 === 0 ? '#990000' : '#000000',
        '#C0C0C0',
        3
      );
      createSlice(
        i,
        wheel,
        300 / numSlices,
        230,
        i === 0 ? '#00CC00' : i % 2 === 0 ? '#CC0000' : '#000000',
        '#C0C0C0',
        1
      );
    }
  }, []);

  const getGradientId = (color: string, number: number) => {
    if (number === 0) return 'greenGradient';
    return color?.toLowerCase() === 'red' ? 'redGradient' : 'blackGradient';
  };

  return (
    <svg
      id="root"
      width="60%"
      height="60%"
      viewBox="0 0 500 500"
      className="w-auto h-auto"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: `${maxSize}px`, maxHeight: `${maxSize}px` }}
    >
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#009900', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#006600', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#BD0046', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8C0034', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#333333', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="circleShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(45, 212, 191, 0.3)" floodOpacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="20" floodColor="rgba(0, 0, 0, 0.5)" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="250" cy="250" r="150" fill="#222222" />
      <g>
        <circle
          cx="250"
          cy="250"
          r="250"
          fill="#444444"
          stroke="#222222"
          style={{ strokeWidth: '1px' }}
          filter="url(#circleShadow)"
        />
        <g>
          <animateTransform
            type="rotate"
            id="numwheel"
            attributeName="transform"
            values="0 250 250;360 250 250"
            dur="10s"
            repeatCount="indefinite"
            calcMode="linear"
          />
          <g id="roulette-board-outter"></g>
        </g>
      </g>
      <g id="roulette-board">
        <circle
          cx="250"
          cy="250"
          r="130"
          fill={roundData?.number !== undefined ? `url(#${getGradientId(roundData.color || '', roundData.number)})` : '#333333'}
          stroke="#C0C0C0"
          style={{ strokeWidth: '2px' }}
        />
        <circle
          cx="250"
          cy="250"
          r="175"
          fill="none"
          stroke="#C0C0C0"
          style={{ strokeWidth: '2px' }}
        />
        <text
          x="250"
          y="260"
          fill="#FFFFFF"
          fontSize={fontSize}
          fontFamily="Orbitron, sans-serif"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
          className={animate ? 'new-number' : ''}
        >
          {roundData?.number !== undefined ? roundData.number : '...'}
        </text>
      </g>
    </svg>
  );
};

export default memo(RouletteSpinner);
