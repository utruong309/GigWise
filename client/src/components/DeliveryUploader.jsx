import React, { useState } from 'react';
import './DeliveryUploader.css';

export default function DeliveryUploader() {
  const [form, setForm] = useState({
    date: '',
    time: '',
    address: '',
    lng: '',
    lat: '',
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
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      tip: parseFloat(form.tip),
      total: parseFloat(form.total),
      tags: form.tags.split(',').map(tag => tag.trim()),
    };
    await fetch('http://localhost:3001/api/deliveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Submitted!');
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const formData = new FormData();
    formData.append('csv', file);

    await fetch('http://localhost:3001/api/deliveries/upload', {
      method: 'POST',
      body: formData,
    });
    alert('File uploaded!');
  };

  return (
    <div className="container">
      {/* Manual Entry Form */}
      <div className="card">
        <div className="title">
          <span style={{ marginRight: '0.5rem' }}>📋</span>
          Manual Entry Form
        </div>

        <form onSubmit={handleManualSubmit}>
          <div className="row">
            <div className="flex-1">
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
            </div>
            <div className="flex-1">
              <label className="label">Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="mb-8">
            <label className="label">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="input" />
          </div>

          <div className="row">
            <div className="flex-1">
              <label className="label">Latitude</label>
              <input type="text" name="lat" value={form.lat} onChange={handleChange} className="input" />
            </div>
            <div className="flex-1">
              <label className="label">Longitude</label>
              <input type="text" name="lng" value={form.lng} onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="row">
            <div className="flex-1">
              <label className="label">Tip</label>
              <input type="number" name="tip" value={form.tip} onChange={handleChange} className="input" />
            </div>
            <div className="flex-1">
              <label className="label">Total</label>
              <input type="number" name="total" value={form.total} onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="mb-8">
            <label className="label">Platform</label>
            <input type="text" name="platform" value={form.platform} onChange={handleChange} className="input" />
          </div>

          <button type="submit" className="button">Submit</button>
        </form>
      </div>

      {/* CSV Upload Section */}
      <div className="card">
        <div className="title">
          <span style={{ marginRight: '0.5rem' }}>📁</span>
          Upload CSV File
        </div>

        <div className="file-box">
          <input type="file" accept=".csv" onChange={handleCsvUpload} />
        </div>

        <div className="file-info">
          {csvFile ? (
            <p className="file-selected">Selected: {csvFile.name}</p>
          ) : (
            <p className="file-empty">No file chosen</p>
          )}
        </div>
      </div>
    </div>
  );
}