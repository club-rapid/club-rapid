import React, { useEffect, useState, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
}

const Chat: React.FC<{ targetUser: {uid: string, name: string}, onBack: () => void }> = ({ targetUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 대화방 ID 생성 (두 UID를 정렬하여 조합)
  const myUid = auth.currentUser?.uid || '';
  const roomId = [myUid, targetUser.uid].sort().join('_');

  useEffect(() => {
    if (!myUid) return;

    // 실시간 리스너 설정 (소켓 역할)
    const q = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      
      // 새 메시지 오면 아래로 스크롤
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [roomId, myUid]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !myUid) return;

    try {
      await addDoc(collection(db, "chats", roomId, "messages"), {
        text: newMessage,
        senderId: myUid,
        createdAt: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card" style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3>{targetUser.name} 님과 대화</h3>
          <button className="btn-secondary" onClick={onBack}>닫기</button>
        </div>

        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', background: '#0f172a', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              display: 'flex', 
              justifyContent: msg.senderId === myUid ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{ 
                background: msg.senderId === myUid ? '#38bdf8' : '#334155',
                color: msg.senderId === myUid ? '#0f172a' : 'white',
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '70%',
                textAlign: 'left'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          <input 
            style={{ flex: 1 }} 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="메시지를 입력하세요..."
          />
          <button type="submit" className="btn-primary">전송</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
