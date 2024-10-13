const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const loggedUserRole = req.user.role;

        if (loggedUserRole !== 'admin') {
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
        const loggedUserRole = req.user.role;

        if (loggedUserRole !== 'admin') {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Utilisateur inconnu', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedUser = req.user._id;
        const loggedUserRole = req.user.role;

        if (loggedUser === userId || loggedUserRole === 'admin') {
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
        const loggedUser = req.user._id;

        if (loggedUser === userId) {
            await User.findByIdAndDelete(userId);
            res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet utilisateur.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.', error });
    }
};