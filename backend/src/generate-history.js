const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const xlsx = require('xlsx');
const path = require('path');

// Ouvrir la base de données
const db = new sqlite3.Database('./src/database.db');

// Charger le fichier Excel des prestataires
const workbook = xlsx.readFile(path.join(__dirname, 'Liste Prestataires.xlsx'));
const sheetName = workbook.SheetNames[0];
const prestatairesData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Définir les alias des bâtiments pour le site "Chevrolet" (non utilisé dans ce script)
const buildingAliases = {
    "A": "Bureaux",
    "A+": "Bureaux Extension",
    "B": "Transit",
    "B+": "Transit Extension",
    "C": "Stockage",
    "D": "Admin Stockage/ Douane",
    "E": "Atelier",
    "F": "Pavillon"
};

// Fonction pour récupérer les données des prestataires
function getPrestataires(callback) {
    callback(prestatairesData);
}

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

    return historique;
}

// Récupérer les données et générer le fichier d'historique
getPrestataires((prestataires) => {
    const historique = generateHistorique(prestataires);

    // Créer un nouveau classeur
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
});
