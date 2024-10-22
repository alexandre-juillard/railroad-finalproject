const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const trainCtrl = require('../controllers/trainController');
const validateTrain = require('../middleware/validationTrain');

/**
 * @swagger
 * tags:
 *   name: Train
 *   description: Gestion des trains
 */
/**
 * @swagger
 * /trains:
 *   post:
 *     summary: Créer un nouveau train (Admin uniquement)
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du train
 *               start_station:
 *                 type: string
 *                 description: Le nom de la station de départ
 *               end_station:
 *                 type: string
 *                 description: Le nom de la station d'arrivée
 *               time_of_departure:
 *                 type: date
 *                 description: L'heure de départ (format HH:mm)
 *               time_of_arrival:
 *                 type: date
 *                 description: L'heure d'arrivée (format HH:mm)
 *     responses:
 *       201:
 *         description: Train créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Train'
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Station introuvable
 *       500:
 *         description: Erreur serveur
 */

router.post('/', validateTrain, auth, authorize(['admin']), trainCtrl.createTrain);

/**
 * @swagger
 * /trains:
 *   get:
 *     summary: Récupérer tous les trains
 *     tags: [Train]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom de train
 *       - in: query
 *         name: start_station
 *         schema:
 *           type: string
 *         description: Filtrer par station de départ
 *       - in: query
 *         name: end_station
 *         schema:
 *           type: string
 *         description: Filtrer par station d'arrivée
 *       - in: query
 *         name: time_of_departure
 *         schema:
 *           type: date
 *           format: HH:mm
 *         description: Filtrer par heure de départ
 *       - in: query
 *         name: time_of_arrival
 *         schema:
 *           type: date
 *           format: HH:mm
 *         description: Filtrer par heure d'arrivée
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limiter le nombre de résultats (par défaut 10)
 *     responses:
 *       200:
 *         description: Liste des trains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Train'
 *       404:
 *          description: Train non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get('/', trainCtrl.getAllTrains);

/**
 * @swagger
 * /trains/{id}:
 *   get:
 *     summary: Récupérer un train par son ID
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID du train
 *     responses:
 *       200:
 *         description: Détails du train
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Train'
 *       404:
 *         description: Train non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get('/:id', auth, trainCtrl.getOneTrain);

/**
 * @swagger
 * /trains/{id}:
 *   put:
 *     summary: Mettre à jour un train (Admin uniquement)
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID du train
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               start_station:
 *                 type: string
 *               end_station:
 *                 type: string
 *               time_of_departure:
 *                 type: date
 *                 format: HH:mm
 *               time_of_arrival:
 *                 type: date
 *                 format: HH:mm
 *     responses:
 *       200:
 *         description: Train mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Train'
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Train non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.put('/:id', validateTrain, auth, authorize(['admin']), trainCtrl.updateTrain);

/**
 * @swagger
 * /trains/{id}:
 *   delete:
 *     summary: Supprimer un train (Admin uniquement)
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID du train à supprimer
 *     responses:
 *       200:
 *         description: Train supprimé avec succès
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Train non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.delete('/:id', auth, authorize(['admin']), trainCtrl.deleteTrain);

module.exports = router;