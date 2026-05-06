import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DEPARTMENTS } from '../data/departments';

const Register: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    phone: '',
    department: DEPARTMENTS[0],
    grade: '1학년', // 학년 추가
    status: '재학',
    githubUrl: '',
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
      const q = query(collection(db, "users"), where("studentId", "==", formData.studentId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error('이미 등록된 학번입니다.');
      }

      const virtualEmail = `${formData.studentId}@club-rapid.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: virtualEmail,
        studentId: formData.studentId,
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        grade: formData.grade, // Firestore 저장
        status: formData.status,
        githubUrl: formData.githubUrl,
        role: 'member',
        createdAt: new Date().toISOString(),
      });
      
      onBack();
    } catch (error: any) {
      alert(`가입 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        <h2>Create Account.</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="studentId" required onChange={handleChange} placeholder="학번" />
          </div>
          <div className="form-group">
            <input name="password" type="password" required onChange={handleChange} placeholder="비밀번호" />
          </div>
          <div className="form-group">
            <input name="name" required onChange={handleChange} placeholder="이름" />
          </div>
          <div className="form-group">
            <input name="phone" required onChange={handleChange} placeholder="연락처" />
          </div>
          <div className="form-group">
            <input name="githubUrl" onChange={handleChange} placeholder="GitHub URL" />
          </div>
          <div className="form-group">
            <select name="department" onChange={handleChange}>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <select name="grade" onChange={handleChange} style={{ flex: 1 }}>
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
              <option value="4학년">4학년</option>
            </select>
            <select name="status" onChange={handleChange} style={{ flex: 1 }}>
              <option value="재학">재학</option>
              <option value="휴학">휴학</option>
              <option value="졸업">졸업</option>
            </select>
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '17px' }} disabled={loading}>
              Create Account
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

export default Register;
