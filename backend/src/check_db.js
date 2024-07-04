const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'));

db.all('SELECT * FROM Maintenance', [], (err, rows) => {
    if (err) {
        console.error("Error fetching data: ", err.message);
        return;
    }
    console.log("Data from Maintenance table:", rows);
});
