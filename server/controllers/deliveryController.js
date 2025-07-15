import fs from 'fs';
import csv from 'csv-parser'; 
import axios from 'axios'; 
import Delivery from '../models/Delivery/js'; 
import dotenv from 'dotenv'; 

dotenv.config(); 
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; 

export const createDelivery = async (req, res) => {
  const { date, time, address, tip, total, platform } = req.body; 

  if (!address) return res.status(400).json({ error: 'Address required'}); 

  try {
    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      { params: { address, key: GOOGLE_API_KEY } }
    );

    const location = data.results[0]?.geometry.location;
    if (!location) return res.status(400).json({ error: 'Bad address' });

    const saved = await Delivery.create({
      date: new Date(date), 
      time, 
      lat: location.lat, 
      lng: location.lng, 
      tip: Number(tip),  
      total: Number(total),
      platform
    }); 

    res.status(201).json({ message: 'Delivery saved', delivery: saved });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Server error' }); 
  }
};

export const uploadCSV = (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: 'No file uploaded' });

  const deliveries = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', row => deliveries.push(row))
    .on('end', async () => {
      fs.unlinkSync(req.file.path);                  // cleanup temp file
      let success = 0, failed = 0;

      for (const d of deliveries) {
        try {
          // Respect Google rate limits (~50 req/s free‑tier). Simple throttle:
          await new Promise(r => setTimeout(r, 100));

          const { data } = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            { params: { address: d.address, key: GOOGLE_API_KEY } }
          );
          const loc = data.results[0]?.geometry.location;
          if (!loc) { failed++; continue; }

          await Delivery.create({
            platform: d.platform,
            address: d.address,
            tip: Number(d.tip),
            date: new Date(d.date),
            lat: loc.lat,
            lng: loc.lng,
          });
          success++;
        } catch (e) {
          failed++;
          console.error('Row failed:', d.address, e.message);
        }
      }

      res.json({
        message: 'CSV processed',
        processed: deliveries.length,
        saved: success,
        failed,
      });
    });
};