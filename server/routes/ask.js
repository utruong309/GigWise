import express from 'express';
import admin from 'firebase-admin';
import { askGemini } from '../ai/askGemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const { question } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const userId = decoded.uid;

    const answer = await askGemini(userId, question); 
    res.json({ answer });                            
  } catch (err) {
    console.error('AI endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;