import React, { useEffect, useState, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

interface Message {
  id: string;
  text: string;
  senderId: string;
  readBy: string[];
  createdAt: Timestamp;
}

const Chat: React.FC<{ targetUser: {uid: string, name: string}, onBack: () => void }> = ({ targetUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const myUid = auth.currentUser?.uid || '';
  const roomId = [myUid, targetUser.uid].sort().join('_');

  useEffect(() => {
    if (!myUid) return;

    const q = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        msgs.push({ id: snapshotDoc.id, ...data } as Message);

        if (data.senderId !== myUid && (!data.readBy || !data.readBy.includes(myUid))) {
          const msgRef = doc(db, "chats", roomId, "messages", snapshotDoc.id);
          updateDoc(msgRef, {
            readBy: [...(data.readBy || []), myUid]
          });
        }
      });
      setMessages(msgs);
      
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
        readBy: [myUid],
        createdAt: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="page-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Chat Header */}
      <header style={{ 
        padding: '12px 20px', 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: '44px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0066cc', fontSize: '17px', cursor: 'pointer' }}>‹ Back</button>
          <h3 style={{ fontSize: '17px', fontWeight: 600 }}>{targetUser.name}</h3>
        </div>
      </header>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              display: 'flex', 
              justifyContent: msg.senderId === myUid ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{ 
                backgroundColor: msg.senderId === myUid ? '#0066cc' : '#f5f5f7',
                color: msg.senderId === myUid ? '#ffffff' : '#1d1d1f',
                padding: '10px 16px',
                borderRadius: '18px',
                maxWidth: '75%',
                fontSize: '17px',
                lineHeight: '1.4',
                textAlign: 'left'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSend} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <input 
            style={{ 
              flex: 1, 
              padding: '12px 20px', 
              borderRadius: '980px', 
              border: '1px solid #e0e0e0', 
              backgroundColor: '#f5f5f7',
              fontSize: '17px'
            }} 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="iMessage"
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
