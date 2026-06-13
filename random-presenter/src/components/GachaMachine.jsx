import React, { useState, useEffect } from 'react';
import '../styles/gacha.css';

const GachaMachine = ({ onExtract, onRedraw, isExtracting, currentResult }) => {
  const [turning, setTurning] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Generate some random capsules for the dome
  const capsules = Array.from({ length: 15 }).map((_, i) => {
    const colors = ['red', 'yellow', 'purple', ''];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return <div key={i} className={`capsule ${color}`}></div>;
  });

  useEffect(() => {
    if (isExtracting) {
      // Start animation
      setTurning(true);
      setShowResult(false);
      
      setTimeout(() => {
        setTurning(false);
        setDropping(true);
      }, 1000);

      setTimeout(() => {
        setShowResult(true);
      }, 2000);

      setTimeout(() => {
        setDropping(false);
      }, 2500);
    } else {
      setShowResult(false);
      setTurning(false);
      setDropping(false);
    }
  }, [isExtracting]);

  return (
    <div className="gacha-container">
      <div className={`machine-body ${turning ? 'turning' : ''} ${dropping ? 'dropping' : ''}`}>
        <div className="glass-dome">
          {capsules}
        </div>
        <div className="crank-container" onClick={!isExtracting ? onExtract : undefined} style={{ cursor: !isExtracting ? 'pointer' : 'default' }}>
          <div className="crank"></div>
        </div>
        <div className="dispenser"></div>
        <div className="capsule-drop"></div>
      </div>
      
      {showResult && currentResult && (
        <div className="result-reveal">
          <p className="result-name">{currentResult}</p>
          {onRedraw && (
            <button className="button-secondary" style={{ marginTop: 'var(--spacing-md)', fontSize: '18px', padding: '8px 20px' }} onClick={onRedraw}>
              다시 뽑기 🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GachaMachine;
