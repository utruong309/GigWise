import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import '../ModernUI.css';

export default function AIDeliveryAssistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    setResponse('');

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('Please login first');

    const token = await user.getIdToken();

    const res = await fetch('http://localhost:3001/api/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setResponse(data.answer || 'No answer found');
    setLoading(false);
  };

  return (
    <div className="modern-ai-assistant">
      <div className="modern-ai-card">
        <h3 className="modern-ai-title">💬 Ask GigWise AI</h3>
        <div className="modern-ai-input-row">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="modern-ai-input"
          />
          <button onClick={askAI} className="modern-ai-send-btn">
            <span role="img" aria-label="send">🚀</span>
          </button>
        </div>
        {loading && <div className="modern-ai-loading"><span className="modern-dot"></span><span className="modern-dot"></span><span className="modern-dot"></span></div>}
        {response && <div className="modern-ai-response-bubble">{response}</div>}
      </div>
    </div>
  );
}