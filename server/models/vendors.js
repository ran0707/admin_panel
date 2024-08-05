// models/vendorModel.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
