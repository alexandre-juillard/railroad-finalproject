const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const trainCtrl = require('../controllers/trainController');

router.post('/trains', auth, trainCtrl.createTrain);

router.get('/trains', trainCtrl.getAllTrains);

router.get('/trains/:id', trainCtrl.getOneTrain);

router.put('/trains/:id', auth, trainCtrl.updateTrain);

router.delete('/trains/:id', auth, trainCtrl.deleteTrain);

module.exports = router;