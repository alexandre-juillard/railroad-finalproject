const express = require('express');
const router = express.Router();
const ticketCtrl = require('../controllers/ticketController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Billet
 *   description: Gestion des billets
 */
/**
 * @swagger
 * /tickets/create:
 *   post:
 *     summary: Créer un nouveau billet
 *     tags: [Billet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui réserve le billet
 *               trainId:
 *                 type: string
 *                 description: L'ID du train pour lequel le billet est réservé
 *     responses:
 *       201:
 *         description: Billet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet créé avec succès
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       description: L'ID de l'utilisateur ayant réservé le billet
 *                     train:
 *                       type: string
 *                       description: L'ID du train réservé
 *       404:
 *         description: Utilisateur ou train introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur lors de la création du billet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la création du billet
 *                 error:
 *                   type: string
 *                   example: "Erreur détaillée"
 */
router.post('/create', auth, ticketCtrl.createTicket);

/**
 * @swagger
 * /tickets/validate:
 *   post:
 *     summary: Valider un billet
 *     tags: [Billet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: L'ID de l'utilisateur qui possède le billet
 *               trainId:
 *                 type: string
 *                 description: L'ID du train associé au billet
 *     responses:
 *       200:
 *         description: Billet validé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet validé
 *       400:
 *         description: Billet déjà validé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet déjà validé
 *       404:
 *         description: Utilisateur, train ou billet introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet non trouvé
 *       500:
 *         description: Erreur serveur lors de la validation du billet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de validation du billet
 *                 error:
 *                   type: string
 *                   example: "Erreur détaillée"
 */
router.post('/validate', auth, ticketCtrl.validateTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Récupérer les détails d'un billet
 *     tags: [Billet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du billet à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: L'ID de l'utilisateur ayant réservé le billet
 *                 train:
 *                   type: string
 *                   description: L'ID du train associé au billet
 *                 validated:
 *                   type: boolean
 *                   description: Statut de validation du billet
 *                   example: false
 *                 validationDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date de validation du billet
 *       404:
 *         description: Billet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet non trouvé
 *       500:
 *         description: Erreur serveur lors de la récupération du billet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération du billet
 *                 error:
 *                   type: string
 *                   example: "Erreur détaillée"
 */
router.get('/:id', auth, ticketCtrl.getOneTicket);

module.exports = router;