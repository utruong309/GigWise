import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const outputPath = path.join('cluster_output.json');
  if (!fs.existsSync(outputPath)) {
    return res.status(404).json({ error: 'No clustering data yet' });
  }

  const data = fs.readFileSync(outputPath, 'utf-8');
  res.json(JSON.parse(data));
});

export default router;