'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SocialLoginButtons({ onSuccess, onError }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false
      });

      if (result?.error) {
        onError?.('Error al iniciar sesión con Google');
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      onError?.('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black text-gray-400">O continúa con</span>
        </div>
      </div>

      {/* Botón de Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle className="w-5 h-5 mr-3" />
        {loading ? 'Conectando...' : 'Continuar con Google'}
      </button>

      {/* Espaciador para futuros botones sociales */}
      {/* 
      <button
        onClick={handleFacebookLogin}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaFacebook className="w-5 h-5 mr-3" />
        {loading ? 'Conectando...' : 'Continuar con Facebook'}
      </button>
      */}
    </div>
  );
}
