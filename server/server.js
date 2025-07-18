import express from 'express'; 
import dotenv from 'dotenv'; 
import cors from 'cors'; 
import deliveriesRouter from './routes/deliveries.js'; 
import mongoose from 'mongoose'; 
import clusterRouter from './routes/clusters.js';
import askRouter from './routes/ask.js';

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 3001; 

//middleware
app.use(cors()); //allows React to call backend
app.use(express.json()); //parses JSON request bodies

//base URL
app.use('/api/deliveries', deliveriesRouter); 
app.use('/api/clusters', clusterRouter);
app.use('/api/ask-ai', askRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); //exit if DB fails
  });