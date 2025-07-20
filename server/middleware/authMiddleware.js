import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let serviceAccount;

if (!admin.apps.length) {
  try {
    const base64 = process.env.FIREBASE_CONFIG_BASE64;
    if (!base64) throw new Error('Missing FIREBASE_CONFIG_BASE64 env variable');

    const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(jsonString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase Admin initialized');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error.message);
  }
}

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; 
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};