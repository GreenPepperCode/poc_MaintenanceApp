const express = require('express');
const router = express.Router();
const providersController = require('../controllers/providersController');

// Routes pour les prestataires
router.get('/', providersController.getAllProviders);
router.post('/', providersController.addProvider);
router.put('/:id', providersController.updateProvider);
router.delete('/:id', providersController.deleteProvider);

module.exports = router;
