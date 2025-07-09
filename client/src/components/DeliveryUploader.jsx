import React, { useState } from 'react'; 

function DeliveryUploader() {
  const [form, setForm] = useState({
    date: '', time: '', address: '', lat: '', lng: '',
    tip: '', total: '', platform: '', tags: ''
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

    try {
      await fetch('http://localhost:3001/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      alert('Manual entry submitted!');

      setForm({
        date: '', time: '', address: '', lat: '', lng: '',
        tip: '', total: '', platform: '', tags: ''
      });
    } catch (err) {
      console.error('Error submitting manual form:', err);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFile(file);

    const formData = new FormData();
    formData.append('csv', file);

    try {
      await fetch('http://localhost:3001/api/deliveries/upload', {
        method: 'POST',
        body: formData,
      });

      alert('File uploaded!');
    } catch (err) {
      console.error('CSV upload error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 📋 Manual Entry Form */}
      <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['date', 'time', 'address', 'lat', 'lng', 'tip', 'total', 'platform', 'tags'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        ))}
        <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      <hr />

      <div>
        <label className="font-semibold">📁 Upload CSV:</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="block mt-2"
        />
        {csvFile && (
          <p className="text-sm text-gray-600 mt-1">Selected file: {csvFile.name}</p>
        )}
      </div>
    </div>
  );
}

export default DeliveryUploader;