import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { DEPARTMENTS } from '../data/departments';
import { saveUser } from '../services/githubService';

const Register: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({
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
      // 1. 비밀번호 해싱 (Salt rounds: 10)
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      
      const userData = {
        ...formData,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      // 2. GitHub에 저장
      await saveUser(userData);
      
      alert('회원가입이 완료되었습니다!');
      onBack();
    } catch (error: any) {
      alert(`에러 발생: ${error.message}`);
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
          <div className="form-group">
            <label>비밀번호</label>
            <input name="password" type="password" required onChange={handleChange} />
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
