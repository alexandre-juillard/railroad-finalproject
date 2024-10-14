const Train = require('../models/Train');
const Station = require('../models/Station');
const Counter = require('../models/Counter');
const User = require('../models/User');

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

exports.createTrain = async (req, res) => {
    const {
        name,
        start_station,
        end_station,
        time_of_departure,
        time_of_arrival
    } = req.body;

    try {
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté

        if (loggedUserRole === 'admin') {
            const trainId = await getNextSequenceValue('trainId');

            // Rechercher les gares par leur nom
            const startStation = await Station.findOne({ name: start_station });
            const endStation = await Station.findOne({ name: end_station });

            if (!start_station || !end_station) {
                return res.status(404).json({ message: 'Une ou plusieurs stations spécifiées sont introuvables.' });
            }

            const newTrain = new Train({
                _id: trainId,
                name,
                start_station: startStation._id,
                end_station: endStation._id,
                time_of_departure,
                time_of_arrival
            });

            await newTrain.save();

            res.status(201).json({
                message: 'Train créé avec succès.',
                train: {
                    _id: newTrain._id,
                    name: newTrain.name,
                    start_station: newTrain.start_station,
                    end_station: newTrain.end_station,
                    time_of_departure: newTrain.time_of_departure,
                    time_of_arrival: newTrain.time_of_arrival
                }
            });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à créer un train.' });
        }
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: 'Erreur lors de la création du train.', error });
    }
}

exports.getAllTrains = async (req, res) => {
    try {
        //Récupérer les filtres et la limite de la requête
        const {
            name,
            start_station,
            end_station,
            time_of_departure,
            time_of_arrival,
            limit = 10
        } = req.query;

        //Construire le filtre de recherche
        const filter = {};
        if (name) filter.name = name;
        if (start_station) filter.start_station = start_station;
        if (end_station) filter.end_station = end_station;
        if (time_of_departure) filter.time_of_departure = time_of_departure;
        if (time_of_arrival) filter.time_of_arrival = time_of_arrival;

        //Récupérer les trains avec filtre et limite
        const trains = await Train.find(filter).limit(parseInt(limit));
        if (trains.length === 0) {
            return res.status(404).json({ message: 'Aucun train correspondant à cette recherche.' });
        }
        res.status(200).json(trains);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des trains.', error });
    }
}

exports.getOneTrain = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) {
            return res.status(404).json({ message: 'Aucun train correspondant à cette recherche.' });
        }
        res.status(200).json(train);
    } catch (error) {
        res.status(404).json({ message: 'Train inconnu', error });
    }
}

exports.updateTrain = async (req, res) => {
    try {
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté
        const trainId = req.params.id;

        if (loggedUserRole === 'admin') {
            const train = await Train.findById(trainId);
            if (!train) {
                return res.status(404).json({ message: 'Train inconnu' });
            }
            const updatedTrain = await Train.findByIdAndUpdate(trainId, req.body, { new: true, runValidators: true });
            res.status(200).json({ message: 'Train modifié', updatedTrain });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce train.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du train.', error });
    }
}

exports.deleteTrain = async (req, res) => {
    try {
        const loggedUserId = req.auth.userId; //ID du user connecté
        const loggedUser = await User.findById(loggedUserId); // User connecté
        const loggedUserRole = loggedUser.role; // Rôle du user connecté
        const trainId = req.params.id;
        if (loggedUserRole === 'admin') {
            const train = await Train.findById(trainId);
            if (!train) {
                return res.status(404).json({ message: 'Train inconnu' });
            }
            await Train.findByIdAndDelete(trainId);
            res.status(200).json({ message: 'Train supprimé avec succès.' });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce train.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du train.', error });
    }
}