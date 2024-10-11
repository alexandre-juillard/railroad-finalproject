const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    start_station: { type: String, required: true },
    end_station: { type: String, required: true },
    time_of_departure: { type: Date, required: true },
    time_of_arrival: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Train', trainSchema);