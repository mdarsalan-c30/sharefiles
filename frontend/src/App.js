
import React, { useEffect, useRef, useState } from 'react';

function App() {
  const socketRef = useRef(null);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    socketRef.current = new WebSocket('wss://sharefiles-x9wr.onrender.com');

    socketRef.current.onopen = () => setStatus('Connected ✅');
    socketRef.current.onclose = () => setStatus('Disconnected ❌');

    socketRef.current.onmessage = (event) => {
      const blob = new Blob([event.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'received_file';
      link.click();
    };

    return () => socketRef.current?.close();
  }, []);

  const handleFileSend = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      socketRef.current.send(arrayBuffer);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📤 Wireless File Transfer</h1>
      <p>Status: {status}</p>
      <input type="file" onChange={handleFileSend} />
    </div>
  );
}

export default App;
