import mongoose from 'mongoose'; 

const DeliverySchema = new mongoose.Schema({
  userId: String,
  date: String, //convert to Date object later 
  time: String,
  address: String,
  lat: Number,
  lng: Number,
  tip: Number,
  total: Number,
  platform: String, 
});

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;