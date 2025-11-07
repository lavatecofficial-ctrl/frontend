'use client';

import React from 'react';
import Image from 'next/image';
import { FaTelegram, FaFacebook } from 'react-icons/fa';

export const LoginHeader: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between lg:justify-between justify-center px-8 py-3 h-[60px]">
      {/* Logo - Centrado en mobile, izquierda en desktop */}
      <div className="flex items-center h-full">
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={50}
          className="object-contain h-[45px] w-auto"
          priority
        />
      </div>

      {/* Redes Sociales - Oculto en < 1024px */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[13px] text-[rgba(180,180,180,0.9)] font-medium" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
          Nuestras redes:
        </span>
        <a
          href="https://t.me/your-telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-full text-white transition-all duration-300 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:scale-110"
        >
          <FaTelegram className="text-[16px]" />
        </a>
        <a
          href="https://facebook.com/your-page"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-full text-white transition-all duration-300 hover:bg-[rgba(30,30,30,0.7)] hover:border-[rgba(255,255,255,0.15)] hover:scale-110"
        >
          <FaFacebook className="text-[16px]" />
        </a>
      </div>
    </header>
  );
};

export default LoginHeader;
