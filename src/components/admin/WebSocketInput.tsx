import React, { useState, useEffect, useRef } from 'react';

interface WebSocketInputProps {
  onSave: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const WebSocketInput: React.FC<WebSocketInputProps> = ({ 
  onSave, 
  onCancel, 
  initialValue = '' 
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enfocar y seleccionar cuando se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = () => {
    onSave(value);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-gray-700/50 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
        placeholder="Ingresa la URL del WebSocket"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') handleCancel();
        }}
      />
      <button
        onClick={handleSave}
        className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm transition-colors duration-200"
      >
        Guardar
      </button>
      <button
        onClick={handleCancel}
        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors duration-200"
      >
        Cancelar
      </button>
    </div>
  );
};

export default WebSocketInput;
