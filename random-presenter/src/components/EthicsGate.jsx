import React from 'react';

const EthicsGate = ({ onAgree }) => {
  const guidelines = [
    {
      title: '활용 목적',
      category: '주도성, 합목적성',
      subtitle: "생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.",
      content: "생성형 AI를 사용하기 전에 '지금 내가 왜 쓰려고 하지?'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요. 모든 공부에 생성형 AI가 필요한 것은 아니므로, 지금 하는 활동에 생성형 AI를 사용하는 것이 나의 학습에 정말 도움이 될지 먼저 고민해요."
    },
    {
      title: '주도적 학습',
      category: '주도성',
      subtitle: '생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.',
      content: '막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요. 주제에 대해 내가 아는 것과 내 아이디어를 먼저 공책에 적거나 정리한 뒤에 생성형 AI를 활용하세요.'
    },
    {
      title: '비판적 검증',
      category: '주도성',
      subtitle: '생성형 AI가 틀릴 수 있다는 점을 알아요.',
      content: "생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 '정말 맞을까?' 하고 한 번 더 확인하는 습관을 가져요. 중요한 내용일수록 책을 찾아보거나 선생님께 여쭤보는 등 다른 방법으로도 꼭 다시 확인하세요."
    },
    {
      title: '사고의 확장',
      category: '주도성, 합목적성',
      subtitle: '생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.',
      content: '생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요.'
    },
    {
      title: '안전과 관계',
      category: '안전성',
      subtitle: '나의 정보와 비밀을 말하지 않아요.',
      content: '내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요. 생성형 AI는 계산된 답변을 내놓는 프로그램이라 감정이 없어요. 나의 고민을 털어놓으며 지나치게 의지하기보다, 친구나 부모님, 선생님과의 실제 대화를 통해 마음을 나누어요.'
    },
    {
      title: '투명성·윤리',
      category: '투명성',
      subtitle: '생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.',
      content: '어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요. 생성형 AI를 쓴 사실을 정직하게 밝힐 때 나의 노력이 더 빛나고 가치 있게 인정받을 수 있어요.'
    }
  ];

  return (
    <div className="ethics-gate-container">
      <div className="ethics-gate-card">
        <h1 className="ethics-title">생성형 AI 윤리 핵심 가이드</h1>
        <p className="ethics-subtitle">본 활동을 시작하기 전에 아래 내용을 꼼꼼히 읽어주세요.</p>
        
        <div className="ethics-list">
          {guidelines.map((guide, index) => (
            <div key={index} className="ethics-item">
              <div className="ethics-item-header">
                <span className="ethics-category">{guide.category}</span>
                <span className="ethics-item-title">가이드 {index + 1} | {guide.title}</span>
              </div>
              <h3 className="ethics-item-subtitle">{guide.subtitle}</h3>
              <p className="ethics-item-content">{guide.content}</p>
            </div>
          ))}
        </div>

        <div className="ethics-action">
          <button className="button-primary ethics-agree-button" onClick={onAgree}>
            나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
          </button>
        </div>
      </div>
    </div>
  );
};

export default EthicsGate;
