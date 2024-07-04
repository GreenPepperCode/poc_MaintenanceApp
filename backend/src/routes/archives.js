const express = require('express');
const router = express.Router();
const archivesController = require('../controllers/archivesController');

// Routes pour les archives
router.get('/', archivesController.getAllArchives);
router.post('/', archivesController.addArchive);
router.put('/:id', archivesController.updateArchive);
router.delete('/:id', archivesController.deleteArchive);

module.exports = router;
