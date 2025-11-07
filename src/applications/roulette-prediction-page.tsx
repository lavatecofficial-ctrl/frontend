import React, { useState } from 'react';
import { RoulettePrediction } from '../components/RoulettePrediction';
import { FaArrowLeft, FaCog } from 'react-icons/fa';
import './roulette-prediction-page.css';

const RoulettePredictionPage: React.FC = () => {
  const [selectedBookmaker, setSelectedBookmaker] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState(0);

  // Lista de bookmakers de ejemplo
  const bookmakers = [
    { id: 1, name: 'Evolution Gaming' },
    { id: 2, name: 'Pragmatic Play' },
    { id: 3, name: 'NetEnt' },
    { id: 4, name: 'Microgaming' },
  ];

  return (
    <div className="roulette-prediction-page">
      <div className="page-header">
        <div className="header-content">
          <button className="back-button">
            <FaArrowLeft />
            Volver
          </button>
          <h1>Predicción de Ruleta</h1>
          <button className="settings-button">
            <FaCog />
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="controls-section">
          <div className="bookmaker-selector">
            <label htmlFor="bookmaker-select">Seleccionar Bookmaker:</label>
            <select
              id="bookmaker-select"
              value={selectedBookmaker}
              onChange={(e) => setSelectedBookmaker(Number(e.target.value))}
            >
              {bookmakers.map((bookmaker) => (
                <option key={bookmaker.id} value={bookmaker.id}>
                  {bookmaker.name}
                </option>
              ))}
            </select>
          </div>

          <div className="number-selector">
            <label htmlFor="number-select">Número inicial:</label>
            <select
              id="number-select"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(Number(e.target.value))}
            >
              {Array.from({ length: 37 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="prediction-container">
          <RoulettePrediction 
            bookmakerId={selectedBookmaker} 
            initialNumber={selectedNumber}
          />
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>¿Cómo funciona?</h3>
            <p>
              Este sistema analiza el historial de la ruleta para predecir qué números 
              tienen mayor probabilidad de aparecer después de un número específico.
            </p>
            <ul>
              <li>Selecciona un número de la ruleta</li>
              <li>El sistema analiza las últimas 100 ocurrencias de ese número</li>
              <li>Muestra estadísticas de los números que aparecieron después</li>
              <li>Los datos se actualizan en tiempo real</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Estadísticas</h3>
            <p>
              Las predicciones se basan en análisis estadísticos de:
            </p>
            <ul>
              <li><strong>Colores:</strong> Rojo, Negro, Verde</li>
              <li><strong>Docenas:</strong> Primera (1-12), Segunda (13-24), Tercera (25-36)</li>
              <li><strong>Rangos:</strong> Bajo (1-18), Alto (19-36), Cero</li>
              <li><strong>Columnas:</strong> Primera, Segunda, Tercera</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoulettePredictionPage;
