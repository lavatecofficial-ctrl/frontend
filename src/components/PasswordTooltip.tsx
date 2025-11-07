import React, { useState } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface PasswordTooltipProps {
  showForRegistration?: boolean;
}

export default function PasswordTooltip({ showForRegistration = true }: PasswordTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Solo mostrar tooltip para registro y nueva contraseña, no para login
  if (!showForRegistration) {
    return (
      <IoMdInformationCircleOutline className="w-4 h-4 text-gray-400 cursor-pointer" />
    );
  }

  return (
    <div className="relative">
      <IoMdInformationCircleOutline 
        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors duration-200" 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      
      {showTooltip && (
        <div className="absolute right-0 bottom-full mb-2 w-64 z-50">
          <div className="bg-[#1a1b1b] border border-gray-700 rounded-lg p-3 shadow-xl">
            <div className="text-white text-sm font-medium mb-2">
              Requisitos de contraseña:
            </div>
            <ul className="text-gray-300 text-xs space-y-1">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                Mínimo 8 caracteres
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                Al menos 1 número
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                Al menos 1 símbolo (!@#$%^&*)
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                Combina letras y números
              </li>
            </ul>
            {/* Flecha apuntando hacia abajo */}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}
