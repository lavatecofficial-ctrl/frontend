'use client';

import React, { useState, useEffect } from 'react';
import { useAviator } from '@/hooks/useAviator';
import { useBookmakers } from '@/hooks/useBookmakers';
import { MdRocket, MdPlayArrow, MdCheckCircle, MdError, MdTrendingUp, MdSettings, MdArrowBack } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

export default function AviatorPage() {
  const aviator = useAviator();
  const { bookmakers, loading: bookmakersLoading, error: bookmakersError, fetchBookmakersByGameId } = useBookmakers();

  const [selectedBookmaker, setSelectedBookmaker] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isEditingWebSocket, setIsEditingWebSocket] = useState(false);
  const [editingWebSocket, setEditingWebSocket] = useState('');

  // Funciones para manejar la edición de la Auth Message
  const handleSaveWebSocket = async (value: string) => {
    try {
      if (!selectedBookmaker) {
        console.error('No hay bookmaker seleccionado');
        return;
      }

      const result = await aviator.updateAuthMessage(selectedBookmaker.id, value);
      if (result.success) {
        setIsEditingWebSocket(false);
        // La información se recarga automáticamente en el hook
      }
    } catch (error) {
      console.error('Error al guardar la Auth Message:', error);
    }
  };

  const handleCancelWebSocket = () => {
    setIsEditingWebSocket(false);
    setEditingWebSocket('');
  };

  useEffect(() => {
    aviator.getStatus();
    // Cargar bookmakers del juego Aviator (ID 1)
    fetchBookmakersByGameId(1);
  }, []);

  // Cargar información del bookmaker cuando se selecciona uno
  useEffect(() => {
    if (selectedBookmaker) {
      aviator.getBookmakerInfo(selectedBookmaker.id);
    }
  }, [selectedBookmaker, aviator.getBookmakerInfo]);

  const handleStart = async () => {
    const result = await aviator.start();
    if (result.success) {
      
      setTimeout(() => aviator.getStatus(), 1000);
    }
  };

  const handleBookmakerConfig = (bookmaker: any) => {
    setSelectedBookmaker(bookmaker);
    setShowConfig(true);
  };

  const handleBackToBookmakers = () => {
    setShowConfig(false);
    setSelectedBookmaker(null);
  };

  const AviatorContent = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Bookmakers de Aviator</h2>
        
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
              <p className="text-gray-400">No hay bookmakers disponibles para Aviator</p>
            </div>
          ) : (
            [...bookmakers]
              .sort((a, b) => {
                const byActive = Number(b.isActive) - Number(a.isActive);
                if (byActive !== 0) return byActive;
                return (a.bookmaker || '').localeCompare(b.bookmaker || '');
              })
              .map((bookmaker) => (
              <div key={bookmaker.id} className="relative rounded-[20px] sm:rounded-[30px] aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] group card-hover-effect bookmaker-card">
                <div className="absolute inset-0 rounded-[20px] sm:rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_70%)]"></div>
            
                {/* Bookmaker Logo with Glow */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-3/4 h-3/4 rounded-full opacity-10 blur-xl"
                      style={{ backgroundColor: '#3B82F6' }}
                    ></div>
                  </div>
                  <Image
                    src={bookmaker.bookmakerImg}
                    alt={`${bookmaker.bookmaker} Logo`}
                    width={0}
                    height={0}
                    className={`h-auto object-contain relative z-10 ${!bookmaker.isActive ? 'opacity-50 grayscale' : ''}`}
                    style={{ 
                      width: `${bookmaker.scaleImg}%`,
                      height: 'auto'
                    }}
                  />
                </div>
                
                {/* Overlay y Botones */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] flex flex-col items-center justify-center z-30 space-y-3">
                  <button 
                    onClick={() => handleBookmakerConfig(bookmaker)}
                    className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer bg-gray-600 text-white hover:bg-gray-700 flex items-center"
                  >
                    <MdSettings className="mr-2" />
                    CONFIGURAR
                  </button>
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
      </div>
    );
  };

  const BookmakerConfigContent = () => {
    return (
      <div className="space-y-6">
                 {/* Header con botón de regreso */}
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-white">
             Configuración de {selectedBookmaker?.bookmaker}
           </h2>
           <button
             onClick={handleBackToBookmakers}
             className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer font-medium"
           >
             <IoArrowBack className="mr-2 text-xl" />
             Volver a Bookmakers
           </button>
         </div>
        
        {/* Configuración del Bookmaker */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primera tarjeta: Botón CONECTAR y Auth URL */}
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-[20px] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700/30">
                <h3 className="text-lg font-semibold text-white">Control del Servicio</h3>
                <p className="text-sm text-gray-400 mt-1">Gestiona la conexión y configuración</p>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Botón CONECTAR */}
                <div className="flex justify-center">
                                     <button
                     onClick={handleStart}
                     disabled={aviator.loading}
                     className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-purple-700 disabled:opacity-50 border border-purple-500 rounded-[20px] transition-all duration-300 font-bold text-white shadow-md hover:shadow-lg disabled:shadow-none text-lg cursor-pointer"
                   >
                    <MdPlayArrow className="w-6 h-6 inline mr-3" />
                    CONECTAR
                  </button>
                </div>
                
                {/* Auth URL */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-md font-medium text-white mb-2">URL de Autenticación</h4>
                    <p className="text-xs text-gray-400">Configura la URL para la autenticación del servicio</p>
                  </div>
                  
                  {isEditingWebSocket ? (
                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        value={editingWebSocket}
                        onChange={(e) => setEditingWebSocket(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-[20px] px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 shadow-lg"
                        placeholder="Ingresa la Auth URL"
                        autoFocus
                      />
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleSaveWebSocket(editingWebSocket)}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-[20px] text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelWebSocket}
                          className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-[20px] text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <div className="w-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/40 rounded-[20px] px-4 py-3 shadow-lg">
                        <span className="text-sm text-white block truncate">
                          {aviator.bookmakerInfo?.authMessage || 'No disponible'}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setEditingWebSocket(aviator.bookmakerInfo?.authMessage || '');
                            setIsEditingWebSocket(true);
                          }}
                                                     className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-[20px] text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Segunda tarjeta: Información del Sistema */}
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-[20px] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700/30">
                <h3 className="text-lg font-semibold text-white">Información del Sistema</h3>
                <p className="text-sm text-gray-400 mt-1">Estado y configuración del servicio</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Columna de Títulos */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm font-medium text-gray-300">Estado del WebSocket</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium text-gray-300">Bookmaker</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-sm font-medium text-gray-300">Juego</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm font-medium text-gray-300">Estado del Bookmaker</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <span className="text-sm font-medium text-gray-300">Última Actualización</span>
                    </div>
                  </div>
                  
                  {/* Columna de Valores */}
                  <div className="space-y-6">
                                         <div className="flex items-center space-x-2">
                       <div className={`w-2 h-2 rounded-full ${
                         aviator.bookmakerInfo?.statusWs === 'CONNECTED' 
                           ? 'bg-green-400' 
                           : aviator.bookmakerInfo?.statusWs === 'CONNECTING'
                           ? 'bg-yellow-400'
                           : 'bg-red-400'
                       }`}></div>
                       <span className="text-sm text-white">
                         {aviator.bookmakerInfo?.statusWs || 'Desconectado'}
                       </span>
                     </div>
                    
                    <div className="text-sm text-white">
                      {selectedBookmaker?.bookmaker}
                    </div>
                    
                    <div className="text-sm text-white">
                      Aviator
                    </div>
                    
                    <div className="text-sm text-white">
                      {selectedBookmaker?.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                    
                    <div className="text-sm text-white">
                      {aviator.bookmakerInfo?.updatedAt ? 
                        new Date(aviator.bookmakerInfo.updatedAt).toLocaleString('es-ES', {
                          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                        }) : 
                        'No disponible'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {aviator.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-6 max-w-4xl">
            <div className="flex items-center space-x-3">
              <MdError className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error: {aviator.error}</span>
            </div>
          </div>
        )}

        
      </div>
    );
  };

  return (
    <AdminLayout 
      pageTitle="Aviator Control"
      pageDescription="Gestiona el servicio de WebSocket de Aviator"
    >
      {showConfig ? (
        <BookmakerConfigContent />
      ) : (
        <AviatorContent />
      )}
    </AdminLayout>
  );
}
