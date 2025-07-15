import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import Delivery from '../models/Delivery.js';     
import dotenv from 'dotenv';

dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function geocode(address) {
  const { data } = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    { params: { address, key: GOOGLE_API_KEY } }
  );

  const loc = data.results[0]?.geometry.location;
  if (!loc) throw new Error('Invalid address for geocoding');
  return loc; 
}

export const createDelivery = async (req, res) => {
  const { date, time, address, tip, total, platform } = req.body;
  const userId = req.user?.uid;                          

  if (!userId) return res.status(401).json({ error: 'No user ID found' });
  if (!address) return res.status(400).json({ error: 'Address required' });

  try {
    const { lat, lng } = await geocode(address);

    const delivery = await Delivery.create({
      userId,
      date,
      time,
      address,
      lat,
      lng,
      tip: Number(tip) || 0,
      total: Number(total) || 0,
      platform,
    });

    res.status(201).json({ message: 'Delivery saved', delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const uploadCSV = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const userId = req.user?.uid;
  if (!userId) return res.status(401).json({ error: 'No user ID found' });

  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      fs.unlinkSync(req.file.path); //delete temp file

      let success = 0;
      let failed = 0;

      for (const r of rows) {
        try {
          await new Promise((rslv) => setTimeout(rslv, 100)); //rate‑limit

          const { lat, lng } = await geocode(r.address);

          await Delivery.create({
            userId,                   //same Firebase user for every row
            date: r.date,
            time: r.time,
            address: r.address,
            lat,
            lng,
            tip: Number(r.tip) || 0,
            total: Number(r.total) || 0,
            platform: r.platform,
          });

          success++;
        } catch (e) {
          failed++;
          console.error(`Failed (${r.address}):`, e.message);
        }
      }

      res.json({
        message: 'CSV processed',
        processed: rows.length,
        saved: success,
        failed,
      });
    });
};