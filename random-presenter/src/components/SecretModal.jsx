import React, { useState } from 'react';

const SecretModal = ({ isOpen, onClose, students, secretOrder, setSecretOrder }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  if (!isOpen) return null;

  const handleAddSecret = () => {
    if (selectedStudent && !secretOrder.includes(selectedStudent)) {
      setSecretOrder([...secretOrder, selectedStudent]);
      setSelectedStudent('');
    }
  };

  const handleRemoveSecret = (nameToRemove) => {
    setSecretOrder(secretOrder.filter(name => name !== nameToRemove));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#ff4757' }}>비밀 모달 (교사용)</h2>
        <p style={{ marginBottom: '1rem', color: '#636e72', fontSize: '0.9rem' }}>
          다음에 뽑힐 학생의 순서를 몰래 지정할 수 있습니다. 
          이곳에 등록된 학생이 우선적으로 추출됩니다.
        </p>

        <div className="flex-col" style={{ marginBottom: '2rem' }}>
          <div className="flex-row">
            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #ccc' }}
            >
              <option value="">학생 선택</option>
              {students.filter(s => !secretOrder.includes(s)).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={handleAddSecret}>지정</button>
          </div>
        </div>

        <div>
          <h3>비밀 대기열</h3>
          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '12px', minHeight: '100px' }}>
            {secretOrder.length === 0 ? <p style={{ color: '#aaa', textAlign: 'center' }}>지정된 학생이 없습니다.</p> : null}
            <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {secretOrder.map((student, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{student}</span>
                    <button 
                      className="danger" 
                      style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
                      onClick={() => handleRemoveSecret(student)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex-center" style={{ marginTop: '2rem' }}>
          <button className="secondary" onClick={onClose} style={{ width: '100%' }}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default SecretModal;
