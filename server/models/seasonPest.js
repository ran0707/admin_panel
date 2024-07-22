// models/User.js
const mongoose = require('mongoose');

const PestSchema = new mongoose.Schema({
  pestName: String,
  month: String,
  createdDate: {type: Date, default: Date.now},
  images: [{data: Buffer, contentType: String}],
});

const Pests = mongoose.model('Pests', PestSchema);

module.exports = Pests;
