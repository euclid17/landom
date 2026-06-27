import React from 'react';
import termsText from '../../../이용약관.md?raw';
import privacyText from '../../../개인정보처리방침.md?raw';

const PolicyModal = ({ isOpen, onClose, policyType }) => {
  if (!isOpen) return null;

  // policyType === 'terms' or 'privacy'
  const title = policyType === 'terms' ? '이용약관' : '개인정보처리방침';
  const rawText = policyType === 'terms' ? termsText : privacyText;

  // Simple parser to render basic markdown paragraphs and bold text
  const renderText = (text) => {
    return text.split('\n').map((line, index) => {
      // Remove starting '# ' for titles if any
      if (line.startsWith('# ')) {
        return <h2 key={index} style={{ marginBottom: 'var(--spacing-md)', color: 'var(--accent-magenta)' }}>{line.replace('# ', '')}</h2>;
      }
      
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Simple bold parsing: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={index} style={{ marginBottom: 'var(--spacing-xs)', lineHeight: '1.6' }}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="template-card" 
        style={{ 
          width: '95%', 
          maxWidth: '800px', 
          maxHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: 'var(--spacing-xl)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h2 className="headline" style={{ color: 'var(--accent-magenta)', fontWeight: 'bold' }}>{title}</h2>
          <button className="button-icon-circular" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 'var(--spacing-md)', 
          backgroundColor: '#f9f9f9', 
          borderRadius: 'var(--rounded-md)',
          border: '2px solid #eee'
        }}>
          {renderText(rawText)}
        </div>
        
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <button className="button-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
