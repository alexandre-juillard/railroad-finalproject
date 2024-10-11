const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupérer le token de l'en-tête Authorization (format: Bearer <token>)
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing Authorization header' });
        }

        const token = authHeader.split(' ')[1]; // On extrait le token
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        // Vérification du token avec le secret
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (error, decodedToken) => {
            if (error) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // console.log('Decoded JWT:', decodedToken); // Afficher le token JWT décodé
            const userId = decodedToken.userId;
            const role = decodedToken.role;

            // Stocker les informations du token dans req.auth
            req.auth = { userId: userId, role: role };

            // Continuer l'exécution de la route
            next();
        });
    } catch (error) {
        // Gérer les erreurs (erreur de vérification du token ou autres)
        // console.error('JWT verification failed:', error);
        res.status(401).json({ error: 'Unauthorized request!' });
    }
};