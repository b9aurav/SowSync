var express = require('express');
var router = express.Router();

var farmerController = require('../controllers/farmerController');
var farmController = require('../controllers/farmController');
var scheduleController = require('../controllers/scheduleController');

router.post('/getFarmers', farmerController.getFarmers);
router.post('/addFarmer', farmerController.addFarmer);
router.post('/removeFarmer', farmerController.removeFarmer);
router.post('/updateFarmer', farmerController.updateFarmer);

router.post('/getFarms', farmController.getFarms);
router.post('/addFarm', farmController.addFarm);
router.post('/removeFarm', farmController.removeFarm);
router.post('/updateFarm', farmController.updateFarm);

router.post('/getSchedules', scheduleController.getSchedules);
router.post('/addSchedule', scheduleController.addSchedule);
router.post('/removeSchedule', scheduleController.removeSchedule);
router.post('/updateSchedule', scheduleController.updateSchedule);

module.exports = router;