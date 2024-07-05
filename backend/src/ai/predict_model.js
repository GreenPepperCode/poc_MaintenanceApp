const tf = require('@tensorflow/tfjs-node');
const path = require('path');

// Fonction pour normaliser les dates (convertir en nombre de jours depuis une date de référence)
const normalizeDate = (dateStr) => {
    const referenceDate = new Date('2000-01-01'); // Date de référence
    const date = new Date(dateStr);
    const diffTime = Math.abs(date - referenceDate);
    const normalizedDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir en jours
    console.log(`Normalized date for ${dateStr}: ${normalizedDate}`); // Vérification de la normalisation
    return normalizedDate;
};

// Fonction pour convertir la périodicité en nombre de jours
const convertPeriodicityToDays = (periodicity) => {
    const match = periodicity.match(/(\d+)\s*(mois|années?)/i);
    if (!match) return 0;
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith('mois')) return value * 30;
    if (unit.startsWith('an')) return value * 365;
    return 0;
};

const predict = async (data) => {
    const modelPath = `file://${path.resolve(__dirname, 'models', 'maintenance_model', 'model.json')}`;
    const model = await tf.loadLayersModel(modelPath);

    const natures = ["Détection Incendie", "Espaces Verts", "Reseau Pneumatique", "Fontaines à eau", "Climatisation", "Chaudières", "Installation Electrique", "Thermographie", "Racks", "EPI", "Lignes de vie et points d'encrage"];
    const natureToIndex = Object.fromEntries(natures.map((nature, index) => [nature, index]));

    const input = tf.tensor2d([[
        natureToIndex[data.nature],
        data.provider_id,
        convertPeriodicityToDays(data.periodicity),
        normalizeDate(data.maintenance_date)
    ]]);

    const prediction = model.predict(input);
    const predictedDate = prediction.dataSync()[0];
    
    const referenceDate = new Date('2000-01-01');
    referenceDate.setDate(referenceDate.getDate() + predictedDate);
    console.log(`Predicted date: ${referenceDate}`);
    return referenceDate;
};

module.exports = { predict };
