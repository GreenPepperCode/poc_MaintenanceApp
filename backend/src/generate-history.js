const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const path = require('path');

// Ouvrir la base de données
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'));

// Charger le fichier Excel des prestataires
const workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile(path.join(__dirname, '..', '..', 'Liste Prestataires.xlsx'))
    .then(() => {
        const worksheet = workbook.getWorksheet(1);
        const prestatairesData = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) { // Ignorer l'en-tête
                const rowData = {
                    Nature: row.getCell(1).value,
                    Prestataire: row.getCell(2).value,
                    'Periodicité(Mois)': row.getCell(3).value,
                    Site: row.getCell(4).value,
                };
                prestatairesData.push(rowData);
            }
        });

        generateHistorique(prestatairesData);
    })
    .catch(err => {
        console.error('Error reading Excel file:', err);
    });

// Fonction pour générer un historique des interventions
function generateHistorique(prestataires) {
    const historique = [];
    const startDate = new Date(2014, 5);  // Juin 2014
    const endDate = new Date(2024, 5);    // Juin 2024

    prestataires.forEach(prestataire => {
        const interval = parseInt(prestataire['Periodicité(Mois)'], 10);
        const sites = prestataire.Site.split(',').map(site => site.trim());

        for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + interval)) {
            sites.forEach(site => {
                historique.push({
                    Date: date.toISOString().split('T')[0],
                    Nature: prestataire.Nature,
                    Prestataire: prestataire.Prestataire,
                    Periodicité: `${interval} mois`,
                    Site: site,
                    Description: `Intervention tous les ${interval} mois sur le site ${site}`
                });
            });
        }
    });

    saveHistoriqueToExcel(historique);
}

// Fonction pour sauvegarder l'historique dans un fichier Excel
function saveHistoriqueToExcel(historique) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historique Interventions');

    // Ajouter des colonnes
    worksheet.columns = [
        { header: 'Date', key: 'Date' },
        { header: 'Nature', key: 'Nature' },
        { header: 'Prestataire', key: 'Prestataire' },
        { header: 'Periodicité', key: 'Periodicité' },
        { header: 'Site', key: 'Site' },
        { header: 'Description', key: 'Description' },
    ];

    // Ajouter des lignes
    historique.forEach(item => {
        worksheet.addRow(item);
    });

    // Sauvegarder le fichier Excel
    workbook.xlsx.writeFile('Historique_Interventions_Généré.xlsx')
        .then(() => {
            console.log('Historique généré avec succès dans Historique_Interventions_Généré.xlsx');
        })
        .catch(err => {
            console.error('Error writing Excel file:', err);
        });

    // Fermer la base de données
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database closed successfully');
        }
    });
}
