import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import './Home.css';

export default function Home({ socket }: { socket: Socket }) {
  const navigate = useNavigate();
  const [connectionId, setConnectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleChatStart = () => {
      setLoading(false);
      navigate(`/chat/${connectionId}`);
    };

    //user tries to join
    const handleError = (err: string) => {
      setLoading(false);
      setError(err);
      setTimeout(() => setError(''), 3000);
    };

    //Backend send event
    socket.on('chat_start', handleChatStart);
    socket.on('error', handleError);

    return () => {
      socket.off('chat_start', handleChatStart);
      socket.off('error', handleError);
    };
  }, [socket, navigate, connectionId]);

  //Join button clicked
  const handleJoin = () => {
    if (!connectionId.trim()) return;
    setLoading(true);
    socket.emit('join_chat', connectionId);
  };

  return (
    <div className="home-container">
      <h1 data-testid="txt__title_join">Join a Chat</h1>
      <p data-testid="txt__subtitle_join">Enter a ID to start chatting</p>

      <input
        placeholder="Connection ID"
        value={connectionId}
        onChange={(e) => setConnectionId(e.target.value)}
        disabled={loading}
        data-testid="txt__input_connection_id"
      />
      <br /><br />

      <button
        onClick={handleJoin}
        disabled={loading}
        data-testid="txt__join_btn"
      >
        {loading ? 'Waiting...' : 'Join Chat'}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}