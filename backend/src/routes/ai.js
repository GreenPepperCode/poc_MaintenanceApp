const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Routes pour l'IA
router.post('/train', aiController.trainModel);
router.get('/metrics', aiController.getMetrics);
router.post('/save', aiController.saveModel);
router.get('/models', aiController.getModels);
router.post('/use', aiController.predictMaintenance);

module.exports = router;
