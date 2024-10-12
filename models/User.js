const mongoose = require('mongoose');
const uniqueValidatore = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidatore);
module.exports = mongoose.model('User', userSchema);