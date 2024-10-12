const mongoose = require('mongoose');
const Train = require('./Train');

const stationSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    open_hour: { type: String, required: true },
    close_hour: { type: String, required: true },
    image: { type: String, required: true }, // Fichier image
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware pour supprimer les trains associés à une station
stationSchema.pre('findOneAndDelete', async function (next) {
    const stationId = this.getQuery()._id;
    await Train.deleteMany({ start_station: stationId });
    next();
});

module.exports = mongoose.model('Station', stationSchema);