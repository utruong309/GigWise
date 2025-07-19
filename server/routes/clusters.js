import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// POST /api/clusters/run
router.post('/run', (req, res) => {
  const scriptPath = path.join(process.cwd(), 'clustering.py');

  exec(`python3 "${scriptPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Clustering failed:', stderr);
      return res.status(500).json({ error: 'Clustering failed', details: stderr });
    }

    console.log('Clustering output:', stdout);
    res.json({ message: 'Clustering completed' });
  });
});

// GET /api/clusters
router.get('/', (req, res) => {
  const filePath = path.join(process.cwd(), 'cluster_output.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'No clustering data yet' });
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) {
    console.error('Failed to parse cluster_output.json:', err);
    res.status(500).json({ error: 'Failed to parse clustering result' });
  }
});

export default router;