import express from 'express'; 
import {
    createDelivery, 
    uploadCSV
} from '../controllers/deliveryController.js'; 
import upload from '../middleware/upload.js'; 

const router = express.Router(); 

//POST /api/deliveries
router.post('/', createDelivery); //manual form

//POST /api/deliveries/upload 
router.post('/upload', upload.single('csv'), uploadCSV); 

export default router; 