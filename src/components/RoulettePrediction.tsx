import React, { useState, useEffect } from 'react';
import { useRoulettePrediction } from '../hooks/useRoulettePrediction';
import { FaCircle, FaChartBar, FaHistory, FaWifi, FaWifiSlash, FaSync } from 'react-icons/fa';
import './RoulettePrediction.css';

interface RoulettePredictionProps {
  bookmakerId: number;
  initialNumber?: number;
}

export const RoulettePrediction: React.FC<RoulettePredictionProps> = ({ 
  bookmakerId, 
  initialNumber = 0 
}) => {
  const [selectedNumber, setSelectedNumber] = useState(initialNumber);
  const {
    isConnected,
    predictionData,
    historyData,
    error,
    subscribePrediction,
    unsubscribePrediction,
    getLatestHistory,
    requestImmediateUpdate,
  } = useRoulettePrediction();

  useEffect(() => {
    if (selectedNumber >= 0 && selectedNumber <= 36) {
      subscribePrediction(bookmakerId, selectedNumber);
    }
    
    return () => {
      if (selectedNumber >= 0 && selectedNumber <= 36) {
        unsubscribePrediction(bookmakerId, selectedNumber);
      }
    };
  }, [bookmakerId, selectedNumber, subscribePrediction, unsubscribePrediction]);

  useEffect(() => {
    getLatestHistory(bookmakerId);
  }, [bookmakerId, getLatestHistory]);

  const getColorClass = (number: number) => {
    if (number === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
  };

  const renderNumberGrid = () => {
    const numbers = [];
    for (let i = 0; i <= 36; i++) {
      numbers.push(i);
    }

    return (
      <div className="number-grid">
        {numbers.map((number) => (
          <button
            key={number}
            className={`number-button ${getColorClass(number)} ${selectedNumber === number ? 'selected' : ''}`}
            onClick={() => setSelectedNumber(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  const renderPredictionStats = () => {
    if (!predictionData || predictionData.number !== selectedNumber) {
      return <div className="no-data">Selecciona un número para ver las predicciones</div>;
    }

    const { percentages, nextNumbers } = predictionData.data;

    const handleRefresh = () => {
      requestImmediateUpdate(bookmakerId, selectedNumber);
    };

    return (
      <div className="prediction-stats">
        <div className="prediction-header">
          <h3>Predicciones para el número {selectedNumber}</h3>
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            title="Actualizar inmediatamente"
          >
            <FaSync />
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-section">
            <h4><FaCircle className="icon" /> Colores</h4>
            <div className="stat-item">
              <span className="label red">Rojo:</span>
              <span className="value">{percentages.colors.red}%</span>
            </div>
            <div className="stat-item">
              <span className="label black">Negro:</span>
              <span className="value">{percentages.colors.black}%</span>
            </div>
            <div className="stat-item">
              <span className="label green">Verde:</span>
              <span className="value">{percentages.colors.green}%</span>
            </div>
          </div>

          <div className="stat-section">
            <h4><FaChartBar className="icon" /> Docenas</h4>
            <div className="stat-item">
              <span className="label">Primera (1-12):</span>
              <span className="value">{percentages.dozens.first}%</span>
            </div>
            <div className="stat-item">
              <span className="label">Segunda (13-24):</span>
              <span className="value">{percentages.dozens.second}%</span>
            </div>
            <div className="stat-item">
              <span className="label">Tercera (25-36):</span>
              <span className="value">{percentages.dozens.third}%</span>
            </div>
          </div>

          <div className="stat-section">
            <h4><FaChartBar className="icon" /> Rangos</h4>
            <div className="stat-item">
              <span className="label">Bajo (1-18):</span>
              <span className="value">{percentages.ranges.low}%</span>
            </div>
            <div className="stat-item">
              <span className="label">Alto (19-36):</span>
              <span className="value">{percentages.ranges.high}%</span>
            </div>
            <div className="stat-item">
              <span className="label">Cero:</span>
              <span className="value">{percentages.ranges.zero}%</span>
            </div>
          </div>
        </div>

        <div className="next-numbers">
          <h4>Últimos números después del {selectedNumber} ({nextNumbers.length} ocurrencias)</h4>
          <div className="numbers-list">
            {nextNumbers.slice(0, 10).map((item, index) => (
              <span
                key={index}
                className={`number-chip ${getColorClass(item.number)}`}
                title={`${item.number} - ${item.timestamp}`}
              >
                {item.number}
              </span>
            ))}
            {nextNumbers.length > 10 && (
              <span className="more-indicator">+{nextNumbers.length - 10} más</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!historyData) {
      return <div className="no-data">Cargando historial...</div>;
    }

    return (
      <div className="history-section">
        <h3><FaHistory className="icon" /> Historial Reciente</h3>
        <div className="history-list">
          {historyData.history.slice(0, 20).map((round) => (
            <div
              key={round.id}
              className={`history-item ${getColorClass(round.number)}`}
              title={`${round.number} - ${round.timestamp}`}
            >
              {round.number}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="roulette-prediction modern-scroll">
      <div className="header">
        <h2>Predicción de Ruleta</h2>
        <div className="connection-status">
          {isConnected ? (
            <FaWifi className="connected" title="Conectado" />
          ) : (
            <FaWifiSlash className="disconnected" title="Desconectado" />
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="content">
        <div className="number-selection">
          <h3>Selecciona un número</h3>
          {renderNumberGrid()}
        </div>

        <div className="prediction-content">
          {renderPredictionStats()}
        </div>

        <div className="history-content">
          {renderHistory()}
        </div>
      </div>
    </div>
  );
};
