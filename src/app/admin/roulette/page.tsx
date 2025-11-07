'use client';

import React, { useState, useEffect } from 'react';
import { useRoulette } from '@/hooks/useRoulette';
import { useBookmakers } from '@/hooks/useBookmakers';
import { MdRestartAlt } from 'react-icons/md';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

export default function RoulettePage() {
  const roulette = useRoulette();
  const { bookmakers, loading: bookmakersLoading, error: bookmakersError, fetchBookmakersByGameId } = useBookmakers();

  useEffect(() => {
    // Only load bookmakers - no automatic status calls
    fetchBookmakersByGameId(3);
  }, []);

  const handleStartOrReset = async () => {
    // El endpoint start ya reinicia correctamente (detiene y luego inicia)
    const result = await roulette.start();
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };

  return (
    <AdminLayout 
      pageTitle="Roulette Control"
      pageDescription="Gestiona el servicio de WebSocket de Roulettes"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Bookmakers de Roulettes</h2>
          <div className="flex items-center">
            <button
              onClick={handleStartOrReset}
              disabled={roulette.loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 border border-purple-500 rounded-lg transition-colors font-medium text-white flex items-center space-x-2"
              title="Iniciar o resetear el servicio de ruleta"
            >
              <MdRestartAlt className={`w-5 h-5 ${roulette.loading ? 'animate-spin' : ''}`} />
              <span>INICIAR/RESETEAR</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
          {bookmakersLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : bookmakersError ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-400">Error cargando bookmakers: {bookmakersError}</p>
            </div>
          ) : bookmakers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No hay bookmakers disponibles para Roulettes</p>
            </div>
          ) : (
            [...bookmakers]
              .sort((a, b) => {
                // Activos primero; luego ordenar por nombre para consistencia
                const byActive = Number(b.isActive) - Number(a.isActive);
                if (byActive !== 0) return byActive;
                return (a.bookmaker || '').localeCompare(b.bookmaker || '');
              })
              .map((bookmaker) => (
              <div key={bookmaker.id} className="relative rounded-[20px] sm:rounded-[30px] aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] group card-hover-effect roulette-card bookmaker-card">
                <div className="absolute inset-0 rounded-[20px] sm:rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_70%)]"></div>

                {/* Bookmaker Logo */}
                <div className="relative z-10 h-full">
                  <Image
                    src={bookmaker.bookmakerImg}
                    alt={`${bookmaker.bookmaker} Logo`}
                    width={0}
                    height={0}
                    className={`h-auto object-contain relative z-10 ${!bookmaker.isActive ? 'opacity-50 grayscale' : ''}`}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      objectFit: 'cover',
                      borderRadius: '20px'
                    }}
                  />
                </div>

                {/* Franja OFFLINE */}
                {!bookmaker.isActive && (
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-20">
                    <div className="py-2 relative bg-black bg-opacity-70">
                      <span className="text-white text-lg font-bold block text-center">
                        OFFLINE
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Error Display */}
        {roulette.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-6">
            <div className="flex items-center space-x-3">
              <span className="text-red-400 font-medium">Error: {roulette.error}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .roulette-card img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 20px !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          max-width: none !important;
          max-height: none !important;
          min-width: 100% !important;
          min-height: 100% !important;
        }
        
        .roulette-card .bookmaker-logo {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 20px !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          max-width: none !important;
          max-height: none !important;
          min-width: 100% !important;
          min-height: 100% !important;
        }
        
        .roulette-card [data-nimg] {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 20px !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          max-width: none !important;
          max-height: none !important;
          min-width: 100% !important;
          min-height: 100% !important;
        }
      `}</style>
    </AdminLayout>
  );
}
