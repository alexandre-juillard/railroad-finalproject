const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    open_hour: { type: String, required: true },
    close_hour: { type: String, required: true },
    image: { type: String, required: true }, // Fichier image
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Station', stationSchema);