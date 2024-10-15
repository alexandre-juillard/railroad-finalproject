const express = require('express');
const router = express.Router();
const stationCtrl = require('../controllers/stationController');
const { upload, resizeImage } = require('../middleware/upload');
const { auth, authorize } = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   name: Station
 *   description: Gestion des station
 */
/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Créer une nouvelle station
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la station
 *               open_hour:
 *                 type: string
 *                 description: L'heure d'ouverture (format HH:mm)
 *               close_hour:
 *                 type: string
 *                 description: L'heure de fermeture (format HH:mm)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: L'image de la station
 *     responses:
 *       201:
 *         description: Station créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

router.post('/', auth, authorize(['admin']), upload.single('image'), resizeImage, stationCtrl.createStation);

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Récupérer toutes les stations
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom de station
 *     responses:
 *       200:
 *         description: Liste des stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 *       400:
 *          description: Aucune gare trouvée
 *       500:
 *         description: Erreur serveur
 */

router.get('/', auth, stationCtrl.getAllStations);

/**
 * @swagger
 * /stations/{id}:
 *   put:
 *     summary: Mettre à jour une station
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de la station
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               open_hour:
 *                 type: string
 *               close_hour:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Station mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Station non trouvée
 *       500:
 *         description: Erreur serveur
 */

router.put('/:id', auth, authorize(['admin']), upload.single('image'), resizeImage, stationCtrl.updateStation);

/**
 * @swagger
 * /stations/{id}:
 *   delete:
 *     summary: Supprimer une station
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de la station à supprimer
 *     responses:
 *       200:
 *         description: Station supprimée avec succès
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Station non trouvée
 *       500:
 *         description: Erreur serveur
 */

router.delete('/:id', authorize(['admin']), auth, stationCtrl.deleteStation);

module.exports = router;