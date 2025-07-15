const mongoose = require("mongoose");

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

module.exports = mongoose.model("Delivery", DeliverySchema);