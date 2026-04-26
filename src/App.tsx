import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import UserList from './pages/UserList'
import Chat from './pages/Chat'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'register' | 'login' | 'users' | 'chat'>('landing');
  const [targetUser, setTargetUser] = useState<{uid: string, name: string} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentPage === 'landing') {
        setCurrentPage('users');
      }
    });
    return () => unsubscribe();
  }, [currentPage]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('landing');
  };

  const startChat = (uid: string, name: string) => {
    setTargetUser({ uid, name });
    setCurrentPage('chat');
  };

  // Rendering logic
  if (currentPage === 'register') return <Register onBack={() => setCurrentPage('landing')} />;
  if (currentPage === 'login') return <Login onBack={() => setCurrentPage('landing')} onSuccess={() => setCurrentPage('users')} />;
  if (user && currentPage === 'users') return <UserList onChat={startChat} onLogout={handleLogout} />;
  if (user && currentPage === 'chat' && targetUser) return <Chat targetUser={targetUser} onBack={() => setCurrentPage('users')} />;

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">Club Rapid</div>
        <ul className="nav-links">
          {user ? (
            <>
              <li><button className="btn-login" onClick={() => setCurrentPage('users')}>Members</button></li>
              <li><button className="btn-secondary" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><button className="btn-login" onClick={() => setCurrentPage('login')}>Login</button></li>
              <li><button className="btn-secondary" onClick={() => setCurrentPage('register')}>Join</button></li>
            </>
          )}
        </ul>
      </nav>

      <header className="hero-section">
        <h1>Accelerate Your Passion with <span className="highlight">Club Rapid</span></h1>
        <p>실시간 소켓 대화가 가능한 동아리 커뮤니티입니다.</p>
        {!user && (
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setCurrentPage('register')}>가입 신청하기</button>
            <button className="btn-secondary" onClick={() => setCurrentPage('login')}>로그인</button>
          </div>
        )}
      </header>

      <footer className="footer">
        <p>&copy; 2026 Club Rapid. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
