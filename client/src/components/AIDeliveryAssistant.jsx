import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

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
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">💬 Ask GigWise AI</h3>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="w-full p-2 border rounded"
      />
      <button onClick={askAI} className="bg-purple-600 text-white px-4 py-2 mt-2 rounded">
        Ask
      </button>
      {loading && <p className="text-gray-500">Thinking...</p>}
      {response && <div className="bg-gray-100 p-4 mt-2 rounded">{response}</div>}
    </div>
  );
}