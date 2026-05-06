import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login: React.FC<{ onBack: () => void, onSuccess: () => void }> = ({ onBack, onSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const virtualEmail = `${studentId}@club-rapid.com`;
      const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password);
      const user = userCredential.user;

      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        await updateDoc(doc(db, "users", user.uid), {
          lastLoginIp: ipData.ip,
          lastLoginAt: new Date().toISOString(),
        });
      } catch (ipError) {
        await updateDoc(doc(db, "users", user.uid), {
          lastLoginAt: new Date().toISOString(),
        });
      }

      onSuccess();
    } catch (error: any) {
      alert(`로그인 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in.</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              required 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder="학번"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호"
            />
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '17px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" className="btn-secondary" style={{ marginTop: '20px', display: 'block', width: '100%' }} onClick={onBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
