const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

// Obtenir la vue hebdomadaire des maintenances
exports.getWeekView = (req, res) => {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    const sql = 'SELECT * FROM Maintenance WHERE maintenance_date BETWEEN ? AND ?';
    db.all(sql, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
};

// Obtenir la vue mensuelle des maintenances
exports.getMonthView = (req, res) => {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    const sql = 'SELECT * FROM Maintenance WHERE maintenance_date BETWEEN ? AND ?';
    db.all(sql, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
};
