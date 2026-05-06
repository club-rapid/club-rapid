import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import UserList from './pages/UserList'
import Chat from './pages/Chat'
import Notice from './pages/Notice'
import Guidelines from './pages/Guidelines'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'register' | 'login' | 'notice' | 'users' | 'chat' | 'guidelines'>('landing');
  const [targetUser, setTargetUser] = useState<{uid: string, name: string, githubUrl?: string} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentPage === 'landing') {
        setCurrentPage('notice');
      }
    });
    return () => unsubscribe();
  }, [currentPage]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('landing');
  };

  const startChat = (target: {uid: string, name: string, githubUrl?: string}) => {
    setTargetUser(target);
    setCurrentPage('chat');
  };

  const renderPage = () => {
    if (currentPage === 'register') return <Register onBack={() => setCurrentPage('landing')} />;
    if (currentPage === 'login') return <Login onBack={() => setCurrentPage('landing')} onSuccess={() => setCurrentPage('notice')} />;
    if (currentPage === 'guidelines') return <Guidelines onBack={() => setCurrentPage('notice')} />;
    
    if (user) {
      if (currentPage === 'notice') return <Notice onNavigate={(page) => setCurrentPage(page as any)} />;
      if (currentPage === 'users') return <UserList onChat={startChat} />;
      if (currentPage === 'chat' && targetUser) return <Chat targetUser={targetUser} onBack={() => setCurrentPage('users')} />;
    }

    return (
      <div className="page-content">
        <header className="hero-section">
          <h1 className="hero-display">Club Rapid.</h1>
          <p className="hero-sub">Accelerate your passion. Fast. Light. Beautiful.</p>
          {!user && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button className="btn-primary" onClick={() => setCurrentPage('register')}>가입하기</button>
              <button className="btn-secondary" onClick={() => setCurrentPage('login')}>로그인 ›</button>
            </div>
          )}
        </header>

        <section className="tile-grid">
          <div className="product-tile" style={{ backgroundColor: '#fafafc' }}>
            <h2>Photography.</h2>
            <p>UI recedes so the product can speak.</p>
          </div>
          <div className="product-tile" style={{ backgroundColor: '#1d1d1f', color: '#ffffff' }}>
            <h2 style={{ color: '#ffffff' }}>Performance.</h2>
            <p style={{ color: '#ffffff' }}>Built with React and Firebase.</p>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => setCurrentPage('landing')}>Club Rapid</div>
          <ul className="nav-links">
            {user ? (
              <>
                <li><span className="nav-link-item" onClick={() => setCurrentPage('notice')}>Notice</span></li>
                <li><span className="nav-link-item" onClick={() => setCurrentPage('users')}>Members</span></li>
                <li><span className="nav-link-item" onClick={handleLogout}>Logout</span></li>
              </>
            ) : (
              <>
                <li><span className="nav-link-item" onClick={() => setCurrentPage('login')}>Login</span></li>
                <li><span className="nav-link-item" onClick={() => setCurrentPage('register')}>Join</span></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {renderPage()}

      <footer className="footer" style={{ backgroundColor: '#f5f5f7', padding: '64px 20px', textAlign: 'center', fontSize: '12px', color: '#86868b' }}>
        <p>&copy; 2026 Club Rapid. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
