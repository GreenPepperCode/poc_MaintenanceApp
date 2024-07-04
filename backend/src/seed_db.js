const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'));

// Fonction pour insérer les données de l'annuaire
function seedAnnuaire() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'db', 'sql', 'seed_data.sql'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading SQL file:', err);
        return reject(err);
      }

      db.exec(data, (err) => {
        if (err) {
          console.error('Error executing SQL script:', err);
          return reject(err);
        } else {
          console.log('Annuaire data seeded successfully.');
          resolve();
        }
      });
    });
  });
}

// Fonction pour normaliser les noms des fournisseurs
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Fonction pour insérer les données à partir du fichier Excel
function seedFromExcel() {
  return new Promise((resolve, reject) => {
    const excelPath = 'C:\\Users\\yzi\\Desktop\\Perso\\poc_MaintenanceApp\\backend\\Historique_Interventions_Généré.xlsx';
    const workbook = new ExcelJS.Workbook();
    
    workbook.xlsx.readFile(excelPath).then(() => {
      const worksheet = workbook.getWorksheet(1);
      const insertMaintenance = db.prepare(`
        INSERT INTO Maintenance (nature, provider_id, periodicity, maintenance_date, maintenance_time, status, creation_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Ignorer l'en-tête
          const [date, nature, provider, periodicity] = row.values.slice(1);
          const maintenanceDate = new Date(date).toISOString().split('T')[0]; // Convertir la date
          const maintenanceTime = '00:00:00';
          const status = 'effectuée'; // Toutes les interventions de l'historique ont eu lieu
          const creationDate = new Date().toISOString().split('T')[0]; // Date actuelle

          // Normaliser le nom du fournisseur
          const normalizedProvider = normalizeName(provider);

          // Correction de la logique pour trouver le provider_id
          db.get('SELECT id FROM Annuaire WHERE lower(trim(name)) = ?', [normalizedProvider], (err, row) => {
            if (err) {
              console.error('Error querying Annuaire table:', err);
              return reject(err);
            }

            if (row) {
              const providerId = row.id;
              insertMaintenance.run(nature, providerId, periodicity, maintenanceDate, maintenanceTime, status, creationDate, (err) => {
                if (err) {
                  console.error('Error inserting maintenance data:', err);
                }
              });
            } else {
              console.error(`Provider not found in Annuaire: ${provider}`);
            }
          });
        }
      });

      insertMaintenance.finalize((err) => {
        if (err) {
          console.error('Error finalizing statement:', err);
          return reject(err);
        } else {
          console.log('Maintenance data seeded successfully from Excel.');
          resolve();
        }
      });
    }).catch(err => {
      console.error('Error reading Excel file:', err);
      reject(err);
    });
  });
}

// Exécuter les deux fonctions de seed
async function seedDatabase() {
  try {
    await seedAnnuaire();
    await seedFromExcel();
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    db.close(() => {
      console.log('Database connection closed.');
    });
  }
}

seedDatabase();
