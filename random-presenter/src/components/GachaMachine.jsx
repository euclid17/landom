import React, { useState, useEffect } from 'react';
import { playTadaSound } from '../utils/sound';
import '../styles/gacha.css';

const GachaMachine = ({ onExtract, onRedraw, isExtracting, currentResult, extractCount, setExtractCount, maxCount }) => {
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

  useEffect(() => {
    if (showResult && currentResult) {
      playTadaSound();
    }
  }, [showResult, currentResult]);

  const getFontSize = (text) => {
    if (!text) return '120px';
    const len = text.length;
    if (len <= 4) return '120px';
    if (len <= 10) return '90px';
    if (len <= 20) return '60px';
    if (len <= 40) return '40px';
    return '24px';
  };

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
          <p 
            className="result-name" 
            style={{ 
              fontSize: getFontSize(currentResult), 
              whiteSpace: 'nowrap',
              padding: '0 20px'
            }}
          >
            {currentResult}
          </p>
          {onRedraw && (
            <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--surface-white)', padding: '4px 12px', borderRadius: 'var(--rounded-pill)', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '18px', color: 'var(--ink)' }}>명수:</span>
                <input 
                  type="number" 
                  min="1" 
                  max={maxCount || 1}
                  value={extractCount}
                  onChange={(e) => setExtractCount(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '60px', textAlign: 'center', fontSize: '18px', padding: '4px', border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}
                />
              </div>
              <button className="button-secondary" style={{ fontSize: '20px', padding: '10px 24px' }} onClick={onRedraw}>
                다시 뽑기 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GachaMachine;
