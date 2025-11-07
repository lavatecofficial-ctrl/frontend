import React, { useState, useEffect, useRef } from 'react';

interface EditableWebSocketInputProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  borderColor?: string;
}

const EditableWebSocketInput: React.FC<EditableWebSocketInputProps> = ({ 
  value, 
  onSave, 
  onCancel,
  borderColor = "border-blue-400"
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Reset input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`flex-1 bg-gray-700/50 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:${borderColor}`}
          placeholder="Ingresa la URL del WebSocket"
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
  }

  return (
    <div className="flex items-center justify-between">
      <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-2 flex-1 mr-3">
        <span className="text-sm text-white max-w-xs truncate">
          {value || 'No disponible'}
        </span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors duration-200"
      >
        Editar
      </button>
    </div>
  );
};

export default EditableWebSocketInput;
