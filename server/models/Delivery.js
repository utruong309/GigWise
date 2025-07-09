const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  userId: String,
  date: String, //convert to Data object later 
  time: String,
  address: String,
  lat: Number,
  lng: Number,
  tip: Number,
  total: Number,
  platform: String,
  tags: [String],
});

module.exports = mongoose.model("Delivery", DeliverySchema);