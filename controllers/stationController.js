const Station = require('../models/stationModel');
const Counter = require('../models/Counter');

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

exports.createStation = async (req, res) => {
    const { name, open_hour, close_hour } = req.body;
    const image = req.files ? req.file.path : null

    try {
        const loggedUserRole = req.user.role;
        if (loggedUserRole === 'admin') {
            const stationId = await getNextSequenceValue('stationId');

            const newStation = new Station({
                _id: stationId,
                name,
                open_hour,
                close_hour,
                image
            });

            await newStation.save();
            res.status(201).json({
                message: 'Station créée avec succès.',
                station: {
                    _id: newStation._id,
                    name: newStation.name,
                    open_hour: newStation.open_hour,
                    close_hour: newStation.close_hour,
                    image: newStation.image
                }
            });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à créer une station.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la station.', error });
    }

};

exports.getAllStations = async (req, res) => {
    try {
        //Récupérer les filtres
        const { name } = req.query;

        const filter = {};
        if (name) {
            filter.name = name;
        }

        const stations = await Station.find(filter);
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des stations.', error });
    }
};

exports.updateStation = async (req, res) => {
    try {
        const loggedUserRole = req.user.role;
        const stationId = req.params.id;

        if (loggedUserRole === 'admin') {
            const updatedStation = await Station.findByIdAndUpdate(stationId, req.body, { new: true, runValidators: true });
            res.status(200).json({ message: 'Station modifiée', updatedStation });
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette station.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de la station.', error });
    }
};

exports.deleteStation = async (req, res) => {
    try {
        const loggedUserRole = req.user.role;
        const stationId = req.params.id;

        if (loggedUserRole === 'admin') {
            const deletedStation = await Station.findByIdAndDelete(stationId);
            if (!deletedStation) {
                return res.status(404).json({ message: 'Station inconnue.' });
            } else {
                res.status(200).json({ message: 'Station et trains associés supprimés.' });
            }
        } else {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette station.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la station.', error });
    }
};
