import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login: React.FC<{ onBack: () => void, onSuccess: () => void }> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. IP 주소 가져오기
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const ipAddress = ipData.ip;

      // 3. Firestore 업데이트
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginIp: ipAddress,
        lastLoginAt: new Date().toISOString(),
      });

      alert('로그인 성공!');
      onSuccess();
    } catch (error: any) {
      alert(`로그인 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Club Rapid 로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <div className="register-btns">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
