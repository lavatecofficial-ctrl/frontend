'use client';

import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Input({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false,
  className = ''
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 bg-gray-200/10 border-2 border-[#333333] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-all duration-200 ${className}`}
      style={{
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.08)',
        height: '40px', // Altura fija para coincidir con los botones
        boxSizing: 'border-box'
      }}
    />
  );
}
