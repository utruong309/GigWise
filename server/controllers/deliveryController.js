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