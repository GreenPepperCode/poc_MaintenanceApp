const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'));

const maintenances = [
    { nature: 'Détection Incendie', provider: 'Spie', periodicity: 6, sites: ['Chevrolet'] },
    { nature: 'RIA', provider: 'Chubb', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Extincteurs', provider: 'BPI', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Extinction Salle Info 1', provider: 'Siemens', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'VGP Levage', provider: 'Bureau Veritas', periodicity: 6, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'MP Levage', provider: 'Jungheinrich', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'MP Levage', provider: 'Virly', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'MP Levage', provider: 'Toyota', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'MP Portes et Quais', provider: 'Assa Abloy', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'Trappes de desenfumage', provider: 'AEP', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Intrusion', provider: 'Polysécurité', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'CCTV', provider: 'ADS', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Deratisation', provider: 'Avipur', periodicity: 3, sites: ['Chevrolet'] },
    { nature: 'Portails et Barrières', provider: 'BSA', periodicity: 6, sites: ['Chevrolet'] },
    { nature: 'Taillage Haies', provider: 'Claude Monnot', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Espaces Verts', provider: 'Claude Monnot', periodicity: 1, sites: ['Chevrolet'] },
    { nature: 'Reseau Pneumatique', provider: 'Aerocom', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Fontaines à eau', provider: 'Culligan', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'Climatisation', provider: 'SBC', periodicity: 6, sites: ['Chevrolet'] },
    { nature: 'Chaudières', provider: 'Girardeau', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Installation Electrique', provider: 'Bureau Veritas', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'Thermographie', provider: 'DS Contrôle', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'Racks', provider: 'Apave', periodicity: 12, sites: ['Chevrolet', 'Champollion'] },
    { nature: 'EPI', provider: 'Mabeo', periodicity: 12, sites: ['Chevrolet'] },
    { nature: 'Lignes de vie et points d\'encrage', provider: 'Ajuva', periodicity: 12, sites: ['Chevrolet'] }
];

const statuses = ['Completed', 'Planned'];
const buildings = ['A', 'A+', 'B', 'B+', 'C', 'D', 'E', 'F'];

function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

// Générer des données historiques
function generateHistory() {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stmt = db.prepare("INSERT INTO Maintenance (nature, provider_id, periodicity, building_id, maintenance_date, maintenance_time, maintenance_period, status, reason, cart_number, creation_date, creation_time, modification_date, modification_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        let providerId = 1;
        for (const maintenance of maintenances) {
            let currentDate = new Date('2014-06-01');
            const endDate = new Date('2024-06-01');

            while (currentDate <= endDate) {
                for (const site of maintenance.sites) {
                    const status = statuses[Math.floor(Math.random() * statuses.length)];
                    const buildingId = Math.floor(Math.random() * buildings.length) + 1;

                    stmt.run(
                        maintenance.nature, // nature
                        providerId, // provider_id
                        maintenance.periodicity, // periodicity
                        buildingId, // building_id
                        currentDate.toISOString().split('T')[0], // maintenance_date
                        '08:00:00', // maintenance_time
                        'Morning', // maintenance_period
                        status, // status
                        `Routine checkup for ${maintenance.provider}`, // reason
                        null, // cart_number
                        new Date().toISOString().split('T')[0], // creation_date
                        new Date().toISOString().split('T')[1].split('.')[0], // creation_time
                        new Date().toISOString().split('T')[0], // modification_date
                        new Date().toISOString().split('T')[1].split('.')[0] // modification_time
                    );
                }
                currentDate = addMonths(currentDate, maintenance.periodicity);
            }
            providerId++;
        }

        stmt.finalize();
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error committing transaction: ", err.message);
            } else {
                console.log("Maintenance history generated successfully.");
            }
        });
    });
}

generateHistory();
