const { default: mongoose } = require("mongoose");

const contentSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
});

const Content = mongoose.model('Content', contentSchema);