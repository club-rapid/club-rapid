import { useState } from 'react'
import './App.css'
import Register from './pages/Register'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'register'>('landing');

  if (currentPage === 'register') {
    return <Register onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">Club Rapid</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><button className="btn-login" onClick={() => setCurrentPage('register')}>Login</button></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Accelerate Your Passion with <span className="highlight">Club Rapid</span></h1>
        <p>함께 성장하고, 빠르게 결과물을 만들어내는 동아리입니다.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => setCurrentPage('register')}>가입 신청하기</button>
          <button className="btn-secondary">더 알아보기</button>
        </div>
      </header>

      {/* Features Preview */}
      <section id="features" className="features-section">
        <h2>Our Main Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>동적 네비게이션</h3>
            <p>언제 어디서든 원하는 메뉴로 빠르게 이동하세요.</p>
          </div>
          <div className="feature-card">
            <h3>실시간 채팅</h3>
            <p>팀원들과 즉각적으로 소통하고 아이디어를 공유합니다.</p>
          </div>
          <div className="feature-card">
            <h3>관리자 페이지</h3>
            <p>동아리 운영을 위한 체계적인 관리 도구를 제공합니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Club Rapid. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
