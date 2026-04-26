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
    status: '재학', // 추가: 재학, 휴학, 졸업
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        studentId: formData.studentId,
        status: formData.status, // 저장
        role: 'member',
        createdAt: new Date().toISOString(),
      });
      
      alert('회원가입이 완료되었습니다!');
      onBack();
    } catch (error: any) {
      alert(`에러: ${error.message}`);
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
            <input name="email" type="email" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input name="password" type="password" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input name="name" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>학번</label>
            <input name="studentId" required onChange={handleChange} />
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
            <button type="submit" className="btn-primary" disabled={loading}>가입하기</button>
            <button type="button" className="btn-secondary" onClick={onBack}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

// Original code preserved below:
/*
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
...
*/
