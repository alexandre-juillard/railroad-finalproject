const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Configuration de stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // Dossier de destination des fichiers
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier
    }
});

// Filtre pour accepter uniquement les fichiers image
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith('image/') && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Merci de télécharger un fichier de type image : .jpg, .jpeg, .png, .webp'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Middleware pour redimensionner les images
const resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const filePath = req.file.path;
    const resizedFilePath = `public/images/resized-${req.file.filename}`;

    try {
        await sharp(filePath)
            .resize(200, 200)
            .toFile(resizedFilePath);

        // Supprimer l'image originale si vous ne souhaitez conserver que l'image redimensionnée
        fs.unlinkSync(filePath);

        // Mettre à jour le chemin du fichier dans la requête
        req.file.path = resizedFilePath;
        req.file.filename = `resized-${req.file.filename}`;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { upload, resizeImage };