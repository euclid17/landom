import React, { useState } from 'react';

const Settings = ({ students, setStudents, setPickedStudents, onClose }) => {
  const [inputText, setInputText] = useState('');

  const handleAddStudents = () => {
    if (!inputText.trim()) return;
    
    // Split by comma, newline, or space
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
    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2>학생 명단 관리</h2>
      
      <div className="flex-col" style={{ marginBottom: '2rem' }}>
        <textarea 
          rows={4} 
          placeholder="학생 이름을 입력하세요. 여러 명일 경우 쉼표(,) 줄바꿈, 띄어쓰기로 구분합니다."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
          <button onClick={handleAddStudents}>추가하기</button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>현재 명단 ({students.length}명)</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.3)', borderRadius: '12px' }}>
          {students.length === 0 ? <p style={{color: '#666'}}>명단이 비어있습니다.</p> : null}
          {students.map((student, index) => (
            <div key={index} style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <span>{student}</span>
              <button 
                className="danger" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderRadius: '50%' }}
                onClick={() => handleRemoveStudent(student)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-col">
        <h3>초기화 설정</h3>
        <div className="flex-row">
          <button className="secondary" onClick={handleResetPicked}>뽑힌 학생 기록 초기화</button>
          <button className="danger" onClick={handleClearAll}>전체 명단 삭제</button>
        </div>
      </div>

      <div className="flex-center" style={{ marginTop: '2rem' }}>
        <button onClick={onClose} style={{ width: '100%' }}>완료 및 돌아가기</button>
      </div>
    </div>
  );
};

export default Settings;
