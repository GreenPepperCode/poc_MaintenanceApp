const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'));

// Lire le fichier SQL et exécuter les commandes
fs.readFile(path.join(__dirname, 'db', 'sql', 'seed_data.sql'), 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading SQL file:', err);
    return;
  }

  db.exec(data, (err) => {
    if (err) {
      console.error('Error executing SQL script:', err);
    } else {
      console.log('Data seeded successfully.');
    }
    db.close();
  });
});
