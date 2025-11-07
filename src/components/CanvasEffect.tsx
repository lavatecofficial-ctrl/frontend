'use client';

import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

export default function CanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = createNoise3D();
    let w: number, h: number;

    // Configurar canvas al tamaño de la ventana
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    ctx.globalCompositeOperation = "lighter";

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.6;
      const cy = h * 0.5;

      for (let i = 0; i < 120; i++) {
        const x = (i / 120) * w;
        for (let j = 0; j < 60; j++) {
          const y = (j / 60) * h;
          const n = noise(x * 0.0015, y * 0.0015, time * 0.0002);
          const intensity = Math.pow(Math.max(n, 0), 2.5);

          if (intensity > 0.02) {
            const color = `rgba(${120 + intensity * 120}, ${200 + intensity * 50}, 255, ${intensity * 0.12})`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 10, 10);
          }
        }
      }
      requestAnimationFrame(draw);
    };

    resize();
    draw(0);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', zIndex: 1 }}
    />
  );
}
