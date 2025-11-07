'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTelegramPlane } from 'react-icons/fa';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-[#0b0b0b] to-[#111] fade-in">
      {/* Glow rojo principal */}
      <div className="red-directional-light" aria-hidden />

      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logos/logo.svg" alt="INTELLI SOFTWARE" width={200} height={200} className="object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer uppercase tracking-wide text-sm"
          >
            LOGIN
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 border border-white/10 shadow-[0_8px_24px_rgba(239,68,68,0.25)] transition-colors cursor-pointer uppercase tracking-wide text-sm"
          >
            REGISTER
          </Link>
        </div>
      </header>

      {/* Hero: dos columnas */}
      <section className="relative max-w-7xl mx-auto px-4 pt-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Izquierda: copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Operativa en vivo • Control y precisión
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">SOFTWARE PREDICTIVO PARA JUEGOS DE CASINO ONLINE</span>
          </h1>
          <p className="mt-5 text-gray-300 max-w-xl uppercase">
            SUITE TÁCTICA: PANELES EN TIEMPO REAL, SEÑALES Y GESTIÓN DEL RIESGO.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 border border-white/10 shadow-[0_10px_30px_rgba(239,68,68,0.25)] cursor-pointer">Empezar ahora</Link>
            <Link href="https://t.me/+A3e6tYou60tmZmQ5" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer inline-flex items-center gap-2">
              <FaTelegramPlane className="text-[#26A4E3]" />
              <span>UNIRSE AHORA</span>
            </Link>
          </div>
        </div>

        {/* Derecha: tarjeta de "código" decorativa */}
        <div className="relative">
          <div className="absolute -top-8 -right-6 h-20 w-20 rounded-full bg-red-500/20 blur-2xl" aria-hidden />
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_120px_-40px_rgba(239,68,68,0.35)]">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-auto text-xs text-gray-400">live-session.ts</span>
            </div>
            <pre className="mt-3 text-[12px] leading-5 text-gray-200">
{`// Estrategia simple (pseudo)
const trend = getTrend(history)
if (trend.aboveEMA && bb.squeeze) {
  signal('Aviator', {
    entry: 'x1.5',
    stop: 'control ciclos',
    context: 'EMA + Bandas + SR'
  })
}`}
            </pre>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-400/20 text-red-200">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Señales en vivo
            </span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Control de riesgo</span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Métricas</span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Estrategias</span>
          </div>
        </div>
      </section>

      {/* Footer invisible: logos en escala de grises */}
      <section aria-label="Partners" className="mt-8 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60 hover:opacity-80 transition-opacity">
            <Image src="/logos/spribe.svg" alt="Spribe" width={120} height={32} className="h-6 w-auto grayscale" />
            <Image src="/logos/pragmatic-play.svg" alt="Pragmatic Play" width={160} height={36} className="h-7 w-auto grayscale" />
            <Image src="/logos/888starz-logo.svg" alt="888Starz" width={100} height={28} className="h-5 w-auto grayscale" />
            <Image src="/logos/aviator-logo.svg" alt="Aviator" width={120} height={32} className="h-6 w-auto grayscale" />
            <Image src="/logos/ruleta-logo.svg" alt="Ruleta" width={120} height={32} className="h-6 w-auto grayscale" />
            <Image src="/logos/spaceman-logo.svg" alt="Spaceman" width={120} height={32} className="h-6 w-auto grayscale" />
          </div>
        </div>
      </section>
      

      

      
    </main>
  );
}
