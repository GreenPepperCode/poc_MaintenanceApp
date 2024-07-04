const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

// Obtenir tous les prestataires
exports.getAllProviders = (req, res) => {
    const sql = 'SELECT * FROM Annuaire';
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

// Ajouter un prestataire
exports.addProvider = (req, res) => {
    const { name, phone, email } = req.body;
    const sql = 'INSERT INTO Annuaire (name, phone, email) VALUES (?, ?, ?)';
    const params = [name, phone, email];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, name, phone, email }
        });
    });
};

// Mettre à jour un prestataire
exports.updateProvider = (req, res) => {
    const { name, phone, email } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE Annuaire SET name = ?, phone = ?, email = ? WHERE id = ?';
    const params = [name, phone, email, id];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id, name, phone, email }
        });
    });
};

// Supprimer un prestataire
exports.deleteProvider = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Annuaire WHERE id = ?';
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
