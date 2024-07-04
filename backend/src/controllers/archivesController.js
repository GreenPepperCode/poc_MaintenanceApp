const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

// Obtenir toutes les archives
exports.getAllArchives = (req, res) => {
    const sql = 'SELECT * FROM Archives';
    db.all(sql, [], (err, rows) => {
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

// Ajouter une archive
exports.addArchive = (req, res) => {
    const { nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time } = req.body;
    const sql = 'INSERT INTO Archives (nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, ...req.body }
        });
    });
};

// Mettre à jour une archive
exports.updateArchive = (req, res) => {
    const { nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE Archives SET nature = ?, provider_id = ?, periodicity = ?, building_id = ?, maintenance_date = ?, maintenance_time = ?, maintenance_period = ?, status = ?, reason = ?, cart_number = ?, creation_date = ?, creation_time = ?, modification_date = ?, modification_time = ? WHERE id = ?';
    const params = [nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time, id];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id, ...req.body }
        });
    });
};

// Supprimer une archive
exports.deleteArchive = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Archives WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "deleted",
            "data": { id }
        });
    });
};
