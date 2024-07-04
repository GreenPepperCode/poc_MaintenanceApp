const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const providersRouter = require('./routes/providers');
const maintenanceRouter = require('./routes/maintenance');
const archivesRouter = require('./routes/archives');
const calendarRouter = require('./routes/calendar');
const statisticsRouter = require('./routes/statistics');
const aiRouter = require('./routes/ai');

app.use('/api/providers', providersRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/archives', archivesRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/ai', aiRouter);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
