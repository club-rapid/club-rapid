import React from 'react';

const NOTICES = [
  {
    id: 1,
    title: "Club Rapid 신규 가입 기간",
    content: "2026년 상반기 신규 부원을 모집합니다. 지금 바로 가입하세요.",
    tag: "New",
  },
  {
    id: 2,
    title: "실시간 채팅 가이드라인",
    content: "팀원들 간의 예의를 지켜주세요. 비속어 사용 시 제재될 수 있습니다.",
    tag: "Guide",
    link: "guidelines" // 특정 링크 타겟 추가
  },
  {
    id: 3,
    title: "정기 모임 안내",
    content: "매주 목요일 오후 6시, 학생회관 302호에서 정기 세션이 진행됩니다.",
    tag: "Event",
  }
];

const Notice: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="page-content">
      <header className="hero-section">
        <h1 className="hero-display">동아리 공지사항</h1>
        <p className="hero-sub">Club Rapid의 최신 소식을 확인하세요.</p>
      </header>

      <div className="tile-grid">
        {NOTICES.map((notice) => (
          <section key={notice.id} className="product-tile">
            <span style={{ color: '#0066cc', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
              {notice.tag}
            </span>
            <h2>{notice.title}</h2>
            <p>{notice.content}</p>
            <button 
              className="btn-secondary" 
              onClick={() => notice.link ? onNavigate(notice.link) : null}
            >
              더 알아보기 ›
            </button>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Notice;
