import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import './Chat.css';

interface Message {
  sender: string;
  message: string;
}

export default function Chat({ socket }: { socket: Socket }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //socket connection check 
  useEffect(() => {
    if (!socket.connected) {
      navigate('/');
      return;
    }

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleChatEnd = () => {
      alert('The other user has left the chat.');
      navigate('/');
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('chat_end', handleChatEnd);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('chat_end', handleChatEnd);
    };
  }, [socket, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !userId) return;
    socket.emit('send_message', { connectionId: userId, message: inputText });
    setInputText('');
  };

  const handleQuit = () => {
    window.location.href = '/';
  };

  return (
    <div className="chat-container">
      <h1>Chat Room: {userId}</h1>
      <button onClick={handleQuit}>End Chat</button>
      <hr />

      <div className="chat-box">
        {messages.map((item, index) => (
          <div key={index}>
            <strong>{item.sender === socket.id ? 'Me' : 'User'}: </strong>
            <span>{item.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
