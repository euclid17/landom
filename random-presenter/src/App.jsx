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
  
  const [recentPicks, setRecentPicks] = useState([]);

  useEffect(() => {
    setStudents(storage.getStudents());
    setSecretOrder(storage.getSecretOrder());
    setPickedStudents(storage.getPickedStudents());
    setTitle(storage.getTitle());
  }, []);

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

  const executeExtraction = (currentPickedList) => {
    if (students.length === 0) {
      alert('설정에서 학생 명단을 먼저 추가해주세요.');
      return;
    }

    if (isExtracting) return;

    let availableStudents = students.filter(s => !currentPickedList.includes(s));
    
    if (availableStudents.length === 0) {
      alert('모든 학생이 뽑혔습니다. 명단을 초기화합니다.');
      setPickedStudents([]);
      availableStudents = [...students];
    }

    const newPicks = [];
    let updatedSecretOrder = [...secretOrder];
    let currentAvailable = [...availableStudents];

    for (let i = 0; i < extractCount; i++) {
      if (currentAvailable.length === 0) break;

      let pickedStudent = '';

      const nextSecret = updatedSecretOrder[0];
      if (nextSecret && currentAvailable.includes(nextSecret)) {
        pickedStudent = nextSecret;
        updatedSecretOrder.shift();
      } else {
        const randomIndex = Math.floor(Math.random() * currentAvailable.length);
        pickedStudent = currentAvailable[randomIndex];
      }

      newPicks.push(pickedStudent);
      currentAvailable = currentAvailable.filter(s => s !== pickedStudent);
    }

    setIsExtracting(true);
    setCurrentResult('');

    setTimeout(() => {
      setIsExtracting(false);
      setCurrentResult(newPicks.join(', '));
      setRecentPicks(newPicks);
      setPickedStudents(prev => {
        // Redraw 시에만 이전 기록이 삭제된 상태로 호출되지만, prev 기반 업데이트가 더 안전
        const filteredPrev = prev.filter(p => !currentPickedList.includes(p) ? true : currentPickedList.includes(p)); 
        // Simply use currentPickedList + newPicks
        return [...currentPickedList, ...newPicks];
      });
      setSecretOrder(updatedSecretOrder);
    }, 1800);
  };

  const handleExtract = () => {
    executeExtraction(pickedStudents);
  };

  const handleRedraw = () => {
    if (isExtracting) return;
    const remainingPicks = pickedStudents.filter(s => !recentPicks.includes(s));
    setPickedStudents(remainingPicks);
    setRecentPicks([]);
    setCurrentResult('');
    // 약간의 딜레이 후 재추출 (UI 리셋을 위해)
    setTimeout(() => {
      executeExtraction(remainingPicks);
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Top Nav (Monochrome Chrome) */}
      <header className="top-nav">
        <div style={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.5px' }}>Figma-style Picker</div>
        <div>
          {view === 'main' ? (
            <button className="button-secondary" onClick={() => setView('settings')}>명단 설정</button>
          ) : (
            <button className="button-primary" onClick={() => setView('main')}>완료 및 돌아가기</button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {view === 'main' ? (
        <main className="color-block-section lime" style={{ minHeight: '600px' }}>
          <input 
            type="text"
            className="display-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ 
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'inherit',
              textAlign: 'center',
              width: '100%',
              marginBottom: 'var(--spacing-xl)',
              fontFamily: 'inherit'
            }}
          />

          <div className="flex-row" style={{ alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <span className="body-lg" style={{ fontWeight: 500 }}>추출 인원:</span>
            <input 
              type="number" 
              min="1" 
              max={students.length || 1}
              value={extractCount}
              onChange={(e) => setExtractCount(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '80px', textAlign: 'center' }}
            />
            <span className="body-lg" style={{ fontWeight: 500 }}>명</span>
          </div>

          <GachaMachine 
            onExtract={handleExtract} 
            onRedraw={handleRedraw}
            isExtracting={isExtracting} 
            currentResult={currentResult} 
          />

          {recentPicks.length > 0 && !isExtracting && (
            <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
              <p className="eyebrow" style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--ink)' }}>🎉 이번에 뽑힌 발표자 🎉</p>
              <p className="headline" style={{ color: 'var(--primary)' }}>
                {recentPicks.join(', ')}
              </p>
            </div>
          )}

          <div className="caption" style={{ marginTop: 'var(--spacing-xxl)', color: 'var(--ink)', opacity: 0.7 }}>
            전체: {students.length}명 / 남은 인원: {students.length - pickedStudents.length}명
          </div>
        </main>
      ) : (
        <main className="color-block-section cream">
          <Settings 
            students={students} 
            setStudents={setStudents}
            setPickedStudents={setPickedStudents}
          />
        </main>
      )}

      {/* Footer (Monochrome) */}
      <footer style={{ width: '100%', maxWidth: '1280px', padding: 'var(--spacing-section) var(--spacing-xl)', textAlign: 'left' }}>
        <p className="caption" style={{ color: 'var(--ink)' }}>Press Shift + A to open secret menu</p>
      </footer>

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
