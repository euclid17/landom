import React, { useState } from 'react';

const Settings = ({ students, setStudents, setPickedStudents }) => {
  const [inputText, setInputText] = useState('');

  const handleAddStudents = () => {
    if (!inputText.trim()) return;
    
    const newNames = inputText
      .split(/[\n, ]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0 && !students.includes(name));
      
    if (newNames.length > 0) {
      setStudents([...students, ...newNames]);
    }
    setInputText('');
  };

  const handleRemoveStudent = (nameToRemove) => {
    setStudents(students.filter(name => name !== nameToRemove));
  };

  const handleResetPicked = () => {
    if (window.confirm('이미 뽑힌 학생 목록을 초기화하시겠습니까?')) {
      setPickedStudents([]);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('모든 학생 명단을 삭제하시겠습니까?')) {
      setStudents([]);
      setPickedStudents([]);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'left', fontFamily: 'var(--font-cute)' }}>
      <h2 className="display-lg" style={{ marginBottom: 'var(--spacing-lg)', fontFamily: 'var(--font-cute)' }}>학생 명단 관리</h2>
      
      <div className="flex-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <p className="body">학생 이름을 입력하세요. 여러 명일 경우 쉼표(,), 줄바꿈, 띄어쓰기로 구분합니다.</p>
        <textarea 
          rows={4} 
          placeholder="예: 김철수, 이영희, 홍길동"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex-row" style={{ justifyContent: 'flex-start' }}>
          <button className="button-primary" onClick={handleAddStudents}>추가하기</button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 className="headline" style={{ marginBottom: 'var(--spacing-sm)' }}>현재 명단 ({students.length}명)</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', maxHeight: '200px', overflowY: 'auto', padding: 'var(--spacing-md)', backgroundColor: 'var(--surface-white)', borderRadius: 'var(--rounded-md)', border: '2px solid #fff', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)' }}>
          {students.length === 0 ? <p className="body-sm" style={{color: 'var(--text-secondary)'}}>명단이 비어있습니다.</p> : null}
          {students.map((student, index) => (
            <div key={index} style={{ backgroundColor: '#fff', padding: '4px 12px', borderRadius: 'var(--rounded-full)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', border: '2px solid var(--accent-pink)', boxShadow: '0 2px 0 var(--accent-pink)' }}>
              <span className="body-sm" style={{ fontFamily: 'var(--font-cute)' }}>{student}</span>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--accent-magenta)', padding: '0', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}
                onClick={() => handleRemoveStudent(student)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-col">
        <h3 className="headline" style={{ marginBottom: 'var(--spacing-sm)' }}>초기화 설정</h3>
        <div className="flex-row">
          <button className="button-secondary" style={{ border: '1px solid var(--hairline)' }} onClick={handleResetPicked}>뽑힌 학생 기록 초기화</button>
          <button className="button-secondary" style={{ color: 'var(--accent-magenta)', border: '1px solid var(--accent-magenta)' }} onClick={handleClearAll}>전체 명단 삭제</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
