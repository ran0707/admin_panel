// models/recommendation.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    label: { type: String, required: true },
    symptoms: { type: String, required: true },
    recommendation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Recommendataion = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendataion;