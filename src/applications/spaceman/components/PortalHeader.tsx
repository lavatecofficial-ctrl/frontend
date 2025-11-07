'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoHome } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { Bookmaker } from '@/types/portal';

interface PortalHeaderProps {
  selectedBookmaker: Bookmaker;
}

export default function PortalHeader({ selectedBookmaker }: PortalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="col-span-12 bg-gradient-to-r from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] rounded-[20px] flex items-center justify-between px-6 header">
      <div className="flex items-center gap-4">
        <Image
          src={selectedBookmaker.bookmakerImg}
          alt={`${selectedBookmaker.bookmaker} Logo`}
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
      
      {/* Burger Menu */}
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1 transition-all duration-300 cursor-pointer"
        >
          <span className={`block w-6 h-0.5 bg-purple-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-purple-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-purple-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute right-0 mt-2 w-48 rounded-lg transition-all duration-300 header-dropdown ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="py-2 bg-gradient-to-br from-[#1A0B1A] to-[#2A0B2A] border border-[#4C1D95] rounded-lg">
            <button
              onClick={handleGoHome}
              className="flex items-center w-full px-4 py-2 text-xs text-purple-300 hover:bg-purple-600/20 transition-colors duration-200 cursor-pointer"
            >
              <IoHome className="mr-3 text-lg" />
              Inicio
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-xs text-red-300 hover:bg-red-600/20 transition-colors duration-200 cursor-pointer"
            >
              <BiLogOutCircle className="mr-3 text-lg" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
