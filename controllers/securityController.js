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

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect.' });
        }

        // Vérifier si le mot de passe est correct
        const validPassword = await brcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect.' });
        }

        //Créer le JWT
        const token = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
        res.status(200).json({
            message: 'Connexion réussie.',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.', error });
    }
};