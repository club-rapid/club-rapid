import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login: React.FC<{ onBack: () => void, onSuccess: () => void }> = ({ onBack, onSuccess }) => {
  const [studentId, setStudentId] = useState(''); // 이메일 대신 학번
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 학번을 가상 이메일로 변환
      const virtualEmail = `${studentId}@club-rapid.com`;

      // 2. 로그인 인증
      const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password);
      const user = userCredential.user;

      // 3. IP 주소 가져오기
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const ipAddress = ipData.ip;

      // 4. Firestore 업데이트
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginIp: ipAddress,
        lastLoginAt: new Date().toISOString(),
      });

      alert('로그인 성공! 환영합니다.');
      onSuccess();
    } catch (error: any) {
      let message = '로그인 실패';
      if (error.code === 'auth/user-not-found') message = '등록되지 않은 학번입니다.';
      if (error.code === 'auth/wrong-password') message = '비밀번호가 틀렸습니다.';
      alert(`${message} (${error.message})`);
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
            <label>학번</label>
            <input 
              type="text" 
              required 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder="학번을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호"
            />
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
