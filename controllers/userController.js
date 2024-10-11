const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Counter = require('../models/Counter');

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur déjà existant.' });
        }

        // Vérifier si l'email existe déjà
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email déjà existant.' });
        }

        //Hasher le mot de passe
        const hashedPassword = await brcrypt.hash(password, 10);
        const userId = await getNextSequenceValue('userId');

        // Créer un nouvel utilisateur
        const newUser = new User({
            _id: userId,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error });
    }
};