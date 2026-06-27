import React, { useState, useEffect } from 'react';
import GachaMachine from './components/GachaMachine';
import Settings from './components/Settings';
import SecretModal from './components/SecretModal';
import EthicsGate from './components/EthicsGate';
import PolicyModal from './components/PolicyModal';
import * as storage from './utils/storage';
import './styles/index.css';

function App() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState('terms'); // 'terms' or 'privacy'
  const [hasAgreedToEthics, setHasAgreedToEthics] = useState(() => {
    return sessionStorage.getItem('agreedToEthics') === 'true';
  });
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

  const executeExtraction = (initialPickedList, excludedPicks = []) => {
    if (students.length === 0) {
      alert('설정에서 학생 명단을 먼저 추가해주세요.');
      return;
    }

    if (isExtracting) return;

    let currentPickedList = [...initialPickedList];
    let availableStudents = students.filter(s => !currentPickedList.includes(s));
    
    if (availableStudents.length === 0) {
      currentPickedList = [];
      availableStudents = [...students];
    }

    let currentAvailable = availableStudents.filter(s => !excludedPicks.includes(s));
    
    if (currentAvailable.length === 0 && excludedPicks.length > 0) {
      currentPickedList = [];
      availableStudents = [...students];
      currentAvailable = availableStudents.filter(s => !excludedPicks.includes(s));
      
      if (currentAvailable.length === 0) {
        currentAvailable = [...availableStudents];
      }
    } else if (currentAvailable.length === 0) {
      currentAvailable = [...availableStudents];
    }

    const newPicks = [];
    let updatedSecretOrder = [...secretOrder];

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
    executeExtraction(pickedStudents, []);
  };

  const handleRedraw = () => {
    if (isExtracting) return;
    
    // 다시 뽑기 시, 방금 나온 사람들은 '건너뛰기(결석 등)' 처리된 것으로 간주하여
    // pickedStudents(뽑힌 명단)에 그대로 둡니다. 
    // 이렇게 하면 남은 인원 수에서 정상적으로 차감되고, 영구적으로 다시 뽑히지 않습니다.
    setRecentPicks([]);
    setCurrentResult('');
    
    // 약간의 딜레이 후 재추출 (기존에 뽑힌 사람들을 제외하고 새롭게 뽑음)
    setTimeout(() => {
      executeExtraction(pickedStudents, []);
    }, 100);
  };

  const handleEthicsAgree = () => {
    sessionStorage.setItem('agreedToEthics', 'true');
    setHasAgreedToEthics(true);
  };

  if (!hasAgreedToEthics) {
    return <EthicsGate onAgree={handleEthicsAgree} />;
  }

  return (
    <div className="app-container">
      {/* Top Nav */}
      <header className="top-nav" style={{ justifyContent: 'flex-end' }}>
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
              fontFamily: 'inherit',
              fontSize: '72px',
              boxShadow: 'none',
              textShadow: '2px 2px 0px #fff'
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
            extractCount={extractCount}
            setExtractCount={setExtractCount}
            maxCount={students.length}
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
      <footer style={{ 
        width: '100%', 
        maxWidth: '1280px', 
        padding: 'var(--spacing-xl)', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        borderTop: '1px solid var(--hairline)',
        marginTop: 'var(--spacing-xxl)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
          <button 
            className="footer-link" 
            onClick={() => { setCurrentPolicy('terms'); setIsPolicyModalOpen(true); }}
          >
            이용약관
          </button>
          <button 
            className="footer-link" 
            onClick={() => { setCurrentPolicy('privacy'); setIsPolicyModalOpen(true); }}
          >
            개인정보처리방침
          </button>
        </div>
        
        <div className="caption" style={{ color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.6' }}>
          <div>정보관리책임자: 양수빈 (서울수리초등학교 교사)</div>
          <div>Copyright © 2026 양수빈. All rights reserved.</div>
        </div>
        
        <p className="caption" style={{ color: 'var(--text-secondary)', opacity: 0.5, marginTop: 'var(--spacing-xs)' }}>
          Press Shift + A to open secret menu
        </p>
      </footer>

      <SecretModal 
        isOpen={isSecretModalOpen} 
        onClose={() => setIsSecretModalOpen(false)}
        students={students}
        secretOrder={secretOrder}
        setSecretOrder={setSecretOrder}
      />
      
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        policyType={currentPolicy}
      />
    </div>
  );
}

export default App;
