import React, { useState } from 'react';
import '../ModernUI.css';
import { getAuth } from 'firebase/auth';

export default function DeliveryUploader({ onUploadComplete }) {
  const [form, setForm] = useState({
    date: '',
    time: '',
    address: '',
    tip: '',
    total: '',
    platform: '',
  });
  const [csvFile, setCsvFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tip: parseFloat(form.tip),
      total: parseFloat(form.total),
    };

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in first.');
      return;
    }

    const token = await user.getIdToken();

    const res = await fetch('http://localhost:3001/api/deliveries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Submitted!');
      onUploadComplete?.(); 
    } else {
      alert('Submission failed.');
    }
  };

  const handleCsvUpload = async (e) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in first');
      return;
    }

    const token = await user.getIdToken();

    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const formData = new FormData();
    formData.append('csv', file);

    const res = await fetch('http://localhost:3001/api/deliveries/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert('File uploaded!');
      onUploadComplete?.(); 
    } else {
      alert('Upload failed.');
    }
  };

  return (
    <div className="modern-glass-card modern-uploader">
      <div className="modern-card-title">
        <span role="img" aria-label="clipboard">📋</span> Logging Form
      </div>
      <form onSubmit={handleManualSubmit} className="modern-form">
        <div className="modern-form-group">
          <label className="modern-floating-label">Date
            <input type="date" name="date" value={form.date} onChange={handleChange} className="modern-input" required />
          </label>
        </div>
        <div className="modern-form-group">
          <label className="modern-floating-label">Time
            <input type="time" name="time" value={form.time} onChange={handleChange} className="modern-input" required />
          </label>
        </div>
        <div className="modern-form-group">
          <label className="modern-floating-label">Address
            <input type="text" name="address" value={form.address} onChange={handleChange} className="modern-input" placeholder="Enter full address" required />
          </label>
        </div>
        <div className="modern-form-group">
          <label className="modern-floating-label">Tip
            <input type="number" name="tip" value={form.tip} onChange={handleChange} className="modern-input" placeholder="e.g. 2.50" step="0.01" required />
          </label>
        </div>
        <div className="modern-form-group">
          <label className="modern-floating-label">Total
            <input type="number" name="total" value={form.total} onChange={handleChange} className="modern-input" placeholder="e.g. 15.00" step="0.01" required />
          </label>
        </div>
        <div className="modern-form-group">
          <label className="modern-floating-label">Platform
            <input type="text" name="platform" value={form.platform} onChange={handleChange} className="modern-input" placeholder="e.g. Uber Eats, DoorDash" required />
          </label>
        </div>
        <button type="submit" className="modern-gradient-btn">
          <span role="img" aria-label="submit">✅</span> Submit
        </button>
      </form>
      <div className="modern-card-title mt-4">
        <span role="img" aria-label="file">📁</span> Upload CSV
      </div>
      <div className="modern-drag-drop-area">
        <input type="file" accept=".csv" onChange={handleCsvUpload} className="modern-file-input" />
        <span className="modern-file-label">Drag & drop or click to select a CSV file</span>
      </div>
      <div className="modern-file-info">
        {csvFile ? (
          <span className="modern-file-selected">Selected: {csvFile.name}</span>
        ) : (
          <span className="modern-file-empty">No file chosen</span>
        )}
      </div>
    </div>
  );
}