const Joi = require('joi');

// Définir un schéma de validation pour un train
const trainSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Le nom du train ne peut pas être vide.',
        'string.min': 'Le nom du train doit contenir au moins {#limit} caractères.',
        'string.max': 'Le nom du train ne peut pas dépasser {#limit} caractères.',
        'any.required': 'Le nom du train est requis.'
    }),
    start_station: Joi.number().required().messages({
        'any.required': 'La gare de départ est requise.'
    }),
    end_station: Joi.number().required().messages({
        'any.required': 'La gare d\'arrivée est requise.'
    }),
    time_of_departure: Joi.string().required().messages({
        'string.empty': 'L\'heure de départ ne peut pas être vide.',
        'any.required': 'L\'heure de départ est requise.'
    }),
    time_of_arrival: Joi.string().required().messages({
        'string.empty': 'L\'heure d\'arrivée ne peut pas être vide.',
        'any.required': 'L\'heure d\'arrivée est requise.'
    })
});

// Middleware de validation
const validateTrain = (req, res, next) => {
    const { error } = trainSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateTrain;