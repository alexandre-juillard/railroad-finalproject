const Joi = require('joi');

// Définir un schéma de validation pour une station
const stationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Le nom de la station ne peut pas être vide.',
        'string.min': 'Le nom de la station doit contenir au moins {#limit} caractères.',
        'string.max': 'Le nom de la station ne peut pas dépasser {#limit} caractères.',
        'any.required': 'Le nom de la station est requis.'
    }),
    open_hour: Joi.string().required().messages({
        'string.empty': 'L\'heure d\'ouverture ne peut pas être vide.',
        'any.required': 'L\'heure d\'ouverture est requise.'
    }),
    close_hour: Joi.string().required().messages({
        'string.empty': 'L\'heure de fermeture ne peut pas être vide.',
        'any.required': 'L\'heure de fermeture est requise.'
    }),
    image: Joi.string().required().messages({
        'string.empty': 'L\'image ne peut pas être vide.',
        'any.required': 'L\'image est requise.'
    })
});

// Middleware de validation
const validateStation = (req, res, next) => {
    const { error } = stationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateStation;