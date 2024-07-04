const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

// Obtenir un résumé des statistiques
exports.getSummary = (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_maintenances,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_maintenances,
            SUM(CASE WHEN status = 'Planned' THEN 1 ELSE 0 END) as planned_maintenances
        FROM Maintenance
    `;
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
};

// Obtenir les statistiques des prestataires
exports.getProvidersStats = (req, res) => {
    const sql = `
        SELECT 
            p.name,
            COUNT(m.id) as total_maintenances,
            SUM(CASE WHEN m.status = 'Completed' THEN 1 ELSE 0 END) as completed_maintenances,
            SUM(CASE WHEN m.status = 'Planned' THEN 1 ELSE 0 END) as planned_maintenances
        FROM Maintenance m
        JOIN Annuaire p ON m.provider_id = p.id
        GROUP BY p.name
    `;
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
