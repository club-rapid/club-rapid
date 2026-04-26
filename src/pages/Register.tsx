import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DEPARTMENTS } from '../data/departments';

const Register: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    department: DEPARTMENTS[0],
    studentId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Firestore에 추가 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        studentId: formData.studentId,
        role: 'member', // 기본 역할
        createdAt: new Date().toISOString(),
      });
      
      alert('회원가입이 완료되었습니다!');
      onBack();
    } catch (error: any) {
      let message = '에러가 발생했습니다.';
      if (error.code === 'auth/email-already-in-use') message = '이미 사용 중인 이메일입니다.';
      if (error.code === 'auth/weak-password') message = '비밀번호가 너무 취약합니다.';
      alert(message + ` (${error.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Club Rapid 가입하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input name="email" type="email" required onChange={handleChange} placeholder="example@email.com" />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input name="password" type="password" required onChange={handleChange} placeholder="6자 이상 입력" />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input name="name" required onChange={handleChange} placeholder="홍길동" />
          </div>
          <div className="form-group">
            <label>연락처</label>
            <input name="phone" required onChange={handleChange} placeholder="010-1234-5678" />
          </div>
          <div className="form-group">
            <label>학과</label>
            <select name="department" onChange={handleChange}>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>학번</label>
            <input name="studentId" required onChange={handleChange} placeholder="202612345" />
          </div>
          
          <div className="register-btns">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
