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
      <div className="template-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="headline" style={{ color: 'var(--accent-magenta)', marginBottom: 'var(--spacing-xs)' }}>비밀 모달 (교사용)</h2>
        <p className="body-sm" style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
          다음에 뽑힐 학생의 순서를 몰래 지정할 수 있습니다. 
          이곳에 등록된 학생이 우선적으로 추출됩니다.
        </p>

        <div className="flex-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="flex-row">
            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">학생 선택</option>
              {students.filter(s => !secretOrder.includes(s)).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="button-primary" onClick={handleAddSecret}>지정</button>
          </div>
        </div>

        <div>
          <h3 className="eyebrow" style={{ marginBottom: 'var(--spacing-xs)' }}>비밀 대기열</h3>
          <div style={{ backgroundColor: 'var(--surface-soft)', padding: 'var(--spacing-md)', borderRadius: 'var(--rounded-md)', minHeight: '100px', border: '1px solid var(--hairline)' }}>
            {secretOrder.length === 0 ? <p className="body-sm" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>지정된 학생이 없습니다.</p> : null}
            <ol style={{ paddingLeft: 'var(--spacing-lg)', margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
              {secretOrder.map((student, index) => (
                <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="body-sm">{student}</span>
                    <button 
                      style={{ background: 'none', color: 'var(--accent-magenta)', padding: '0', fontSize: '14px', border: 'none' }}
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

        <div className="flex-center" style={{ marginTop: 'var(--spacing-xxl)', display: 'flex', justifyContent: 'center' }}>
          <button className="button-secondary" style={{ border: '1px solid var(--hairline)', width: '100%' }} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default SecretModal;
