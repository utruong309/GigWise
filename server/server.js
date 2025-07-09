import express from 'express'; 
import dotenv from 'dotenv'; 
import cors from 'cors'; 
import deliveriesRouter from './router/deliveries.js'; 

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT; 

//middleware
app.use(cors()); //allows React to call backend
app.use(express.json()); //parses JSON request bodies

//base URL
app.use('/api/deliveries', deliveriesRouter); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 