import React, { useState } from 'react';

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
    <div className="max-w-4xl mx-auto space-y-12 p-6">
      {/* Manual Form Section */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12">
        <div className="flex items-center justify-center mb-12">
          <span className="text-4xl mr-4">📋</span>
          <h2 className="text-4xl font-bold text-gray-800">Manual Delivery Entry</h2>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-0">
          {/* Date + Time */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>

          {/* Lat + Lng */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Latitude</label>
              <input
                type="text"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Enter latitude"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Longitude</label>
              <input
                type="text"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Enter longitude"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Tip + Total */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Tip</label>
              <input
                type="number"
                name="tip"
                value={form.tip}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Total</label>
              <input
                type="number"
                name="total"
                value={form.total}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Platform */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Platform</label>
            <input
              type="text"
              name="platform"
              value={form.platform}
              onChange={handleChange}
              placeholder="Uber Eats, DoorDash, etc."
              className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Submit
          </button>
        </form>
      </div>
  
      {/* CSV Upload Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
        <div className="flex items-center justify-center mb-12">
          <span className="text-4xl mr-4">📁</span>
          <h2 className="text-4xl font-bold text-gray-800">Upload CSV File</h2>
        </div>
  
        <div className="space-y-8">
          <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all bg-gray-50 hover:bg-blue-50">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="block w-full text-xl text-gray-700 file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-xl file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 focus:outline-none cursor-pointer"
            />
          </div>
  
          <div className="text-center">
            {csvFile ? (
              <p className="text-2xl text-green-600 font-bold">Selected: {csvFile.name}</p>
            ) : (
              <p className="text-2xl text-gray-500 font-semibold">No file chosen</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );   
}