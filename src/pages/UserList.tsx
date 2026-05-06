import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface UserData {
  uid: string;
  name: string;
  department: string;
  grade?: string;
  status: string;
  githubUrl?: string;
  unreadCount?: number;
}

const UserList: React.FC<{ onChat: (user: UserData) => void }> = ({ onChat }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const myUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const userList: UserData[] = [];
        
        querySnapshot.forEach((doc) => {
          if (doc.id !== myUid) {
            userList.push({ uid: doc.id, ...doc.data(), unreadCount: 0 } as UserData);
          }
        });
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [myUid]);

  useEffect(() => {
    if (!myUid || users.length === 0) return;

    const unsubscribes = users.map(user => {
      const roomId = [myUid, user.uid].sort().join('_');
      const q = query(collection(db, "chats", roomId, "messages"));

      return onSnapshot(q, (snapshot) => {
        let count = 0;
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.senderId !== myUid && (!data.readBy || !data.readBy.includes(myUid))) {
            count++;
          }
        });

        setUsers(prevUsers => prevUsers.map(u => 
          u.uid === user.uid ? { ...u, unreadCount: count } : u
        ));
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [users.length, myUid]);

  const openGithub = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation(); // 카드 클릭(채팅 이동) 방지
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page-content" style={{ backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
      <header className="hero-section" style={{ backgroundColor: 'transparent' }}>
        <h1 className="hero-display">Members.</h1>
        <p className="hero-sub">동아리 동료들과 대화를 시작해 보세요.</p>
      </header>
      
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 20px 80px' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading members...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {users.map(user => (
              <div 
                key={user.uid} 
                onClick={() => onChat(user)}
                style={{ 
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                className="user-card"
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066cc', padding: '2px 8px', backgroundColor: '#f5f5f7', borderRadius: '4px' }}>{user.status}</span>
                    {user.grade && <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868b' }}>{user.grade}</span>}
                  </div>
                  <h3 style={{ fontSize: '19px', margin: 0, color: '#1d1d1f', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    {user.name}
                    <span style={{ fontSize: '14px', fontWeight: 400, color: '#86868b' }}>{user.department}</span>
                  </h3>
                </div>

                {user.unreadCount !== undefined && user.unreadCount > 0 && (
                  <span className="unread-badge" style={{ position: 'absolute', top: '24px', right: '24px' }}>
                    {user.unreadCount}
                  </span>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f5f5f7' }}>
                  <div style={{ color: '#0066cc', fontSize: '14px', fontWeight: 400 }}>Message ›</div>
                  {user.githubUrl && (
                    <div 
                      onClick={(e) => openGithub(e, user.githubUrl)}
                      style={{ color: '#0066cc', fontSize: '14px', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      GitHub ›
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
