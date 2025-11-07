'use client';

import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/hooks/useAuth';
import { 
  MdPlayArrow, 
  MdCheckCircle, 
  MdError, 
  MdRefresh,
  MdWarning,
  MdLock
} from 'react-icons/md';

interface StartServicesButtonProps {
  className?: string;
}

export default function StartServicesButton({ className = '' }: StartServicesButtonProps) {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  // Permission validation: only superadmins can access this function
  if (!isSuperAdmin()) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          disabled
          className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg font-medium flex items-center justify-center cursor-not-allowed opacity-60"
        >
          <MdLock className="w-5 h-5 mr-2" />
          Iniciar Servicios
        </button>
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
          <div className="flex items-start">
            <MdLock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400">
              <p className="font-medium mb-1">Acceso Restringido</p>
              <p>Solo los Super Administradores pueden iniciar los servicios del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleStartServices = async () => {
    try {
      setLoading(true);
      setStatus('loading');
      setMessage('Iniciando servicios...');

      const response = await adminService.startServices();
      
      setStatus('success');
      setMessage(response.message || 'Servicios iniciados correctamente');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Error al iniciar los servicios');
      
      // Auto-hide error message after 8 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Iniciando...
        </>
      );
    }

    return (
      <>
        <MdPlayArrow className="w-5 h-5 mr-2" />
        Iniciar Servicios
      </>
    );
  };

  const getButtonStyles = () => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center';
    
    if (status === 'success') {
      return `${baseStyles} bg-green-600 hover:bg-green-700 text-white`;
    }
    
    if (status === 'error') {
      return `${baseStyles} bg-red-600 hover:bg-red-700 text-white`;
    }
    
    return `${baseStyles} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Button */}
      <button
        onClick={handleStartServices}
        disabled={loading}
        className={getButtonStyles()}
      >
        {getButtonContent()}
      </button>

      {/* Status Message */}
      {message && status !== 'idle' && (
        <div className={`
          flex items-center p-3 rounded-lg border text-sm
          ${status === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }
        `}>
          {status === 'success' ? (
            <MdCheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          ) : (
            <MdError className="w-4 h-4 mr-2 flex-shrink-0" />
          )}
          <span className="break-words">{message}</span>
        </div>
      )}

      {/* Warning Message */}
      {status === 'idle' && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-start">
            <MdWarning className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-400">
              <p className="font-medium mb-1">Advertencia</p>
              <p>Esta acción reiniciará todos los servicios WebSocket del sistema. Úsalo solo si es necesario.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
