const Joi = require('joi');

// Définir un schéma de validation pour un utilisateur avec des messages d'erreur personnalisés
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Le nom d\'utilisateur ne peut pas être vide.',
        'string.min': 'Le nom d\'utilisateur doit contenir au moins {#limit} caractères.',
        'string.max': 'Le nom d\'utilisateur ne peut pas dépasser {#limit} caractères.',
        'any.required': 'Le nom d\'utilisateur est requis.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'L\'email doit être une adresse email valide.',
        'string.empty': 'L\'email ne peut pas être vide.',
        'any.required': 'L\'email est requis.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Le mot de passe ne peut pas être vide.',
        'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères.',
        'any.required': 'Le mot de passe est requis.'
    }),
});

// Middleware de validation
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateUser;