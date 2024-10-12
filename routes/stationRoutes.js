const express = require('express');
const router = express.Router();
const stationCtrl = require('../controllers/stationController');
const { upload, resizeImage } = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/stations', auth, upload.single('image'), resizeImage, stationCtrl.createStation);

module.exports = router;