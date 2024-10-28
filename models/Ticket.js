const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    user: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    train: {
        type: mongoose.Schema.Types.Number,
        ref: 'Train',
        required: true
    },
    validated: { type: Boolean, default: false },
    validationDate: { type: Date, default: null }
});

module.exports = mongoose.model('Ticket', ticketSchema);