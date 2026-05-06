import React from 'react';

const Guidelines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="page-content">
      <header className="hero-section">
        <h1 className="hero-display">Chat Guidelines.</h1>
        <p className="hero-sub">건전하고 즐거운 소통을 위한 약속입니다.</p>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px 80px', color: '#1d1d1f' }}>
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>1. 상호 존중</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#86868b' }}>
            모든 멤버는 서로를 존중해야 합니다. 비속어, 욕설, 인신공격 등 타인에게 불쾌감을 주는 언행은 엄격히 금지됩니다.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>2. 정보 공유</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#86868b' }}>
            동아리 내에서 공유되는 개인정보나 내부 자료를 외부로 유출하지 마세요. 신뢰는 우리 커뮤니티의 기본입니다.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>3. 클린 채팅</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#86868b' }}>
            광고, 도배, 부적절한 이미지 전송 등 채팅방의 목적과 맞지 않는 행동은 삼가주세요.
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button className="btn-primary" onClick={onBack}>확인했습니다</button>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
