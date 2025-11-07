'use client';

import React from 'react';
import { useSpaceman } from '@/hooks/useSpaceman';
import { MdRocket, MdRefresh, MdPlayArrow } from 'react-icons/md';

export default function SpacemanControl() {
  const spaceman = useSpaceman();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MdRocket className="w-8 h-8 text-purple-400 mr-3" />
          Control de Spaceman
        </h2>
        <button
          onClick={spaceman.getStatus}
          disabled={spaceman.loading}
          className="p-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors disabled:opacity-50"
          title="Actualizar estado"
        >
          <MdRefresh className={`w-4 h-4 text-gray-300 ${spaceman.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado actual */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-300 mb-3">Estado Actual</h4>
            
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg border ${
                spaceman.status?.isActive 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <MdRocket className={`w-8 h-8 ${
                  spaceman.status?.isActive ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  spaceman.status?.isActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {spaceman.status?.isActive ? 'ACTIVO' : 'INACTIVO'}
                </p>
                <p className="text-gray-400 text-sm">
                  Estado del servicio
                </p>
                {spaceman.status?.timestamp && (
                  <p className="text-gray-500 text-xs">
                    Actualizado: {new Date(spaceman.status.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            {spaceman.status && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {spaceman.status.activeConnections}
                  </p>
                  <p className="text-gray-400 text-sm">Conexiones Activas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {spaceman.status.totalSpaceman}
                  </p>
                  <p className="text-gray-400 text-sm">Total Spaceman</p>
                </div>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-300 mb-3">Controles</h4>
            
            <div className="space-y-3">
              <button
                onClick={async () => {
                  const result = await spaceman.start();
                  if (result.success) {
                    alert('✅ Spaceman iniciado exitosamente');
                  } else {
                    alert(`❌ Error: ${result.message}`);
                  }
                }}
                disabled={spaceman.loading || spaceman.status?.isActive}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 border border-green-500 rounded-lg transition-colors font-medium"
              >
                <MdPlayArrow className="w-5 h-5" />
                <span>Iniciar Spaceman</span>
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {spaceman.status?.isActive 
                    ? '✅ Servicio activo - Los tokens se actualizan automáticamente'
                    : '⏸️ Servicio inactivo - Presiona "Iniciar" para activar'
                  }
                </p>
              </div>
            </div>

            {spaceman.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{spaceman.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
