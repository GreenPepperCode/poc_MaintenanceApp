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

// Fonction pour convertir la périodicité en nombre de mois
function convertPeriodicity(periodicity) {
  const periods = {
    '1 mois': 1,
    '3 mois': 3,
    '6 mois': 6,
    '12 mois': 12
  };
  return periods[periodicity.toLowerCase()] || 0;
}

// Fonction pour ajouter des mois à une date
function addMonthsToDate(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().split('T')[0]; // Convertir la date en format ISO
}

// Fonction pour insérer les données à partir du fichier Excel
function seedFromExcel() {
  return new Promise(async (resolve, reject) => {
    const excelPath = 'C:\\Users\\yzi\\Desktop\\Perso\\poc_MaintenanceApp\\backend\\Historique_Interventions_Généré.xlsx';
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(excelPath);
      const worksheet = workbook.getWorksheet(1);
      const insertMaintenance = db.prepare(`
        INSERT INTO Maintenance (nature, provider_id, periodicity, maintenance_date, maintenance_time, status, creation_date, targeted_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const row of worksheet.getRows(2, worksheet.rowCount - 1)) {
        const [date, nature, provider, periodicity] = row.values.slice(1);
        const maintenanceDate = new Date(date).toISOString().split('T')[0]; // Convertir la date
        const maintenanceTime = '00:00:00';
        const status = 'effectuée'; // Toutes les interventions de l'historique ont eu lieu
        const creationDate = new Date().toISOString().split('T')[0]; // Date actuelle

        // Normaliser le nom du fournisseur
        const normalizedProvider = normalizeName(provider);

        // Convertir la périodicité
        const periodicityInMonths = convertPeriodicity(periodicity);

        // Calculer la targeted_date
        const targetedDate = addMonthsToDate(maintenanceDate, periodicityInMonths);

        // Recherche de l'ID du fournisseur et insertion des données
        try {
          const row = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM Annuaire WHERE lower(trim(name)) = ?', [normalizedProvider], (err, row) => {
              if (err) return reject(err);
              resolve(row);
            });
          });

          if (row) {
            const providerId = row.id;
            await new Promise((resolve, reject) => {
              insertMaintenance.run(nature, providerId, periodicityInMonths, maintenanceDate, maintenanceTime, status, creationDate, targetedDate, (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          } else {
            console.error(`Provider not found in Annuaire: ${provider}`);
          }
        } catch (err) {
          console.error('Error querying Annuaire table:', err);
          return reject(err);
        }
      }

      insertMaintenance.finalize((err) => {
        if (err) {
          console.error('Error finalizing statement:', err);
          return reject(err);
        } else {
          console.log('Maintenance data seeded successfully from Excel.');
          resolve();
        }
      });

    } catch (err) {
      console.error('Error reading Excel file:', err);
      reject(err);
    }
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
