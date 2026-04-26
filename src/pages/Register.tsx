import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DEPARTMENTS } from '../data/departments';

const Register: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    studentId: '', // 이제 이게 ID 역할을 함
    name: '',
    phone: '',
    department: DEPARTMENTS[0],
    status: '재학',
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
      // 1. 학번 중복 체크
      const q = query(collection(db, "users"), where("studentId", "==", formData.studentId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error('이미 등록된 학번입니다.');
      }

      // 2. 가상 이메일 생성 (학번@club-rapid.com)
      const virtualEmail = `${formData.studentId}@club-rapid.com`;

      // 3. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        virtualEmail, 
        formData.password
      );
      const user = userCredential.user;

      // 4. Firestore에 추가 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: virtualEmail,
        studentId: formData.studentId,
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        status: formData.status,
        role: 'member',
        createdAt: new Date().toISOString(),
      });
      
      alert('동아리 회원가입이 완료되었습니다! 이제 학번으로 로그인하세요.');
      onBack();
    } catch (error: any) {
      alert(`가입 실패: ${error.message}`);
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
            <label>학번</label>
            <input name="studentId" required onChange={handleChange} placeholder="학번이 로그이 ID가 됩니다" />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input name="password" type="password" required onChange={handleChange} placeholder="6자 이상 입력" />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input name="name" required onChange={handleChange} placeholder="본명을 입력하세요" />
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
            <label>상태</label>
            <select name="status" onChange={handleChange}>
              <option value="재학">재학</option>
              <option value="휴학">휴학</option>
              <option value="졸업">졸업</option>
            </select>
          </div>
          
          <div className="register-btns">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '가입 중...' : '동아리 가입'}
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
