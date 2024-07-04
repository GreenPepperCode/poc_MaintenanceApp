const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Routes pour les maintenances
router.get('/', maintenanceController.getAllMaintenances);
router.post('/', maintenanceController.addMaintenance);
router.put('/:id', maintenanceController.updateMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;
