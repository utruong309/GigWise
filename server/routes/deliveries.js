import express from 'express'; 
import {
    createDelivery, 
    uploadCSV
} from '../controllers/deliveryController.js'; 
import upload from '../middleware/upload.js'; 
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';


const router = express.Router(); 

//POST /api/deliveries
router.post('/', verifyFirebaseToken, createDelivery); //manual form

//POST /api/deliveries/upload 
router.post('/upload', verifyFirebaseToken, upload.single('csv'), uploadCSV); 

export default router; 