const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Counter = require('../models/Counter');
const User = require('../models/User');

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
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect.' });
        }

        // Vérifier si le mot de passe est correct
        const validPassword = await brcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect.' });
        }

        //Créer le JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
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

exports.getAllUsers = async (req, res) => {
    try {
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté

        if (loggedUserRole === 'admin') {
            const users = await User.find();
            res.status(200).json(users);
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.', error });
    }
};

exports.getOneUser = async (req, res) => {
    try {
        const userId = req.params.id; // Id du user en paramètres
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté

        console.log(`Requested User Logged: ${loggedUser}`);
        console.log(`Logged User Role: ${loggedUserRole}`);
        console.log(`Requested User ID: ${userId}`);
        console.log(`Logged User ID: ${loggedUserId}`);

        if (loggedUserRole === 'admin' || loggedUserId.toString() === userId.toString()) {
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'Utilisateur inconnu' });
            }
            console.log('User found:', user);
            res.status(200).json(user);
        } else {
            console.log('Access denied');
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' });
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Id du user en paramètres
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté

        if (loggedUserId.toString() === userId.toString() || loggedUserRole === 'admin') {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur inconnu' });
            }
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
            res.status(200).json({ message: 'Utilisateur modifié', updatedUser });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet utilisateur.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de l\'utilisateur.', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedUserId = req.auth.userId;

        if (loggedUserId.toString() === userId.toString()) {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet utilisateur.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.', error });
    }
};