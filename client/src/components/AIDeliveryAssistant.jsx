import React, { useState } from 'react';
import { useAuth } from '../firebase/context.jsx';

function AIDeliveryAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useAuth(); 

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    setMessages([...messages, { from: 'user', text: input }]);

    const res = await fetch('http://localhost:3001/api/ai/ask-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
    });

    if (!res.ok) {
      const text = await res.text();
      setMessages(msgs => [...msgs, { from: 'ai', text: `Error: ${res.status} ${text}` }]);
      setInput('');
      return;
    }

    const data = await res.json();
    setMessages(msgs => [...msgs, { from: 'ai', text: data.answer }]);
    setInput('');
  };

  return (
    <div>
      <div style={{ minHeight: 200, border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'user' ? 'right' : 'left' }}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%' }}
        disabled={!user}
      />
      <button onClick={sendMessage} disabled={!user}>Send</button>
    </div>
  );
}

export default AIDeliveryAssistant;