import React, { useState, useRef, useEffect } from 'react';

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  loading?: boolean;
  error?: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ 
  length = 6, 
  onComplete, 
  loading = false,
  error 
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus en el primer input al montar
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Verificar si el código está completo
    if (values.every(value => value !== '') && values.join('').length === length) {
      onComplete(values.join(''));
    }
  }, [values, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    // Solo permitir dígitos
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1); // Solo el último dígito
    setValues(newValues);

    // Auto-focus al siguiente input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // Si está vacío y se presiona backspace, ir al anterior
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    const newValues = Array(length).fill('');
    for (let i = 0; i < pastedData.length; i++) {
      newValues[i] = pastedData[i];
    }
    setValues(newValues);
    
    // Focus en el siguiente input disponible o el último
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const clearCode = () => {
    setValues(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="code-input-container">
      <div className="code-input-grid">
        {values.map((value, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={loading}
            className={`code-input ${error ? 'error' : ''} ${loading ? 'loading' : ''}`}
            autoComplete="off"
          />
        ))}
      </div>
      
      {error && (
        <div className="code-input-error">
          {error}
        </div>
      )}
      
      {values.some(v => v) && (
        <button 
          type="button" 
          onClick={clearCode}
          className="code-input-clear"
          disabled={loading}
        >
          Limpiar código
        </button>
      )}

      <style jsx>{`
        .code-input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .code-input-grid {
          display: grid;
          grid-template-columns: repeat(${length}, 1fr);
          gap: 12px;
          justify-content: center;
        }

        .code-input {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          border: 2px solid #374151;
          border-radius: 12px;
          background: #1f2937;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .code-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          transform: scale(1.05);
        }

        .code-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .code-input.error {
          border-color: #ef4444;
          animation: shake 0.4s ease-in-out;
        }

        .code-input.loading {
          background: #374151;
        }

        .code-input-error {
          color: #ef4444;
          font-size: 14px;
          text-align: center;
          margin-top: 8px;
        }

        .code-input-clear {
          background: transparent;
          border: 1px solid #6b7280;
          color: #9ca3af;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .code-input-clear:hover:not(:disabled) {
          border-color: #6366f1;
          color: #6366f1;
        }

        .code-input-clear:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 480px) {
          .code-input {
            width: 40px;
            height: 50px;
            font-size: 20px;
          }
          
          .code-input-grid {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeInput;
