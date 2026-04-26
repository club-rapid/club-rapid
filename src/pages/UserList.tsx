import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface UserData {
  uid: string;
  name: string;
  department: string;
  status: string;
}

const UserList: React.FC<{ onChat: (uid: string, name: string) => void, onLogout: () => void }> = ({ onChat, onLogout }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // '재학' 상태인 사람만 쿼리
        const q = query(collection(db, "users"), where("status", "==", "재학"));
        const querySnapshot = await getDocs(q);
        const userList: UserData[] = [];
        querySnapshot.forEach((doc) => {
          userList.push({ uid: doc.id, ...doc.data() } as UserData);
        });
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="register-container">
      <div className="register-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>재학 중인 멤버</h2>
          <button className="btn-secondary" onClick={onLogout} style={{ height: 'fit-content' }}>로그아웃</button>
        </div>
        
        {loading ? <p>로딩 중...</p> : (
          <div className="user-list">
            {users.length === 0 ? <p>재학 중인 멤버가 없습니다.</p> : users.map(user => (
              <div key={user.uid} className="feature-card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{user.department}</p>
                </div>
                <button className="btn-primary" onClick={() => onChat(user.uid, user.name)}>대화하기</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
