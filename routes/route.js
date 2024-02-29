var express = require('express');
var router = express.Router();

var farmerController = require('../controllers/farmerController');

router.post('/getFarmers', farmerController.getFarmers);
router.post('/addFarmer', farmerController.addFarmer);
router.post('/removeFarmer', farmerController.removeFarmer);
router.post('/updateFarmer', farmerController.updateFarmer);

module.exports = router;