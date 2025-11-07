'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FaMeta } from 'react-icons/fa6';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { LuEyeClosed, LuEye } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { signIn } from 'next-auth/react';
import Input from './Input';
import CodeInput from '@/components/CodeInput';
import PasswordTooltip from '@/components/PasswordTooltip';
import { PasswordResetService } from '@/services/passwordResetService';
import LoginHeader from './LoginHeader';
import WinnerBlock from './WinnerBlock';
import { useRememberMe } from '@/hooks/useRememberMe';

// Dynamic import del CanvasEffect para evitar problemas con SSR
const CanvasEffect = dynamic(
  () => import('@/components/CanvasEffect'),
  { ssr: false }
);

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { login, register } = useAuth();
  
  // Hook personalizado para "Recordar usuario"
  const {
    email,
    password,
    rememberMe,
    hasStoredCreds,
    setEmail,
    setPassword,
    toggleRememberMe,
    handleLoginSuccess: handleRememberMeSuccess,
  } = useRememberMe(true); // Auto-cargar credenciales
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMetaHovered, setIsMetaHovered] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(true);
  const [transitionType, setTransitionType] = useState(''); // 'complete', 'simple', 'top'
  const [showFadeInBottom, setShowFadeInBottom] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para recuperación de contraseña
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Efecto para simular la carga de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Guardar credenciales si "Recordarme" está marcado
      handleRememberMeSuccess();
      // Si el login es exitoso, llamar al callback del padre
      onLogin(email, password);
    } catch (error: any) {
      console.error('Error en el login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailButtonClick = () => {
    console.log('🔵 Email button clicked - Starting simple transition');
    setIsTransitioning(true);
    setTransitionType('simple');
    setIsGoingBack(false);
    setShowFadeInBottom(false);
    
    setTimeout(() => {
      console.log('🔵 600ms passed - Setting showEmailForm to true');
      setShowEmailForm(true);
      setIsTransitioning(false);
      setTransitionType('');
      
      // Pequeño delay para que se vea el fade-in-bottom
      setTimeout(() => {
        setShowFadeInBottom(true);
      }, 50);
    }, 600);
  };

  const handleBackButtonClick = () => {
    console.log('🔴 Back button clicked - Starting top transition');
    setIsTransitioning(true);
    setTransitionType('top');
    setIsGoingBack(true);
    
    setTimeout(() => {
      console.log('🔴 600ms passed - Setting showEmailForm to false');
      setShowEmailForm(false);
      setIsTransitioning(false);
      setTransitionType('');
      setIsGoingBack(false);
    }, 600);
  };

  const handleRegisterButtonClick = () => {
    console.log('🟢 Register button clicked - Starting simple transition');
    setIsTransitioning(true);
    setTransitionType('simple');
    setIsGoingBack(false);
    setShowFadeInBottom(false);
    
    setTimeout(() => {
      console.log('🟢 600ms passed - Setting showEmailForm to false and showRegisterForm to true');
      setShowEmailForm(false);
      setShowRegisterForm(true);
      setIsTransitioning(false);
      setTransitionType('');
      
      // Pequeño delay para que se vea el fade-in-bottom
      setTimeout(() => {
        setShowFadeInBottom(true);
      }, 50);
    }, 600);
  };

  const handleRegisterBackButtonClick = () => {
    console.log('🟡 Register back button clicked - Starting top transition');
    setIsTransitioning(true);
    setTransitionType('top');
    setIsGoingBack(true);
    
    setTimeout(() => {
      console.log('🟡 600ms passed - Setting showRegisterForm to false');
      setShowRegisterForm(false);
      setIsTransitioning(false);
      setTransitionType('');
      setIsGoingBack(false);
    }, 600);
  };

  const handleLoginFromRegisterClick = () => {
    console.log('🟠 Login from register clicked - Starting simple transition');
    setIsTransitioning(true);
    setTransitionType('simple');
    setIsGoingBack(false);
    setShowFadeInBottom(false);
    
    setTimeout(() => {
      console.log('🟠 600ms passed - Setting showRegisterForm to false and showEmailForm to true');
      setShowRegisterForm(false);
      setShowEmailForm(true);
      setIsTransitioning(false);
      setTransitionType('');
      
      // Pequeño delay para que se vea el fade-in-bottom
      setTimeout(() => {
        setShowFadeInBottom(true);
      }, 50);
    }, 600);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(fullName, email, registerPassword);
      // Si el registro es exitoso, llamar al callback del padre
      onLogin(email, registerPassword);
    } catch (error: any) {
      console.error('Error en el registro:', error);
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones de recuperación de contraseña
  const handleForgotPasswordClick = () => {
    console.log('🔵 Forgot password clicked - Starting simple transition');
    setIsTransitioning(true);
    setTransitionType('simple');
    setIsGoingBack(false);
    setShowFadeInBottom(false);
    setResetEmail(email); // Pre-llenar con el email del login si existe
    setResetError('');
    setResetSuccess('');
    
    setTimeout(() => {
      console.log('🔵 600ms passed - Setting showPasswordReset to true');
      setShowEmailForm(false);
      setShowRegisterForm(false);
      setShowPasswordReset(true);
      setResetStep('email');
      setIsTransitioning(false);
      setTransitionType('');
      
      // Pequeño delay para que se vea el fade-in-bottom
      setTimeout(() => {
        setShowFadeInBottom(true);
      }, 50);
    }, 600);
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');

    try {
      const response = await PasswordResetService.requestPasswordReset(resetEmail);
      setResetSuccess(response.message);
      setResetStep('code');
      setResetCode(''); // Limpiar código anterior
    } catch (error: any) {
      setResetError(error.message || 'Error al enviar código de recuperación');
    } finally {
      setResetLoading(false);
    }
  };

  const handleCodeComplete = async (code: string) => {
    setResetCode(code);
    setResetLoading(true);
    setResetError('');
    
    // Verificar código automáticamente cuando se complete
    console.log('🔵 Auto-verifying code:', code);
    
    try {
      // Solo verificar el código, sin cambiar contraseña aún
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://grupoaviatorcolombia.app'}/api/auth/password-reset/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          code: code
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Código inválido');
      }

      // Si el código es válido, ir al paso de nueva contraseña
      setResetStep('password');
      setResetSuccess('Código verificado correctamente');
    } catch (error: any) {
      setResetError(error.message || 'Código inválido o expirado');
      setResetCode(''); // Limpiar código para que pueda intentar de nuevo
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || resetCode.length !== 6) {
      setResetError('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      const response = await PasswordResetService.verifyResetCode({
        email: resetEmail,
        code: resetCode,
        new_password: newPassword
      });
      setResetSuccess(response.message);
      setResetStep('success');
      
      // Llamar función de éxito
      handlePasswordResetSuccess();
    } catch (error: any) {
      setResetError(error.message || 'Error al verificar el código');
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackFromPasswordReset = () => {
    console.log('🔴 Back from password reset clicked - Starting top transition');
    setIsTransitioning(true);
    setTransitionType('top');
    setIsGoingBack(true);
    
    setTimeout(() => {
      console.log('🔴 600ms passed - Setting showPasswordReset to false');
      setShowPasswordReset(false);
      setShowEmailForm(true);
      setResetStep('email');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setResetError('');
      setResetSuccess('');
      setIsTransitioning(false);
      setTransitionType('');
      setIsGoingBack(false);
      
      // Pequeño delay para que se vea el fade-in-bottom
      setTimeout(() => {
        setShowFadeInBottom(true);
      }, 50);
    }, 600);
  };

  const handlePasswordResetSuccess = () => {
    // Después del éxito, volver al login después de 3 segundos
    setTimeout(() => {
      handleBackFromPasswordReset();
    }, 3000);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Usar Google OAuth directamente
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '481959811670-9hjg6l6ilia6n28fcoroupiic0egii9v.apps.googleusercontent.com';
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'email profile';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
      
      window.location.href = googleAuthUrl;
      
    } catch (error) {
      console.error('Error en login con Google:', error);
      setError('Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // NextAuth manejará la redirección automáticamente a /auth/callback
      await signIn('facebook');
      
    } catch (error) {
      console.error('Error en login con Facebook:', error);
      setError('Error al iniciar sesión con Facebook');
      setIsLoading(false);
    }
  };

  // Determinar las clases de Tailwind basadas en el tipo de transición
  const getContainerClass = () => {
    const isButtons = !showEmailForm && !showRegisterForm && !showPasswordReset;
    const baseClasses = 'w-full max-w-[420px] flex flex-col gap-4 p-8';
    
    if (isTransitioning) {
      if (transitionType === 'complete') {
        return `${baseClasses} transition-all duration-[600ms] ease-in-out opacity-0 translate-y-[300px]`;
      }
      if (transitionType === 'simple') {
        return `${baseClasses} transition-opacity duration-[600ms] ease-in-out opacity-0`;
      }
      if (transitionType === 'top') {
        return `${baseClasses} transition-all duration-[600ms] ease-in-out opacity-0 -translate-y-[300px]`;
      }
    }
    
    // Si no está en transición y hay un formulario activo con showFadeInBottom
    if ((showEmailForm || showRegisterForm || showPasswordReset) && !isTransitioning && showFadeInBottom) {
      return `${baseClasses} transition-all duration-[1000ms] cubic-bezier-[0.25,0.46,0.45,0.94] opacity-100 translate-y-0`;
    }
    
    // Estado por defecto
    if (isButtons) {
      return `${baseClasses} transition-opacity duration-[600ms] ease-in-out opacity-100`;
    }
    
    return `${baseClasses} transition-all duration-[1000ms] cubic-bezier-[0.25,0.46,0.45,0.94] opacity-0 translate-y-[300px]`;
  };

  // Debug logs
  console.log('🎨 CSS Classes:', {
    showEmailForm,
    showRegisterForm,
    isTransitioning,
    isGoingBack,
    transitionType,
    showFadeInBottom,
    containerClass: getContainerClass()
  });

  return (
    <div 
      className="min-h-screen relative w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='120' fill='%23000000'/%3E%3Cpath d='M120 0 L0 0 0 120' fill='none' stroke='%230d0d0d' stroke-width='4'/%3E%3Cg fill='%230d0d0d'%3E%3Ccircle cx='11' cy='11' r='1'/%3E%3Ccircle cx='22' cy='11' r='1'/%3E%3Ccircle cx='33' cy='11' r='1'/%3E%3Ccircle cx='44' cy='11' r='1'/%3E%3Ccircle cx='55' cy='11' r='1'/%3E%3Ccircle cx='66' cy='11' r='1'/%3E%3Ccircle cx='77' cy='11' r='1'/%3E%3Ccircle cx='88' cy='11' r='1'/%3E%3Ccircle cx='99' cy='11' r='1'/%3E%3Ccircle cx='110' cy='11' r='1'/%3E%3Ccircle cx='11' cy='22' r='1'/%3E%3Ccircle cx='22' cy='22' r='1'/%3E%3Ccircle cx='33' cy='22' r='1'/%3E%3Ccircle cx='44' cy='22' r='1'/%3E%3Ccircle cx='55' cy='22' r='1'/%3E%3Ccircle cx='66' cy='22' r='1'/%3E%3Ccircle cx='77' cy='22' r='1'/%3E%3Ccircle cx='88' cy='22' r='1'/%3E%3Ccircle cx='99' cy='22' r='1'/%3E%3Ccircle cx='110' cy='22' r='1'/%3E%3Ccircle cx='11' cy='33' r='1'/%3E%3Ccircle cx='22' cy='33' r='1'/%3E%3Ccircle cx='33' cy='33' r='1'/%3E%3Ccircle cx='44' cy='33' r='1'/%3E%3Ccircle cx='55' cy='33' r='1'/%3E%3Ccircle cx='66' cy='33' r='1'/%3E%3Ccircle cx='77' cy='33' r='1'/%3E%3Ccircle cx='88' cy='33' r='1'/%3E%3Ccircle cx='99' cy='33' r='1'/%3E%3Ccircle cx='110' cy='33' r='1'/%3E%3Ccircle cx='11' cy='44' r='1'/%3E%3Ccircle cx='22' cy='44' r='1'/%3E%3Ccircle cx='33' cy='44' r='1'/%3E%3Ccircle cx='44' cy='44' r='1'/%3E%3Ccircle cx='55' cy='44' r='1'/%3E%3Ccircle cx='66' cy='44' r='1'/%3E%3Ccircle cx='77' cy='44' r='1'/%3E%3Ccircle cx='88' cy='44' r='1'/%3E%3Ccircle cx='99' cy='44' r='1'/%3E%3Ccircle cx='110' cy='44' r='1'/%3E%3Ccircle cx='11' cy='55' r='1'/%3E%3Ccircle cx='22' cy='55' r='1'/%3E%3Ccircle cx='33' cy='55' r='1'/%3E%3Ccircle cx='44' cy='55' r='1'/%3E%3Ccircle cx='55' cy='55' r='1'/%3E%3Ccircle cx='66' cy='55' r='1'/%3E%3Ccircle cx='77' cy='55' r='1'/%3E%3Ccircle cx='88' cy='55' r='1'/%3E%3Ccircle cx='99' cy='55' r='1'/%3E%3Ccircle cx='110' cy='55' r='1'/%3E%3Ccircle cx='11' cy='66' r='1'/%3E%3Ccircle cx='22' cy='66' r='1'/%3E%3Ccircle cx='33' cy='66' r='1'/%3E%3Ccircle cx='44' cy='66' r='1'/%3E%3Ccircle cx='55' cy='66' r='1'/%3E%3Ccircle cx='66' cy='66' r='1'/%3E%3Ccircle cx='77' cy='66' r='1'/%3E%3Ccircle cx='88' cy='66' r='1'/%3E%3Ccircle cx='99' cy='66' r='1'/%3E%3Ccircle cx='110' cy='66' r='1'/%3E%3Ccircle cx='11' cy='77' r='1'/%3E%3Ccircle cx='22' cy='77' r='1'/%3E%3Ccircle cx='33' cy='77' r='1'/%3E%3Ccircle cx='44' cy='77' r='1'/%3E%3Ccircle cx='55' cy='77' r='1'/%3E%3Ccircle cx='66' cy='77' r='1'/%3E%3Ccircle cx='77' cy='77' r='1'/%3E%3Ccircle cx='88' cy='77' r='1'/%3E%3Ccircle cx='99' cy='77' r='1'/%3E%3Ccircle cx='110' cy='77' r='1'/%3E%3Ccircle cx='11' cy='88' r='1'/%3E%3Ccircle cx='22' cy='88' r='1'/%3E%3Ccircle cx='33' cy='88' r='1'/%3E%3Ccircle cx='44' cy='88' r='1'/%3E%3Ccircle cx='55' cy='88' r='1'/%3E%3Ccircle cx='66' cy='88' r='1'/%3E%3Ccircle cx='77' cy='88' r='1'/%3E%3Ccircle cx='88' cy='88' r='1'/%3E%3Ccircle cx='99' cy='88' r='1'/%3E%3Ccircle cx='110' cy='88' r='1'/%3E%3Ccircle cx='11' cy='99' r='1'/%3E%3Ccircle cx='22' cy='99' r='1'/%3E%3Ccircle cx='33' cy='99' r='1'/%3E%3Ccircle cx='44' cy='99' r='1'/%3E%3Ccircle cx='55' cy='99' r='1'/%3E%3Ccircle cx='66' cy='99' r='1'/%3E%3Ccircle cx='77' cy='99' r='1'/%3E%3Ccircle cx='88' cy='99' r='1'/%3E%3Ccircle cx='99' cy='99' r='1'/%3E%3Ccircle cx='110' cy='99' r='1'/%3E%3Ccircle cx='11' cy='110' r='1'/%3E%3Ccircle cx='22' cy='110' r='1'/%3E%3Ccircle cx='33' cy='110' r='1'/%3E%3Ccircle cx='44' cy='110' r='1'/%3E%3Ccircle cx='55' cy='110' r='1'/%3E%3Ccircle cx='66' cy='110' r='1'/%3E%3Ccircle cx='77' cy='110' r='1'/%3E%3Ccircle cx='88' cy='110' r='1'/%3E%3Ccircle cx='99' cy='110' r='1'/%3E%3Ccircle cx='110' cy='110' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat'
      }}>
      {/* Canvas Effect Background */}
      <CanvasEffect />
      
      {/* Header */}
      <LoginHeader />
      
      {/* Contenedor principal con CSS Grid - 2 columnas */}
      <div 
        className={`relative w-full grid lg:grid-cols-2 grid-cols-1 grid-rows-1 gap-4 p-2 box-border overflow-hidden transition-all duration-700 ease-out origin-bottom ${
          isPageLoaded 
            ? 'opacity-100 transform translate-y-0 scale-100' 
            : 'opacity-0 transform translate-y-8 scale-95'
        }`}
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* Contenedor 1 - Winner Block (Info Block) - Oculto en < 1024px */}
        <div className="hidden lg:flex h-full items-center justify-center overflow-hidden p-4 box-border">
          <WinnerBlock />
        </div>

        {/* Contenedor 2 - Formulario de Login - Centrado en < 1024px */}
        <div className="relative z-20 h-full flex items-center justify-center overflow-hidden p-4 box-border">
            <div className={getContainerClass()}>
              {/* Header - Estilos V2 con Tailwind */}
              <div className="text-center mb-4">
                <h2 className="text-[28px] font-bold text-white m-0 mb-[6px] leading-tight" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                  {showPasswordReset 
                    ? '¡Recupera tu cuenta!' 
                    : showRegisterForm 
                    ? '¡Empieza a ganar!' 
                    : showEmailForm 
                    ? '¡Bienvenido de vuelta!' 
                    : '¡Bienvenido!'}
                </h2>
                <p className="text-[14px] font-normal text-[#9ca3af] m-0 leading-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                  {showPasswordReset 
                    ? 'Te enviaremos un enlace de recuperación' 
                    : showRegisterForm 
                    ? 'Crea tu cuenta y comienza a ganar' 
                    : showEmailForm 
                    ? 'Accede y sigue conquistando' 
                    : 'Elige tu forma de acceder'}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {!showEmailForm && !showRegisterForm && !showPasswordReset ? (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-white border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] relative"
                      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FcGoogle className="text-[22px] flex-shrink-0 grayscale-[100%] brightness-200 transition-all duration-300 hover:grayscale-0 hover:brightness-100" />
                        <span>{isLoading ? 'Conectando...' : 'Continuar con Google'}</span>
                      </div>
                      <div className="w-px h-[30px] flex-shrink-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.2)] to-transparent" style={{ boxShadow: '1px 0 0 rgba(0,0,0,0.3), -1px 0 0 rgba(255,255,255,0.1)' }}></div>
                      <div 
                        className="flex items-center justify-center w-10 h-10 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-full flex-shrink-0 text-xl transition-all duration-300 hover:bg-[rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.2)]" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFacebookLogin();
                        }}
                      >
                        <FaMeta className="text-[#0866FF]" />
                      </div>
                    </button>
          
                    <button
                      type="button"
                      onClick={handleEmailButtonClick}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-white border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <MdOutlineMailOutline className="text-[22px] flex-shrink-0" />
                        <span>Continuar con Email</span>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-full flex-shrink-0 text-xl transition-all duration-300">
                        <IoIosArrowRoundForward />
                      </div>
                    </button>

                    {/* Terms */}
                    <p className="text-center text-[11px] leading-[1.5] m-0 bg-gradient-to-br from-[rgba(100,100,100,0.6)] to-[rgba(40,40,40,0.8)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Al continuar con el acceso, confirmas que has leído y aceptas nuestros{' '}
                      <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Términos y Condiciones de Servicio</span> y{' '}
                      <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Política de Privacidad</span>
                    </p>

                    {/* Copyright */}
                    <p className="text-center text-[10px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(80,80,80,0.5)] to-[rgba(30,30,30,0.7)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      © 2025 grupoaviatorcolombia. Todos los derechos reservados.
                    </p>

                    {/* Version */}
                    <p className="text-center text-[9px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(120,120,120,0.7)] to-[rgba(70,70,70,0.9)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Versión 6.0.0
                    </p>
                  </>
                ) : showEmailForm ? (
                  <>
                    {/* Form Header */}
                    <div className="flex items-center justify-between w-full gap-3">
                      <button
                        type="button"
                        onClick={handleBackButtonClick}
                        className="flex items-center justify-center w-10 h-10 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-full text-white cursor-pointer transition-all duration-300 flex-shrink-0 hover:bg-[rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.2)]"
                      >
                        <IoIosArrowRoundForward style={{ transform: 'rotate(180deg)' }} />
                      </button>
                     
                      <p className="text-[13px] text-[rgba(120,120,120,0.9)] m-0 flex-1 text-right" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                        ¿Aún no estás ganando?{' '}
                        <span className="text-white font-medium cursor-pointer transition-all duration-150 bg-[rgba(20,20,20,0.6)] py-1 px-2 rounded-[24px] border border-[rgba(255,255,255,0.08)] inline-block text-[12px] hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)]" onClick={handleRegisterButtonClick}>
                          Regístrate
                        </span>
                      </p>
                    </div>
                    
                    {/* Email Form Container */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
                        {/* Email Input */}
                        <div className="w-full relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            required
                            className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                          />
                        </div>

                        {/* Password Input */}
                        <div className="w-full relative mb-0">
                          <div className="relative w-full">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Contraseña"
                              required
                              className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                              style={{ paddingRight: '40px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-transparent border-none text-[rgba(120,120,120,0.9)] cursor-pointer p-[6px] flex items-center justify-center transition-colors duration-150 text-[15px] z-10 hover:text-[rgba(160,160,160,1)]"
                            >
                              {showPassword ? <LuEyeClosed /> : <LuEye />}
                            </button>
                          </div>
                        </div>
                        
                        {/* Form Options - Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between w-full text-[12px]" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                          {/* Remember Me Checkbox */}
                          <div className="flex items-center gap-2 cursor-pointer text-[rgba(120,120,120,0.9)] transition-colors duration-150 select-none hover:text-[rgba(160,160,160,1)]" onClick={toggleRememberMe}>
                            <div className={`w-[18px] h-[18px] rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-150 flex-shrink-0 ${rememberMe ? 'border-[rgba(0,255,136,0.5)] bg-[rgba(0,255,136,0.1)]' : ''}`}>
                              {rememberMe && <div className="w-[10px] h-[10px] rounded-full bg-[rgba(0,255,136,0.8)]"></div>}
                            </div>
                            <span>Recuérdame</span>
                          </div>

                          {/* Forgot Password */}
                          <span className="text-[rgba(120,120,120,0.9)] cursor-pointer transition-colors duration-150 hover:text-[rgba(160,160,160,1)] hover:underline" onClick={handleForgotPasswordClick}>
                            ¿Olvidaste tu contraseña?
                          </span>
                        </div>
                        
                        {/* Mostrar error si existe */}
                        {error && (
                          <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl mt-3 mb-3">
                            <p className="text-[#f87171] text-sm m-0">{error}</p>
                          </div>
                        )}
                        
                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 px-4 text-[15px] font-medium text-white bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] h-12 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                        >
                          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>

                        {/* Terms */}
                        <p className="text-center text-[11px] leading-[1.5] m-0 bg-gradient-to-br from-[rgba(100,100,100,0.6)] to-[rgba(40,40,40,0.8)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Al continuar con el acceso, confirmas que has leído y aceptas nuestros{' '}
                          <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Términos y Condiciones de Servicio</span> y{' '}
                          <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Política de Privacidad</span>
                        </p>

                        {/* Copyright */}
                        <p className="text-center text-[10px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(80,80,80,0.5)] to-[rgba(30,30,30,0.7)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          © 2025 grupoaviatorcolombia. Todos los derechos reservados.
                        </p>

                        {/* Version */}
                        <p className="text-center text-[9px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(120,120,120,0.7)] to-[rgba(70,70,70,0.9)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Versión 6.0.0
                        </p>
                      </form>
                    </div>
                  </>
                ) : showRegisterForm ? (
                  // Contenedor para el formulario de registro
                  <>
                    {/* Form Header */}
                    <div className="flex items-center justify-between w-full gap-3">
                      <button
                        type="button"
                        onClick={handleRegisterBackButtonClick}
                        className="flex items-center justify-center w-10 h-10 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-full text-white cursor-pointer transition-all duration-300 flex-shrink-0 hover:bg-[rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.2)]"
                      >
                        <IoIosArrowRoundForward style={{ transform: 'rotate(180deg)' }} />
                      </button>
                     
                      <p className="text-[13px] text-[rgba(120,120,120,0.9)] m-0 flex-1 text-right" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                        ¿Ya tienes cuenta?{' '}
                        <span className="text-white font-medium cursor-pointer transition-all duration-150 bg-[rgba(20,20,20,0.6)] py-1 px-2 rounded-[24px] border border-[rgba(255,255,255,0.08)] inline-block text-[12px] hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)]" onClick={handleLoginFromRegisterClick}>
                          Iniciar Sesión
                        </span>
                      </p>
                    </div>
                    
                    {/* Register Form Container */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-[10px]">
                        {/* Name Row - Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-[10px] w-full">
                          <div className="w-full relative">
                            <input
                              type="text"
                              value={fullName.split(' ')[0] || ''}
                              onChange={(e) => {
                                const lastName = fullName.split(' ').slice(1).join(' ');
                                setFullName(e.target.value + (lastName ? ' ' + lastName : ''));
                              }}
                              placeholder="Nombre"
                              required
                              className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-white border border-[rgba(100,100,100,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(120,120,120,0.7)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)]"
                              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                            />
                          </div>
                          <div className="w-full relative">
                            <input
                              type="text"
                              value={fullName.split(' ').slice(1).join(' ') || ''}
                              onChange={(e) => {
                                const firstName = fullName.split(' ')[0] || '';
                                setFullName(firstName + (e.target.value ? ' ' + e.target.value : ''));
                              }}
                              placeholder="Apellido"
                              required
                              className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-white border border-[rgba(100,100,100,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(120,120,120,0.7)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)]"
                              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                            />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="w-full relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                          />
                        </div>

                        {/* Password Input */}
                        <div className="w-full relative">
                          <div className="relative w-full">
                            <input
                              type={showRegisterPassword ? "text" : "password"}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="Contraseña"
                              required
                              className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                              style={{ paddingRight: '80px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                            />
                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-transparent border-none text-[rgba(120,120,120,0.9)] cursor-pointer p-[6px] flex items-center justify-center transition-colors duration-150 text-[15px] z-10 hover:text-[rgba(160,160,160,1)]"
                              >
                                {showRegisterPassword ? <LuEyeClosed /> : <LuEye />}
                              </button>
                              <PasswordTooltip showForRegistration={true} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Mostrar error si existe */}
                        {error && (
                          <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl mt-3 mb-3">
                            <p className="text-[#f87171] text-sm m-0">{error}</p>
                          </div>
                        )}
                        
                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 px-4 text-[15px] font-medium text-white bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] h-12 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                        >
                          {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>

                        {/* Terms */}
                        <p className="text-center text-[11px] leading-[1.5] m-0 bg-gradient-to-br from-[rgba(100,100,100,0.6)] to-[rgba(40,40,40,0.8)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Al continuar con el acceso, confirmas que has leído y aceptas nuestros{' '}
                          <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Términos y Condiciones de Servicio</span> y{' '}
                          <span className="bg-gradient-to-br from-[rgba(120,120,120,0.8)] to-[rgba(60,60,60,1)] bg-clip-text text-transparent font-medium cursor-pointer transition-all duration-150 hover:bg-gradient-to-br hover:from-[rgba(140,140,140,1)] hover:to-[rgba(80,80,80,1)] hover:underline" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Política de Privacidad</span>
                        </p>

                        {/* Copyright */}
                        <p className="text-center text-[10px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(80,80,80,0.5)] to-[rgba(30,30,30,0.7)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          © 2025 grupoaviatorcolombia. Todos los derechos reservados.
                        </p>

                        {/* Version */}
                        <p className="text-center text-[9px] leading-[1.5] m-0 font-normal bg-gradient-to-br from-[rgba(120,120,120,0.7)] to-[rgba(70,70,70,0.9)] bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Versión 6.0.0
                        </p>
                      </form>
                    </div>
                  </>
                ) : (
                  // Contenedor para el formulario de recuperación de contraseña
                  <>
                    {/* Form Header */}
                    <div className="flex items-center justify-between w-full gap-3">
                      <button
                        type="button"
                        onClick={handleBackFromPasswordReset}
                        className="flex items-center justify-center w-10 h-10 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-full text-white cursor-pointer transition-all duration-300 flex-shrink-0 hover:bg-[rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.2)]"
                      >
                        <IoIosArrowRoundForward style={{ transform: 'rotate(180deg)' }} />
                      </button>
                     
                      <p className="text-[13px] text-[rgba(120,120,120,0.9)] m-0 flex-1 text-right" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                        ¿Recordaste tu contraseña?{' '}
                        <span className="text-white font-medium cursor-pointer transition-all duration-150 bg-[rgba(20,20,20,0.6)] py-1 px-2 rounded-[24px] border border-[rgba(255,255,255,0.08)] inline-block text-[12px] hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)]" onClick={handleBackFromPasswordReset}>
                          Iniciar Sesión
                        </span>
                      </p>
                    </div>

                    {/* Password Reset Form Container */}
                    <div className="flex flex-col gap-[10px] w-full">
                      {/* Paso 1: Solicitar email */}
                      {resetStep === 'email' && (
                        <form onSubmit={handleRequestPasswordReset} className="flex flex-col gap-[10px]">
                          {/* Email Input */}
                          <div className="w-full relative">
                            <input
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="Email"
                              required
                              className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                            />
                          </div>
                          
                          {/* Mostrar error si existe */}
                          {resetError && (
                            <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl mt-3 mb-3">
                              <p className="text-[#f87171] text-sm m-0">{resetError}</p>
                            </div>
                          )}
                          
                          {/* Mostrar éxito si existe */}
                          {resetSuccess && (
                            <div className="p-3 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-xl mt-3 mb-3">
                              <p className="text-[#34d399] text-sm m-0">{resetSuccess}</p>
                            </div>
                          )}
                          
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={resetLoading}
                            className="w-full py-3 px-4 text-[15px] font-medium text-white bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] h-12 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                          >
                            {resetLoading ? 'Enviando...' : 'Enviar Código'}
                          </button>
                        </form>
                      )}

                      {/* Paso 2: Solo verificar código */}
                      {resetStep === 'code' && (
                        <div className="mb-5">
                          <div className="mb-6 text-center">
                            <h3 className="text-[20px] font-bold text-white mb-2" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>Verificar Código</h3>
                            <p className="text-[#9ca3af] text-[14px]" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>Ingresa el código de 6 dígitos que enviamos a tu email</p>
                          </div>

                          <div className="mb-4">
                            <CodeInput
                              onComplete={handleCodeComplete}
                              loading={resetLoading}
                              error={resetError}
                            />
                          </div>
                          
                          {/* Mostrar error si existe */}
                          {resetError && (
                            <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl mt-3 mb-3">
                              <p className="text-[#f87171] text-sm m-0">{resetError}</p>
                            </div>
                          )}
                          
                          {/* Mostrar éxito si existe */}
                          {resetSuccess && (
                            <div className="p-3 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-xl mt-3 mb-3">
                              <p className="text-[#34d399] text-sm m-0">{resetSuccess}</p>
                            </div>
                          )}

                          {resetLoading && (
                            <div className="mt-4 text-center">
                              <p className="text-[#9ca3af] text-[14px]">Verificando código...</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Paso 3: Nueva contraseña */}
                      {resetStep === 'password' && (
                        <form onSubmit={handleVerifyCodeSubmit} className="flex flex-col gap-[10px]">
                          {/* Password Input */}
                          <div className="w-full relative">
                            <div className="relative w-full">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nueva contraseña"
                                required
                                minLength={8}
                                className="w-full px-3 py-2 text-[15px] font-medium bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] text-[rgba(180,180,180,1)] border border-[rgba(180,180,180,0.3)] rounded-[24px] outline-none transition-all duration-300 h-12 placeholder:text-[rgba(180,180,180,0.5)] focus:border-[rgba(0,255,136,0.5)] focus:bg-[rgba(20,20,20,0.7)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                                style={{ paddingRight: '80px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                              />
                              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-transparent border-none text-[rgba(120,120,120,0.9)] cursor-pointer p-[6px] flex items-center justify-center transition-colors duration-150 text-[15px] z-10 hover:text-[rgba(160,160,160,1)]"
                                >
                                  {showNewPassword ? <LuEyeClosed /> : <LuEye />}
                                </button>
                                <PasswordTooltip showForRegistration={true} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Mostrar error si existe */}
                          {resetError && (
                            <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl mt-3 mb-3">
                              <p className="text-[#f87171] text-sm m-0">{resetError}</p>
                            </div>
                          )}
                          
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={resetLoading || !newPassword}
                            className="w-full py-3 px-4 text-[15px] font-medium text-white bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[24px] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] h-12 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}
                          >
                            {resetLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                          </button>
                        </form>
                      )}

                      {/* Paso 4: Éxito */}
                      {resetStep === 'success' && (
                        <div className="text-center">
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Contraseña Actualizada</h3>
                            <p className="text-gray-400 text-sm">Tu contraseña ha sido cambiada exitosamente</p>
                          </div>
                          
                          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-green-400 font-medium">{resetSuccess}</p>
                          </div>
                          
                          <p className="text-gray-300 mb-6">
                            Ahora puedes iniciar sesión con tu nueva contraseña
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}


