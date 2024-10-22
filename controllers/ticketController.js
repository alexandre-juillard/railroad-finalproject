const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Train = require('../models/Train');

exports.createTicket = async (req, res) => {
    try {
        const loggedUserId = req.auth.userId;
        if (!loggedUserId) {
            return res.status(401).json({ message: 'Utilisateur non connecté' });
        }
        const { trainId } = req.body;

        //Verifier si l'utilisateur existe
        const user = await User.findById(loggedUserId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        //Verifier si le train existe
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ message: 'Train non trouvé' });
        }

        const newTicket = new Ticket({
            user: loggedUserId,
            train: trainId
        });

        await newTicket.save();
        res.status(201).json({ message: 'Billet créé avec succès', ticket: newTicket });
    } catch (error) {
        console.log('Erreur de création du billet : ', error);
        res.status(500).json({ message: 'Erreur lors de la création du billet', error });
    }
};

exports.validateTicket = async (req, res) => {
    try {
        const loggedUserId = req.auth.userId;
        const { trainId } = req.body;

        //Verifier si l'utilisateur existe
        const user = await User.findById(loggedUserId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        //Verifier si le train existe
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ message: 'Train non trouvé' });
        }

        //Verifier si le billet existe
        const ticket = await Ticket.findOne({ user: loggedUserId, train: trainId });
        if (!ticket) {
            return res.status(404).json({ message: 'Billet non trouvé' });
        }

        //Verifier si le billet est déjà validé
        if (ticket.validated) {
            return res.status(400).json({ message: 'Billet déjà validé' });
        }

        //Valider le billet
        ticket.validated = true;
        ticket.validationDate = new Date();

        res.status(200).json({ message: 'Billet validé avec succès' });
    } catch (error) {
        console.log('Erreur de validation du billet : ', error);
        res.status(500).json({ message: 'Erreur lors de validation du billet', error });
    }
};

exports.getUserTickets = async (req, res) => {
    try {
        //Verifier si l'utilisateur est connecté
        const loggedUserId = req.auth.userId;
        const user = await User.findById(loggedUserId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const tickets = await Ticket.find({ user: loggedUserId });
        if (!tickets) {
            return res.status(404).json({ message: 'Billet non trouvé' });
        }
        res.status(200).json(tickets);
    } catch (error) {
        console.log('Erreur de récupération des billets : ', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des billets', error });
    }
};

exports.checkTicketValidation = async (req, res) => {
    try {
        const loggedUser = req.auth;
        if (loggedUser.role === 'admin') {
            const ticketId = req.params.id;
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) {
                return res.status(404).json({ message: 'Billet non trouvé' });
            } else {
                return res.status(200).json({ validated: ticket.validated, validationDate: ticket.validationDate });
            }
        } else {
            return res.status(403).json({ message: 'Accès refusé' });
        }
    } catch (error) {
        // console.log('Erreur de vérification de la validation du billet : ', error);
        res.status(500).json({ message: 'Erreur lors de la vérification de la validation du billet', error });
    }
};