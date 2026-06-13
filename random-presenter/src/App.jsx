import React, { useState, useEffect } from 'react';
import GachaMachine from './components/GachaMachine';
import Settings from './components/Settings';
import SecretModal from './components/SecretModal';
import * as storage from './utils/storage';
import './styles/index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [secretOrder, setSecretOrder] = useState([]);
  const [pickedStudents, setPickedStudents] = useState([]);
  const [title, setTitle] = useState('🎲 랜덤 발표자 뽑기');
  
  const [view, setView] = useState('main'); // 'main' or 'settings'
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  
  const [extractCount, setExtractCount] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentResult, setCurrentResult] = useState('');
  
  // Results array for displaying multiple picks
  const [recentPicks, setRecentPicks] = useState([]);

  // Load initial data
  useEffect(() => {
    setStudents(storage.getStudents());
    setSecretOrder(storage.getSecretOrder());
    setPickedStudents(storage.getPickedStudents());
    setTitle(storage.getTitle());
  }, []);

  // Save data on change
  useEffect(() => {
    storage.saveStudents(students);
  }, [students]);

  useEffect(() => {
    storage.saveTitle(title);
  }, [title]);

  useEffect(() => {
    storage.saveSecretOrder(secretOrder);
  }, [secretOrder]);

  useEffect(() => {
    storage.savePickedStudents(pickedStudents);
  }, [pickedStudents]);

  // Hotkey listener for secret modal (Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsSecretModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExtract = async () => {
    if (students.length === 0) {
      alert('설정에서 학생 명단을 먼저 추가해주세요.');
      return;
    }

    if (isExtracting) return;

    let availableStudents = students.filter(s => !pickedStudents.includes(s));
    
    // Auto reset if everyone is picked
    if (availableStudents.length === 0) {
      alert('모든 학생이 뽑혔습니다. 명단을 초기화합니다.');
      setPickedStudents([]);
      availableStudents = [...students];
    }

    // Determine who to pick
    const newPicks = [];
    let updatedSecretOrder = [...secretOrder];
    let currentAvailable = [...availableStudents];

    for (let i = 0; i < extractCount; i++) {
      if (currentAvailable.length === 0) break;

      let pickedStudent = '';

      // 1. Check secret order
      const nextSecret = updatedSecretOrder[0];
      if (nextSecret && currentAvailable.includes(nextSecret)) {
        pickedStudent = nextSecret;
        updatedSecretOrder.shift(); // Remove from secret queue
      } else {
        // 2. Random pick
        const randomIndex = Math.floor(Math.random() * currentAvailable.length);
        pickedStudent = currentAvailable[randomIndex];
      }

      newPicks.push(pickedStudent);
      currentAvailable = currentAvailable.filter(s => s !== pickedStudent);
    }

    // Animation & State Updates
    setIsExtracting(true);
    setCurrentResult(''); // Hide previous result

    // Simulate gacha animation wait
    setTimeout(() => {
      setIsExtracting(false);
      setCurrentResult(newPicks.join(', '));
      setRecentPicks(newPicks);
      setPickedStudents(prev => [...prev, ...newPicks]);
      setSecretOrder(updatedSecretOrder);
    }, 2500); // 2.5s for the animation to complete
  };

  return (
    <div className="app-container">
      {view === 'main' ? (
        <div className="flex-col" style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            <button className="secondary" onClick={() => setView('settings')}>명단 설정</button>
          </div>

          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              textAlign: 'center', 
              marginBottom: '2rem', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              color: 'inherit',
              width: '100%',
              padding: '0'
            }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem 2rem', borderRadius: '20px', boxShadow: 'var(--glass-shadow)' }}>
            <span style={{ fontWeight: '600' }}>추출 인원:</span>
            <input 
              type="number" 
              min="1" 
              max={students.length || 1}
              value={extractCount}
              onChange={(e) => setExtractCount(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '80px', textAlign: 'center' }}
            />
            <span>명</span>
          </div>

          <GachaMachine 
            onExtract={handleExtract} 
            isExtracting={isExtracting} 
            currentResult={currentResult} 
          />

          {recentPicks.length > 0 && !isExtracting && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h3>🎉 이번에 뽑힌 발표자 🎉</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--button-bg)' }}>
                {recentPicks.join(', ')}
              </p>
            </div>
          )}

          <div style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
            전체: {students.length}명 / 남은 인원: {students.length - pickedStudents.length}명
          </div>
        </div>
      ) : (
        <Settings 
          students={students} 
          setStudents={setStudents}
          setPickedStudents={setPickedStudents}
          onClose={() => setView('main')} 
        />
      )}

      <SecretModal 
        isOpen={isSecretModalOpen} 
        onClose={() => setIsSecretModalOpen(false)}
        students={students}
        secretOrder={secretOrder}
        setSecretOrder={setSecretOrder}
      />
    </div>
  );
}

export default App;
