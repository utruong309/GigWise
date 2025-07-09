import fs from 'fs';
import csv from 'csv-parser'; 

export const createDelivery = (req, res) => {
  const data = req.body;
  console.log('Manual entry form submitted:', data);
  res.status(201).json({ message: 'Delivery saved' });
};

export const uploadCSV = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row); //push each parsed row into results array
    })
    .on('end', () => {
      console.log('CSV parsed:', results.length, 'records');
      fs.unlinkSync(req.file.path); //delete the file after reading
      res.json({ message: 'CSV uploaded', records: results.length });
    });
};