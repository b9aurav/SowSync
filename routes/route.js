var express = require('express');
var router = express.Router();

var farmerController = require('../controllers/farmerController');
var farmController = require('../controllers/farmController');
var scheduleController = require('../controllers/scheduleController');

router.post('/getFarmers', farmerController.getFarmers);
router.post('/getFarmerById', farmerController.getFarmerById);
router.post('/addFarmer', farmerController.validateFarmer, farmerController.addFarmer);
router.post('/removeFarmer', farmerController.removeFarmer);
router.post('/updateFarmer', farmerController.validateFarmer, farmerController.updateFarmer);
router.post('/getFarmersGrowingCrop', farmerController.getFarmersGrowingCrop);
router.post('/calculateBill', farmerController.validateBillInputs, farmerController.calculateBill);

router.post('/getFarms', farmController.getFarms);
router.post('/getFarmById', farmController.getFarmById);
router.post('/getFarmsByFarmerId', farmController.getFarmsByFarmerId);
router.post('/addFarm', farmController.validateFarmInputs, farmController.addFarm);
router.post('/removeFarm', farmController.removeFarm);
router.post('/updateFarm', farmController.validateFarmInputs, farmController.updateFarm);

router.post('/getSchedules', scheduleController.getSchedules);
router.post('/getScheduleById', scheduleController.getScheduleById);
router.post('/getSchedulesByFarmId', scheduleController.getSchedulesByFarmId);
router.post('/addSchedule', scheduleController.validateSchedule, scheduleController.addSchedule);
router.post('/removeSchedule', scheduleController.removeSchedule);
router.post('/updateSchedule', scheduleController.validateSchedule, scheduleController.updateSchedule);
router.post('/getSchedulesDue', scheduleController.getSchedulesDue);

module.exports = router;