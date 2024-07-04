const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// Routes pour le calendrier
router.get('/week', calendarController.getWeekView);
router.get('/month', calendarController.getMonthView);

module.exports = router;
