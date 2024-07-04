const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Routes pour les statistiques
router.get('/summary', statisticsController.getSummary);
router.get('/providers', statisticsController.getProvidersStats);

module.exports = router;
